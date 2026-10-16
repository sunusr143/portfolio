import type { Metadata } from "next";
import { LabShell } from "@/components/lab/LabShell";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Engineering lab: interactive cloud and DevOps demos",
  description: "Working client-side demos: CI/CD pipeline, EKS architecture, Terraform structure, cloud governance decisions, incident troubleshooting, monitoring commands, a terminal session playback and an embedded/IoT reference design, a serial bus comparison an OTA firmware update and rollback simulator, and hardware architecture diagrams with animated data flows.",
  alternates: { canonical: "/lab" },
};

export default function LabPage() {
  return (
    <>
      <PageHero eyebrow="Engineering lab" title="See how I approach platform problems" intro="Eleven small demos that run in your browser with sample data. Nothing connects to a real account." />
      <section className="section-y">
        <div className="container-page"><LabShell /></div>
      </section>
    </>
  );
}
