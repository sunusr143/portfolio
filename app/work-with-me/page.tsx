import type { Metadata } from "next";
import { Suspense } from "react";
import { engagements } from "@/content/engagements";
import { site } from "@/content/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHero } from "@/components/PageHero";
import { InquiryForm } from "@/components/InquiryForm";
import { AvailabilityBadge } from "@/components/ui/AvailabilityBadge";
import { Faq } from "@/components/Faq";

export const metadata: Metadata = {
  title: "Work with me: freelance AWS, EKS, Terraform and DevSecOps engagements",
  description: "Defined consulting engagements: cloud assessment, Terraform automation, CI/CD audit, EKS review, DevSecOps governance and AI-assisted automation.",
  alternates: { canonical: "/work-with-me" },
};

const ul = "list-disc space-y-1 pl-5 text-sm text-mist-300";

export default function WorkWithMePage() {
  return (
    <>
      <PageHero eyebrow="Work with me" title="Six clear ways to start working together" intro="If your situation does not fit one, describe it and I will propose a custom scope and quote.">
        <AvailabilityBadge />
      </PageHero>
      <section className="section-y">
        <div className="container-page">
          <ul className="grid gap-5 lg:grid-cols-2">
            {engagements.map((e) => (
              <li key={e.id} className="panel p-6">
                <h2 className="text-xl font-semibold tracking-tight">{e.title}</h2>
                <p className="mt-2 text-mist-300">{e.summary}</p>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <div><h3 className="mb-2 text-sm font-medium">Deliverables</h3><ul className={ul}>{e.deliverables.map((x) => <li key={x}>{x}</li>)}</ul></div>
                  <div><h3 className="mb-2 text-sm font-medium">Suitable for</h3><ul className={ul}>{e.suitableFor.map((x) => <li key={x}>{x}</li>)}</ul></div>
                  <div><h3 className="mb-2 text-sm font-medium">What I need from you</h3><ul className={ul}>{e.inputs.map((x) => <li key={x}>{x}</li>)}</ul></div>
                  <div><h3 className="mb-2 text-sm font-medium">How it works</h3><ol className="list-decimal space-y-1 pl-5 text-sm text-mist-300">{e.process.map((x) => <li key={x}>{x}</li>)}</ol></div>
                </div>
                {e.price && <p className="mt-5 text-sm font-medium">{e.price}</p>}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-mist-500">{site.pricingNote}</p>
        </div>
      </section>

      <section id="inquiry" className="section-y border-t border-signal/20">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <SectionHeading title="Start a conversation" intro="Send a project inquiry, or ask for a short discovery call to see whether we are a fit." />
            <p className="mt-6 text-sm text-mist-300">Prefer email? <a className="text-signal-strong underline" href={`mailto:${site.email}`}>{site.email}</a></p>
          </div>
          <Suspense fallback={<div className="panel p-8 text-mist-300">Loading form...</div>}>
            <InquiryForm />
          </Suspense>
        </div>
      </section>

      <Faq />
    </>
  );
}
