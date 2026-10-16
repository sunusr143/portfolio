export type Engagement = {
  id: string;
  title: string;
  summary: string;
  deliverables: string[];
  suitableFor: string[];
  inputs: string[];
  process: string[];
  /** Optional. Leave undefined to hide. Example: "From EUR 2,500" */
  price?: string;
};

export const engagements: Engagement[] = [
  {
    id: "cloud-assessment",
    title: "Cloud Infrastructure Assessment",
    summary: "A focused review of your AWS setup with a prioritised plan.",
    deliverables: ["Review of networking, IAM and environment structure", "Findings ranked by risk and effort", "A written roadmap for next steps"],
    suitableFor: ["Teams that inherited an AWS setup", "Companies preparing to scale or modernise"],
    inputs: ["Read-only access or architecture walkthrough", "Your top concerns and goals"],
    process: ["Scoping call", "Review", "Findings walkthrough", "Written roadmap"],
  },
  {
    id: "terraform-automation",
    title: "Terraform and Infrastructure Automation",
    summary: "Move hand-built infrastructure into reviewable, reusable code.",
    deliverables: ["Reusable Terraform modules", "Remote state and environment separation", "Plan and apply automation", "Handover documentation"],
    suitableFor: ["Teams with manual or inconsistent environments", "Startups standardising before growth"],
    inputs: ["Current infrastructure overview", "Target environments", "Preferred CI system"],
    process: ["Scope and inventory", "Module design", "Implementation", "Handover"],
  },
  {
    id: "cicd-audit",
    title: "CI/CD Pipeline Audit and Improvement",
    summary: "Find what makes releases slow or fragile, then fix the priority items.",
    deliverables: ["Pipeline review", "Quality gate and security scan recommendations", "Implemented improvements as agreed"],
    suitableFor: ["Teams with Jenkins, GitHub Actions or Bitbucket Pipelines pain", "Teams adding security checks to delivery"],
    inputs: ["Repository and pipeline access (or screen share)", "Current release process description"],
    process: ["Audit", "Prioritise", "Implement", "Verify with your team"],
  },
  {
    id: "eks-review",
    title: "EKS Troubleshooting and Architecture Review",
    summary: "Fix a misbehaving cluster or review one before it goes to production.",
    deliverables: ["Root cause analysis for current problems", "Architecture review: networking, IAM, nodes, storage", "Runbook for recurring failure modes"],
    suitableFor: ["Teams with node, CNI, IAM or storage issues", "Teams planning an EC2-to-EKS migration"],
    inputs: ["Cluster access or diagnostic output", "Symptoms and timeline"],
    process: ["Triage", "Diagnose", "Fix or recommend", "Document"],
  },
  {
    id: "devsecops-governance",
    title: "DevSecOps and Cloud Governance Implementation",
    summary: "Put guardrails in code and connect findings to action.",
    deliverables: ["Cloud Custodian policies and deployment pipeline", "Notification, exception and approval workflow", "Ticketing or pull request automation"],
    suitableFor: ["Organizations with growing security findings", "Multi-account AWS environments"],
    inputs: ["Compliance priorities", "Account structure", "Ticketing system in use"],
    process: ["Prioritise controls", "Build and test policies", "Pipeline rollout", "Handover"],
  },
  {
    id: "ai-automation",
    title: "AI-Assisted Cloud Automation Consulting",
    summary: "Design AI-assisted workflows with validation and human approval built in.",
    deliverables: ["Workflow design and architecture", "Validation and approval gate design", "Prototype implementation as agreed"],
    suitableFor: ["Teams exploring AI for governance or operations", "Teams that need safe, auditable automation"],
    inputs: ["Target process", "Constraints on data and approvals"],
    process: ["Discovery", "Design", "Prototype", "Review"],
  },
];
