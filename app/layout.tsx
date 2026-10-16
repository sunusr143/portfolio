import type { Metadata, Viewport } from "next";
import { Schibsted_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AboutStrip } from "@/components/AboutStrip";
import { CardSpotlight } from "@/components/CardSpotlight";
import { CommandPalette } from "@/components/CommandPalette";

const sans = Schibsted_Grotesk({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} | AWS DevOps, Platform & AI Automation Consultant`, template: `%s | ${site.name}` },
  description: site.description,
  keywords: ["AWS DevOps Consultant", "EKS Consultant", "Terraform Engineer", "CI/CD Consultant", "Cloud Security Automation", "DevSecOps Consultant", "AI DevOps Engineer", "AI-assisted cloud automation"],
  authors: [{ name: site.name, url: site.linkedin }],
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} | AWS DevOps, Platform & AI Automation Consultant`,
    description: site.description,
    url: site.url,
  },
  twitter: { card: "summary_large_image", title: `${site.name} | Cloud Platform Consultant`, description: site.description },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#070c18", width: "device-width", initialScale: 1 };

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.shortTitle,
  email: site.email,
  url: site.url,
  sameAs: [site.linkedin, ...(site.github ? [site.github] : [])],
  knowsAbout: ["AWS", "Kubernetes", "Terraform", "CI/CD", "DevSecOps", "Cloud governance"],
};

const businessJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: `${site.name} | AWS DevOps & Platform Engineering Consulting`,
  description: site.description,
  url: site.url,
  email: site.email,
  areaServed: "Worldwide",
  serviceType: ["AWS DevOps consulting", "Amazon EKS", "Terraform infrastructure as code", "CI/CD pipelines", "DevSecOps", "AI-assisted cloud automation"],
  founder: { "@type": "Person", name: site.name },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-signal focus:px-4 focus:py-2 focus:text-ink-950">
          Skip to content
        </a>
        <CardSpotlight />
        <CommandPalette />
        <Header />
        <main id="main">{children}</main>
        <AboutStrip />
        <Footer />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }} />
      </body>
    </html>
  );
}
