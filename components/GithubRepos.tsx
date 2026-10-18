import { site } from "@/content/site";
import { featuredRepos } from "@/content/repos";
import { getFeaturedRepos } from "@/lib/github";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/Reveal";

/** Curated public repositories, enriched with live GitHub data when available. Hidden if no username is configured. */
export async function GithubRepos() {
  if (!site.github) return null;
  const repos = await getFeaturedRepos(site.githubUser, featuredRepos);

  return (
    <section aria-labelledby="gh-heading" className="section-y">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h2 id="gh-heading" className="text-3xl font-semibold tracking-tight">On GitHub</h2>
            <p className="mt-3 text-mist-300">
              Selected public repositories. Client and employer work is private and shown only as sanitized case studies.
            </p>
          </div>
          <a href={site.github} target="_blank" rel="noopener noreferrer" className="btn-ghost">
            <Icon name="github" className="h-4 w-4" />@{site.githubUser}
          </a>
        </div>

        {repos.length === 0 ? (
          <p className="panel mt-8 p-6 text-sm text-mist-300">
            No public repositories to show right now. Visit the{" "}
            <a className="text-signal-strong underline" href={site.github} target="_blank" rel="noopener noreferrer">GitHub profile</a> directly.
          </p>
        ) : (
          <Reveal><ul className="mt-8 grid gap-5 md:grid-cols-2">
            {repos.map((r) => (
              <li key={r.name} className="panel panel-hover flex flex-col p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="hover:text-signal-strong">{r.name}</a>
                  </h3>
                  {r.status && <span className="chip !border-warn/50 !text-warn">{r.status}</span>}
                </div>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-mist-300">{r.summary}</p>
                <ul className="mt-4 flex flex-wrap gap-2" aria-label="Technologies">
                  {r.tech.map((t) => <li key={t} className="chip">{t}</li>)}
                </ul>
                <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-mist-500">
                  {r.language && <span>{r.language}</span>}
                  {r.stars > 0 && <span>{r.stars} {r.stars === 1 ? "star" : "stars"}</span>}
                  {r.pushedAt && <span>Updated {new Date(r.pushedAt).toLocaleDateString("en", { month: "short", year: "numeric" })}</span>}
                </p>
              </li>
            ))}
          </ul></Reveal>
        )}
      </div>
    </section>
  );
}
