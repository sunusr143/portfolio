"use client";

import { useState } from "react";

const findings = [
  { id: "s3", name: "Publicly accessible S3 bucket", risky: "Making a bucket private can break a site or integration that relied on public reads.", reversible: true },
  { id: "ebs", name: "Unencrypted EBS volume", risky: "Encrypting an attached volume means a snapshot and replace, which is not a casual change.", reversible: false },
  { id: "ec2", name: "Idle EC2 instance", risky: "An instance that looks idle may be a rarely used but important system.", reversible: true },
  { id: "rds", name: "Untagged RDS snapshot", risky: "Deleting an untagged snapshot could remove the only backup of something.", reversible: false },
] as const;

type Decision = { outcome: "Guardrail (enforce)" | "Notify-only" | "Skip: approved exception"; steps: string[]; why: string };

function decide(opts: { reversible: boolean; production: boolean; exception: boolean; criticalData: boolean }): Decision {
  if (opts.exception) {
    return { outcome: "Skip: approved exception", why: "A documented, approved exception exists, so the policy leaves this resource alone.", steps: ["Detect the resource", "Match it to the exception list", "Record that it was skipped and why", "Re-check the exception on its review date"] };
  }
  if (opts.reversible && !opts.production && !opts.criticalData) {
    return { outcome: "Guardrail (enforce)", why: "The change is reversible and low-impact outside production, so enforcing is reasonable once tested and approved.", steps: ["Detect the resource", "Tag it and notify the owner", "Remediate automatically", "Record the change in version control and open a ticket"] };
  }
  return { outcome: "Notify-only", why: "The change is hard to undo, touches production, or may involve critical data, so a person should decide.", steps: ["Detect the resource", "Tag it and notify the owner", "Open a ticket or pull request for follow-up", "Owner remediates or requests an exception"] };
}

export function GovernanceWorkflow() {
  const [id, setId] = useState<(typeof findings)[number]["id"]>("s3");
  const [production, setProduction] = useState(false);
  const [exception, setException] = useState(false);
  const [criticalData, setCriticalData] = useState(false);

  const f = findings.find((x) => x.id === id)!;
  const d = decide({ reversible: f.reversible, production, exception, criticalData });

  return (
    <div>
      <h2 className="text-2xl font-semibold">Cloud governance decision workflow</h2>
      <p className="mt-2 max-w-prose text-mist-300">Choose a finding and its context. The demo shows whether I would propose a guardrail or a notify-only policy, and why. Either way, a proposal still needs testing and human approval.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="space-y-5">
          <div>
            <label htmlFor="finding" className="mb-1.5 block text-sm font-medium">Finding</label>
            <select id="finding" className="field" value={id} onChange={(e) => setId(e.target.value as typeof id)}>
              {findings.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
            </select>
            <p className="mt-2 text-xs text-mist-500">Why it needs care: {f.risky}</p>
          </div>
          <fieldset className="space-y-3">
            <legend className="mb-1 text-sm font-medium">Context</legend>
            {[
              { label: "Resource is in production", v: production, set: setProduction },
              { label: "Resource holds critical or sensitive data", v: criticalData, set: setCriticalData },
              { label: "An approved exception exists", v: exception, set: setException },
            ].map((c) => (
              <label key={c.label} className="flex items-center gap-3 text-sm">
                <input type="checkbox" className="h-4 w-4 accent-[#6b8cff]" checked={c.v} onChange={(e) => c.set(e.target.checked)} />
                {c.label}
              </label>
            ))}
          </fieldset>
        </div>

        <div className="rounded-lg border border-signal/20 bg-ink-950/50 p-5" aria-live="polite">
          <p className="text-sm text-mist-300">Proposed policy type</p>
          <p className="mt-1 text-xl font-semibold">{d.outcome}</p>
          <p className="mt-3 text-sm text-mist-300">{d.why}</p>
          <ol className="mt-4 list-decimal space-y-1.5 pl-5 text-sm text-mist-300">{d.steps.map((s) => <li key={s}>{s}</li>)}</ol>
          <p className="mt-5 rounded-md border border-dashed border-warn/60 bg-warn/5 p-3 text-xs text-mist-300">This is a proposal. It must pass validation on test resources and be approved by a person before deployment.</p>
        </div>
      </div>
    </div>
  );
}
