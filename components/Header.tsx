"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { site } from "@/content/site";
import { Icon } from "@/components/ui/Icon";

const links = [
  { href: "/", label: "Home", match: "/" },
  { href: "/about", label: "About", match: "/about" },
  { href: "/expertise", label: "Skills", match: "/expertise" },
  { href: "/projects", label: "Projects", match: "/projects" },
  { href: "/about#career", label: "Experience", match: "" },
  { href: "/services", label: "Services", match: "/services" },
  { href: "/lab", label: "Lab", match: "/lab" },
  { href: "/work-with-me#inquiry", label: "Contact", match: "" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mac, setMac] = useState(false);

  useEffect(() => setMac(/Mac|iPhone|iPad/.test(navigator.userAgent)), []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const active = (match: string) => match !== "" && (match === "/" ? pathname === "/" : pathname === match || pathname.startsWith(match + "/"));

  return (
    <header className="sticky top-0 z-40 border-b border-signal/20 bg-ink-950/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-3 sm:gap-6">
        <Link href="/" className="group flex min-w-0 items-center gap-2.5 leading-tight sm:gap-3" aria-label="Sunu Mohan, home">
          <span
            aria-hidden="true"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-signal to-violet text-base font-bold tracking-tight text-white shadow-glow transition-transform group-hover:scale-105"
          >
            SM
          </span>
          <span className="min-w-0">
            <span className="block truncate text-lg font-semibold tracking-tight text-white">Sunu Mohan</span>
            <span className="block truncate whitespace-nowrap font-mono text-[10px] uppercase tracking-wide text-signal-strong sm:text-[11px]">{site.headerTitle}</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden h-full items-center gap-7 xl:flex">
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              aria-current={active(l.match) ? "page" : undefined}
              className={cn(
                "flex h-full items-center border-b-2 text-sm transition-colors hover:text-white",
                active(l.match) ? "border-signal text-signal-strong" : "border-transparent text-mist-100"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("open-palette"))}
            className="btn-ghost !gap-2 !px-3 !py-2"
            aria-label="Search the site"
          >
            <Icon name="search" className="h-4 w-4" />
            <span className="hidden md:inline">Search</span>
            <kbd className="hidden rounded border border-signal/30 px-1.5 text-[11px] text-mist-300 lg:inline">{mac ? "\u2318K" : "Ctrl K"}</kbd>
          </button>
          <Link href="/work-with-me" className="btn-primary hidden !py-2.5 sm:inline-flex">
            Let&apos;s work together
          </Link>
          <button
            type="button"
            className="btn-ghost !px-3 !py-2 xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-signal/20 bg-ink-900 xl:hidden">
          <ul className="container-page flex flex-col py-3">
            {[...links, { href: "/work-with-me", label: "Work with me", match: "/work-with-me" }].map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  aria-current={active(l.match) ? "page" : undefined}
                  className="block rounded-md px-2 py-3 text-mist-100 hover:bg-signal/10"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
