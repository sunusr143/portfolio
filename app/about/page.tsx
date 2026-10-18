import type { Metadata } from "next";
import { site } from "@/content/site";
import { experience, certifications, education } from "@/content/skills";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "About",
  description: "Sunu Mohan: Staff DevOps & Cloud Engineer with 13 years of experience in cloud platforms, Kubernetes, CI/CD, DevSecOps and AI-assisted automation.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About" title="Engineer, troubleshooter, builder" intro="Thirteen years of keeping production systems reliable, secure and automated." />
      <section className="section-y">
        <div className="container-page max-w-3xl">
          <div className="prose-body space-y-4 text-lg">
            <p>I am a {site.shortTitle} with {site.yearsExperience} years in IT and engineering. I started in technical support, moved into release and pipeline work, and now design and operate cloud platforms.</p>
            <p>I like problems where the cause is not obvious: a node that will not join, a permission that fails only in one path, a pipeline that breaks every third run. I trace those to the root cause instead of papering over them, then write the runbook so the next person does not start from zero.</p>
            <p>I care about security and operational ownership as much as automation. In my recent work, AI can propose a governance policy, but tests validate it and a person approves it before anything reaches production.</p>
          </div>

          <h2 id="career" className="mt-14 text-2xl font-semibold">Career</h2>
          <ol className="mt-4 space-y-4">
            {experience.map((e) => (
              <li key={e.role + e.company} className="panel p-5">
                <p className="font-medium">{e.role}, {e.company}</p>
                <p className="text-sm text-mist-500">{e.period}</p>
              </li>
            ))}
          </ol>

          <h2 className="mt-14 text-2xl font-semibold">Education and certifications</h2>
          <ul className="mt-4 space-y-2 text-mist-300">
            <li>{education}</li>
            {certifications.map((c) => <li key={c.name}>{c.name}{c.date ? `, ${c.date}` : ""}</li>)}
          </ul>

          <div className="mt-12 flex flex-wrap gap-3">
            <a className="btn-primary" href={site.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            {site.github && <a className="btn-ghost" href={site.github} target="_blank" rel="noopener noreferrer">GitHub</a>}
            <a className="btn-ghost" href={`mailto:${site.email}`}>{site.email}</a>
          </div>
          <p className="mt-6 text-sm text-mist-500">I work remotely with international teams. I do not hold local presence or work authorization claims in any specific country; we can discuss contracting arrangements directly.</p>
        </div>
      </section>
    </>
  );
}
