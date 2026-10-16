"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="section-y">
      <div className="container-page">
        <h1 className="text-3xl font-semibold">Something went wrong</h1>
        <p className="mt-3 text-mist-300">The page failed to load. Try again, and if it keeps happening, email me directly.</p>
        <button className="btn-primary mt-6" onClick={reset}>Try again</button>
      </div>
    </section>
  );
}
