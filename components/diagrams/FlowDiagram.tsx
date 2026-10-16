import type { Diagram, Tone } from "@/content/projects";
import { cn } from "@/lib/utils";

const toneStyle: Record<Tone, { box: string; label?: string }> = {
  default: { box: "border-signal/30 bg-ink-800" },
  proposed: { box: "border-dashed border-warn/70 bg-warn/5", label: "Proposed" },
  validated: { box: "border-signal/60 bg-signal/10", label: "Validated" },
  approved: { box: "border-ok/60 bg-ok/10", label: "Approved" },
  security: { box: "border-risk/50 bg-risk/5", label: "Security control" },
};

/** Content-driven flow diagram. Lanes stack vertically; nodes flow left to right and wrap on small screens. */
export function FlowDiagram({ diagram }: { diagram: Diagram }) {
  const usedTones = Array.from(new Set(diagram.lanes.flatMap((l) => l.nodes.map((n) => n.tone ?? "default")))).filter(
    (t): t is Exclude<Tone, "default"> => t !== "default"
  );

  return (
    <figure className="panel p-5 sm:p-6">
      <ol className="space-y-6">
        {diagram.lanes.map((lane) => (
          <li key={lane.label}>
            <p className="mb-3 text-sm font-medium text-mist-300">{lane.label}</p>
            <ol className="flex flex-wrap items-stretch gap-x-2 gap-y-3">
              {lane.nodes.map((node, i) => {
                const tone = toneStyle[node.tone ?? "default"];
                return (
                  <li key={node.id} className="flex items-center gap-2">
                    <div className={cn("min-w-[9rem] max-w-[14rem] rounded-lg border px-3.5 py-2.5", tone.box)}>
                      {tone.label && <p className="mb-1 text-[11px] font-medium text-mist-300">{tone.label}</p>}
                      <p className="text-sm font-medium leading-snug">{node.label}</p>
                      {node.detail && <p className="mt-1 text-xs leading-snug text-mist-500">{node.detail}</p>}
                    </div>
                    {i < lane.nodes.length - 1 && (
                      <span aria-hidden className="text-mist-500">&rsaquo;</span>
                    )}
                  </li>
                );
              })}
            </ol>
          </li>
        ))}
      </ol>
      <figcaption className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-signal/20 pt-4 text-xs text-mist-500">
        <span>{diagram.caption}</span>
        {usedTones.length > 0 && (
          <span>Key: {usedTones.map((t) => toneStyle[t].label).join(", ")}</span>
        )}
      </figcaption>
    </figure>
  );
}
