"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useState } from "react";
import { projects, projectCategories, type ProjectCategory } from "@/content/projects";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";

const categoryIcon: Record<string, string> = { Jenkins: "gear", "CI/CD": "gear", Kubernetes: "box", Terraform: "layers", Security: "shield", "AI & Automation": "brain", Observability: "cloud", "Embedded & IoT": "gear" };

export function ProjectExplorer({ limit }: { limit?: number }) {
  const [filter, setFilter] = useState<"All" | ProjectCategory>("All");
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const baseId = useId();

  const visible = projects.filter((p) => filter === "All" || p.category.includes(filter)).slice(0, limit);

  return (
    <div>
      <div role="group" aria-label="Filter projects by category" className="flex flex-wrap gap-2">
        {projectCategories.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={filter === c}
            onClick={() => { setFilter(c); setOpenSlug(null); }}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm transition-colors",
              filter === c ? "border-signal bg-signal/15 text-mist-100" : "border-signal/30 bg-ink-900/60 text-mist-300 hover:border-signal/70 hover:text-white"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <p className="sr-only" role="status" aria-live="polite">{visible.length} projects shown</p>

      {visible.length === 0 ? (
        <p className="mt-8 rounded-lg border border-signal/20 p-6 text-mist-300">
          No projects in this category yet. <button className="underline" onClick={() => setFilter("All")}>Show all projects</button>.
        </p>
      ) : (
        <ul className="mt-8 grid gap-4">
          {visible.map((p) => {
            const open = openSlug === p.slug;
            const panelId = `${baseId}-${p.slug}`;
            return (
              <li key={p.slug} className="panel panel-hover p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex max-w-2xl gap-4">
                    {p.image ? (
                      <Image src={p.image} alt="" width={120} height={63} className="hidden h-16 w-[122px] shrink-0 rounded-lg border border-signal/25 object-cover sm:block" />
                    ) : null}
                    <span aria-hidden className={cn("grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-signal/25 bg-ink-800 text-signal-strong", p.image && "sm:hidden")}><Icon name={categoryIcon[p.category[0]] ?? "box"} className="h-6 w-6" /></span>
                    <div>
                    <h3 className="text-xl font-semibold tracking-tight">
                      <Link href={`/projects/${p.slug}`} className="hover:text-signal-strong">{p.title}</Link>
                    </h3>
                    <p className="mt-2 text-mist-300">{p.tagline}</p>
                    <ul className="mt-3 flex flex-wrap gap-2" aria-label="Categories">
                      {p.status && p.status !== "Production work" && <li className="chip !border-warn/50 !text-warn">{p.status}</li>}
                      {p.category.map((c) => <li key={c} className="chip">{c}</li>)}
                    </ul>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-ghost !py-2"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenSlug(open ? null : p.slug)}
                  >
                    {open ? "Hide summary" : "Quick summary"}
                  </button>
                </div>

                <div id={panelId} hidden={!open} className="mt-5 border-t border-signal/20 pt-5">
                  <dl className="grid gap-4 text-sm sm:grid-cols-2">
                    <div><dt className="font-medium">Problem</dt><dd className="mt-1 text-mist-300">{p.problem}</dd></div>
                    <div><dt className="font-medium">What I did</dt><dd className="mt-1 text-mist-300">{p.role[0]}</dd></div>
                  </dl>
                  {p.stack && p.stack.length > 0 && <p className="mt-4 text-sm text-mist-500">Stack: {p.stack.join(", ")}</p>}
                  <Link href={`/projects/${p.slug}`} className="btn-primary mt-5 !py-2">Read the full case study</Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
