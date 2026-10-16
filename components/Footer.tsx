import Link from "next/link";
import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-signal/20 bg-ink-900/80 py-12">
      <div className="container-page grid gap-8 sm:grid-cols-3">
        <div>
          <p className="font-semibold">{site.name}</p>
          <p className="mt-2 max-w-xs text-sm text-mist-500">
            Independent cloud platform and DevSecOps consulting. Remote engagements.
          </p>
        </div>
        <nav aria-label="Footer" className="text-sm">
          <ul className="space-y-2 text-mist-300">
            <li><Link href="/services" className="hover:text-signal-strong">Services</Link></li>
            <li><Link href="/projects" className="hover:text-signal-strong">Projects</Link></li>
            <li><Link href="/work-with-me" className="hover:text-signal-strong">Work with me</Link></li>
            <li><Link href="/privacy" className="hover:text-signal-strong">Privacy</Link></li>
          </ul>
        </nav>
        <ul className="space-y-2 text-sm text-mist-300">
          <li><a className="hover:text-signal-strong" href={`mailto:${site.email}`}>{site.email}</a></li>
          <li><a className="hover:text-signal-strong" href={site.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
          {site.github && <li><a className="hover:text-signal-strong" href={site.github} target="_blank" rel="noopener noreferrer">GitHub</a></li>}
        </ul>
      </div>
      <p className="container-page mt-10 text-xs text-mist-500">
        © {new Date().getFullYear()} {site.name}. Case studies are sanitized descriptions of past work.
      </p>
    </footer>
  );
}
