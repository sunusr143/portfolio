export function SectionHeading({ title, intro, as: Tag = "h2" }: { title: string; intro?: string; as?: "h1" | "h2" }) {
  return (
    <div className="max-w-2xl">
      <Tag className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</Tag>
      {intro && <p className="mt-4 text-lg leading-relaxed text-mist-300">{intro}</p>}
    </div>
  );
}
