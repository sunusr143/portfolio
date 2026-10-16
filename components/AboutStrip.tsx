import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";
import { Icon } from "@/components/ui/Icon";

const quick = [
  { href: "/about", label: "About", icon: "user" },
  { href: "/expertise", label: "Skills", icon: "layers" },
  { href: "/projects", label: "Projects", icon: "folder" },
  { href: "/about#career", label: "Experience", icon: "briefcase" },
  { href: "/work-with-me#inquiry", label: "Contact", icon: "mail" },
];

export function AboutStrip() {
  const contact = [
    { href: `mailto:${site.email}`, label: site.email, icon: "mail", external: false },
    { href: site.linkedin, label: "linkedin.com/in/sunu-mohan", icon: "linkedin", external: true },
    ...(site.github ? [{ href: site.github, label: site.github.replace(/^https?:\/\//, ""), icon: "github", external: true }] : []),
  ];
  return (
    <section aria-label="About and contact" className="border-t border-signal/20 bg-ink-900/70">
      <div className="container-page grid gap-10 py-12 lg:grid-cols-[1.6fr_0.7fr_1.1fr]">
        <div className="flex gap-5">
          {site.photo ? (
            <Image src={site.photo} alt={`Portrait of ${site.name}`} width={112} height={112} className="h-28 w-28 shrink-0 rounded-full border border-signal/30 object-cover" />
          ) : (
            <span aria-hidden className="grid h-28 w-28 shrink-0 place-items-center rounded-full border border-signal/30 bg-gradient-to-br from-brand to-violet text-3xl font-semibold text-white">SM</span>
          )}
          <div>
            <h2 className="text-xl font-semibold">About me</h2>
            <p className="mt-3 text-sm leading-relaxed text-mist-300">
              I am {site.name}, a {site.shortTitle} with {site.yearsExperience} years of experience in cloud infrastructure, CI/CD, containerization and automation. I enjoy building reliable, secure systems that make delivery faster and calmer.
            </p>
            <Link href="/projects" className="btn-ghost mt-4 !py-2"><Icon name="folder" className="h-4 w-4" />See my projects</Link>
          </div>
        </div>

        <nav aria-label="Quick links">
          <h2 className="text-xl font-semibold">Quick links</h2>
          <ul className="mt-3 space-y-2.5 text-sm text-mist-300">
            {quick.map((q) => (
              <li key={q.label}><Link href={q.href} className="inline-flex items-center gap-2.5 hover:text-signal-strong"><Icon name={q.icon} className="h-4 w-4 text-signal-strong" />{q.label}</Link></li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-xl font-semibold">Let&apos;s work together</h2>
          <p className="mt-3 text-sm text-mist-300">Open to selected freelance and consulting engagements. Tell me about your project.</p>
          <ul className="mt-3 space-y-2.5 text-sm text-mist-300">
            {contact.map((c) => (
              <li key={c.href}>
                <a href={c.href} {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="inline-flex items-center gap-2.5 break-all hover:text-signal-strong">
                  <Icon name={c.icon} className="h-4 w-4 shrink-0 text-signal-strong" />{c.label}
                </a>
              </li>
            ))}
          </ul>
          <Link href="/work-with-me#inquiry" className="btn-primary mt-5 !py-2.5"><Icon name="send" className="h-4 w-4" />Get in touch</Link>
        </div>
      </div>
    </section>
  );
}
