"use client";

import { useEffect, useRef, useState } from "react";

const stages = [
  { id: "commit", name: "Commit and trigger", what: "A push or pull request starts the pipeline." },
  { id: "build", name: "Build", what: "Compile and package, for example with Maven." },
  { id: "test", name: "Automated tests", what: "Unit and integration tests run on every change." },
  { id: "quality", name: "Quality gate", what: "Code quality checks, for example SonarQube." },
  { id: "security", name: "Security scan", what: "Dependency and code scanning, for example Snyk or Nexus IQ." },
  { id: "image", name: "Container image", what: "Build and push the image." },
  { id: "nonprod", name: "Deploy to non-prod", what: "Roll out to a test environment and verify." },
  { id: "prod", name: "Deploy to prod", what: "Promote the same artifact, then verify after go-live." },
] as const;

type State = "pending" | "running" | "passed" | "failed";

export function PipelineVisualizer() {
  const [failAt, setFailAt] = useState<string>("none");
  const [states, setStates] = useState<State[]>(stages.map(() => "pending"));
  const [running, setRunning] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(timer.current), []);

  function run() {
    clearTimeout(timer.current);
    setRunning(true);
    setStates(stages.map(() => "pending"));
    let i = 0;
    const step = () => {
      setStates((prev) => prev.map((s, idx) => (idx === i ? "running" : s)));
      timer.current = setTimeout(() => {
        const fails = stages[i].id === failAt;
        setStates((prev) => prev.map((s, idx) => (idx === i ? (fails ? "failed" : "passed") : s)));
        if (fails || i === stages.length - 1) { setRunning(false); return; }
        i += 1;
        step();
      }, 650);
    };
    step();
  }

  function reset() {
    clearTimeout(timer.current);
    setRunning(false);
    setStates(stages.map(() => "pending"));
  }

  const failedIdx = states.indexOf("failed");
  const allPassed = states.every((s) => s === "passed");
  const label: Record<State, string> = { pending: "Waiting", running: "Running", passed: "Passed", failed: "Failed" };
  const style: Record<State, string> = {
    pending: "border-signal/20 text-mist-500",
    running: "border-signal bg-signal/10",
    passed: "border-ok/60 bg-ok/10",
    failed: "border-risk/70 bg-risk/10",
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold">CI/CD pipeline visualizer</h2>
      <p className="mt-2 max-w-prose text-mist-300">Run a simulated pipeline, optionally breaking one stage, to see how quality gates stop a bad release from moving forward.</p>

      <div className="mt-6 flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="fail-at" className="mb-1.5 block text-sm font-medium">Inject a failure at</label>
          <select id="fail-at" className="field" value={failAt} onChange={(e) => setFailAt(e.target.value)} disabled={running}>
            <option value="none">No failure</option>
            {stages.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <button className="btn-primary" onClick={run} disabled={running}>{running ? "Running..." : "Run pipeline"}</button>
        <button className="btn-ghost" onClick={reset}>Reset</button>
      </div>

      <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stages.map((s, i) => (
          <li key={s.id} className={`rounded-lg border p-4 ${style[states[i]]}`}>
            <p className="text-xs text-mist-300">{label[states[i]]}</p>
            <p className="mt-1 font-medium">{s.name}</p>
            <p className="mt-1 text-xs text-mist-500">{s.what}</p>
          </li>
        ))}
      </ol>

      <div aria-live="polite" className="mt-6 min-h-[3rem] text-sm text-mist-300">
        {failedIdx >= 0 && <p><strong className="text-mist-100">Pipeline stopped at &quot;{stages[failedIdx].name}&quot;.</strong> Later stages never ran, so nothing unverified reached the next environment. In a real setup this is where an issue or notification would be raised for the owner.</p>}
        {allPassed && <p><strong className="text-mist-100">All stages passed.</strong> The same artifact moved from build to production with checks at each step.</p>}
      </div>
    </div>
  );
}
