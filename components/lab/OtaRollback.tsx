"use client";

import Image from "next/image";
import { useState } from "react";

type Step = { label: string; detail: string };

const steps: Step[] = [
  { label: "Check for update", detail: "The device asks the release server for a newer signed version." },
  { label: "Download to slot B", detail: "The new image is written to the inactive slot. Slot A keeps running." },
  { label: "Verify signature", detail: "The image signature and checksum are verified before anything switches." },
  { label: "Reboot into slot B", detail: "The bootloader boots the new image once, marked as pending verification." },
  { label: "Self-test", detail: "The new firmware must boot, reconnect and pass its health checks in time." },
];

export function OtaRollback() {
  const [i, setI] = useState(0);
  const [fail, setFail] = useState(false);
  const atEnd = i >= steps.length;
  const rolledBack = atEnd && fail;

  function reset() { setI(0); }

  return (
    <div>
      <h2 className="text-xl font-semibold">OTA update and rollback</h2>
      <p className="mt-2 max-w-prose text-sm text-mist-300">
        Step through a firmware update on a device with two partitions. Turn on <em>simulate a failing release</em> to see the automatic rollback. Sample flow only; no device is involved.
      </p>
      <Image src="/images/lab-ota-rollback.webp" alt="Illustration of two OTA firmware slots and a bootloader" width={1200} height={630} className="mt-5 h-auto w-full max-w-3xl rounded-xl border border-signal/25" />
      <label className="mt-5 flex items-center gap-2 text-sm text-mist-300">
        <input type="checkbox" checked={fail} onChange={(e) => { setFail(e.target.checked); reset(); }} />
        Simulate a failing release
      </label>
      <ol className="mt-4 grid gap-2 text-sm">
        {steps.map((s, n) => (
          <li key={s.label} className={`rounded-lg border p-3 ${n < i ? "border-ok/40" : n === i ? "border-signal bg-signal/10" : "border-signal/15 text-mist-500"}`}>
            <strong className="text-mist-100">{n + 1}. {s.label}</strong>
            {n <= i && <span className="mt-1 block text-mist-300">{s.detail}</span>}
          </li>
        ))}
      </ol>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" className="btn-primary !py-2" disabled={atEnd} onClick={() => setI(i + 1)}>
          {atEnd ? "Complete" : "Next step"}
        </button>
        <button type="button" className="btn-ghost !py-2" onClick={reset}>Reset</button>
      </div>
      <p role="status" aria-live="polite" className="mt-4 text-sm">
        {atEnd && (rolledBack
          ? <span className="text-risk">Self-test failed. The bootloader reverted to slot A (v1.4.2) and the release is flagged so the rollout can pause.</span>
          : <span className="text-ok">Self-test passed. Slot B (v1.5.0) is marked valid and becomes the running image.</span>)}
      </p>
    </div>
  );
}
