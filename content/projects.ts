import { projectExtras, projectStatus } from "./projectExtras";

/**
 * Case studies are sanitized: no account IDs, internal URLs, IPs, credentials,
 * or company-specific diagrams. Impact statements use only verifiable facts.
 */
export type Tone = "default" | "proposed" | "validated" | "approved" | "security";

export type DiagramNode = { id: string; label: string; detail?: string; tone?: Tone };
export type DiagramLane = { label: string; nodes: DiagramNode[] };
export type Diagram = { caption: string; lanes: DiagramLane[] };

export type ProjectCategory = "Kubernetes" | "AI & Automation" | "Security" | "CI/CD" | "Jenkins" | "Terraform" | "Observability" | "Embedded & IoT";

export type ProjectStatus = "Production work" | "Open-source reference" | "Prototype" | "Concept";

export type Project = {
  slug: string;
  title: string;
  category: ProjectCategory[];
  tagline: string;
  overview: string;
  problem: string;
  role: string[];
  diagram?: Diagram;
  /** Production work, open-source reference, prototype or design concept. Set in projectExtras.ts. */
  status?: ProjectStatus;
  /** Optional recruiter-facing sections. Set in projectExtras.ts. */
  workflow?: string[];
  security?: string[];
  validation?: string[];
  stack?: string[];
  decisions?: { title: string; body: string }[];
  challenges?: { challenge: string; approach: string }[];
  impact?: string[];
  skills: string[];
  lessons?: string[];
  note?: string;
  /** Optional WebP cover image in /public/images (1200x630). */
  image?: string;
  /** Public source repository, when the work is open on GitHub. */
  repoUrl?: string;
};

const CONFIDENTIAL_NOTE =
  "This is a sanitized description of enterprise work. Names, identifiers and internal architecture are intentionally omitted, and the code is not open source.";

