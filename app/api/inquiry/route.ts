import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { inquirySchema, type InquiryResponse } from "@/lib/inquiry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Best-effort in-memory rate limit. On serverless this is per instance;
// for strict limits use a shared store (e.g. Upstash Redis) or your host's WAF.
const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_HITS;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").slice(0, 120);

const json = (body: InquiryResponse, status = 200) => NextResponse.json(body, { status });

async function verifyTurnstile(token: string | undefined, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // not configured: honeypot + rate limit still apply
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (limited(ip)) {
    return json({ ok: false, code: "rate_limited", message: "Too many submissions. Please wait a few minutes or email me directly." }, 429);
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return json({ ok: false, code: "bad_request", message: "The request could not be read." }, 400);
  }

  const parsed = inquirySchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    // A filled honeypot fails validation: treat as spam without hints.
    if (fieldErrors.website) return json({ ok: false, code: "spam", message: "Submission rejected." }, 400);
    return json({ ok: false, code: "validation", message: "Please fix the highlighted fields.", fieldErrors }, 400);
  }
  const d = parsed.data;

  if (!(await verifyTurnstile(d.turnstileToken, ip))) {
    return json({ ok: false, code: "spam", message: "Spam check failed. Reload the page and try again." }, 400);
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.INQUIRY_FROM_EMAIL;
  const to = process.env.INQUIRY_TO_EMAIL;
  const webhook = process.env.INQUIRY_WEBHOOK_URL;
  const emailConfigured = Boolean(apiKey && from && to);

  const rows: [string, string][] = [
    ["Type", d.kind === "discovery" ? "Discovery call request" : "Project inquiry"],
    ["Name", d.name],
    ["Email", d.email],
    ["Company", d.company],
    ["Project type", d.projectType],
    ["Current challenge", d.challenge],
    ["Expected deliverables", d.deliverables],
    ["Budget", d.budget || "Not provided"],
    ["Start date", d.startDate || "Not provided"],
    ["Details", d.details || "None"],
  ];
  const html = `<table cellpadding="6" style="font-family:sans-serif;font-size:14px">${rows
    .map(([k, v]) => `<tr><td valign="top"><b>${esc(k)}</b></td><td style="white-space:pre-wrap">${esc(v)}</td></tr>`)
    .join("")}</table>`;
  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n\n");

  // Delivery chain: email (Resend), then webhook (Slack/Discord/Zapier), then a local file.
  // The visitor is told "sent" only if at least one channel actually stored the inquiry.
  let delivered = false;

  if (emailConfigured) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from,
          to: [to],
          reply_to: d.email,
          subject: `[Portfolio] ${d.kind === "discovery" ? "Discovery call" : "Inquiry"}: ${oneLine(d.projectType)} from ${oneLine(d.name)}`,
          html,
          text,
        }),
      });
      if (res.ok) delivered = true;
      else console.error("Resend delivery failed", res.status);
    } catch (err) {
      console.error("Resend request error", err);
    }
  }

  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // "text" and "content" cover Slack-style and Discord-style webhooks.
        body: JSON.stringify({ text: `New portfolio inquiry\n\n${text}`.slice(0, 1900), content: `New portfolio inquiry\n\n${text}`.slice(0, 1900) }),
      });
      if (res.ok) delivered = true;
      else console.error("Webhook delivery failed", res.status);
    } catch (err) {
      console.error("Webhook request error", err);
    }
  }

  if (!delivered) {
    try {
      const dir = path.join(process.cwd(), "data");
      await fs.mkdir(dir, { recursive: true });
      await fs.appendFile(path.join(dir, "inquiries.jsonl"), JSON.stringify({ receivedAt: new Date().toISOString(), ...d, turnstileToken: undefined }) + "\n", "utf8");
      delivered = true;
      console.warn("Inquiry saved to data/inquiries.jsonl (no email or webhook delivered it).");
    } catch (err) {
      console.error("Could not store inquiry", err);
    }
  }

  if (!delivered) {
    return json({ ok: false, code: "delivery_failed", message: "Your message could not be delivered. Please email me directly." }, 502);
  }
  return json({ ok: true });
}
