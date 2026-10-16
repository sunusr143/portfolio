import { site } from "@/content/site";
import { projects } from "@/content/projects";
import { certifications } from "@/content/skills";
import { Icon } from "@/components/ui/Icon";
import { CountUp } from "@/components/CountUp";

/** Every figure is derived from verifiable content: no invented metrics. */
export function StatsRow() {
  const stats = [
    { icon: "briefcase", value: site.yearsExperience, label: "Years of experience" },
    { icon: "folder", value: projects.length, label: "Case studies" },
    { icon: "cloud", value: 3, label: "Cloud platforms: AWS, Azure, GCP" },
    { icon: "shield", value: certifications.length, label: "Certifications: AWS and HashiCorp" },
  ];
  return (
    <section aria-label="At a glance" className="container-page">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <li key={s.label} className="panel flex items-center gap-4 p-5">
            <span aria-hidden className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-signal/15 text-signal-strong"><Icon name={s.icon} className="h-6 w-6" /></span>
            <div>
              <p className="text-gradient text-3xl font-bold leading-none"><CountUp value={s.value} /></p>
              <p className="mt-1.5 text-sm text-mist-300">{s.label}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
