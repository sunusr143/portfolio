import Link from "next/link";

export function CtaBand({ title = "Have a platform problem to solve?", body = "Tell me what is slowing your team down. I will reply with an honest view on whether and how I can help.", href = "/work-with-me#inquiry", label = "Discuss your project" }: { title?: string; body?: string; href?: string; label?: string }) {
  return (
    <section className="section-y">
      <div className="container-page">
        <div className="panel flex flex-col items-start gap-6 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <div className="max-w-xl">
            <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
            <p className="mt-2 text-mist-300">{body}</p>
          </div>
          <Link href={href} className="btn-primary shrink-0">{label}</Link>
        </div>
      </div>
    </section>
  );
}
