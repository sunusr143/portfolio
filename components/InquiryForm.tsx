"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { projectTypes, budgetRanges, type InquiryResponse } from "@/lib/inquiry";
import { site } from "@/content/site";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: { sitekey: string; callback: (t: string) => void; "expired-callback": () => void; "error-callback": () => void }) => string;
      reset: (id?: string) => void;
    };
  }
}

type Status = "idle" | "submitting" | "success" | "error";
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const topicToType: Record<string, (typeof projectTypes)[number]> = {
  "aws-infrastructure": "Cloud Infrastructure Assessment",
  "kubernetes-eks": "EKS Troubleshooting and Architecture Review",
  "terraform-iac": "Terraform and Infrastructure Automation",
  "cicd-gitops": "CI/CD Pipeline Audit and Improvement",
  "devsecops-governance": "DevSecOps and Cloud Governance Implementation",
  "ai-cloud-automation": "AI-Assisted Cloud Automation Consulting",
};

function Field({ id, label, error, hint, optional, children }: { id: string; label: string; error?: string; hint?: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label} {optional && <span className="font-normal text-mist-500">(optional)</span>}
      </label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className="mt-1 text-xs text-mist-500">{hint}</p>}
      {error && <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-risk">{error}</p>}
    </div>
  );
}

function mailtoHref(p: Record<string, string>) {
  const body = ["name", "email", "company", "projectType", "challenge", "deliverables", "budget", "startDate", "details"]
    .filter((k) => p[k])
    .map((k) => `${k}: ${p[k]}`)
    .join("\n\n");
  return `mailto:${site.email}?subject=${encodeURIComponent("Project inquiry from website")}&body=${encodeURIComponent(body)}`;
}

export function InquiryForm() {
  const params = useSearchParams();
  const topic = params.get("topic") ?? "";
  const initialType = topicToType[topic] ?? "";

  const [kind, setKind] = useState<"project" | "discovery">("project");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [token, setToken] = useState("");
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string>();
  const statusRef = useRef<HTMLDivElement>(null);
  const lastPayload = useRef<Record<string, string>>({});

  useEffect(() => {
    if (!SITE_KEY || !widgetRef.current) return;
    const mount = () => {
      if (!window.turnstile || !widgetRef.current || widgetId.current) return;
      widgetId.current = window.turnstile.render(widgetRef.current, {
        sitekey: SITE_KEY,
        callback: setToken,
        "expired-callback": () => setToken(""),
        "error-callback": () => setToken(""),
      });
    };
    if (window.turnstile) return mount();
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    s.async = true;
    s.onload = mount;
    document.head.appendChild(s);
  }, []);

  useEffect(() => {
    if (status === "success" || status === "error") statusRef.current?.focus();
  }, [status]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = Object.fromEntries(fd.entries()) as Record<string, string>;
    lastPayload.current = payload;
    payload.kind = kind;
    payload.turnstileToken = token;

    if (SITE_KEY && !token) {
      setStatus("error");
      setMessage("Please complete the spam check before sending.");
      return;
    }

    setStatus("submitting");
    setErrors({});
    setMessage("");
    try {
      const res = await fetch("/api/inquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = (await res.json()) as InquiryResponse;
      if (data.ok) {
        setStatus("success");
        form.reset();
        return;
      }
      setErrors(data.fieldErrors ?? {});
      setMessage(data.message);
      setStatus("error");
    } catch {
      setMessage("Network error. Check your connection and try again, or email me directly.");
      setStatus("error");
    } finally {
      if (SITE_KEY) { window.turnstile?.reset(widgetId.current); setToken(""); }
    }
  }

  if (status === "success") {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="panel border-ok/40 p-8">
        <h3 className="text-xl font-semibold">Message delivered</h3>
        <p className="mt-2 text-mist-300">Thanks. Your inquiry reached me and I will reply to the email you provided.</p>
        <button className="btn-ghost mt-6" onClick={() => setStatus("idle")}>Send another</button>
      </div>
    );
  }

  const busy = status === "submitting";
  const inv = (k: string) => (errors[k] ? { "aria-invalid": true, "aria-describedby": `${k}-error` } : {});

  return (
    <form onSubmit={onSubmit} noValidate className="panel space-y-5 p-6 sm:p-8" aria-busy={busy}>
      <fieldset>
        <legend className="mb-2 text-sm font-medium">What do you need?</legend>
        <div className="flex flex-wrap gap-2">
          {(["project", "discovery"] as const).map((k) => (
            <label key={k} className={`cursor-pointer rounded-lg border px-4 py-2 text-sm has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-signal-strong ${kind === k ? "border-signal bg-signal/15" : "border-signal/30"}`}>
              <input type="radio" name="kindChoice" className="sr-only" checked={kind === k} onChange={() => setKind(k)} />
              {k === "project" ? "Project inquiry" : "Discovery call request"}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Name" error={errors.name}>
          <input id="name" name="name" autoComplete="name" required className="field" {...inv("name")} />
        </Field>
        <Field id="email" label="Email" error={errors.email}>
          <input id="email" name="email" type="email" autoComplete="email" required className="field" {...inv("email")} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="company" label="Company or organization" optional error={errors.company}>
          <input id="company" name="company" autoComplete="organization" className="field" {...inv("company")} />
        </Field>
        <Field id="projectType" label="Project type" optional error={errors.projectType}>
          <select id="projectType" name="projectType" defaultValue={initialType} className="field" {...inv("projectType")}>
            <option value="">Not sure yet</option>
            {projectTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
      </div>

      <Field id="challenge" label="How can I help?" error={errors.challenge} hint="A sentence or two is plenty. No credentials or secrets, please.">
        <textarea id="challenge" name="challenge" rows={4} required className="field" {...inv("challenge")} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="budget" label="Estimated budget" optional error={errors.budget}>
          <select id="budget" name="budget" defaultValue="" className="field">
            <option value="">Prefer not to say</option>
            {budgetRanges.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </Field>
        <Field id="startDate" label="Expected start date" optional error={errors.startDate}>
          <input id="startDate" name="startDate" placeholder="e.g. next month" className="field" />
        </Field>
      </div>

      <Field id="details" label="Additional details" optional error={errors.details}>
        <textarea id="details" name="details" rows={3} className="field" />
      </Field>

      {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      {SITE_KEY && <div ref={widgetRef} />}

      <p className="text-xs text-mist-500">
        I use these details only to reply to you. See the <Link className="underline" href="/privacy">privacy notice</Link>.
      </p>

      <div ref={statusRef} tabIndex={-1} aria-live="polite">
        {status === "error" && message && (
          <p role="alert" className="rounded-lg border border-risk/40 bg-risk/10 p-3 text-sm">
            {message}{" "}
            <a className="underline" href={mailtoHref(lastPayload.current)}>Send this by email instead</a>
          </p>
        )}
      </div>

      <button type="submit" className="btn-primary w-full sm:w-auto" disabled={busy}>
        {busy ? "Sending..." : kind === "discovery" ? "Request a discovery call" : "Send project inquiry"}
      </button>
    </form>
  );
}
