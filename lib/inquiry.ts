import { z } from "zod";

export const projectTypes = [
  "Cloud Infrastructure Assessment",
  "Terraform and Infrastructure Automation",
  "CI/CD Pipeline Audit and Improvement",
  "EKS Troubleshooting and Architecture Review",
  "DevSecOps and Cloud Governance Implementation",
  "AI-Assisted Cloud Automation Consulting",
  "Something else",
] as const;

export const budgetRanges = ["Not sure yet", "Under 5k", "5k to 15k", "15k to 40k", "40k+"] as const;

const clean = (max: number) => z.string().trim().max(max);

export const inquirySchema = z.object({
  kind: z.enum(["project", "discovery"]),
  name: clean(120).min(2, "Enter your name."),
  email: clean(200).email("Enter a valid email address."),
  company: clean(160).optional(),
  projectType: z.enum(projectTypes).optional().or(z.literal("")),
  challenge: clean(3000).min(10, "Tell me a little about what you need (a sentence or two)."),
  deliverables: clean(2000).optional(),
  budget: z.enum(budgetRanges).optional().or(z.literal("")),
  startDate: clean(60).optional(),
  details: clean(3000).optional(),
  // Spam protection
  website: z.string().max(0).optional(), // honeypot: must stay empty
  turnstileToken: z.string().max(4096).optional(),
});

export type InquiryInput = z.infer<typeof inquirySchema>;

export type InquiryResponse =
  | { ok: true }
  | { ok: false; code: "validation" | "spam" | "rate_limited" | "not_configured" | "delivery_failed" | "bad_request"; message: string; fieldErrors?: Record<string, string> };
