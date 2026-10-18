import type { FeaturedRepo } from "@/content/repos";

export type RepoCard = FeaturedRepo & {
  url: string;
  stars: number;
  pushedAt?: string;
  /** True when language, stars and date came from the GitHub API rather than the curated fallback. */
  live: boolean;
};

/**
 * Resolves the curated repository list against the GitHub API.
 *
 * - API reachable: each curated repo is enriched with live language, stars and last push date, and any repo
 *   GitHub does not return (renamed, deleted, private) is dropped so the page never links to a dead repo.
 * - API unreachable or rate limited: the curated list is shown as-is and the cause is logged. Previously this
 *   case returned an empty list silently, which is how the section could end up empty after a rate-limited build.
 *
 * Unauthenticated GitHub API calls are limited to 60/hour per IP, and shared build servers hit that easily.
 * Set GITHUB_TOKEN (read-only, no scopes needed for public data) to avoid it.
 */
export async function getFeaturedRepos(user: string, featured: FeaturedRepo[]): Promise<RepoCard[]> {
  if (!user) return [];
  const fallback: RepoCard[] = featured.map((f) => ({ ...f, url: `https://github.com/${user}/${f.name}`, stars: 0, live: false }));

  try {
    const headers: Record<string, string> = { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    const res = await fetch(`https://api.github.com/users/${encodeURIComponent(user)}/repos?per_page=100&sort=pushed`, {
      headers,
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      const limited = res.status === 403 || res.status === 429;
      console.error(`GitHub API returned ${res.status}${limited ? " (rate limited: set GITHUB_TOKEN)" : ""}; showing curated repositories without live data.`);
      return fallback;
    }
    const data: unknown = await res.json();
    if (!Array.isArray(data)) return fallback;

    const byName = new Map<string, Record<string, unknown>>();
    for (const r of data) if (r && typeof r === "object" && typeof r.name === "string") byName.set(r.name, r as Record<string, unknown>);

    return featured.flatMap((f): RepoCard[] => {
      const r = byName.get(f.name);
      if (!r || typeof r.html_url !== "string") {
        console.warn(`Curated repository "${f.name}" was not found on GitHub for ${user}; hiding it.`);
        return [];
      }
      return [{
        ...f,
        url: r.html_url,
        language: typeof r.language === "string" ? r.language : f.language,
        stars: typeof r.stargazers_count === "number" ? r.stargazers_count : 0,
        pushedAt: typeof r.pushed_at === "string" ? r.pushed_at : undefined,
        live: true,
      }];
    });
  } catch (err) {
    console.error("GitHub API request failed; showing curated repositories without live data.", err);
    return fallback;
  }
}
