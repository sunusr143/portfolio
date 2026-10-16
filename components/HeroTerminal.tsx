"use client";

import { useEffect, useState } from "react";

/** Illustrative commands only: a typed terminal line that cycles. Static text for reduced-motion users. */
const lines = [
  { cmd: "terraform plan -out=tfplan", out: "Plan reviewed before every apply" },
  { cmd: "helm upgrade --install app ./chart", out: "Repeatable, versioned releases" },
  { cmd: "kubectl rollout status deploy/app", out: "Deployments verified, not assumed" },
  { cmd: "trivy image app:latest", out: "Security checks inside the pipeline" },
];

export function HeroTerminal() {
  const [i, setI] = useState(0);
  const [n, setN] = useState(lines[0].cmd.length);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setN(0);
    let idx = 0;
    let chars = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const cmd = lines[idx].cmd;
      if (chars < cmd.length) {
        chars += 1;
        setN(chars);
        timer = setTimeout(tick, 45);
      } else {
        timer = setTimeout(() => {
          idx = (idx + 1) % lines.length;
          chars = 0;
          setI(idx);
          setN(0);
          timer = setTimeout(tick, 300);
        }, 2600);
      }
    };
    timer = setTimeout(tick, 600);
    return () => clearTimeout(timer);
  }, []);

  const line = lines[i];
  const done = n >= line.cmd.length;

  return (
    <div className="mt-8 max-w-xl overflow-hidden rounded-lg border border-signal/25 bg-ink-950/80 font-mono text-sm" role="img" aria-label="Illustrative terminal showing infrastructure and delivery commands">
      <div className="flex items-center gap-1.5 border-b border-signal/20 bg-ink-800 px-3 py-2" aria-hidden>
        <i className="h-2.5 w-2.5 rounded-full bg-risk/70" /><i className="h-2.5 w-2.5 rounded-full bg-warn/70" /><i className="h-2.5 w-2.5 rounded-full bg-ok/70" />
        <span className="ml-2 text-xs text-mist-500">~/platform</span>
      </div>
      <div className="min-h-[4.25rem] space-y-1 px-4 py-3" aria-hidden>
        <p className="text-mist-100"><span className="text-ok">$</span> {line.cmd.slice(0, n)}{!done && <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-signal-strong" />}</p>
        <p className={`text-xs text-signal-strong transition-opacity ${done ? "opacity-100" : "opacity-0"}`}>&#10003; {line.out}</p>
      </div>
    </div>
  );
}
