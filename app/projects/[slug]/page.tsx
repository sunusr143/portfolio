import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, getProject } from "@/content/projects";
import { site } from "@/content/site";
import { FlowDiagram } from "@/components/diagrams/FlowDiagram";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const p = getProject(params.slug);
  if (!p) return {};
  return { title: p.title, description: p.tagline, alternates: { canonical: `/projects/${p.slug}` } };
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function ProjectPage({ params }: Props) {
  const p = getProject(params.slug);
  if (!p) notFound();

  const base = site.url.replace(/\/$/, "");
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: base },
          { "@type": "ListItem", position: 2, name: "Projects", item: `${base}/projects` },
          { "@type": "ListItem", position: 3, name: p.title, item: `${base}/projects/${p.slug}` },
        ],
      },
      {
        "@type": "Article",
        headline: p.title,
        description: p.tagline,
        author: { "@type": "Person", name: site.name },
        mainEntityOfPage: `${base}/projects/${p.slug}`,
        keywords: [...p.category, ...(p.stack ?? [])].join(", "),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="section-y">
        <div className="container-page max-w-5xl">
          <Link href="/projects" className="text-sm text-mist-300 hover:text-mist-100">&larr; All projects</Link>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{p.title}</h1>
          <p className="mt-4 text-lg text-mist-300">{p.tagline}</p>
          <ul className="mt-4 flex flex-wrap gap-2">{p.category.map((c) => <li key={c} className="chip">{c}</li>)}</ul>

          {p.image && (
            <Image src={p.image} alt={`${p.title}: block diagram`} width={1200} height={630} priority className="mt-8 h-auto w-full rounded-xl border border-signal/25" />
          )}

          <Block title="Overview"><p className="max-w-prose text-mist-300 leading-relaxed">{p.overview}</p></Block>
          <Block title="Problem"><p className="max-w-prose text-mist-300 leading-relaxed">{p.problem}</p></Block>
          <Block title="My role and contributions">
            <ul className="list-disc space-y-2 pl-5 text-mist-300">{p.role.map((r) => <li key={r}>{r}</li>)}</ul>
          </Block>
          {p.diagram && <Block title="Architecture and workflow"><FlowDiagram diagram={p.diagram} /></Block>}

          {p.decisions && (
            <Block title="Engineering decisions">
              <dl className="grid gap-4 md:grid-cols-3">
                {p.decisions.map((d) => (
                  <div key={d.title} className="panel p-5">
                    <dt className="font-medium">{d.title}</dt>
                    <dd className="mt-2 text-sm text-mist-300">{d.body}</dd>
                  </div>
                ))}
              </dl>
            </Block>
          )}

          {p.challenges && p.challenges.length > 0 && (
          <Block title="Technical challenges and how I approached them">
            <ul className="grid gap-3">
              {p.challenges.map((c) => (
                <li key={c.challenge} className="panel p-5">
                  <p className="font-medium">{c.challenge}</p>
                  <p className="mt-1 text-sm text-mist-300">{c.approach}</p>
                </li>
              ))}
            </ul>
          </Block>
          )}

          {p.stack && p.stack.length > 0 && (
            <Block title="Technology stack">
              <ul className="flex flex-wrap gap-2">{p.stack.map((s) => <li key={s} className="chip">{s}</li>)}</ul>
            </Block>
          )}

          {p.impact && p.impact.length > 0 && (
            <Block title="Verified impact">
              <ul className="list-disc space-y-2 pl-5 text-mist-300">{p.impact.map((i) => <li key={i}>{i}</li>)}</ul>
            </Block>
          )}

          {p.lessons && (
            <Block title="Lessons learned">
              <ul className="list-disc space-y-2 pl-5 text-mist-300">{p.lessons.map((l) => <li key={l}>{l}</li>)}</ul>
            </Block>
          )}

          <Block title="Skills demonstrated">
            <ul className="flex flex-wrap gap-2">{p.skills.map((s) => <li key={s} className="chip">{s}</li>)}</ul>
          </Block>

          {p.note && <p className="mt-10 rounded-lg border border-signal/20 p-4 text-sm text-mist-500">{p.note}</p>}

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href={`/work-with-me?topic=${p.slug}#inquiry`} className="btn-primary">Discuss a Similar Project</Link>
            {p.repoUrl && <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost">View source on GitHub</a>}
          </div>
        </div>
      </article>
    </>
  );
}
