export type Service = {
  slug: string;
  title: string;
  summary: string;
  problem: string;
  deliverables: string[];
  benefit: string;
  keywords: string[];
  icon: string;
};

export const services: Service[] = [
  {
    slug: "aws-infrastructure",
    icon: "cloud",
    title: "AWS Infrastructure & Architecture",
    summary: "Secure, repeatable AWS foundations your team can build on.",
    problem:
      "Environments grew by hand. Networking, IAM and account structure are hard to reason about, and nobody is sure a new environment would match the old one.",
    deliverables: [
      "Cloud infrastructure design and review",
      "VPC, networking, IAM and account foundations",
      "Secure, repeatable environment provisioning",
      "Written architecture notes your team can maintain",
    ],
    benefit:
      "A clearer, more secure baseline and environments that can be recreated on demand instead of rebuilt from memory.",
    keywords: ["AWS DevOps Consultant", "AWS architecture"],
  },
  {
    slug: "kubernetes-eks",
    icon: "box",
    title: "Kubernetes & Amazon EKS",
    summary: "EKS clusters that are set up properly and fixed when they misbehave.",
    problem:
      "Workloads are moving to Kubernetes but cluster networking, node onboarding, storage or IAM access keeps causing production surprises.",
    deliverables: [
      "EKS cluster setup, review and troubleshooting",
      "EC2-to-EKS migration planning and execution",
      "Helm deployments, node groups, networking, storage and load balancing",
      "Runbooks for the failure modes we find",
    ],
    benefit:
      "A cluster your team understands, with the common failure modes documented and the migration path de-risked.",
    keywords: ["EKS Consultant", "Kubernetes consultant"],
  },
  {
    slug: "terraform-iac",
    icon: "layers",
    title: "Terraform & Infrastructure as Code",
    summary: "Infrastructure defined in code, reviewed like code.",
    problem:
      "Infrastructure changes are manual or inconsistent across environments, and the real state has drifted from what anyone thinks it is.",
    deliverables: [
      "Reusable Terraform modules",
      "Remote state and environment separation",
      "Automation around plan and apply",
      "Drift-conscious workflows and conventions",
    ],
    benefit:
      "Changes become reviewable and repeatable, and spinning up another environment stops being a project.",
    keywords: ["Terraform Engineer", "Infrastructure as Code"],
  },
  {
    slug: "cicd-gitops",
    icon: "gear",
    title: "CI/CD & GitOps",
    summary: "Pipelines that make releases routine instead of risky.",
    problem:
      "Deployments are manual, slow or fragile. Builds pass on one machine and fail on another, and releases need a person watching.",
    deliverables: [
      "Jenkins and GitHub Actions pipelines",
      "Build, test, security scan and deployment automation",
      "GitOps and release workflow improvements",
      "Pipeline audit with prioritised fixes",
    ],
    benefit: "Fewer manual deployment steps and a release process that behaves the same way every time.",
    keywords: ["CI/CD Consultant", "GitHub Actions"],
  },
  {
    slug: "devsecops-governance",
    icon: "shield",
    title: "DevSecOps & Cloud Governance",
    summary: "Security guardrails as code, with room for exceptions and approvals.",
    problem:
      "Security findings pile up in dashboards. Fixing them depends on people noticing, and blunt automation risks breaking production.",
    deliverables: [
      "Cloud Custodian policy-as-code",
      "Findings-to-remediation workflows",
      "Guardrails, exception handling and approval-based remediation",
      "Ticketing and pull request automation for follow-up",
    ],
    benefit:
      "Governance that is version-controlled and traceable, so findings get acted on without surprise changes in production.",
    keywords: ["DevSecOps Consultant", "Cloud Security Automation"],
  },
  {
    slug: "ai-cloud-automation",
    icon: "brain",
    title: "AI-Driven Cloud Automation",
    summary: "AI that proposes. Tests and people decide.",
    problem:
      "Writing and maintaining governance policies by hand does not keep up with the findings coming in, but unreviewed AI output is not safe to run against production.",
    deliverables: [
      "AI-assisted security policy generation",
      "Validation workflows and human approval gates",
      "Automated ticketing and governance processes",
      "Clear separation of proposals from approved changes",
    ],
    benefit:
      "Faster policy drafting with testing and human review before anything reaches production.",
    keywords: ["AI cloud automation", "agentic workflows"],
  },
];
