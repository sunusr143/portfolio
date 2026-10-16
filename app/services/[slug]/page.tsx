import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { services } from "@/content/services";
import { projects } from "@/content/projects";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const s = services.find((x) => x.slug === params.slug);
  if (!s) return {};
  return { title: s.title, description: s.summary, alternates: { canonical: `/services/${s.slug}` } };
}

const relatedMap: Record<string, string[]> = {
  "aws-infrastructure": ["artifactory-eks-migration", "terraform-reusable-aws-modules"],
  "kubernetes-eks": ["artifactory-eks-migration", "kubernetes-helm-microservices", "kustomize-environment-overlays", "kubernetes-observability"],
  "terraform-iac": ["terraform-reusable-aws-modules", "artifactory-eks-migration"],
  "cicd-gitops": ["payment-application-infra-cicd", "cicd-devsecops", "jenkins-maven-sonarqube-pipelines", "jenkins-snyk-nexus-iq-security", "release-engineering-go-live", "java-service-jenkins-kubernetes"],
  "devsecops-governance": ["cloud-security-governance", "multi-cloud-security-automation", "jenkins-snyk-nexus-iq-security", "automated-failure-triage"],
  "ai-cloud-automation": ["agentic-ai-cloud-governance"],
};

export default function ServicePage({ params }: Props) {
  const s = services.find((x) => x.slug === params.slug);
  if (!s) notFound();
  const related = projects.filter((p) => (relatedMap[s.slug] ?? []).includes(p.slug));

  return (
    <>
      <article className="section-y">
        <div className="container-page max-w-3xl">
          <Link href="/services" className="text-sm text-mist-300 hover:text-mist-100">&larr; All services</Link>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">{s.title}</h1>
          <p className="mt-4 text-lg text-mist-300">{s.summary}</p>

          <h2 className="mt-12 text-xl font-semibold">The business problem</h2>
          <p className="mt-3 text-mist-300">{s.problem}</p>

          <h2 className="mt-10 text-xl font-semibold">What I can deliver</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-mist-300">{s.deliverables.map((d) => <li key={d}>{d}</li>)}</ul>

          <h2 className="mt-10 text-xl font-semibold">Expected operational benefit</h2>
          <p className="mt-3 text-mist-300">{s.benefit}</p>
          <p className="mt-2 text-sm text-mist-500">Results vary with your environment; nothing here is a guarantee.</p>

          {related.length > 0 && (
            <>
              <h2 className="mt-10 text-xl font-semibold">Related work</h2>
              <ul className="mt-3 space-y-2">
                {related.map((p) => (
                  <li key={p.slug}><Link className="text-signal-strong hover:underline" href={`/projects/${p.slug}`}>{p.title}</Link></li>
                ))}
              </ul>
            </>
          )}

          <Link href={`/work-with-me?topic=${s.slug}#inquiry`} className="btn-primary mt-10">Discuss this requirement</Link>
        </div>
      </article>
    </>
  );
}
