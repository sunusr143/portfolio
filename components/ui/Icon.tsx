/** Small stroke icon set (24x24). Decorative; pair with visible text. */
const paths: Record<string, string> = {
  briefcase: "M3 8h18v11H3zM8 8V6a2 2 0 012-2h4a2 2 0 012 2v2M3 13h18",
  cloud: "M7 18a4 4 0 010-8 5 5 0 019.6-1.2A4.5 4.5 0 0117 18z",
  layers: "M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 17.5l9 5 9-5",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3zM8.5 12l2.5 2.5L15.5 10",
  mail: "M3 6h18v12H3zM3 7l9 7 9-7",
  linkedin: "M5 9v10M5 5v.5M10 19v-6a3 3 0 016 0v6M10 9v10",
  github: "M9 19c-4 1-4-2-6-2m12 4v-3.5a3 3 0 00-.8-2.3c2.700-.3 5.500-1.300 5.500-6a4.700 4.700 0 00-1.300-3.300 4.400 4.400 0 00-.1-3.300s-1-.3-3.400 1.300a11.600 11.600 0 00-6 0C6.500 2.500 5.500 2.800 5.500 2.800a4.400 4.400 0 00-.1 3.300A4.700 4.700 0 004 9.500c0 4.700 2.800 5.700 5.500 6A3 3 0 008.700 18V21",
  download: "M12 4v11m0 0l-4-4m4 4l4-4M5 20h14",
  send: "M21 3L10 14M21 3l-7 18-4-7-7-4 18-7z",
  home: "M4 11l8-7 8 7v9H4zM10 20v-6h4v6",
  user: "M12 12a4 4 0 100-8 4 4 0 000 8zM4 21c0-4 3.500-6 8-6s8 2 8 6",
  folder: "M3 6h6l2 2h10v11H3z",
  gear: "M12 15a3 3 0 100-6 3 3 0 000 6zM19 12l2-1-1-3-2.200.4-1.600-1.600L16.600 4l-3-1-1 2h-1.200l-1-2-3 1 .4 2.200-1.600 1.600L4 8l-1 3 2 1v1.200l-2 1 1 3 2.200-.4 1.600 1.600L7.400 20l3 1 1-2h1.200l1 2 3-1-.4-2.200 1.600-1.600L20 16l1-3-2-1z",
  brain: "M9 4a3 3 0 00-3 3 3 3 0 00-2 3 3 3 0 001.500 2.600A3 3 0 007 17a3 3 0 005 1V5a3 3 0 00-3-1zM15 4a3 3 0 013 3 3 3 0 012 3 3 3 0 01-1.500 2.600A3 3 0 0117 17a3 3 0 01-5 1",
  search: "M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.300-4.300",
  box: "M3 7l9-4 9 4-9 4-9-4zM3 7v10l9 4 9-4V7M12 11v10",
};

export function Icon({ name, className = "h-5 w-5" }: { name: keyof typeof paths | string; className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d={paths[name] ?? paths.box} />
    </svg>
  );
}
