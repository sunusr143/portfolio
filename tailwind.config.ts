import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./content/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { 950: "#070c18", 900: "#0e172b", 800: "#14203a", 700: "#1d2c4d", 600: "#2a3d66" },
        mist: { 100: "#f4f7ff", 300: "#c3cde6", 500: "#8f9cbd" },
        signal: { DEFAULT: "#2f78ff", strong: "#8db8ff", deep: "#1a62f0" },
        brand: { DEFAULT: "#1a62f0", hover: "#2f78ff" },
        violet: { DEFAULT: "#7b5cff", soft: "#b2a3ff" },
        ok: "#4fd1a1",
        warn: "#f0b45a",
        risk: "#ff7a8a",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      maxWidth: { prose: "68ch" },
      boxShadow: { card: "0 1px 0 rgba(255,255,255,0.05) inset, 0 12px 32px -12px rgba(2,6,23,0.7)", glow: "0 0 0 1px rgba(107,140,255,0.35), 0 16px 40px -12px rgba(107,140,255,0.35)" },
    },
  },
  plugins: [],
};

export default config;
