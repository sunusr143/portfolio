import type { Metadata } from "next";
import { site } from "@/content/site";

export const metadata: Metadata = { title: "Privacy notice", alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return (
    <section className="section-y">
      <div className="container-page prose-body max-w-3xl space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight text-mist-100">Privacy notice</h1>
        <p>When you submit the inquiry form, I receive the details you enter: name, email, organization (if given), and project information. I use them only to reply to your inquiry and discuss a possible engagement.</p>
        <p>Submissions are delivered by email through a transactional email provider. They are not sold or shared for marketing. Spam protection (Cloudflare Turnstile) may process technical signals from your browser to tell humans from bots.</p>
        <p>This site does not use advertising trackers. Please do not include credentials, secrets or confidential infrastructure details in the form.</p>
        <p>To ask for a copy or deletion of your information, email <a className="text-signal-strong underline" href={`mailto:${site.email}`}>{site.email}</a>.</p>
      </div>
    </section>
  );
}
