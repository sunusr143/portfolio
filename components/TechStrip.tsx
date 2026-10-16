import Link from "next/link";
import { site } from "@/content/site";
import { techIcons } from "@/lib/techIcons";

export function TechStrip() {
  return (
    <section aria-labelledby="tech-heading" className="container-page">
      <div className="panel p-4 sm:p-5">
        <h2 id="tech-heading" className="mb-4 text-sm font-medium tracking-wide text-mist-300">Technologies I work with</h2>
        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-7 xl:[grid-template-columns:repeat(13,minmax(0,1fr))]">
          {site.techStrip.map((t) => (
            <li key={t.label} className="flex flex-col items-center gap-2 rounded-lg border border-signal/15 bg-ink-800/70 px-2 py-3 text-center transition hover:-translate-y-0.5 hover:border-signal/50 hover:bg-ink-700/70">
              <span aria-hidden className="grid h-11 w-11 place-items-center rounded-lg" style={{ color: t.color, background: `${t.color}22`, border: `1px solid ${t.color}55` }}>
                {techIcons[t.icon] ? (
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor"><path d={techIcons[t.icon]} /></svg>
                ) : (
                  <span className="font-mono text-sm font-bold">{t.mono}</span>
                )}
              </span>
              <span className="text-xs text-mist-300">{t.label}</span>
            </li>
          ))}
          <li className="flex flex-col items-center gap-2 rounded-lg border border-signal/15 bg-ink-800/70 px-2 py-3 text-center">
            <Link href="/expertise" className="flex flex-col items-center gap-2">
              <span aria-hidden className="grid h-10 w-10 place-items-center text-xl text-mist-300">&middot;&middot;&middot;</span>
              <span className="text-xs text-mist-300">More</span>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
