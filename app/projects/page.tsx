import type { Metadata } from "next";
import { ProjectExplorer } from "@/components/ProjectExplorer";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Projects and case studies",
  description: "Sanitized case studies: EKS migration, agentic AI cloud governance, Cloud Custodian, multi-cloud security automation, Jenkins CI/CD and observability.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <>
      <PageHero eyebrow="Projects" title="Projects and case studies" intro="Enterprise work, described without confidential details. Filter by area, or open one for architecture and approach." />
      <section className="section-y">
        <div className="container-page"><ProjectExplorer /></div>
      </section>
    </>
  );
}
