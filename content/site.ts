/**
 * Edit this file to change availability, contact details and positioning.
 * No rebuild of UI code is needed - only a redeploy of the content.
 */
export const site = {
  name: "Sunu Mohan",
  title: "Staff DevOps & Cloud Engineer | AWS, Kubernetes, Terraform & Platform Automation",
  shortTitle: "Staff DevOps & Cloud Engineer",
  /** Compact one-line label for the header logo. */
  headerTitle: "Staff Engineer | DevOps / Cloud",
  yearsExperience: 13,
  /** Used for every mailto link and the structured data. Put your dedicated freelance address here. */
  email: "sunuremote@gmail.com",
  /**
   * Web3Forms access key. It is public by design (it only lets forms email YOU), so it is safe in browser code.
   * Free plans only accept submissions sent from the visitor's browser, which is how the inquiry form uses it.
   */
  web3formsKey: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ?? "9010580f-9b7c-444b-89af-6151aedad27c",
  linkedin: "https://www.linkedin.com/in/sunu-mohan/",
  /** SEO meta description and social preview text. */
  description:
    "Explore Sunu Mohan's DevOps and cloud engineering portfolio featuring AWS, Kubernetes, Terraform, CI/CD automation, cloud security, and platform engineering projects.",
  /** Browser tab / search result title for the home page. */
  seoTitle: "Sunu Mohan | DevOps, AWS, Kubernetes & Platform Engineering",
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
  headlineLines: ["Staff DevOps & Cloud Engineer", "AWS, Kubernetes, Terraform", "& Platform Automation"],
  heroEyebrow: "13 years in cloud and platform engineering",

  /** Optional. Put a photo in /public (e.g. "/sunu.jpg") to show it in the About strip. Initials show if unset. */
  photo: undefined as string | undefined,
  /** GitHub username (CONFIRM THIS). Set to "" to hide every GitHub link and the repositories section. */
  githubUser: "sunusr143",
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
    "I design, automate, and secure cloud infrastructure and delivery platforms, helping engineering teams ship reliable software through infrastructure as code, CI/CD, Kubernetes, and cloud-native security.",

  expertiseStrip: ["AWS", "Amazon EKS", "Terraform", "CI/CD", "DevSecOps", "AI-driven cloud governance"],

  // Add pricing later by filling these in; the UI hides empty values.
  pricingNote: "Every engagement is scoped and quoted to your situation. Share your goals and I will propose a plan and price.",
};

export type Site = typeof site;
