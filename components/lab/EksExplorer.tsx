"use client";

import { useState } from "react";

type Layer = "Network" | "Identity" | "Compute" | "Storage" | "Data";
const parts: { id: string; name: string; layer: Layer; role: string; failure: string; check: string }[] = [
  { id: "vpc", name: "Private subnets and VPC endpoints", layer: "Network", role: "Keep cluster and AWS service traffic on private paths, without open public access.", failure: "Nodes cannot reach the control plane or AWS APIs, so they never become ready.", check: "Confirm routes, security groups and that the needed VPC endpoints exist and resolve privately." },
  { id: "cp", name: "EKS control plane", layer: "Network", role: "Managed Kubernetes API. Private endpoint access keeps it off the public internet.", failure: "Tools or nodes cannot reach the API endpoint from where they run.", check: "Verify endpoint access settings and that the caller is inside the allowed network." },
  { id: "cni", name: "Pod networking (CNI)", layer: "Network", role: "Gives pods IP addresses and connectivity.", failure: "Pods stuck creating, or IP address exhaustion on nodes.", check: "Inspect the CNI pods and logs, and compare subnet capacity to the pod count." },
  { id: "oidc", name: "IAM roles and OIDC", layer: "Identity", role: "Lets workloads assume narrowly scoped AWS roles without long-lived keys.", failure: "Access denied from a pod even though the role looks right.", check: "Check the service account annotation and the role trust policy, then confirm which identity the pod actually has." },
  { id: "nodes", name: "Managed node groups", layer: "Compute", role: "EC2 capacity that runs your pods.", failure: "Nodes fail to join or stay NotReady.", check: "Check the node role mapping, bootstrap output and network path to the control plane." },
  { id: "pv", name: "Persistent volumes", layer: "Storage", role: "Durable block storage for stateful workloads.", failure: "Volume will not attach or mount, often tied to zone or driver permissions.", check: "Follow claim to volume to node, and confirm zone placement and storage driver permissions." },
  { id: "rds", name: "RDS database", layer: "Data", role: "Managed database reached over a private connection.", failure: "Application cannot connect to the database from the cluster.", check: "Verify security group rules from node or pod network to the database port, and DNS resolution." },
  { id: "lb", name: "Load balancer and SSL", layer: "Network", role: "Entry point with TLS, kept private when access should be internal.", failure: "Failing health checks or certificate errors.", check: "Check target health, the health check path, and the certificate chain and hostname." },
];

const layers: ("All" | Layer)[] = ["All", "Network", "Identity", "Compute", "Storage", "Data"];

export function EksExplorer() {
  const [layer, setLayer] = useState<"All" | Layer>("All");
  const [selected, setSelected] = useState(parts[0].id);
  const current = parts.find((p) => p.id === selected)!;

  return (
    <div>
      <h2 className="text-2xl font-semibold">EKS deployment architecture explorer</h2>
      <p className="mt-2 max-w-prose text-mist-300">A generic private EKS design. Pick a component to see its role, a typical failure, and how I would check it.</p>

      <div role="group" aria-label="Filter by layer" className="mt-6 flex flex-wrap gap-2">
        {layers.map((l) => (
          <button key={l} aria-pressed={layer === l} onClick={() => setLayer(l)} className={`rounded-full border px-3.5 py-1 text-sm ${layer === l ? "border-signal bg-signal/15" : "border-signal/30 text-mist-300"}`}>{l}</button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <ul className="space-y-2">
          {parts.map((p) => {
            const dim = layer !== "All" && p.layer !== layer;
            return (
              <li key={p.id}>
                <button
                  aria-pressed={selected === p.id}
                  onClick={() => setSelected(p.id)}
                  className={`w-full rounded-lg border px-4 py-3 text-left transition-opacity ${selected === p.id ? "border-signal bg-signal/10" : "border-signal/20"} ${dim ? "opacity-40" : ""}`}
                >
                  <span className="block text-sm font-medium">{p.name}</span>
                  <span className="text-xs text-mist-500">{p.layer}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="rounded-lg border border-signal/20 bg-ink-950/50 p-5" aria-live="polite">
          <h3 className="text-lg font-semibold">{current.name}</h3>
          <dl className="mt-4 space-y-4 text-sm">
            <div><dt className="font-medium">Role</dt><dd className="mt-1 text-mist-300">{current.role}</dd></div>
            <div><dt className="font-medium">Typical failure</dt><dd className="mt-1 text-mist-300">{current.failure}</dd></div>
            <div><dt className="font-medium">How I check</dt><dd className="mt-1 text-mist-300">{current.check}</dd></div>
          </dl>
        </div>
      </div>
    </div>
  );
}
