"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { buildItems, filterItems, type PaletteItem } from "@/lib/palette";
import { Icon } from "@/components/ui/Icon";

/** Ctrl/⌘+K command palette: jump to any page, project or service, or start a conversation. */
export function CommandPalette() {
  const router = useRouter();
  const uid = useId();
  const listId = `${uid}-list`;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const items = useMemo(() => buildItems(), []);
  const results = useMemo(() => filterItems(items, query), [items, query]);

  const close = useCallback(() => setOpen(false), []);
  const show = useCallback(() => {
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setQuery("");
    setActive(0);
    setOpen(true);
  }, []);

  // Global shortcut and the header button's custom event.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => {
          if (!o) {
            returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
            setQuery("");
            setActive(0);
          }
          return !o;
        });
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-palette", show);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-palette", show);
    };
  }, [show]);

  // Focus input on open, restore focus and scrolling on close.
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
      returnFocus.current?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    if (open) document.getElementById(`${uid}-opt-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [active, open, uid]);

  function choose(item: PaletteItem) {
    setOpen(false);
    if (item.external) {
      if (item.href.startsWith("mailto:")) window.location.href = item.href;
      else window.open(item.href, "_blank", "noopener,noreferrer");
    } else {
      router.push(item.href);
    }
  }

  function onKeyDown(e: React.KeyboardEvent) {
    const n = results.length;
    if (e.key === "Escape") { e.preventDefault(); close(); }
    else if (e.key === "ArrowDown") { e.preventDefault(); if (n) setActive((a) => (a + 1) % n); }
    else if (e.key === "ArrowUp") { e.preventDefault(); if (n) setActive((a) => (a - 1 + n) % n); }
    else if (e.key === "Home") { e.preventDefault(); setActive(0); }
    else if (e.key === "End") { e.preventDefault(); if (n) setActive(n - 1); }
    else if (e.key === "Enter") { e.preventDefault(); if (results[active]) choose(results[active]); }
    else if (e.key === "Tab") { e.preventDefault(); }
  }

  if (!open) return null;

  let lastGroup = "";
  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]">
      <div className="absolute inset-0 bg-ink-950/75 backdrop-blur-sm" aria-hidden="true" onMouseDown={close} />
      <div role="dialog" aria-modal="true" aria-label="Search and jump to" onKeyDown={onKeyDown} className="panel pal-in relative w-full max-w-2xl overflow-hidden shadow-glow">
        <div className="flex items-center gap-3 border-b border-signal/20 px-4 py-3">
          <Icon name="search" className="h-5 w-5 shrink-0 text-signal-strong" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActive(0); }}
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={results[active] ? `${uid}-opt-${active}` : undefined}
            aria-label="Search projects, services and pages"
            placeholder="Search projects, services, pages..."
            className="w-full bg-transparent text-base text-mist-100 placeholder:text-mist-500 focus:outline-none"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="hidden rounded border border-signal/30 px-1.5 py-0.5 text-[11px] text-mist-300 sm:block">Esc</kbd>
        </div>

        <ul id={listId} role="listbox" aria-label="Results" className="max-h-[50vh] overflow-y-auto p-2">
          {results.length === 0 && (
            <li role="presentation" className="px-3 py-8 text-center text-sm text-mist-300">
              No matches for &ldquo;{query}&rdquo;. Try &ldquo;terraform&rdquo;, &ldquo;jenkins&rdquo; or &ldquo;eks&rdquo;.
            </li>
          )}
          {results.map((item, i) => {
            const header = item.group !== lastGroup ? item.group : null;
            lastGroup = item.group;
            return (
              <li key={item.id} role="presentation">
                {header && <p className="px-3 pb-1 pt-3 text-xs font-medium text-mist-500">{header}</p>}
                <div
                  id={`${uid}-opt-${i}`}
                  role="option"
                  aria-selected={i === active}
                  onMouseMove={() => active !== i && setActive(i)}
                  onClick={() => choose(item)}
                  className={`flex cursor-pointer items-center justify-between gap-4 rounded-lg px-3 py-2.5 text-sm ${i === active ? "bg-signal/15 text-white shadow-[inset_2px_0_0_#2f78ff]" : "text-mist-300"}`}
                >
                  <span className="truncate">{item.label}</span>
                  {item.hint && <span className="shrink-0 text-xs text-mist-500">{item.hint}</span>}
                </div>
              </li>
            );
          })}
        </ul>

        <p className="sr-only" role="status" aria-live="polite">{results.length} results</p>
        <div className="flex items-center gap-4 border-t border-signal/20 bg-ink-800 px-4 py-2 text-xs text-mist-500">
          <span><kbd className="rounded border border-signal/30 px-1 text-mist-300">&uarr;&darr;</kbd> move</span>
          <span><kbd className="rounded border border-signal/30 px-1 text-mist-300">&crarr;</kbd> open</span>
          <span><kbd className="rounded border border-signal/30 px-1 text-mist-300">esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
