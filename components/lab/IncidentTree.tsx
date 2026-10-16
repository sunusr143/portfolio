"use client";

import { useState } from "react";

type Node = { question: string; options: { label: string; next: string }[] } | { result: string; actions: string[] };

const tree: Record<string, Node> = {
  start: { question: "What is the main symptom?", options: [
    { label: "Pods are Pending or not starting", next: "pods" },
    { label: "A node is NotReady or will not join", next: "node" },
    { label: "Users see errors at the load balancer", next: "lb" },
    { label: "Access denied from a workload", next: "iam" },
  ]},
  pods: { question: "What do the pod events say?", options: [
    { label: "Insufficient CPU or memory", next: "capacity" },
    { label: "Volume attach or mount failure", next: "volume" },
    { label: "Cannot pull the image", next: "image" },
    { label: "Network or IP address errors", next: "cni" },
  ]},
  capacity: { result: "Not enough schedulable capacity", actions: ["Compare pod requests to node allocatable resources", "Scale the node group or right-size requests", "Check for taints or selectors that exclude available nodes"] },
  volume: { result: "Storage attach or mount problem", actions: ["Follow claim to volume to node", "Confirm the volume and node are in the same availability zone", "Check storage driver permissions and logs"] },
  image: { result: "Image pull failure", actions: ["Check the image name and tag", "Confirm registry credentials or role permissions", "Verify the node can reach the registry privately"] },
  cni: { result: "Pod networking (CNI) issue", actions: ["Inspect CNI pod logs", "Check free IP addresses in the node subnets", "Review security group and subnet assumptions"] },
  node: { question: "Did the node ever join the cluster?", options: [
    { label: "Never joined", next: "nojoin" },
    { label: "Joined, then went NotReady", next: "notready" },
  ]},
  nojoin: { result: "Node onboarding problem", actions: ["Check the node IAM role is mapped for cluster access", "Read bootstrap logs on the instance", "Verify the network path to the control plane and AWS endpoints"] },
  notready: { result: "Node health problem", actions: ["Check kubelet status and resource pressure", "Look for CNI or disk pressure conditions", "Cordon and drain, then replace if needed"] },
  lb: { question: "Are targets healthy?", options: [
    { label: "No, health checks fail", next: "health" },
    { label: "Yes, but errors persist", next: "app" },
    { label: "Certificate warnings", next: "tls" },
  ]},
  health: { result: "Health check failing", actions: ["Confirm the health check path and port match the app", "Check security groups between the load balancer and pods", "Inspect pod readiness and logs"] },
  app: { result: "Application-level errors", actions: ["Check application logs and recent deploys", "Correlate error rate with the release time", "Roll back if the timing matches"] },
  tls: { result: "Certificate or hostname problem", actions: ["Check expiry and the certificate chain", "Confirm the hostname matches the certificate", "Verify TLS termination is where you expect"] },
  iam: { question: "Is the workload using the role you expect?", options: [
    { label: "Not sure", next: "identity" },
    { label: "Yes, role is right", next: "policy" },
  ]},
  identity: { result: "Identity mismatch", actions: ["Check the service account annotation", "Confirm the OIDC provider and trust policy conditions", "Verify which identity the pod actually resolves"] },
  policy: { result: "Permission scope problem", actions: ["Read the exact denied action and resource", "Add only that permission, not a wildcard", "Check for boundary or service control policies"] },
};

export function IncidentTree() {
  const [path, setPath] = useState<string[]>(["start"]);
  const currentId = path[path.length - 1];
  const node = tree[currentId];

  return (
    <div>
      <h2 className="text-2xl font-semibold">Incident troubleshooting decision tree</h2>
      <p className="mt-2 max-w-prose text-mist-300">Answer the questions the way I would narrow down a cluster incident. The tree is simplified and illustrative.</p>

      <div className="mt-6 min-h-[16rem] rounded-lg border border-signal/20 bg-ink-950/50 p-5" aria-live="polite">
        {"question" in node ? (
          <>
            <h3 className="text-lg font-semibold">{node.question}</h3>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {node.options.map((o) => (
                <li key={o.next}><button className="btn-ghost w-full !justify-start text-left" onClick={() => setPath((p) => [...p, o.next])}>{o.label}</button></li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <p className="text-sm text-mist-300">Likely area</p>
            <h3 className="text-xl font-semibold">{node.result}</h3>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-mist-300">{node.actions.map((a) => <li key={a}>{a}</li>)}</ol>
          </>
        )}
      </div>

      <div className="mt-4 flex gap-3">
        <button className="btn-ghost !py-2" disabled={path.length === 1} onClick={() => setPath((p) => p.slice(0, -1))}>Back</button>
        <button className="btn-ghost !py-2" disabled={path.length === 1} onClick={() => setPath(["start"])}>Start over</button>
      </div>
    </div>
  );
}
