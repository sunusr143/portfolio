import Link from "next/link";
import { site } from "@/content/site";
import { services } from "@/content/services";
import { AvailabilityBadge } from "@/components/ui/AvailabilityBadge";
import { HeroBackdrop } from "@/components/HeroBackdrop";
import { HeroIllustration } from "@/components/HeroIllustration";
import { HeroPanel } from "@/components/HeroPanel";
import { HeroTerminal } from "@/components/HeroTerminal";
import { TechStrip } from "@/components/TechStrip";
import { StatsRow } from "@/components/StatsRow";
import { FeaturedProjects } from "@/components/FeaturedProjects";
import { GithubRepos } from "@/components/GithubRepos";
import { Process } from "@/components/Process";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const trust = [
  { title: "13 years in IT and engineering", body: "From technical support to Staff Engineer, with hands-on ownership of production systems." },
  { title: "Certified", body: "HashiCorp Terraform Associate (003) and AWS Solutions Architect Associate." },
  { title: "Real platform work", body: "EKS migrations, multi-cloud security rollouts and AI-assisted governance, shown as sanitized case studies." },
];

export default function HomePage() {
  const [l1, l2, l3] = site.headlineLines;
  return (
    <>
      <section className="relative isolate pb-10 pt-12 sm:pt-16 lg:pb-14">
        <HeroBackdrop />
        <div className="container-page grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
          <div>
            <AvailabilityBadge />
            <p className="mt-6 text-sm font-medium tracking-wide text-signal-strong">{site.heroEyebrow}</p>
            <h1 className="mt-3 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl xl:text-6xl">
              <span className="block">{l1}</span>
              <span className="text-gradient block">{l2}</span>
              <span className="block">{l3}</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-mist-300">{site.subheadline}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/work-with-me#inquiry" className="btn-primary">Discuss Your Project</Link>
              <Link href="/projects" className="btn-ghost">Explore My Work</Link>
              {site.github && (
                <a href={site.github} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                  <Icon name="github" className="h-4 w-4" />View GitHub
                </a>
              )}
            </div>
            <HeroTerminal />
          </div>
          <HeroIllustration />
        </div>
      </section>

      <div className="space-y-6 pb-16">
        <TechStrip />
        <StatsRow />
      </div>

      <div className="pb-16"><FeaturedProjects /></div>

      <section className="section-y section-alt">
        <div className="container-page">
          <SectionHeading title="Problems I help teams solve" intro="Delivery that is slow or manual, infrastructure nobody can recreate, clusters that misbehave, and security findings that never get fixed." />
          <Reveal><ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <li key={s.slug} className="panel panel-hover flex flex-col p-6">
                <span aria-hidden className="mb-4 grid h-11 w-11 place-items-center rounded-xl border border-signal/25 bg-ink-800 text-signal-strong"><Icon name={s.icon} className="h-6 w-6" /></span>
                <h3 className="font-semibold">{s.title}</h3>
                <p className="mt-2 flex-1 text-sm text-mist-300">{s.summary}</p>
                <Link href={`/services/${s.slug}`} className="mt-4 text-sm font-medium text-signal-strong hover:underline">
                  See what I deliver<span className="sr-only"> for {s.title}</span>
                </Link>
              </li>
            ))}
          </ul></Reveal>
        </div>
      </section>

      <section className="section-y">
        <div className="container-page">
          <SectionHeading title="Why trust the experience" />
          <Reveal><ul className="mt-8 grid gap-5 md:grid-cols-3">
            {trust.map((t) => (
              <li key={t.title} className="panel p-6">
                <h3 className="font-semibold">{t.title}</h3>
                <p className="mt-2 text-sm text-mist-300">{t.body}</p>
              </li>
            ))}
          </ul></Reveal>
        </div>
      </section>

      <section className="section-y section-alt">
        <div className="container-page grid items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading title="See how I think through problems" intro="The engineering lab has five small, working demos: a pipeline, an EKS architecture, a Terraform layout, a governance decision flow and an incident decision tree. They run in your browser and never touch real infrastructure." />
            <Link href="/lab" className="btn-primary mt-8">Open the engineering lab</Link>
          </div>
          <HeroPanel />
        </div>
      </section>

      <Process />

      <GithubRepos />

    </>
  );
}
