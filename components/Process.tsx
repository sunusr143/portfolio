import { Reveal } from "@/components/Reveal";

const steps = [
  { title: "Discover", body: "A short call or written brief to understand the problem, the environment and what success means for you." },
  { title: "Plan", body: "A scoped proposal: what I will do, what I need from you, how long it should take and the quote." },
  { title: "Build", body: "Infrastructure and pipelines delivered as reviewable code, in small steps your team can follow." },
  { title: "Hand over", body: "Documentation and runbooks so your team can run and change it without me." },
];

export function Process() {
  return (
    <section aria-labelledby="process-heading" className="section-y section-alt">
      <div className="container-page">
        <h2 id="process-heading" className="text-3xl font-semibold tracking-tight">How an engagement works</h2>
        <Reveal><ol className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title} className="panel p-6">
              <span aria-hidden className="grid h-9 w-9 place-items-center rounded-lg bg-signal/15 text-sm font-semibold text-signal-strong">{i + 1}</span>
              <h3 className="mt-4 font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mist-300">{s.body}</p>
            </li>
          ))}
        </ol></Reveal>
      </div>
    </section>
  );
}
