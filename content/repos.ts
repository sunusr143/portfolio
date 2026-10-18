/**
 * Curated public repositories shown in the "On GitHub" section.
 * Summaries are written from each repository's own README and file tree. Language, stars and
 * last-updated date are read live from GitHub when the API is reachable; if it is not, this
 * list still renders. A repository GitHub no longer returns (renamed, deleted, made private)
 * is dropped automatically rather than linked.
 *
 * To add one: append an entry with the exact repository name and a summary you can stand behind.
 */
export type RepoStatus = "In progress" | "Prototype";

export type FeaturedRepo = {
  name: string;
  summary: string;
  tech: string[];
  /** Fallback shown only when the GitHub API is unavailable. */
  language?: string;
  status?: RepoStatus;
};

export const featuredRepos: FeaturedRepo[] = [
  {
    name: "tweet-trend-service",
    summary:
      "Containerized Java (Maven) microservice delivered through a Jenkins pipeline: build and unit tests, SonarQube analysis, Docker image build and Kubernetes deployment manifests.",
    tech: ["Java", "Maven", "Jenkins", "SonarQube", "Docker", "Kubernetes"],
    language: "Java",
  },
  {
    name: "enterprise-ci-cd-aws",
    summary: "A production-style Jenkins CI pipeline on AWS. Only the README is published so far; the implementation is in progress.",
    tech: ["Jenkins", "AWS"],
    status: "In progress",
  },
  {
    name: "portfolio",
    summary: "Source code for this website: Next.js 14 (App Router), TypeScript and Tailwind CSS, deployed on Vercel.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
    language: "TypeScript",
  },
  {
    name: "hospitality-saas-core",
    summary: "NestJS and TypeORM backend in TypeScript for a hospitality SaaS project.",
    tech: ["NestJS", "TypeORM", "TypeScript"],
    language: "TypeScript",
    status: "Prototype",
  },
];
