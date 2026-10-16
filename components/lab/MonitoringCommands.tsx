"use client";

import { useState } from "react";

type Cmd = { group: string; cmd: string; why: string };

/** Standard CLI commands for day-to-day monitoring. <placeholders> are values you supply. */
const commands: Cmd[] = [
  { group: "Linux", cmd: "uptime", why: "Load average over 1, 5 and 15 minutes" },
  { group: "Linux", cmd: "free -h", why: "Memory and swap usage" },
  { group: "Linux", cmd: "df -h", why: "Disk usage per filesystem" },
  { group: "Linux", cmd: "ps aux --sort=-%cpu | head -10", why: "Top CPU consumers" },
  { group: "Linux", cmd: "ss -tulpn", why: "Listening ports and owning processes" },
  { group: "Linux", cmd: "journalctl -u <service> --since \"10 min ago\" -f", why: "Follow a service's recent logs" },
  { group: "Kubernetes", cmd: "kubectl get pods -A --field-selector=status.phase!=Running", why: "Pods that are not healthy" },
  { group: "Kubernetes", cmd: "kubectl top nodes", why: "Node CPU and memory (needs metrics-server)" },
  { group: "Kubernetes", cmd: "kubectl top pods -A --sort-by=memory | head", why: "Heaviest pods by memory" },
  { group: "Kubernetes", cmd: "kubectl get events -A --sort-by=.lastTimestamp | tail -20", why: "Most recent cluster events" },
  { group: "Kubernetes", cmd: "kubectl rollout status deploy/<name>", why: "Confirm a deployment finished" },
  { group: "Kubernetes", cmd: "kubectl logs -f deploy/<name> --since=10m", why: "Follow recent application logs" },
  { group: "Docker", cmd: "docker stats --no-stream", why: "One-shot container CPU and memory" },
  { group: "AWS", cmd: "aws logs tail <log-group> --follow --since 10m", why: "Stream CloudWatch logs" },
  { group: "AWS", cmd: "aws ec2 describe-instance-status --filters Name=instance-status.status,Values=impaired", why: "Find impaired instances" },
  { group: "AWS", cmd: "aws cloudwatch describe-alarms --state-value ALARM --query 'MetricAlarms[].AlarmName'", why: "Which alarms are firing" },
  { group: "Jenkins", cmd: "curl -s -u <user>:<token> <jenkins-url>/api/json?tree=jobs[name,color]", why: "Job health at a glance (red = failing)" },
  { group: "IoT / Embedded", cmd: "mosquitto_sub -h <broker> -t 'sensors/#' -v", why: "Watch live MQTT messages from devices" },
  { group: "IoT / Embedded", cmd: "pio device monitor -b 115200", why: "Read a board's serial output (PlatformIO)" },
  { group: "IoT / Embedded", cmd: "i2cdetect -y 1", why: "Check I2C sensors are wired and detected (Raspberry Pi)" },
];

const groups = ["All", ...Array.from(new Set(commands.map((c) => c.group)))];

export function MonitoringCommands() {
  const [group, setGroup] = useState("All");
  const [copied, setCopied] = useState<string | null>(null);
  const shown = commands.filter((c) => group === "All" || c.group === group);

  async function copy(cmd: string) {
    try {
      await navigator.clipboard.writeText(cmd);
      setCopied(cmd);
      setTimeout(() => setCopied((c) => (c === cmd ? null : c)), 1500);
    } catch {
      /* clipboard unavailable: the command is still selectable */
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold">Monitoring commands I reach for</h2>
      <p className="mt-2 text-sm text-mist-300">{commands.length} everyday commands across hosts, Kubernetes, AWS, CI and IoT devices. Replace values in &lt;angle brackets&gt;.</p>
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter commands">
        {groups.map((g) => (
          <button key={g} type="button" aria-pressed={group === g} onClick={() => setGroup(g)}
            className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${group === g ? "border-signal bg-signal/15" : "border-signal/30 text-mist-300 hover:border-signal/70"}`}>{g}</button>
        ))}
      </div>
      <ul className="mt-5 space-y-3">
        {shown.map((c) => (
          <li key={c.cmd} className="rounded-lg border border-signal/20 bg-ink-950/70 p-3">
            <div className="flex items-start justify-between gap-3">
              <code className="min-w-0 break-all font-mono text-sm text-mist-100"><span className="text-ok">$</span> {c.cmd}</code>
              <button type="button" onClick={() => copy(c.cmd)} className="btn-ghost shrink-0 !px-3 !py-1 !text-xs" aria-label={`Copy command: ${c.cmd}`}>
                {copied === c.cmd ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="mt-1.5 text-xs text-mist-300"><span className="chip mr-2">{c.group}</span>{c.why}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
