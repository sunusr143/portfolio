import { HeroBackdrop } from "@/components/HeroBackdrop";

/** Shared banner for inner pages: same navy grid + glow as the home hero. */
export function PageHero({ title, intro, eyebrow, children }: { title: string; intro?: string; eyebrow?: string; children?: React.ReactNode }) {
  return (
    <section className="relative isolate border-b border-signal/15 py-12 sm:py-16">
      <HeroBackdrop />
      <div className="container-page">
        {eyebrow && <p className="text-sm font-medium tracking-wide text-signal-strong">{eyebrow}</p>}
        <h1 className="mt-2 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">{title}</h1>
        {intro && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-mist-300">{intro}</p>}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}
