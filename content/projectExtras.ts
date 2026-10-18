import type { Project, ProjectStatus } from "./projects";

/**
 * Extra case-study sections and project status labels, kept apart from the main project text.
 * Everything here restates what the project entries already say, in the structure recruiters look for.
 * Add only what you can verify; empty sections are not shown.
 */

/** Projects that are not production work. Everything else defaults to "Production work". */
export const projectStatus: Record<string, ProjectStatus> = {
  "java-service-jenkins-kubernetes": "Open-source reference",
  "greenhouse-iot-esp32-aws": "Prototype",
  "stm32-rtos-sensor-node": "Concept",
  "raspberry-pi-edge-gateway": "Concept",
  "esp32-ota-firmware-pipeline": "Concept",
};

type Extras = Pick<Project, "workflow" | "security" | "validation">;

export const projectExtras: Record<string, Extras> = {
  "artifactory-eks-migration": {
    workflow: [
      "Design the target EKS architecture with private networking as a hard requirement",
      "Build the cluster, node groups, IAM/OIDC, storage, RDS and load balancing in Terraform",
      "Deploy Artifactory as a Helm release configured through Helm values",
      "Work through node onboarding, CNI, IAM and volume issues",
      "Clear the readiness checks, then move the platform over",
    ],
    security: [
      "Cluster endpoint and supporting AWS service traffic stay on private networking with VPC endpoints",
      "Workloads get scoped access through IAM and OIDC",
      "TLS is terminated at an internal load balancer",
      "Infrastructure and application are code (Terraform and Helm), so a rebuild is a reviewable change",
    ],
    validation: [
      "SSL, load balancer behaviour, Docker registry access, database connectivity and private cluster access were each verified before the platform moved over",
    ],
  },
  "cicd-devsecops": {
    workflow: [
      "Standardize pipeline stages so builds and deployments behave consistently",
      "Build and test with Maven and automated tests",
      "Run quality analysis with SonarQube",
      "Scan with Snyk and Nexus IQ in pipelines, Jenkins jobs and developer IDEs",
      "Deploy containerized services to Kubernetes, using Kustomize overlays per environment",
    ],
    security: [
      "Security scanning runs during development and in CI, so issues surface while they are cheap to fix",
      "Snyk and Nexus IQ are integrated into Bitbucket Pipelines, Jenkins jobs and IDEs",
    ],
    validation: ["Release support included post go-live verification in non-prod and prod"],
  },
  "kubernetes-observability": {
    workflow: [
      "Centralize metrics and logs in Coralogix so investigation starts from one place",
      "Wire alerts into monitoring systems",
      "Lead root cause analysis for production incidents",
      "Capture each response in a runbook",
    ],
    security: [
      "Alerts connect to a documented response rather than a bare notification",
      "Underlying causes are fixed instead of applying temporary workarounds",
    ],
  },
  "terraform-reusable-aws-modules": {
    workflow: [
      "Define EC2, VPC, IAM and S3 as reusable Terraform modules",
      "Build each environment from the same modules with different inputs",
      "Keep infrastructure in version control so every change goes through review",
      "Automate environment setup through CI/CD pipelines",
    ],
    security: [
      "Environments built from shared modules do not drift apart",
      "Changes to IAM and networking are reviewable in version control",
    ],
  },
  "cloud-security-governance": {
    workflow: [
      "Write Cloud Custodian policies as version-controlled guardrails",
      "Deploy them through dedicated pipelines across multi-account AWS and multi-cloud environments",
      "Detect or clean up public S3 buckets, unencrypted EBS volumes, idle EC2 instances and untagged RDS snapshots",
      "Open a GitHub issue, Azure DevOps ticket or pull request for violations and pipeline failures",
    ],
    security: [
      "Public S3 exposure is detected, the owner notified, and remediation applied where it is safe",
      "Unencrypted volumes are flagged for follow-up, because encrypting an attached volume is not a casual change",
      "Untagged snapshots are routed to owners so ownership is clear before cleanup",
    ],
  },
  "greenhouse-iot-esp32-aws": {
    workflow: [
      "Firmware reads sensors and publishes over mutual-TLS MQTT",
      "An AWS IoT Core rule validates messages and routes them to a Lambda ingest handler",
      "Readings are stored in DynamoDB, and CloudWatch alarms flag offline or out-of-range devices",
      "CI runs the tests, validates Terraform and compiles the firmware",
    ],
    security: [
      "One certificate and one least-privilege policy per device, so a single device can be revoked without touching the fleet",
      "Mutual TLS between device and broker",
    ],
    validation: [
      "Ingest handler covered by 6 passing unit tests, plus a local simulator that runs readings with injected faults through the real handler",
      "ESP32 firmware compiles cleanly; Terraform passes format and validation checks",
      "Not yet deployed to AWS or flashed to hardware",
    ],
  },
};
