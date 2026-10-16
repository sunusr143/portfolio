export type Repo = {
  name: string;
  description: string | null;
  url: string;
  language: string | null;
  stars: number;
  pushedAt: string;
};

/**
 * Fetches public, non-fork, non-archived repositories at build/revalidate time.
 * Returns [] on any failure so the page degrades to a plain profile link.
 * Optional GITHUB_TOKEN (read-only, public data) raises the API rate limit.
 */
export async function getRepos(user: string, limit = 6, exclude: string[] = []): Promise<Repo[]> {
  if (!user) return [];
  try {
    const headers: Record<string, string> = { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    const res = await fetch(`https://api.github.com/users/${encodeURIComponent(user)}/repos?per_page=100&sort=pushed`, {
      headers,
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data: unknown = await res.json();
    if (!Array.isArray(data)) return [];
    return data
      .filter((r) => r && typeof r === "object" && !r.fork && !r.archived && typeof r.name === "string" && typeof r.html_url === "string")
      .filter((r) => r.name !== user && !exclude.includes(r.name))
      .map((r) => ({
        name: r.name as string,
        description: typeof r.description === "string" ? r.description : null,
        url: r.html_url as string,
        language: typeof r.language === "string" ? r.language : null,
        stars: typeof r.stargazers_count === "number" ? r.stargazers_count : 0,
        pushedAt: typeof r.pushed_at === "string" ? r.pushed_at : "",
      }))
      .sort((a, b) => b.stars - a.stars || b.pushedAt.localeCompare(a.pushedAt))
      .slice(0, limit);
  } catch {
    return [];
  }
}
