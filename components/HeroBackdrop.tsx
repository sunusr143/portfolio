/**
 * Decorative hero background: blueprint grid, glows, and a faint infrastructure
 * topology (nodes and links). Purely visual; hidden from assistive tech.
 */
export function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="bg-grid absolute inset-0" />
      <div className="absolute -right-24 -top-24 h-[28rem] w-[28rem] rounded-full bg-signal/25 blur-3xl" />
      <div className="absolute -left-24 top-1/3 h-[24rem] w-[24rem] rounded-full bg-violet/20 blur-3xl" />
    </div>
  );
}
