/**
 * Hero illustration: a three-monitor DevOps workstation drawn in SVG
 * (code editor, cloud topology, deployment checklist). Decorative.
 */
const codeColors = ["#2f78ff", "#7b5cff", "#4fd1a1", "#8db8ff", "#f0b45a"];
const checklist = ["AWS", "Kubernetes (EKS)", "Terraform", "CI/CD pipelines", "Monitoring & logging", "Security & compliance"];

export function HeroIllustration() {
  return (
    <svg viewBox="0 0 640 400" role="img" aria-label="Illustration of a workstation showing code, a cloud architecture diagram and a deployment checklist" className="h-auto w-full">
      <defs>
        <linearGradient id="scr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#0f1d3d" /><stop offset="1" stopColor="#0a1226" /></linearGradient>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#2f78ff" stopOpacity=".45" /><stop offset="1" stopColor="#2f78ff" stopOpacity="0" /></radialGradient>
        <linearGradient id="desk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1a2a52" /><stop offset="1" stopColor="#0a1226" /></linearGradient>
      </defs>
      <ellipse cx="320" cy="250" rx="300" ry="150" fill="url(#glow)" className="svg-glow" />

      {/* Left monitor: code */}
      <g>
        <rect x="14" y="70" width="190" height="210" rx="8" fill="#0b1224" stroke="#2a3d66" />
        <rect x="22" y="78" width="174" height="194" rx="4" fill="url(#scr)" />
        {Array.from({ length: 17 }).map((_, i) => (
          <rect key={i} className="svg-code" style={{ "--i": i } as React.CSSProperties} x={30 + (i % 3) * 10} y={90 + i * 10.5} width={30 + ((i * 37) % 90)} height="3.5" rx="1.7" fill={codeColors[i % codeColors.length]} />
        ))}
      </g>

      {/* Center monitor: cloud topology */}
      <g>
        <rect x="214" y="40" width="250" height="240" rx="8" fill="#0b1224" stroke="#2a3d66" />
        <rect x="222" y="48" width="234" height="224" rx="4" fill="url(#scr)" />
        {Array.from({ length: 9 }).map((_, r) => Array.from({ length: 11 }).map((_, c) => (
          (r * 11 + c) % 3 === 0 ? <circle key={`${r}-${c}`} cx={236 + c * 9} cy={150 + r * 9} r="1.6" fill="#2f78ff" opacity=".45" /> : null
        )))}
        <path className="svg-float" d="M382 100a14 14 0 010-28 18 18 0 0135 3 13 13 0 013 25z" transform="translate(-6 8)" fill="none" stroke="#8db8ff" strokeWidth="2" />
        <g stroke="#2f78ff" strokeWidth="1.5" fill="none"><path className="svg-flow" d="M376 128v18M376 146h-34M376 146h34M342 146v14M410 146v14M376 146v14" /></g>
        {[342, 376, 410].map((x) => <rect key={x} x={x - 14} y="160" width="28" height="20" rx="3" fill="#0f1d3d" stroke="#2f78ff" strokeWidth="1.5" />)}
        <g stroke="#2f78ff" strokeWidth="1.5" fill="none"><path className="svg-flow" d="M342 180v18M376 180v18M410 180v18" /></g>
        {[342, 376, 410].map((x) => <rect key={`b${x}`} x={x - 14} y="198" width="28" height="20" rx="3" fill="#0f1d3d" stroke="#7b5cff" strokeWidth="1.5" />)}
      </g>

      {/* Right monitor: deployment checklist */}
      <g>
        <rect x="474" y="82" width="154" height="190" rx="8" fill="#0b1224" stroke="#2a3d66" />
        <rect x="482" y="90" width="138" height="174" rx="4" fill="url(#scr)" />
        <text x="492" y="112" fill="#f4f7ff" fontSize="10.5" fontWeight="600">Infrastructure Deployed</text>
        {checklist.map((t, i) => (
          <g key={t} transform={`translate(492 ${128 + i * 22})`}>
            <circle className="svg-pop" style={{ "--i": i } as React.CSSProperties} cx="5" cy="0" r="5.5" fill="#4fd1a1" /><path d="M2.500 0l2 2 3.500-4" stroke="#07131f" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <text x="18" y="3.500" fill="#c3cde6" fontSize="9">{t}</text>
          </g>
        ))}
      </g>

      {/* Desk + keyboard */}
      <path d="M40 300h560l30 50H10z" fill="url(#desk)" opacity=".9" />
      <g fill="#14203a" stroke="#2f78ff" strokeOpacity=".6">
        <rect x="190" y="312" width="260" height="30" rx="4" />
      </g>
      {Array.from({ length: 3 }).map((_, r) => Array.from({ length: 20 }).map((_, c) => (
        <rect key={`${r}-${c}`} x={198 + c * 12.4} y={316 + r * 9} width="9" height="6" rx="1.5" fill="#2f78ff" opacity=".7" />
      )))}
    </svg>
  );
}
