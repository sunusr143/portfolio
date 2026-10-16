import { site } from "@/content/site";

const faqs = [
  { q: "How do we get started?", a: "Send a project inquiry or request a discovery call. I will reply with questions or a proposed next step, then a scoped plan and quote if we are a fit." },
  { q: "How is pricing handled?", a: site.pricingNote },
  { q: "Do you guarantee specific results?", a: "No. I commit to the scope, quality and communication we agree on. Outcomes such as cost or speed depend on your environment, so I will not promise numbers I cannot control." },
  { q: "What access do you need?", a: "Only what the work requires, ideally read-only first and scoped roles after that. Please never send credentials through the contact form." },
  { q: "Do you work remotely?", a: `Yes. ${site.availability.note}` },
  { q: "Can you show work like mine?", a: "Yes. The case studies are sanitized descriptions of real work. I can talk through details of an approach on a call without sharing anything confidential." },
];

export function Faq() {
  return (
    <section aria-labelledby="faq-heading" className="section-y border-t border-signal/20">
      <div className="container-page max-w-4xl">
        <h2 id="faq-heading" className="text-3xl font-semibold tracking-tight">Questions clients ask</h2>
        <div className="mt-8 space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="panel group p-5">
              <summary className="cursor-pointer list-none font-medium marker:hidden">
                <span className="flex items-center justify-between gap-4">{f.q}<span aria-hidden className="text-signal-strong transition-transform group-open:rotate-45">+</span></span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-mist-300">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
