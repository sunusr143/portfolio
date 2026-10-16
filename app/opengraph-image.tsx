import { ImageResponse } from "next/og";

export const alt = "Sunu Mohan - Cloud platform and DevSecOps consultant";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "#070c18", color: "#eceef3" }}>
        <div style={{ fontSize: 28, color: "#8db8ff" }}>Sunu Mohan</div>
        <div style={{ fontSize: 68, fontWeight: 700, marginTop: 24, lineHeight: 1.1 }}>I Build Scalable, Automated & Secure Cloud Infrastructure</div>
        <div style={{ fontSize: 28, marginTop: 28, color: "#b6bbc8" }}>AWS, EKS, Terraform, CI/CD and DevSecOps consulting</div>
      </div>
    ),
    size
  );
}
