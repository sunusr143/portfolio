import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section-y">
      <div className="container-page">
        <h1 className="text-4xl font-semibold tracking-tight">Page not found</h1>
        <p className="mt-4 text-mist-300">That page does not exist or has moved. Try the projects or services pages.</p>
        <div className="mt-6 flex gap-3"><Link href="/" className="btn-primary">Home</Link><Link href="/projects" className="btn-ghost">Projects</Link></div>
      </div>
    </section>
  );
}
