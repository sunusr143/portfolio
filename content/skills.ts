export type SkillGroup = { title: string; items: string[]; note?: string };

/** Only list skills backed by real experience. Add skills only if they are backed by experience. */
export const skillGroups: SkillGroup[] = [
  { title: "Cloud platforms", items: ["AWS", "Azure", "GCP"] , note: "AWS is the primary platform."},
  { title: "Kubernetes and containers", items: ["Amazon EKS", "Kubernetes", "Docker", "Helm", "Kustomize", "AKS", "GKE"] },
  { title: "Infrastructure as Code", items: ["Terraform"] },
  { title: "CI/CD and GitOps", items: ["Jenkins", "GitHub Actions", "Bitbucket Pipelines", "Maven"] },
  { title: "DevSecOps and governance", items: ["Cloud Custodian", "Wiz", "Snyk", "Nexus IQ", "SonarQube", "Policy-as-code"] },
  { title: "AI and automation", items: ["OpenAI GPT-5.1 workflows", "Human approval gates", "Automated ticketing"] },
  { title: "Monitoring and observability", items: ["Coralogix", "Prometheus", "Grafana"] },
  { title: "Embedded and IoT", items: ["ESP32", "Arduino", "Raspberry Pi", "MQTT", "AWS IoT Core"], note: "Hands-on with ESP32, Arduino and Raspberry Pi boards." },
  { title: "Scripting and programming", items: ["Bash", "PowerShell", "Python", "Git", "GitHub", "Bitbucket"] },
];

export const certifications = [
  { name: "HashiCorp Certified: Terraform Associate (003)", date: "April 2024" },
  { name: "AWS Certified Solutions Architect - Associate" },
];

export const experience = [
  { role: "Staff Engineer", company: "Altimetrik", period: "March 2025 - Present" },
  { role: "Senior DevOps Engineer", company: "Art Technology & Software Solutions", period: "May 2023 - March 2025" },
  { role: "Technical Lead", company: "Cognizant Technology Solutions", period: "December 2015 - April 2023" },
  { role: "Senior Associate", company: "IV Support Technologies", period: "April 2014 - November 2015" },
  { role: "Technical Support Engineer", company: "CSS Corp Private Ltd.", period: "December 2012 - March 2014" },
];

export const education = "B.Sc. Computer Science, SNR Sons College, Coimbatore (2012)";
