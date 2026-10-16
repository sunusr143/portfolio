/**
 * Edit this file to change availability, contact details and positioning.
 * No rebuild of UI code is needed - only a redeploy of the content.
 */
export const site = {
  name: "Sunu Mohan",
  title: "Staff DevOps & AI Engineer | Cloud Platform, DevSecOps & AI Automation",
  shortTitle: "Staff DevOps & AI Engineer",
  /** Compact one-line label for the header logo. */
  headerTitle: "Staff Engineer | DevOps / AI",
  yearsExperience: 13,
  /** Used for every mailto link and the structured data. Put your dedicated freelance address here. */
  email: "sunuremote@gmail.com",
  linkedin: "https://www.linkedin.com/in/sunu-mohan/",
  description:
    "Independent AWS DevOps consultant for EKS, Terraform, CI/CD and DevSecOps. 13 years building, securing and automating production cloud platforms.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  /** Availability is configurable. Set status to "unavailable" to change the banner. */
  availability: {
    status: "available" as "available" | "limited" | "unavailable",
    messages: {
      available: "Available for selected freelance and consulting engagements",
      limited: "Limited availability: booking projects for later in the year",
      unavailable: "Not taking new engagements right now. You can still get in touch.",
    },
    note: "Remote, working with teams across time zones.",
  },

  headline: "I Build Scalable, Automated & Secure Cloud Infrastructure",
  /** Hero headline lines; the second line is rendered with the gradient accent. */
  headlineLines: ["I Build Scalable,", "Automated & Secure", "Cloud Infrastructure"],
  heroEyebrow: "Staff DevOps & AI Engineer | Cloud Platform, DevSecOps & AI Automation",

  /** Optional. Put a photo in /public (e.g. "/sunu.jpg") to show it in the About strip. Initials show if unset. */
  photo: undefined as string | undefined,
  /** GitHub username (CONFIRM THIS). Set to "" to hide every GitHub link and the repositories section. */
  githubUser: "sunusr143",
  /** Repo names to hide from the "On GitHub" section (your profile repo is always hidden). */
  githubExclude: ["Detect-FakeProfile", "java_test_devops", "dha-mock-exam-platform", "Tree_view"],
  get github() { return this.githubUser ? `https://github.com/${this.githubUser}` : undefined; },

  /** Tools shown in the home page strip. Only tools you have actually used. */
  techStrip: [
    { label: "AWS", icon: "aws", mono: "aws", color: "#ff9900" },
    { label: "Kubernetes", icon: "kubernetes", mono: "K8s", color: "#326ce5" },
    { label: "Terraform", icon: "terraform", mono: "TF", color: "#7b42bc" },
    { label: "Docker", icon: "docker", mono: "Dk", color: "#2496ed" },
    { label: "Jenkins", icon: "jenkins", mono: "Jk", color: "#d33833" },
    { label: "GitHub Actions", icon: "githubactions", mono: "GA", color: "#8db8ff" },
    { label: "Helm", icon: "helm", mono: "He", color: "#6f7bff" },
    { label: "Python", icon: "python", mono: "Py", color: "#ffd43b" },
    { label: "Azure", icon: "azure", mono: "Az", color: "#0078d4" },
    { label: "GCP", icon: "gcp", mono: "GC", color: "#4285f4" },
    { label: "Prometheus", icon: "prometheus", mono: "Pm", color: "#e6522c" },
    { label: "Grafana", icon: "grafana", mono: "Gf", color: "#f46800" },
  ],
  subheadline:
    "Staff DevOps & AI Engineer with 13 years of experience building AWS infrastructure, Kubernetes platforms, automated delivery pipelines, cloud security solutions and AI-assisted automation.",

  expertiseStrip: ["AWS", "Amazon EKS", "Terraform", "CI/CD", "DevSecOps", "AI-driven cloud governance"],

  // Add pricing later by filling these in; the UI hides empty values.
  pricingNote: "Every engagement is scoped and quoted to your situation. Share your goals and I will propose a plan and price.",
};

export type Site = typeof site;
