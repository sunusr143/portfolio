import Link from "next/link";
import { projects } from "@/content/projects";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/Reveal";

const featured = [
  { slug: "artifactory-eks-migration", icon: "box" },
  { slug: "agentic-ai-cloud-governance", icon: "brain" },
  { slug: "cicd-devsecops", icon: "gear" },
];

export function FeaturedProjects() {
  const items = featured.flatMap((f) => {
    const p = projects.find((x) => x.slug === f.slug);
    return p ? [{ p, icon: f.icon }] : [];
  });
  return (
    <section aria-labelledby="featured-heading" className="container-page">
      <div className="flex items-end justify-between gap-4">
        <h2 id="featured-heading" className="text-2xl font-semibold">Featured projects</h2>
        <Link href="/projects" className="text-sm font-medium text-signal-strong hover:underline">View all projects</Link>
      </div>
      <Reveal><ul className="mt-5 grid gap-5 lg:grid-cols-3">
        {items.map(({ p, icon }) => (
          <li key={p.slug} className="panel panel-hover flex flex-col p-5">
            <div className="flex gap-4">
              <span aria-hidden className="grid h-14 w-14 shrink-0 place-items-center rounded-xl border border-signal/25 bg-ink-800 text-signal-strong"><Icon name={icon} className="h-7 w-7" /></span>
              <div>
                <h3 className="font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mist-300">{p.tagline}</p>
              </div>
            </div>
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Technologies">{(p.stack ?? []).slice(0, 4).map((t) => <li key={t} className="chip">{t}</li>)}</ul>
            <Link href={`/projects/${p.slug}`} className="mt-5 text-sm font-medium text-signal-strong hover:underline">
              View project<span className="sr-only">: {p.title}</span>
            </Link>
          </li>
        ))}
      </ul></Reveal>
    </section>
  );
}
