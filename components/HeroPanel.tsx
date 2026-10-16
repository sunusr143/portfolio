/**
 * Hero visual: the governance workflow, stepping in once on load.
 * Stages are labelled with text as well as styling so state never relies on color alone.
 */
const stages = [
  { name: "Finding", detail: "Public S3 bucket reported", state: "Input", style: "border-ink-600 bg-ink-800" },
  { name: "Policy drafted by AI", detail: "Candidate: notify-only", state: "Proposed", style: "border-dashed border-warn/70 bg-warn/5" },
  { name: "Tested on AWS test resources", detail: "Policy run and checked", state: "Validated", style: "border-signal/60 bg-signal/10" },
  { name: "Pull request reviewed", detail: "A person approves", state: "Approved", style: "border-ok/60 bg-ok/10" },
];

export function HeroPanel() {
  return (
    <div className="panel overflow-hidden shadow-glow" aria-label="Illustration of the AI-assisted cloud governance workflow">
      <div className="flex items-center justify-between border-b border-signal/20 bg-ink-800 px-4 py-2.5 text-xs text-mist-300">
        <span className="flex items-center gap-1.5" aria-hidden><i className="h-2.5 w-2.5 rounded-full bg-risk/70" /><i className="h-2.5 w-2.5 rounded-full bg-warn/70" /><i className="h-2.5 w-2.5 rounded-full bg-ok/70" /></span>
        <span className="font-mono">governance-pipeline</span>
        <span>Illustration</span>
      </div>
      <ol className="space-y-3 p-4 sm:p-5">
        {stages.map((s, i) => (
          <li
            key={s.name}
            className={`stage-in rounded-lg border px-4 py-3 ${s.style}`}
            style={{ animationDelay: `${i * 450}ms` }}
          >
            <div className="flex items-baseline justify-between gap-4">
              <p className="text-sm font-medium">{s.name}</p>
              <p className="text-xs text-mist-300">{s.state}</p>
            </div>
            <p className="mt-0.5 font-mono text-xs text-mist-300">{s.detail}</p>
          </li>
        ))}
      </ol>
      <p className="border-t border-signal/20 bg-ink-800 px-4 py-3 text-xs text-mist-300">
        Generated policies are proposals until tests pass and a person approves.
      </p>
    </div>
  );
}
