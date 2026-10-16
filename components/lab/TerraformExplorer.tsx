"use client";

import { useState } from "react";

type Entry = { path: string; kind: "dir" | "file"; depth: number; note: string; snippet?: string };

const tree: Entry[] = [
  { path: "modules/", kind: "dir", depth: 0, note: "Reusable building blocks. Each module does one job and exposes inputs and outputs." },
  { path: "network/", kind: "dir", depth: 1, note: "VPC, subnets, route tables and endpoints. Consumed by every environment." },
  { path: "main.tf", kind: "file", depth: 2, note: "Resources for the module.", snippet: 'resource "aws_vpc" "this" {\n  cidr_block           = var.cidr_block\n  enable_dns_hostnames = true\n  tags                 = var.tags\n}' },
  { path: "variables.tf", kind: "file", depth: 2, note: "Typed inputs with descriptions and sensible defaults.", snippet: 'variable "cidr_block" {\n  type        = string\n  description = "CIDR for the VPC"\n}' },
  { path: "outputs.tf", kind: "file", depth: 2, note: "Values other modules and environments depend on.", snippet: 'output "vpc_id" {\n  value = aws_vpc.this.id\n}' },
  { path: "eks/", kind: "dir", depth: 1, note: "Cluster, node groups and IAM/OIDC wiring, built on the network module outputs." },
  { path: "environments/", kind: "dir", depth: 0, note: "One folder per environment. Same modules, different inputs." },
  { path: "dev/", kind: "dir", depth: 1, note: "Small, cheap settings for experimentation." },
  { path: "prod/", kind: "dir", depth: 1, note: "Production values and stricter review." },
  { path: "backend.tf", kind: "file", depth: 2, note: "Remote state per environment, with locking, so state is shared safely and never lives on a laptop.", snippet: 'terraform {\n  backend "s3" {\n    bucket         = "<state-bucket>"\n    key            = "prod/terraform.tfstate"\n    region         = "<region>"\n    dynamodb_table = "<lock-table>"\n    encrypt        = true\n  }\n}' },
  { path: "main.tf", kind: "file", depth: 2, note: "Calls the modules with environment-specific inputs.", snippet: 'module "network" {\n  source     = "../../modules/network"\n  cidr_block = "10.0.0.0/16"\n  tags       = local.tags\n}' },
  { path: ".github/workflows/terraform.yml", kind: "file", depth: 0, note: "Plan on pull request, apply after approval. Changes are reviewed like code." },
];

export function TerraformExplorer() {
  const [sel, setSel] = useState(0);
  const e = tree[sel];

  return (
    <div>
      <h2 className="text-2xl font-semibold">Terraform module structure explorer</h2>
      <p className="mt-2 max-w-prose text-mist-300">A sample repository layout (placeholder values only). Select a folder or file to see why it is organised this way.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <ul className="rounded-lg border border-signal/20 p-2 font-mono text-sm" role="list">
          {tree.map((t, i) => (
            <li key={`${t.path}-${i}`}>
              <button
                aria-pressed={sel === i}
                onClick={() => setSel(i)}
                style={{ paddingLeft: `${t.depth * 1.25 + 0.75}rem` }}
                className={`w-full rounded-md py-1.5 pr-3 text-left ${sel === i ? "bg-signal/15" : "hover:bg-signal/10"}`}
              >
                <span aria-hidden className="mr-2 text-mist-500">{t.kind === "dir" ? "▸" : "·"}</span>
                {t.path}
                <span className="sr-only"> {t.kind === "dir" ? "folder" : "file"}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="rounded-lg border border-signal/20 bg-ink-950/50 p-5" aria-live="polite">
          <h3 className="font-mono text-base font-medium">{e.path}</h3>
          <p className="mt-3 text-sm text-mist-300">{e.note}</p>
          {e.snippet && <pre className="mt-4 overflow-x-auto rounded-lg bg-ink-950 p-4 font-mono text-xs leading-relaxed text-mist-300"><code>{e.snippet}</code></pre>}
        </div>
      </div>
    </div>
  );
}
