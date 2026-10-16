import type { Metadata } from "next";
import Link from "next/link";
import { services } from "@/content/services";
import { PageHero } from "@/components/PageHero";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: "Services: AWS, EKS, Terraform, CI/CD and DevSecOps consulting",
  description: "Freelance AWS DevOps consulting: infrastructure, Kubernetes and EKS, Terraform, CI/CD, DevSecOps governance and AI-driven cloud automation.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero eyebrow="Services" title="Cloud and DevOps services for growing teams" intro="Each service starts from a business problem and ends with something your team can run without me." />
      <section className="section-y">
        <div className="container-page">
          <ul className="grid gap-5 md:grid-cols-2">
            {services.map((s) => (
              <li key={s.slug} className="panel panel-hover flex flex-col p-6">
                <div className="flex items-start gap-4">
                  <span aria-hidden className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-signal/25 bg-ink-800 text-signal-strong"><Icon name={s.icon} className="h-6 w-6" /></span>
                  <h2 className="pt-2 text-xl font-semibold tracking-tight">{s.title}</h2>
                </div>
                <p className="mt-4 text-sm text-mist-300"><span className="font-medium text-mist-100">The problem: </span>{s.problem}</p>
                <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-mist-300">
                  {s.deliverables.map((d) => <li key={d}>{d}</li>)}
                </ul>
                <p className="mt-4 text-sm text-mist-300"><span className="font-medium text-mist-100">Expected benefit: </span>{s.benefit}</p>
                <div className="mt-auto flex flex-wrap gap-3 pt-6">
                  <Link href={`/work-with-me?topic=${s.slug}#inquiry`} className="btn-primary !py-2">Discuss this requirement</Link>
                  <Link href={`/services/${s.slug}`} className="btn-ghost !py-2">Details</Link>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-mist-500">Outcomes depend on your environment and constraints. I will tell you plainly what I can and cannot commit to.</p>
        </div>
      </section>
    </>
  );
}
