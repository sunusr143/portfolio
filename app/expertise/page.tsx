import type { Metadata } from "next";
import { skillGroups, certifications } from "@/content/skills";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Technical expertise",
  description: "AWS, EKS, Terraform, CI/CD, DevSecOps, Cloud Custodian, observability and automation skills, grounded in 13 years of experience.",
  alternates: { canonical: "/expertise" },
};

export default function ExpertisePage() {
  return (
    <>
      <PageHero eyebrow="Skills" title="Technical expertise" intro="Grouped by what you would hire me to do. Only tools I have used in production work are listed." />
      <section className="section-y">
        <div className="container-page">
          <ul className="grid gap-4 sm:grid-cols-2">
            {skillGroups.map((g) => (
              <li key={g.title} className="panel p-6">
                <h2 className="font-semibold">{g.title}</h2>
                <ul className="mt-3 flex flex-wrap gap-2">{g.items.map((i) => <li key={i} className="chip">{i}</li>)}</ul>
                {g.note && <p className="mt-3 text-sm text-mist-500">{g.note}</p>}
              </li>
            ))}
          </ul>
          <h2 className="mt-14 text-2xl font-semibold">Certifications</h2>
          <ul className="mt-4 space-y-2 text-mist-300">
            {certifications.map((c) => <li key={c.name}>{c.name}{c.date ? `, ${c.date}` : ""}</li>)}
          </ul>
        </div>
      </section>
    </>
  );
}
