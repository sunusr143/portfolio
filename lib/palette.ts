import { site } from "../content/site";
import { projects } from "../content/projects";
import { services } from "../content/services";

export type PaletteGroup = "Pages" | "Projects" | "Services" | "Actions";
export const GROUP_ORDER: PaletteGroup[] = ["Pages", "Projects", "Services", "Actions"];

export type PaletteItem = {
  id: string;
  group: PaletteGroup;
  label: string;
  hint?: string;
  href: string;
  external?: boolean;
  keywords?: string;
};

/** Everything the palette can jump to, built from the same content files as the site. */
export function buildItems(): PaletteItem[] {
  const pages: PaletteItem[] = [
    { id: "page-home", group: "Pages", label: "Home", href: "/", keywords: "start main" },
    { id: "page-about", group: "Pages", label: "About", href: "/about", keywords: "experience career background story" },
    { id: "page-skills", group: "Pages", label: "Skills and expertise", href: "/expertise", keywords: "tools stack technologies certifications" },
    { id: "page-projects", group: "Pages", label: "Projects and case studies", href: "/projects", keywords: "work portfolio" },
    { id: "page-services", group: "Pages", label: "Services", href: "/services", keywords: "offer help consulting" },
    { id: "page-lab", group: "Pages", label: "Engineering lab", href: "/lab", keywords: "demos interactive simulation pipeline" },
    { id: "page-work", group: "Pages", label: "Work with me", href: "/work-with-me", keywords: "hire engagements freelance contact pricing" },
    { id: "page-privacy", group: "Pages", label: "Privacy notice", href: "/privacy", keywords: "data policy" },
  ];

  const projectItems: PaletteItem[] = projects.map((p) => ({
    id: `project-${p.slug}`,
    group: "Projects",
    label: p.title,
    hint: p.category[0],
    href: `/projects/${p.slug}`,
    keywords: [...p.category, ...(p.stack ?? []), ...p.skills].join(" "),
  }));

  const serviceItems: PaletteItem[] = services.map((s) => ({
    id: `service-${s.slug}`,
    group: "Services",
    label: s.title,
    href: `/services/${s.slug}`,
    keywords: s.keywords.join(" "),
  }));

  const actions: PaletteItem[] = [
    { id: "act-inquiry", group: "Actions", label: "Start a project inquiry", href: "/work-with-me#inquiry", keywords: "contact hire quote discovery call" },
    { id: "act-email", group: "Actions", label: "Send an email", hint: site.email, href: `mailto:${site.email}`, external: true, keywords: "contact write message" },
    { id: "act-linkedin", group: "Actions", label: "Open LinkedIn", href: site.linkedin, external: true, keywords: "profile social" },
    ...(site.github ? [{ id: "act-github", group: "Actions" as const, label: "Open GitHub", hint: `@${site.githubUser}`, href: site.github, external: true, keywords: "code repositories open source" }] : []),
  ];

  return [...pages, ...projectItems, ...serviceItems, ...actions];
}

/**
 * Empty query: a short curated list. Otherwise every word must match the label or keywords;
 * label matches rank above keyword matches, and results are grouped in a fixed order.
 */
export function filterItems(items: PaletteItem[], query: string, limit = 14): PaletteItem[] {
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) {
    const curated = [
      ...items.filter((i) => i.group === "Pages"),
      ...items.filter((i) => i.group === "Projects").slice(0, 4),
      ...items.filter((i) => i.group === "Actions"),
    ];
    return curated;
  }
  const scored: { item: PaletteItem; score: number; order: number }[] = [];
  items.forEach((item, order) => {
    const label = item.label.toLowerCase();
    const extra = `${item.keywords ?? ""} ${item.hint ?? ""}`.toLowerCase();
    let score = 0;
    for (const t of tokens) {
      if (label.startsWith(t) || label.includes(` ${t}`)) score += 0;
      else if (label.includes(t)) score += 1;
      else if (extra.includes(t)) score += 2;
      else return;
    }
    scored.push({ item, score, order });
  });
  scored.sort((a, b) => GROUP_ORDER.indexOf(a.item.group) - GROUP_ORDER.indexOf(b.item.group) || a.score - b.score || a.order - b.order);
  return scored.slice(0, limit).map((s) => s.item);
}
