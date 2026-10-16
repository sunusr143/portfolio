"use client";

import { useEffect, useState } from "react";

type Ev = { t: "cmd" | "out"; text: string };
type Scenario = { id: string; label: string; events: Ev[] };

const c = (text: string): Ev => ({ t: "cmd", text });
const o = (text: string): Ev => ({ t: "out", text });

/** Scripted sessions with sample output. Nothing here runs a real command. */
const scenarios: Scenario[] = [
  {
    id: "k8s", label: "Kubernetes health check",
    events: [
      c("kubectl get pods -A --field-selector=status.phase!=Running"),
      o("NAMESPACE   NAME                    READY   STATUS             RESTARTS"),
      o("payments    api-7c9d5b6f4-x2k8p     0/1     CrashLoopBackOff   6"),
      c("kubectl logs deploy/api -n payments --since=10m | tail -3"),
      o("ERROR  cannot connect to db: connection refused"),
      o("ERROR  retrying in 5s (attempt 6)"),
      c("kubectl get events -n payments --sort-by=.lastTimestamp | tail -2"),
      o("Warning  BackOff  pod/api-7c9d5b6f4-x2k8p  Back-off restarting failed container"),
      c("kubectl rollout undo deploy/api -n payments"),
      o("deployment.apps/api rolled back"),
      c("kubectl rollout status deploy/api -n payments"),
      o("deployment \"api\" successfully rolled out"),
    ],
  },
  {
    id: "iot", label: "IoT device to cloud",
    events: [
      c("pio device monitor -b 115200"),
      o("[boot] ESP32 ready, wifi connected (rssi -58 dBm)"),
      o("[mqtt] connected to broker, publishing every 10s"),
      c("mosquitto_sub -h broker.local -t 'sensors/#' -v"),
      o("sensors/greenhouse-1/temp  {\"c\": 24.6, \"rh\": 61}"),
      o("sensors/greenhouse-1/temp  {\"c\": 24.7, \"rh\": 61}"),
      c("aws logs tail /aws/iot/rules/ingest --since 5m"),
      o("rule ingest matched 30 messages, 0 errors"),
      c("aws cloudwatch describe-alarms --state-value ALARM"),
      o("[]   # no alarms firing"),
    ],
  },
];

export function DemoPlayer() {
  const [sid, setSid] = useState(scenarios[0].id);
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(0); // events fully shown
  const [typed, setTyped] = useState(0); // chars typed of the current cmd
  const [reduced, setReduced] = useState(false);

  const sc = scenarios.find((s) => s.id === sid)!;
  const total = sc.events.length;
  const finished = pos >= total;

  useEffect(() => {
    const r = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(r);
    if (r) setPos(total);
  }, [total]);

  useEffect(() => {
    if (!playing || finished || reduced) return;
    const ev = sc.events[pos];
    let timer: ReturnType<typeof setTimeout>;
    if (ev.t === "cmd" && typed < ev.text.length) {
      timer = setTimeout(() => setTyped((n) => n + 1), 28);
    } else {
      timer = setTimeout(() => { setPos((p) => p + 1); setTyped(0); }, ev.t === "cmd" ? 450 : 650);
    }
    return () => clearTimeout(timer);
  }, [playing, finished, reduced, pos, typed, sc]);

  useEffect(() => { if (finished) setPlaying(false); }, [finished]);

  function choose(id: string) {
    setSid(id); setPlaying(false); setTyped(0);
    setPos(reduced ? scenarios.find((s) => s.id === id)!.events.length : 0);
  }
  function restart() { setPos(0); setTyped(0); setPlaying(true); }

  const visible = sc.events.slice(0, pos);
  const current = !finished && sc.events[pos]?.t === "cmd" ? sc.events[pos].text.slice(0, typed) : null;
  const pct = Math.round((pos / total) * 100);

  return (
    <div>
      <h2 className="text-xl font-semibold">Watch a monitoring session</h2>
      <p className="mt-2 text-sm text-mist-300">A short scripted terminal playback with sample output. Pick a scenario and press play.</p>
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Choose a scenario">
        {scenarios.map((s) => (
          <button key={s.id} type="button" aria-pressed={sid === s.id} onClick={() => choose(s.id)}
            className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${sid === s.id ? "border-signal bg-signal/15" : "border-signal/30 text-mist-300 hover:border-signal/70"}`}>{s.label}</button>
        ))}
      </div>

      <div className="mt-5 overflow-hidden rounded-lg border border-signal/25 bg-ink-950 font-mono text-sm">
        <div className="flex items-center justify-between border-b border-signal/20 bg-ink-800 px-3 py-2 text-xs text-mist-500" aria-hidden>
          <span className="flex gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-risk/70" /><i className="h-2.5 w-2.5 rounded-full bg-warn/70" /><i className="h-2.5 w-2.5 rounded-full bg-ok/70" /></span>
          <span>simulated session</span>
        </div>
        <div className="min-h-[18rem] space-y-1 px-4 py-3" aria-live="off">
          {visible.map((e, i) => e.t === "cmd"
            ? <p key={i} className="pt-2 text-mist-100"><span className="text-ok">$</span> {e.text}</p>
            : <p key={i} className="whitespace-pre-wrap break-words text-xs text-signal-strong">{e.text}</p>)}
          {current !== null && <p className="pt-2 text-mist-100"><span className="text-ok">$</span> {current}<span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-signal-strong" /></p>}
          {pos === 0 && !playing && <p className="text-mist-500">Press play to start.</p>}
        </div>
        <div className="h-1 bg-ink-800" aria-hidden><div className="h-full bg-signal transition-all" style={{ width: `${pct}%` }} /></div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        {finished
          ? <button type="button" onClick={restart} className="btn-primary !py-2">Replay</button>
          : <button type="button" onClick={() => setPlaying((p) => !p)} className="btn-primary !py-2">{playing ? "Pause" : pos === 0 ? "Play" : "Resume"}</button>}
        <button type="button" onClick={() => { setPlaying(false); setPos(0); setTyped(0); }} className="btn-ghost !py-2">Reset</button>
        <span className="text-xs text-mist-500">{pct}% · output is sample data, not a live system</span>
      </div>
    </div>
  );
}