const baseProjects: Project[] = [
  {
    slug: "artifactory-eks-migration",
    title: "Enterprise Artifactory Migration to Amazon EKS",
    category: ["Kubernetes", "Terraform"],
    tagline: "Moving JFrog Artifactory from EC2 to a private Amazon EKS platform built with Terraform and Helm.",
    overview:
      "I led the migration of JFrog Artifactory from EC2 to Amazon EKS. The cluster and its supporting infrastructure were built with Terraform and deployed with Helm, with private networking as a hard requirement.",
    problem:
      "An artifact repository sits in the critical path of every build. The platform had to move to Kubernetes without opening public access to the cluster, and without breaking SSL, registry access or database connectivity for the teams relying on it.",
    role: [
      "Led the migration and designed the target EKS architecture",
      "Built the cluster in Terraform and Helm: node groups, private networking with VPC endpoints, IAM/OIDC, storage, RDS and load balancing",
      "Worked through node onboarding, CNI, IAM and volume issues",
      "Cleared the migration readiness checks: SSL, load balancer setup, Docker registry access, database connectivity and private cluster access",
    ],
    diagram: {
      caption: "Conceptual, sanitized architecture. Not the production diagram.",
      lanes: [
        { label: "Access", nodes: [
          { id: "users", label: "Build agents and engineers", detail: "Private network access only" },
          { id: "lb", label: "Load balancer + SSL", detail: "Internal, TLS terminated" },
        ]},
        { label: "EKS cluster", nodes: [
          { id: "ingress", label: "Ingress / service", detail: "Routes to the application" },
          { id: "app", label: "Artifactory (Helm release)", detail: "Deployed via Helm values" },
          { id: "pv", label: "Persistent volumes", detail: "Block storage for application data" },
        ]},
        { label: "Platform services", nodes: [
          { id: "nodes", label: "Managed node groups", detail: "Onboarded to the cluster" },
          { id: "iam", label: "IAM + OIDC", detail: "Scoped access for workloads" },
          { id: "rds", label: "RDS database", detail: "Private connectivity" },
          { id: "vpce", label: "VPC endpoints", detail: "No open public path" },
        ]},
      ],
    },
    stack: ["Amazon EKS", "Terraform", "Helm", "AWS IAM / OIDC", "VPC endpoints", "RDS", "Docker", "JFrog Artifactory"],
    decisions: [
      { title: "Private by default", body: "The cluster endpoint and the supporting AWS service traffic stay on private networking with VPC endpoints, so the platform does not depend on open public access." },
      { title: "Everything in code", body: "Cluster, node groups, IAM/OIDC, storage and database wiring are Terraform. The application is a Helm release. A rebuild is a code change, not a runbook." },
      { title: "Readiness checks before cutover", body: "SSL, load balancer behaviour, registry access, database connectivity and private cluster access were each verified before the platform moved over." },
    ],
    challenges: [
      { challenge: "Nodes failing to join or become ready", approach: "Check node IAM role mappings, bootstrap configuration and the network path to the control plane before touching the workload." },
      { challenge: "Pod networking (CNI) problems", approach: "Inspect CNI behaviour and address availability on nodes, and confirm subnet and security group assumptions match the design." },
      { challenge: "IAM and OIDC access errors", approach: "Trace which identity the workload is actually using, then correct the trust policy and role scope rather than widening permissions." },
      { challenge: "Persistent volume attach and mount issues", approach: "Work from the volume claim to the node and availability zone, and verify driver permissions and zone placement." },
    ],
    impact: [
      "The platform moved from EC2 to EKS without open public access to the cluster.",
      "The migration readiness checks across SSL, load balancing, Docker registry access, database connectivity and private access were cleared.",
    ],
    skills: ["EKS architecture", "Terraform", "Helm", "AWS networking and IAM", "Troubleshooting", "Migration planning"],
    lessons: [
      "Prove the private network path early. Most late surprises in an EKS build are connectivity and identity, not Kubernetes itself.",
      "Troubleshoot in layers: network, identity, node, storage, then application. It keeps the search space small.",
      "Write down each failure and its fix as you go. Those notes become the runbook.",
    ],
    note: CONFIDENTIAL_NOTE,
  },
  {
    slug: "agentic-ai-cloud-governance",
    title: "Agentic AI Pipeline for Cloud Governance",
    category: ["AI & Automation", "Security"],
    tagline: "AI drafts the policy. Tests validate it. A person approves it.",
    overview:
      "I led the architecture of an AI-assisted pipeline that turns cloud governance findings into candidate Cloud Custodian policies using OpenAI GPT-5.1. Each candidate is tested against AWS test resources before a pull request with human approval gates is the last step before anything goes live.",
    problem:
      "Governance findings arrive faster than policies can be written by hand. Letting generated policies run unreviewed against production is not acceptable, so the workflow needs testing and approval built in.",
    role: [
      "Led the architecture of the pipeline",
      "Defined how findings become either guardrail policies or notify-only policies",
      "Designed validation against test resources in AWS and the pull request approval flow",
    ],
    diagram: {
      caption: "Proposals are visually separate from validated and approved changes.",
      lanes: [
        { label: "Trigger", nodes: [
          { id: "findings", label: "Cloud security findings" },
          { id: "s3", label: "Report in S3", detail: "Landing triggers the workflow" },
          { id: "gha", label: "GitHub Actions" },
        ]},
        { label: "Proposal (not trusted yet)", nodes: [
          { id: "ai", label: "AI-assisted policy generation", detail: "GPT-5.1", tone: "proposed" },
          { id: "kind", label: "Guardrail or notify-only", detail: "Candidate classification", tone: "proposed" },
        ]},
        { label: "Validation", nodes: [
          { id: "test", label: "Run against AWS test resources", tone: "validated" },
          { id: "pr", label: "Pull request", detail: "Traceable and version-controlled", tone: "validated" },
        ]},
        { label: "Approved change", nodes: [
          { id: "human", label: "Human approval", tone: "approved" },
          { id: "deploy", label: "Controlled deployment", tone: "approved" },
        ]},
      ],
    },
    stack: ["OpenAI GPT-5.1", "AWS Cloud Custodian", "GitHub Actions", "Amazon S3", "AWS test resources", "Pull requests"],
    decisions: [
      { title: "Guardrail versus notify-only", body: "Not every finding should be enforced automatically. The pipeline produces either a guardrail policy or a notify-only policy so risky enforcement is a deliberate choice." },
      { title: "Generated is not trusted", body: "A generated policy is only a proposal until it has passed validation against test resources and a person has approved the pull request." },
      { title: "Git as the audit trail", body: "Policy delivery goes through pull requests, so every change is reviewable and traceable." },
    ],
    challenges: [
      { challenge: "Generated policies can be wrong or too broad", approach: "Validate each candidate against test resources before it is allowed to progress." },
      { challenge: "Automation must not change production unreviewed", approach: "Make human approval the last gate and deploy only through the controlled pipeline." },
    ],
    impact: [
      "Findings are converted into tested guardrail or notify-only policies.",
      "A pull request with human approval gates is the last step before anything goes live.",
    ],
    skills: ["Agentic workflow design", "Policy-as-code", "GitHub Actions", "AWS governance", "Human-in-the-loop controls"],
    note: CONFIDENTIAL_NOTE,
  },
  {
    slug: "cloud-security-governance",
    title: "AWS Cloud Security Governance",
    category: ["Security"],
    tagline: "Version-controlled Cloud Custodian guardrails across multi-account AWS and multi-cloud environments.",
    overview:
      "I wrote Cloud Custodian policies as version-controlled guardrails and deployed them through dedicated pipelines across multi-account AWS and multi-cloud environments. They flag or clean up public S3 buckets, unencrypted EBS volumes, idle EC2 instances and untagged RDS snapshots. Pipeline failures and policy violations open a GitHub issue, an Azure DevOps ticket or a pull request.",
    problem:
      "Misconfigurations are easy to create and slow to find in many accounts. Teams need consistent detection and cleanup, with a way to handle legitimate exceptions.",
    role: [
      "Wrote the policies and the pipelines that deploy them",
      "Automated follow-up: issues, tickets and pull requests when something fails or a violation is found",
    ],
    diagram: {
      caption: "Generic detection-to-remediation flow. Which steps apply depends on the policy.",
      lanes: [
        { label: "Policy lifecycle", nodes: [
          { id: "code", label: "Policy as code", detail: "Version-controlled" },
          { id: "pipe", label: "Dedicated pipeline", detail: "Multi-account deployment" },
        ]},
        { label: "Detection and handling", nodes: [
          { id: "detect", label: "Detect", detail: "Scan resources", tone: "security" },
          { id: "tag", label: "Tag and notify", detail: "Owner is told", tone: "security" },
          { id: "exc", label: "Exception check", detail: "Approved exceptions skipped", tone: "security" },
          { id: "fix", label: "Remediate where applicable", detail: "After approval", tone: "approved" },
        ]},
        { label: "Follow-up", nodes: [
          { id: "issue", label: "GitHub issue / Azure DevOps ticket / PR" },
        ]},
      ],
    },
    stack: ["AWS Cloud Custodian", "AWS (multi-account)", "Multi-cloud", "GitHub", "Azure DevOps", "CI/CD pipelines"],
    challenges: [
      { challenge: "Public S3 buckets", approach: "Detect public exposure, notify the owner, and remediate where it is safe to do so." },
      { challenge: "Unencrypted EBS volumes", approach: "Flag them and drive follow-up, since encrypting an attached volume is not a casual change." },
      { challenge: "Idle EC2 instances", approach: "Identify and flag idle instances so owners can decide, which is a cost and hygiene control." },
      { challenge: "Untagged RDS snapshots", approach: "Detect missing tags and route to owners, so ownership is clear before cleanup." },
    ],
    impact: [
      "Governance policies are version-controlled and deployed through dedicated pipelines.",
      "Violations and pipeline failures are turned into tracked work automatically.",
    ],
    skills: ["Cloud Custodian", "AWS security", "Policy-as-code", "Multi-account operations", "Workflow automation"],
    note: CONFIDENTIAL_NOTE,
  },
  {
    slug: "multi-cloud-security-automation",
    title: "Multi-Cloud Security Automation",
    category: ["Security", "Kubernetes"],
    tagline: "Rolling out the Wiz Defend Kubernetes Sensor with Helm across EKS, AKS and GKE.",
    overview:
      "I automated the rollout of the Wiz Defend Kubernetes Sensor with Helm across EKS, AKS and GKE, and fed Wiz findings into the same pipelines and ticketing so they get triaged and fixed.",
    problem:
      "Running a security sensor on three managed Kubernetes platforms by hand does not scale, and findings are only useful if they reach someone who can act on them.",
    role: ["Automated the Helm-based sensor rollout across three clouds", "Integrated findings with pipelines and ticketing"],
    diagram: {
      caption: "Conceptual flow across clouds.",
      lanes: [
        { label: "Rollout", nodes: [
          { id: "helm", label: "Helm chart + values", detail: "Version-controlled" },
          { id: "pipe", label: "Automation pipeline" },
        ]},
        { label: "Clusters", nodes: [
          { id: "eks", label: "Amazon EKS", tone: "security" },
          { id: "aks", label: "Azure AKS", tone: "security" },
          { id: "gke", label: "Google GKE", tone: "security" },
        ]},
        { label: "Findings", nodes: [
          { id: "wiz", label: "Wiz findings" },
          { id: "ticket", label: "Ticketing and pull requests", detail: "Triaged and fixed" },
        ]},
      ],
    },
    stack: ["Wiz Defend", "Helm", "Amazon EKS", "Azure AKS", "Google GKE", "Ticketing integrations"],
    challenges: [
      { challenge: "Three platforms, one rollout process", approach: "Drive all clusters from the same Helm-based automation instead of per-cloud manual steps." },
      { challenge: "Findings that go nowhere", approach: "Connect findings to the existing pipelines and ticketing so they become tracked work." },
    ],
    impact: ["The sensor rollout is automated across EKS, AKS and GKE.", "Wiz findings feed the same pipelines and ticketing for triage and fixes."],
    skills: ["Multi-cloud Kubernetes", "Helm", "Security tooling integration", "Automation"],
    note: CONFIDENTIAL_NOTE,
  },
  {
    slug: "cicd-devsecops",
    title: "CI/CD and DevSecOps Engineering",
    category: ["CI/CD", "Jenkins", "Security"],
    tagline: "Repeatable releases with automated tests, quality gates and security checks.",
    overview:
      "Across several roles I built and ran Jenkins pipelines using Git, Maven, SonarQube and automated tests, developed pipelines with Snyk-based security scanning and containerized deployments, and integrated Snyk and Nexus IQ into Bitbucket Pipelines, Jenkins jobs and developer IDEs. I also worked with GitHub Actions.",
    problem:
      "Fragile builds and late security findings slow teams down. The goal is consistent builds and deployments, with checks early enough to be cheap to fix.",
    role: [
      "Built and ran Jenkins pipelines",
      "Integrated security and quality tooling into builds and IDEs",
      "Supported releases end to end, including post go-live verification in non-prod and prod",
    ],
    diagram: {
      caption: "Typical delivery workflow. Exact stages vary by team.",
      lanes: [
        { label: "Pipeline", nodes: [
          { id: "commit", label: "Commit", detail: "Git, Bitbucket, GitHub" },
          { id: "build", label: "Build", detail: "Maven, Docker" },
          { id: "test", label: "Automated tests" },
          { id: "quality", label: "Quality gate", detail: "SonarQube", tone: "validated" },
          { id: "sec", label: "Security scan", detail: "Snyk, Nexus IQ", tone: "security" },
          { id: "deploy", label: "Containerized deploy", tone: "approved" },
        ]},
      ],
    },
    stack: ["Jenkins", "GitHub Actions", "Bitbucket Pipelines", "Snyk", "Nexus IQ", "SonarQube", "Maven", "Docker", "Kustomize", "Helm"],
    challenges: [
      { challenge: "Builds that are fragile", approach: "Standardise stages so builds and deployments behave consistently." },
      { challenge: "Security issues found late", approach: "Move scanning into pipelines and developer IDEs so issues surface during development and CI." },
      { challenge: "Different environments, different manifests", approach: "Manage Kubernetes manifests with Kustomize environment overlays." },
    ],
    impact: ["Builds and deployments were made consistent instead of fragile.", "Security issues are identified early in development and during CI builds."],
    skills: ["Jenkins", "GitHub Actions", "Bitbucket Pipelines", "Snyk", "Nexus IQ", "SonarQube", "Release engineering"],
  },
  {
    slug: "kubernetes-observability",
    title: "Kubernetes Observability and Reliability",
    category: ["Observability", "Kubernetes"],
    tagline: "Centralized metrics, logs and alerting, plus root cause analysis and runbooks.",
    overview:
      "I set up centralized monitoring and logging with Coralogix to visualize metrics, trace logs and enable real-time alerting. Previously I led root cause analysis for production incidents and wrote runbooks, wiring alerts into monitoring systems for complex microservices setups.",
    problem:
      "In a microservices environment, incidents are slow to resolve when logs and metrics are scattered and alerts are not connected to a clear response.",
    role: [
      "Set up centralized monitoring and logging",
      "Led root cause analysis for production incidents",
      "Wrote runbooks and wired alerts into monitoring systems",
    ],
    diagram: {
      caption: "Conceptual observability flow.",
      lanes: [
        { label: "Signals", nodes: [
          { id: "metrics", label: "Metrics", detail: "Prometheus, Grafana" },
          { id: "logs", label: "Logs and traces", detail: "Coralogix" },
        ]},
        { label: "Response", nodes: [
          { id: "alert", label: "Real-time alerting" },
          { id: "invest", label: "Incident investigation", tone: "validated" },
          { id: "rca", label: "Root cause fix + runbook", tone: "approved" },
        ]},
      ],
    },
    stack: ["Coralogix", "Prometheus", "Grafana", "Kubernetes", "Helm", "Kustomize"],
    challenges: [
      { challenge: "Finding the signal in microservices", approach: "Centralize metrics and logs so investigation starts from one place." },
      { challenge: "Repeat incidents", approach: "Fix underlying causes rather than applying temporary workarounds, and capture the response in runbooks." },
    ],
    impact: [
      "Centralized monitoring improved observability and accelerated incident response.",
      "Runbooks and alerts helped teams resolve issues faster in complex microservices setups.",
    ],
    skills: ["Observability", "Incident response", "Root cause analysis", "Runbook design", "Kubernetes operations"],
    note: CONFIDENTIAL_NOTE,
  },
  {
    slug: "java-service-jenkins-kubernetes",
    title: "Containerized Java Service: Jenkins CI/CD to Kubernetes",
    category: ["Jenkins", "CI/CD", "Kubernetes"],
    tagline: "A reference implementation: Maven build, SonarQube analysis, Docker image and Kubernetes deployment from a declarative Jenkins pipeline.",
    overview:
      "Tweet Trend Service is a containerized Java backend that I use as a public DevOps reference project. The repository contains the application, a declarative Jenkinsfile, a Dockerfile, Kubernetes manifests and a deploy script, so the path from commit to running workload is visible end to end.",
    problem:
      "A service is only as dependable as the path that ships it. This project shows how I structure that path: consistent builds, a code quality check before packaging, and deployments described as version-controlled manifests instead of manual steps.",
    role: [
      "Author and maintainer of the repository, including the Jenkinsfile, Dockerfile, Kubernetes manifests and deploy script",
      "Defined the pipeline stages from source checkout through Kubernetes deployment",
      "Kept Kubernetes configuration in version control so deployments are repeatable",
    ],
    diagram: {
      caption: "Pipeline stages as defined in the repository's Jenkinsfile.",
      lanes: [
        { label: "Jenkins pipeline", nodes: [
          { id: "checkout", label: "Source checkout" },
          { id: "build", label: "Maven build and unit tests" },
          { id: "sonar", label: "Static analysis", detail: "SonarQube", tone: "validated" },
          { id: "image", label: "Docker image build" },
          { id: "push", label: "Push to container registry" },
          { id: "deploy", label: "Kubernetes deployment", tone: "approved" },
        ]},
        { label: "Kubernetes resources (in Git)", nodes: [
          { id: "ns", label: "Namespace", detail: "Logical isolation" },
          { id: "dep", label: "Deployment", detail: "Application lifecycle" },
          { id: "svc", label: "Service", detail: "Internal exposure" },
          { id: "sec", label: "Secret resource", detail: "Sensitive configuration kept separate", tone: "security" },
        ]},
      ],
    },
    stack: ["Java", "Maven", "Jenkins", "SonarQube", "Docker", "Kubernetes", "Shell"],
    challenges: [
      { challenge: "Builds that behave differently each run", approach: "Define every stage declaratively in a Jenkinsfile so the same steps run for every change." },
      { challenge: "Code quality checked too late", approach: "Run SonarQube analysis in the pipeline before the image is built and pushed." },
      { challenge: "Deployments that depend on someone's memory", approach: "Describe the namespace, deployment, service and secret as manifests in the repository, with a deploy script around them." },
      { challenge: "Environment-specific and sensitive values", approach: "Keep configuration separate from the image and treat credentials as per-environment values, never as shared defaults." },
    ],
    impact: [
      "The full commit-to-deployment path is defined as code: pipeline, container image and Kubernetes manifests.",
      "This is a public reference and demonstration project, not production or employer work, and I make no claims about traffic or uptime.",
    ],
    skills: ["Jenkins pipelines", "Docker", "Kubernetes manifests", "SonarQube", "Maven", "Release automation"],
    repoUrl: "https://github.com/sunusr143/tweet-trend-service",
    note: "Open-source reference project, public on GitHub. It is separate from my employer and client work described in the other case studies.",
  },
  {
    slug: "jenkins-maven-sonarqube-pipelines",
    title: "Jenkins CI Pipelines with Maven and SonarQube",
    category: ["Jenkins", "CI/CD"],
    tagline: "Making builds and deployments consistent instead of fragile.",
    overview:
      "In my Technical Lead role I built and ran Jenkins pipelines that combined Git, Maven, SonarQube and automated tests, so builds and deployments followed the same steps every time.",
    problem:
      "Builds that depend on manual steps or one person's setup break unpredictably. Teams need a pipeline that builds, tests and checks quality the same way for every change.",
    role: [
      "Built and ran Jenkins pipelines using Git, Maven, SonarQube and automated tests",
      "Managed Jenkins and worked with developers and infrastructure teams to fix broken workflows",
      "Automated environment setup with scripts",
    ],
    diagram: {
      caption: "Illustrative flow. Exact stages varied by application.",
      lanes: [
        { label: "Jenkins pipeline", nodes: [
          { id: "git", label: "Git checkout" },
          { id: "maven", label: "Maven build" },
          { id: "tests", label: "Automated tests" },
          { id: "sonar", label: "SonarQube analysis", tone: "validated" },
          { id: "release", label: "Deployable artifact", tone: "approved" },
        ]},
      ],
    },
    stack: ["Jenkins", "Git", "Maven", "SonarQube", "Shell scripting"],
    challenges: [
      { challenge: "Fragile, manual builds", approach: "Express the build and test steps as a pipeline so they run identically for every change." },
      { challenge: "Quality problems found late", approach: "Run static analysis inside the pipeline, before anything is released." },
      { challenge: "Broken workflows and Jenkins upkeep", approach: "Work directly with developers and infrastructure teams to repair pipelines and script environment setup." },
    ],
    impact: ["Builds and deployments became consistent instead of fragile."],
    skills: ["Jenkins", "Maven", "SonarQube", "Build automation", "Cross-team troubleshooting"],
    note: CONFIDENTIAL_NOTE,
  },
  {
    slug: "jenkins-snyk-nexus-iq-security",
    title: "Security Scanning in Jenkins and Bitbucket Pipelines",
    category: ["Jenkins", "CI/CD", "Security"],
    tagline: "Finding dependency and code security issues during development, not after release.",
    overview:
      "In my Senior DevOps Engineer role I developed Jenkins pipelines with automated testing, Snyk-based security scanning, code quality checks and containerized deployments. I also integrated Snyk and Nexus IQ into Bitbucket Pipelines, Jenkins jobs and developer IDEs.",
    problem:
      "Security findings are cheap to fix while the code is being written and expensive after release. The goal was to surface issues early, in the editor and in CI.",
    role: [
      "Developed Jenkins pipelines with testing, Snyk scanning, quality checks and containerized deployment",
      "Integrated Snyk and Nexus IQ into Bitbucket Pipelines and Jenkins jobs",
      "Brought the same checks into developer IDEs",
    ],
    diagram: {
      caption: "Where security checks sit, from IDE to pipeline.",
      lanes: [
        { label: "Developer", nodes: [
          { id: "ide", label: "IDE plugin checks", detail: "Snyk, Nexus IQ", tone: "security" },
          { id: "commit", label: "Commit" },
        ]},
        { label: "CI (Jenkins / Bitbucket Pipelines)", nodes: [
          { id: "build", label: "Build and tests" },
          { id: "quality", label: "Code quality checks", tone: "validated" },
          { id: "scan", label: "Dependency and code scan", detail: "Snyk, Nexus IQ", tone: "security" },
          { id: "container", label: "Containerized deployment", tone: "approved" },
        ]},
      ],
    },
    stack: ["Jenkins", "Bitbucket Pipelines", "Snyk", "Nexus IQ", "Docker", "Git"],
    challenges: [
      { challenge: "Issues discovered only at release time", approach: "Scan in the IDE and again in every CI build so problems appear while the change is small." },
      { challenge: "Different CI systems in one organization", approach: "Apply the same Snyk and Nexus IQ checks in both Jenkins and Bitbucket Pipelines." },
    ],
    impact: ["Security issues are identified early in development and during CI builds."],
    skills: ["DevSecOps", "Snyk", "Nexus IQ", "Jenkins", "Bitbucket Pipelines", "Shift-left security"],
    note: CONFIDENTIAL_NOTE,
  },
  {
    slug: "release-engineering-go-live",
    title: "Release Engineering and Go-Live Verification",
    category: ["CI/CD"],
    tagline: "Supporting releases end to end, from the pipeline to post-deployment checks.",
    overview:
      "In my Technical Lead role I supported releases end to end: joining release calls, watching pipelines during deployments, and verifying applications after go-live in non-production and production.",
    problem:
      "A deployment is not finished when the pipeline turns green. Releases need someone who watches the rollout and confirms the application actually works afterwards.",
    role: [
      "Joined release calls and coordinated with the teams involved",
      "Monitored pipelines during deployments",
      "Verified applications after go-live in non-prod and prod",
    ],
    diagram: {
      caption: "Illustrative release flow.",
      lanes: [
        { label: "Release", nodes: [
          { id: "plan", label: "Release call" },
          { id: "deploy", label: "Pipeline deployment", detail: "Watched in real time" },
          { id: "verify-np", label: "Verify in non-prod", tone: "validated" },
          { id: "verify-p", label: "Verify in prod", tone: "approved" },
        ]},
      ],
    },
    stack: ["Jenkins", "Kubernetes", "Helm", "Monitoring and alerting"],
    challenges: [
      { challenge: "Problems that only show up after deployment", approach: "Verify the running application in each environment, not just the pipeline result." },
      { challenge: "Coordination across teams", approach: "Take part in release calls so issues are raised and resolved in the moment." },
    ],
    impact: ["Releases were supported from pipeline to post-go-live verification in both non-production and production."],
    skills: ["Release management", "Deployment monitoring", "Post-deployment verification", "Cross-team coordination"],
    note: CONFIDENTIAL_NOTE,
  },
  {
    slug: "kubernetes-helm-microservices",
    title: "Kubernetes Manifests and Helm Charts for Microservices",
    category: ["Kubernetes"],
    tagline: "Deploying and managing microservices consistently across dev, staging and production.",
    overview:
      "I wrote and maintained Kubernetes manifests and Helm charts to deploy and manage microservices across dev, staging and production environments.",
    problem:
      "Hand-edited manifests drift between environments. Microservices need a repeatable, reviewable way to describe how each one is deployed.",
    role: [
      "Wrote and maintained Kubernetes manifests",
      "Built and maintained Helm charts for microservices",
      "Deployed across dev, staging and production",
    ],
    diagram: {
      caption: "Illustrative Helm-based deployment flow.",
      lanes: [
        { label: "Definition", nodes: [
          { id: "chart", label: "Helm chart", detail: "Templates and defaults" },
          { id: "values", label: "Per-environment values" },
        ]},
        { label: "Environments", nodes: [
          { id: "dev", label: "Dev" },
          { id: "stg", label: "Staging", tone: "validated" },
          { id: "prod", label: "Production", tone: "approved" },
        ]},
      ],
    },
    stack: ["Kubernetes", "Helm", "Docker", "Jenkins"],
    challenges: [
      { challenge: "Configuration drift between environments", approach: "Use one chart with per-environment values instead of copied manifests." },
      { challenge: "Operating many services", approach: "Keep deployment definitions in version control so changes are reviewed like code." },
    ],
    impact: ["Microservices were deployed and managed across dev, staging and production using charts and manifests kept in version control."],
    skills: ["Helm", "Kubernetes manifests", "Microservice deployment", "Environment promotion"],
    note: CONFIDENTIAL_NOTE,
  },
  {
    slug: "kustomize-environment-overlays",
    title: "Kustomize Environment Overlays for Streamlined Deployments",
    category: ["Kubernetes", "CI/CD"],
    tagline: "One base, environment-specific overlays, fewer copied manifests.",
    overview:
      "In my Senior DevOps Engineer role I managed Kubernetes manifests with Kustomize, using environment-specific overlays to streamline deployments.",
    problem:
      "Maintaining separate copies of manifests for each environment invites mistakes. Teams need a shared base with small, explicit differences per environment.",
    role: ["Managed Kubernetes manifests with Kustomize", "Created and maintained environment-specific overlays"],
    diagram: {
      caption: "Base plus overlays.",
      lanes: [
        { label: "Kustomize layout", nodes: [
          { id: "base", label: "Base manifests", detail: "Shared definition" },
          { id: "o-dev", label: "Overlay: dev" },
          { id: "o-stg", label: "Overlay: staging", tone: "validated" },
          { id: "o-prod", label: "Overlay: production", tone: "approved" },
        ]},
      ],
    },
    stack: ["Kustomize", "Kubernetes", "Jenkins", "Bitbucket Pipelines"],
    challenges: [
      { challenge: "Manifest duplication across environments", approach: "Keep one base and express each environment as a small overlay." },
      { challenge: "Reviewing what really differs", approach: "Make environment differences explicit and small, so reviews focus on the change." },
    ],
    impact: ["Deployments were streamlined with environment-specific overlays over a shared base."],
    skills: ["Kustomize", "Kubernetes configuration", "Environment management"],
    note: CONFIDENTIAL_NOTE,
  },
  {
    slug: "terraform-reusable-aws-modules",
    title: "Reusable Terraform Modules for Multi-Environment AWS",
    category: ["Terraform"],
    tagline: "AWS infrastructure defined once and reused across environments and VPCs.",
    overview:
      "Across two roles I automated AWS infrastructure with Terraform, creating reusable modules to manage resources cleanly across multiple environments and VPCs. The modules covered components such as EC2, VPC, IAM and S3.",
    problem:
      "Infrastructure built by hand differs from environment to environment and is hard to reproduce. Reusable modules make environments consistent and changes reviewable.",
    role: [
      "Wrote Terraform modules for EC2, VPC, IAM and S3",
      "Structured modules for reuse across multiple environments and VPCs",
      "Automated environment setup",
    ],
    diagram: {
      caption: "Illustrative module reuse. Not a specific production layout.",
      lanes: [
        { label: "Reusable modules", nodes: [
          { id: "vpc", label: "VPC module" },
          { id: "iam", label: "IAM module", tone: "security" },
          { id: "ec2", label: "EC2 module" },
          { id: "s3", label: "S3 module" },
        ]},
        { label: "Consumers", nodes: [
          { id: "e1", label: "Environment A" },
          { id: "e2", label: "Environment B" },
          { id: "e3", label: "Environment C" },
        ]},
      ],
    },
    stack: ["Terraform", "AWS (EC2, VPC, IAM, S3)", "Git", "CI/CD pipelines"],
    challenges: [
      { challenge: "Environments that drift apart", approach: "Build environments from the same modules with different inputs." },
      { challenge: "Safe infrastructure change", approach: "Keep infrastructure in version control so changes go through review." },
    ],
    impact: ["Resources are managed cleanly across multiple environments and VPCs through reusable modules."],
    skills: ["Terraform", "AWS networking and IAM", "Module design", "Infrastructure as Code"],
    note: CONFIDENTIAL_NOTE,
  },
  {
    slug: "incident-rca-runbooks",
    title: "Production Incident Root Cause Analysis and Runbooks",
    category: ["Observability"],
    tagline: "Fixing underlying causes, and capturing the response so the next incident is faster.",
    overview:
      "In my Technical Lead role I led root cause analysis for production incidents, fixing underlying issues instead of applying temporary workarounds. I improved incident response by writing clear runbooks and wiring alerts into monitoring systems for complex microservices setups.",
    problem:
      "Workarounds hide the real problem and the same incident returns. Teams also lose time when the response lives in one person's head.",
    role: [
      "Led root cause analysis for production incidents",
      "Fixed underlying issues rather than applying temporary workarounds",
      "Wrote runbooks and wired alerts into monitoring systems",
    ],
    diagram: {
      caption: "Incident learning loop.",
      lanes: [
        { label: "Response", nodes: [
          { id: "alert", label: "Alert from monitoring" },
          { id: "triage", label: "Investigate and mitigate" },
          { id: "rca", label: "Root cause analysis", tone: "validated" },
          { id: "fix", label: "Fix underlying issue", tone: "approved" },
          { id: "runbook", label: "Update runbook and alerts" },
        ]},
      ],
    },
    stack: ["Monitoring and alerting", "Runbooks", "Kubernetes", "Microservices"],
    challenges: [
      { challenge: "Recurring incidents", approach: "Pursue the root cause rather than the quickest workaround." },
      { challenge: "Slow, person-dependent response", approach: "Write clear runbooks and connect alerts to them so teams can resolve issues faster." },
    ],
    impact: ["Runbooks and alerting helped teams resolve issues faster in complex microservices setups."],
    skills: ["Root cause analysis", "Incident response", "Runbook writing", "Alert design"],
    note: CONFIDENTIAL_NOTE,
  },
  {
    slug: "automated-failure-triage",
    title: "Automated Follow-up for Pipeline Failures and Policy Violations",
    category: ["CI/CD", "Security"],
    tagline: "When something breaks or a policy is violated, a tracked item appears automatically.",
    overview:
      "I automated follow-up on failures: when a pipeline breaks or a policy violation is found, the automation opens a GitHub issue, an Azure DevOps ticket or a pull request.",
    problem:
      "Failures and violations that only appear in logs or dashboards are easy to miss. Work gets done when it is tracked where the team already plans.",
    role: ["Automated creation of GitHub issues, Azure DevOps tickets and pull requests from pipeline failures and policy violations"],
    diagram: {
      caption: "Event to tracked work.",
      lanes: [
        { label: "Detection", nodes: [
          { id: "fail", label: "Pipeline failure" },
          { id: "viol", label: "Policy violation", tone: "security" },
        ]},
        { label: "Follow-up", nodes: [
          { id: "gh", label: "GitHub issue" },
          { id: "ado", label: "Azure DevOps ticket" },
          { id: "pr", label: "Pull request", tone: "validated" },
        ]},
      ],
    },
    stack: ["GitHub", "GitHub Actions", "Azure DevOps", "CI/CD pipelines"],
    challenges: [
      { challenge: "Failures nobody owns", approach: "Create a tracked item automatically, in the system the owning team uses." },
      { challenge: "Different teams, different trackers", approach: "Support GitHub issues, Azure DevOps tickets and pull requests from the same automation." },
    ],
    impact: ["Pipeline failures and policy violations are turned into tracked work automatically."],
    skills: ["Workflow automation", "GitHub", "Azure DevOps", "Operational follow-through"],
    note: CONFIDENTIAL_NOTE,
  },
  {
    slug: "payment-application-infra-cicd",
    title: "UAE Payment Platform: Cloud Infrastructure and CI/CD",
    category: ["Jenkins", "CI/CD", "Terraform", "Observability"],
    tagline: "Led the team delivering cloud infrastructure, CI/CD and monitoring for a payment application serving the UAE market.",
    overview:
      "I designed and implemented cloud infrastructure and CI/CD automation for a payment application serving the UAE market, with a focus on deployment automation, infrastructure reliability and secure application delivery.",
    problem:
      "A payment application needs repeatable deployments, reliable infrastructure and a secure delivery path, because failures are quickly visible to customers and the business.",
    role: [
      "Led the team responsible for the platform's infrastructure, delivery pipelines and monitoring",
      "Designed and provisioned the cloud infrastructure that supported the application environments",
      "Implemented CI/CD pipelines to automate application build and deployment workflows",
      "Integrated deployment processes with source control and containerization tools",
      "Applied infrastructure-as-code practices to improve consistency and repeatability",
      "Set up deployment monitoring and supported it in operation, alongside environment configuration and deployment troubleshooting",
    ],
    diagram: {
      caption: "Conceptual and simplified. Not the production architecture.",
      lanes: [
        { label: "Infrastructure as code", nodes: [
          { id: "tf", label: "Terraform configuration", detail: "Version-controlled" },
          { id: "aws", label: "AWS environments", detail: "Provisioned consistently" },
        ]},
        { label: "Delivery workflow", nodes: [
          { id: "scm", label: "Source control" },
          { id: "jenkins", label: "Jenkins pipeline", detail: "Build and deployment automation" },
          { id: "image", label: "Container image", detail: "Docker" },
          { id: "deploy", label: "Deployment to environments", tone: "approved" },
        ]},
        { label: "Operations", nodes: [
          { id: "monitor", label: "Deployment monitoring", detail: "Built and supported by my team" },
          { id: "support", label: "Troubleshooting and reliability", detail: "Ongoing operational support" },
        ]},
      ],
    },
    stack: ["AWS", "Terraform", "Jenkins", "Docker", "Kubernetes", "Helm"],
    skills: ["Team leadership", "Cloud infrastructure design", "Infrastructure as Code", "CI/CD automation", "Deployment monitoring", "Operational reliability"],
    note: "The organization is intentionally not named, and this is a sanitized summary of my part in the work. I am happy to discuss details on a call.",
  },
  {
    slug: "greenhouse-iot-esp32-aws",
    title: "GreenSense: ESP32-to-AWS IoT Monitoring Pipeline",
    category: ["Embedded & IoT", "CI/CD", "Observability"],
    tagline: "A reference architecture for taking an embedded sensor board from firmware to a monitored, securely connected cloud pipeline.",
    overview:
      "GreenSense is a reference design for an environmental monitoring system: ESP32 sensor boards publish readings over MQTT with TLS to AWS IoT Core, where rules validate and store the data and alarms flag offline or out-of-range devices. Firmware is built and released through a CI pipeline, so device software gets the same discipline as cloud software.",
    problem:
      "Embedded projects often stop at a board on a desk. Production IoT needs secure device identity, observable data flow, alerting when devices go quiet, and a repeatable way to build and update firmware.",
    role: [
      "Designed the device-to-cloud architecture, from sensor and board to alerting",
      "Defined per-device certificate identity and least-privilege IoT policies",
      "Wrote the ESP32 firmware (PlatformIO, Arduino framework) with mutual-TLS MQTT and sensor-fault handling",
      "Wrote the Terraform for device identity, least-privilege policy, ingest rule, Lambda, storage and alarms",
      "Built the CI pipeline that runs tests, validates Terraform and compiles the firmware",
      "Designed device-health monitoring and alarms for offline devices and bad readings",
    ],
    diagram: {
      caption: "Personal reference implementation. Not a delivered client system.",
      lanes: [
        { label: "Device (embedded)", nodes: [
          { id: "sensor", label: "Sensors", detail: "Temperature, humidity, soil moisture" },
          { id: "board", label: "ESP32 board", detail: "Reads sensors, buffers data" },
          { id: "fw", label: "Firmware", detail: "C/C++ with PlatformIO" },
        ]},
        { label: "Secure connectivity", nodes: [
          { id: "cert", label: "Per-device certificate", detail: "Unique identity, revocable", tone: "security" },
          { id: "mqtt", label: "MQTT over TLS", detail: "Topic per device" },
          { id: "core", label: "AWS IoT Core", detail: "Least-privilege IoT policy", tone: "security" },
        ]},
        { label: "Cloud processing", nodes: [
          { id: "rule", label: "IoT rule", detail: "Route and filter messages" },
          { id: "fn", label: "Lambda", detail: "Validate and transform" },
          { id: "db", label: "Time-series storage", detail: "Readings and history" },
          { id: "dash", label: "Dashboard", detail: "Live and historical views" },
        ]},
        { label: "Operations", nodes: [
          { id: "alarm", label: "CloudWatch alarms", detail: "Device offline, out-of-range data", tone: "approved" },
          { id: "notify", label: "Notification", detail: "Alert to the on-call channel" },
        ]},
        { label: "Firmware delivery (CI/CD)", nodes: [
          { id: "repo", label: "Source control" },
          { id: "build", label: "CI build and tests", detail: "Compile, static checks" },
          { id: "artifact", label: "Signed firmware artifact", tone: "validated" },
          { id: "ota", label: "OTA update rollout", detail: "Staged, with rollback", tone: "proposed" },
        ]},
      ],
    },
    stack: ["ESP32", "PlatformIO", "MQTT", "AWS IoT Core", "AWS Lambda", "DynamoDB", "CloudWatch", "Terraform", "GitHub Actions", "Python"],
    impact: [
      "Ingest handler covered by 6 passing unit tests, plus a local simulator that runs readings with injected faults through the real handler",
      "ESP32 firmware compiles cleanly (about 70% of flash, 14% of RAM)",
      "Terraform passes format and validation checks",
    ],
    decisions: [
      { title: "One certificate per device", body: "Each board has its own identity and policy, so a single compromised device can be revoked without touching the fleet." },
      { title: "Alarm on silence, not only on bad data", body: "A dead sensor sends no bad readings. Offline detection catches failures that value thresholds would miss." },
      { title: "Treat firmware like any other release", body: "Building and releasing firmware through CI gives repeatable, auditable artifacts and a safe path to staged updates." },
    ],
    skills: ["Embedded systems", "ESP32 and Arduino", "Raspberry Pi", "IoT architecture", "MQTT", "AWS IoT Core", "Device security", "Firmware CI/CD", "Monitoring and alerting"],
    note: "A personal reference implementation, not a delivered client system. The code builds and its tests pass; deployment to AWS and flashing to hardware are the next step, and no field results are claimed.",
  },
  {
    slug: "stm32-rtos-sensor-node",
    title: "STM32 FreeRTOS Sensor Node",
    category: ["Embedded & IoT"],
    tagline: "A reference firmware design for a low-power STM32 node: FreeRTOS tasks, I2C and SPI sensors, a watchdog and a UART debug console.",
    image: "/images/stm32-rtos-sensor-node.webp",
    overview:
      "A reference design for a battery-friendly sensor node on an STM32 (Cortex-M4). Sensor reads, processing and radio transmit run as separate FreeRTOS tasks that exchange data through queues, with a hardware watchdog to recover from lockups.",
    problem:
      "Bare-metal super-loops get hard to reason about once a device reads several sensors, talks over a radio and has to survive faults. A task-based design with clear ownership of each bus makes timing and failure handling explicit.",
    role: [
      "Designed the task layout: sensor acquisition, filtering, transmit and a low-priority housekeeping task",
      "Specified bus ownership so each I2C and SPI peripheral is accessed from one task, with mutexes where sharing is unavoidable",
      "Defined watchdog policy: each task checks in, and the independent watchdog resets the board if any task stalls",
      "Designed a UART debug console and SWD workflow for logging and on-target debugging",
      "Planned unit-testable driver boundaries so sensor logic can run in host-side tests and CI",
    ],
    diagram: {
      caption: "Personal reference design. Not a delivered client system.",
      lanes: [
        { label: "Peripherals", nodes: [
          { id: "i2c", label: "I2C environmental sensor", detail: "Temperature, humidity, pressure" },
          { id: "spi", label: "SPI motion sensor", detail: "Interrupt-driven reads" },
          { id: "adc", label: "ADC input", detail: "Analog probe, averaged" },
        ]},
        { label: "FreeRTOS tasks", nodes: [
          { id: "acq", label: "Acquisition task", detail: "Owns the buses" },
          { id: "proc", label: "Processing task", detail: "Filter and validate", tone: "validated" },
          { id: "tx", label: "Transmit task", detail: "Radio, retry with backoff" },
        ]},
        { label: "Reliability", nodes: [
          { id: "wdg", label: "Independent watchdog", detail: "All tasks must check in", tone: "approved" },
          { id: "uart", label: "UART console", detail: "Logs and diagnostics" },
        ]},
      ],
    },
    stack: ["STM32 (Cortex-M4)", "FreeRTOS", "C", "I2C", "SPI", "UART", "ADC", "ST-Link / SWD", "CMake"],
    decisions: [
      { title: "One owner per bus", body: "Each peripheral bus is accessed from a single task. This removes a class of timing bugs that are hard to reproduce on hardware." },
      { title: "Watchdog with task check-ins", body: "A plain watchdog feed hides a stuck task. Requiring every task to check in means a stall resets the device instead of failing silently." },
      { title: "Hardware-independent drivers", body: "Driver logic is separated from register access so it can be tested on a host machine in CI before it ever touches a board." },
    ],
    skills: ["Embedded C", "FreeRTOS", "STM32", "I2C and SPI", "UART", "Watchdog design", "Low-power design", "Firmware testing"],
    note: "A personal reference design, not a delivered client system. No field or performance results are claimed.",
  },
  {
    slug: "raspberry-pi-edge-gateway",
    title: "Raspberry Pi Edge Gateway",
    category: ["Embedded & IoT", "Observability"],
    tagline: "A reference edge gateway that reads Modbus and BLE devices, buffers offline and forwards data over MQTT with TLS.",
    image: "/images/raspberry-pi-edge-gateway.webp",
    overview:
      "A reference design for a Raspberry Pi gateway that sits between field devices and the cloud. It reads Modbus RTU sensors and BLE beacons, buffers readings locally when the uplink drops, and forwards them over MQTT with TLS. Services run in containers under systemd.",
    problem:
      "Field devices speak serial and BLE, not cloud protocols, and connectivity is unreliable. A gateway has to translate, survive outages without losing data, and report on its own health so it can be run remotely.",
    role: [
      "Designed the gateway services: protocol readers, a normalizer, a store-and-forward buffer and an MQTT publisher",
      "Specified a SQLite-backed offline buffer with ordered replay and a bounded size",
      "Defined container and systemd setup so services restart on failure and start in the right order",
      "Planned device-health reporting: uptime, buffer depth, link state and CPU temperature",
      "Defined certificate-based MQTT identity and a read-only root filesystem profile for hardening",
    ],
    diagram: {
      caption: "Personal reference design. Not a delivered client system.",
      lanes: [
        { label: "Field side", nodes: [
          { id: "modbus", label: "Modbus RTU sensors", detail: "RS-485 serial" },
          { id: "ble", label: "BLE beacons", detail: "Passive scan" },
          { id: "gpio", label: "GPIO inputs", detail: "Digital state" },
        ]},
        { label: "Gateway (Raspberry Pi)", nodes: [
          { id: "read", label: "Protocol readers", detail: "One container each" },
          { id: "norm", label: "Normalizer", detail: "Common message schema", tone: "validated" },
          { id: "buf", label: "SQLite buffer", detail: "Store and forward", tone: "proposed" },
        ]},
        { label: "Uplink", nodes: [
          { id: "mqtt", label: "MQTT over TLS", detail: "Per-device certificate", tone: "security" },
          { id: "health", label: "Health metrics", detail: "Uptime, buffer depth, temperature", tone: "approved" },
        ]},
      ],
    },
    stack: ["Raspberry Pi", "Linux", "Docker", "systemd", "Python", "Modbus RTU", "BLE", "MQTT", "SQLite", "TLS"],
    decisions: [
      { title: "Store and forward", body: "Readings are written to a local buffer first and published from it, so a network outage delays data instead of losing it." },
      { title: "Bounded buffer", body: "The buffer has a size cap with a stated drop policy, so a long outage cannot fill the SD card and take the gateway down." },
      { title: "Hardened by default", body: "A read-only root filesystem and certificate identity reduce what a compromised or power-cycled device can do." },
    ],
    skills: ["Raspberry Pi", "Edge computing", "Modbus and BLE", "MQTT", "Linux services", "Docker", "Device monitoring", "Offline-first design"],
    note: "A personal reference design, not a delivered client system. No field or performance results are claimed.",
  },
  {
    slug: "esp32-ota-firmware-pipeline",
    title: "Signed OTA Firmware Pipeline for ESP32",
    category: ["Embedded & IoT", "CI/CD", "Security"],
    tagline: "A reference pipeline that builds, tests, signs and rolls out ESP32 firmware over the air, with staged rollout and automatic rollback.",
    image: "/images/esp32-ota-firmware-pipeline.webp",
    overview:
      "A reference design for shipping firmware to a fleet of ESP32 devices the way cloud software is shipped. CI builds and tests each commit, signs the release image, publishes it, and devices update from dual OTA slots, confirm they are healthy, and roll back on their own if they are not.",
    problem:
      "Devices in the field are hard to reach. A bad firmware release can brick a fleet, and unsigned updates are a security risk. Updates need integrity checks, a staged rollout and a safe way back.",
    role: [
      "Designed the CI pipeline: build with PlatformIO, run host-side tests, produce versioned artifacts",
      "Specified image signing and verification so devices only accept firmware from the release key",
      "Designed dual-partition OTA with a post-boot self-test before the new image is marked valid",
      "Planned a staged rollout: a canary group first, then the fleet, gated on device health",
      "Defined rollback behavior, both on-device automatic revert and a release-side halt",
    ],
    diagram: {
      caption: "Personal reference design. Not a delivered client system.",
      lanes: [
        { label: "CI and release", nodes: [
          { id: "build", label: "Build and test", detail: "PlatformIO, host-side tests" },
          { id: "sign", label: "Sign image", detail: "Release key kept out of CI logs", tone: "security" },
          { id: "pub", label: "Publish artifact", detail: "Versioned object storage" },
        ]},
        { label: "Rollout", nodes: [
          { id: "canary", label: "Canary group", detail: "Small share of devices first", tone: "proposed" },
          { id: "gate", label: "Health gate", detail: "Boot success, connectivity, error rate", tone: "validated" },
          { id: "fleet", label: "Fleet rollout", detail: "Paused automatically on failures", tone: "approved" },
        ]},
        { label: "Device", nodes: [
          { id: "slots", label: "Dual OTA slots", detail: "Running image stays intact" },
          { id: "self", label: "Post-boot self-test", detail: "Mark valid or revert" },
        ]},
      ],
    },
    stack: ["ESP32", "PlatformIO", "ESP-IDF OTA", "GitHub Actions", "Image signing", "Object storage", "MQTT", "Terraform"],
    decisions: [
      { title: "Verify before trust", body: "Devices check the image signature before switching partitions, so a tampered or corrupted download is rejected." },
      { title: "Self-test before commit", body: "The new image is only marked valid after it boots and reconnects. If it does not, the bootloader returns to the previous image." },
      { title: "Canary first", body: "A small group gets each release first, and the fleet rollout is gated on their health, which limits the blast radius of a bad build." },
    ],
    skills: ["Firmware CI/CD", "OTA updates", "ESP32", "Code signing", "Secure boot concepts", "Release engineering", "Rollback design"],
    note: "A personal reference design, not a delivered client system. Deployment to real devices is the next step, and no field results are claimed.",
  },
  {
    slug: "business-application-support",
    title: "Support for Business Applications",
    category: ["Observability"],
    tagline: "Keeping business applications running and helping the teams that depend on them.",
    overview:
      "Alongside infrastructure and delivery work, I provided support for business applications used across the organization.",
    problem:
      "Business applications need someone who can investigate problems and keep them working, so the people who rely on them can get on with their jobs.",
    role: ["Provided support for business applications"],
    skills: ["Application support", "Troubleshooting", "Operational ownership"],
    note: "The applications and the organization are intentionally not named. This summary is deliberately brief; I am happy to discuss the details on a call.",
  },
  /*
   * ADD YOUR OWN PROJECT: copy this block, remove the comment markers, fill it in with
   * TRUE details only, and save. It appears on the site automatically (projects page,
   * filters, sitemap). Every field except title, slug, category, tagline, overview,
   * problem, role and skills is optional; empty sections are simply not shown.
   *
   * {
   *   slug: "my-project-name",                    // lowercase-with-dashes, must be unique
   *   title: "Project title",
   *   category: ["CI/CD"],                        // Kubernetes | AI & Automation | Security | CI/CD | Jenkins | Terraform | Observability
   *   tagline: "One sentence on what it was.",
   *   overview: "What the project was, in two or three sentences.",
   *   problem: "What the team or business needed.",
   *   role: ["What you personally built or fixed", "Another real contribution"],
   *   stack: ["Jenkins", "Terraform"],            // optional: only tools you actually used
   *   challenges: [{ challenge: "A real problem", approach: "How you solved it" }], // optional
   *   impact: ["A result you can verify"],        // optional: leave out if you cannot back it up
   *   skills: ["Skill one", "Skill two"],
   *   note: CONFIDENTIAL_NOTE,                    // keep for employer or client work
   * },
   */
];

export const projects: Project[] = baseProjects.map((p) => ({
  ...p,
  status: projectStatus[p.slug] ?? "Production work",
  ...projectExtras[p.slug],
}));

export const projectCategories: ("All" | ProjectCategory)[] = ["All", "Jenkins", "CI/CD", "Kubernetes", "Terraform", "Security", "AI & Automation", "Observability", "Embedded & IoT"];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
