"use client";

import { useRef, useState } from "react";
import { PipelineVisualizer } from "./PipelineVisualizer";
import { EksExplorer } from "./EksExplorer";
import { TerraformExplorer } from "./TerraformExplorer";
import { GovernanceWorkflow } from "./GovernanceWorkflow";
import { IncidentTree } from "./IncidentTree";
import { MonitoringCommands } from "./MonitoringCommands";
import { DemoPlayer } from "./DemoPlayer";
import { IotReference } from "./IotReference";
import { BusCompare } from "./BusCompare";
import { OtaRollback } from "./OtaRollback";
import { HardwareArchitectures } from "./HardwareArchitectures";

const demos = [
  { id: "pipeline", label: "CI/CD pipeline", Component: PipelineVisualizer },
  { id: "eks", label: "EKS architecture", Component: EksExplorer },
  { id: "terraform", label: "Terraform modules", Component: TerraformExplorer },
  { id: "governance", label: "Governance decisions", Component: GovernanceWorkflow },
  { id: "incident", label: "Incident troubleshooting", Component: IncidentTree },
  { id: "commands", label: "Monitoring commands", Component: MonitoringCommands },
  { id: "playback", label: "Session playback", Component: DemoPlayer },
  { id: "iot", label: "Embedded & IoT", Component: IotReference },
  { id: "buses", label: "UART / I2C / SPI", Component: BusCompare },
  { id: "ota", label: "OTA & rollback", Component: OtaRollback },
  { id: "hwarch", label: "Hardware architectures", Component: HardwareArchitectures },
] as const;

export function LabShell() {
  const [active, setActive] = useState<(typeof demos)[number]["id"]>("pipeline");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(e: React.KeyboardEvent, index: number) {
    let next = index;
    if (e.key === "ArrowRight") next = (index + 1) % demos.length;
    else if (e.key === "ArrowLeft") next = (index - 1 + demos.length) % demos.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = demos.length - 1;
    else return;
    e.preventDefault();
    setActive(demos[next].id);
    tabRefs.current[next]?.focus();
  }

  const Current = demos.find((d) => d.id === active)!.Component;

  return (
    <div>
      <p className="mb-6 rounded-lg border border-warn/40 bg-warn/5 p-4 text-sm text-mist-300">
        <strong className="text-mist-100">Demonstrations only.</strong> Everything here runs in your browser with sample data.
        Nothing connects to a real AWS account and no infrastructure is changed.
      </p>
      <div role="tablist" aria-label="Engineering lab demos" className="flex flex-wrap gap-2">
        {demos.map((d, i) => (
          <button
            key={d.id}
            ref={(el) => { tabRefs.current[i] = el; }}
            role="tab"
            id={`tab-${d.id}`}
            aria-selected={active === d.id}
            aria-controls={`panel-${d.id}`}
            tabIndex={active === d.id ? 0 : -1}
            onClick={() => setActive(d.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={`rounded-lg border px-4 py-2 text-sm transition-colors ${active === d.id ? "border-signal bg-signal/15" : "border-signal/30 text-mist-300 hover:border-signal/70"}`}
          >
            {d.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`panel-${active}`} aria-labelledby={`tab-${active}`} className="panel mt-6 p-5 sm:p-8">
        <Current />
      </div>
    </div>
  );
}
