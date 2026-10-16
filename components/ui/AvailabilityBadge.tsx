import { site } from "@/content/site";
import { cn } from "@/lib/utils";

const dot = { available: "bg-ok", limited: "bg-warn", unavailable: "bg-mist-500" } as const;

export function AvailabilityBadge() {
  const { status, messages } = site.availability;
  return (
    <p className="inline-flex items-center gap-2 rounded-full border border-signal/20 bg-ink-800 px-3.5 py-1.5 text-sm text-mist-300">
      <span aria-hidden className={cn("h-2 w-2 rounded-full", dot[status])} />
      {messages[status]}
    </p>
  );
}
