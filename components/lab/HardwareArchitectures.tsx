"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Item = {
  id: string; label: string; src: string; alt: string; summary: string; points: string[];
  video?: string;
};

const items: Item[] = [
  { id: "aws", label: "Device to cloud", src: "/images/arch-iot-aws.webp", alt: "Architecture: sensors and ESP32 to AWS IoT Core, rules, Lambda, storage and alarms",
    summary: "Telemetry from a microcontroller to cloud storage, with device-health alarms alongside.",
    points: ["Per-device certificates and least-privilege IoT policy", "Rules validate and route messages before storage", "Alarms cover offline devices and out-of-range readings"] },
  { id: "aws-anim", label: "Telemetry (animated)", src: "/images/anim-telemetry-poster.webp", video: "/images/anim-telemetry.webm", alt: "Animated telemetry flow from sensors through AWS IoT Core to storage and alarms",
    summary: "The same pipeline with data moving through it. Sample flow, not live traffic.",
    points: ["Each dot is one message moving between stages", "The alarm branch runs in parallel with storage"] },
  { id: "power", label: "Power tree", src: "/images/arch-power-tree.webp", alt: "Power architecture for a battery node: protection, buck converter and switched rails",
    summary: "How a battery node is regulated and which rails are switched off to save power.",
    points: ["Protection first: reverse polarity and fuse", "Sensor and radio rails are switched, so idle current stays low", "A supervisor resets the MCU on brown-out"] },
  { id: "boot", label: "Secure boot", src: "/images/arch-secure-boot.webp", alt: "Secure boot chain from ROM bootloader to signed application and secure element",
    summary: "A chain of trust: each stage verifies the next before it runs.",
    points: ["Root of trust is immutable ROM plus a write-once key hash", "Flash encryption protects data at rest", "A secure element can hold the TLS identity"] },
  { id: "lora", label: "LoRaWAN", src: "/images/arch-lorawan.webp", alt: "LoRaWAN topology from sensor nodes through a gateway and network server to applications",
    summary: "Long-range, low-power uplinks from many nodes through a gateway to the application.",
    points: ["Nodes talk to any gateway in range", "The network server deduplicates and validates frames", "Application payloads stay encrypted until the application server"] },
  { id: "lora-anim", label: "LoRaWAN (animated)", src: "/images/anim-lorawan-poster.webp", video: "/images/anim-lorawan.webm", alt: "Animated LoRaWAN uplink from three sensor nodes to dashboard",
    summary: "An uplink from nodes to the dashboard. Sample flow, not live traffic.",
    points: ["Several nodes can reach the same gateway", "The network server fans out to the application and alerts"] },
];

function Clip({ item }: { item: Item }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const v = ref.current;
    if (v && !reduce) v.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, [item.id]);

  function toggle() {
    const v = ref.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); } else { v.pause(); setPlaying(false); }
  }

  return (
    <div className="max-w-3xl">
      <video ref={ref} key={item.id} muted loop playsInline preload="metadata" poster={item.src} aria-label={item.alt} className="h-auto w-full rounded-xl border border-signal/25">
        <source src={item.video} type="video/webm" />
      </video>
      <button type="button" onClick={toggle} className="btn-ghost mt-3 !py-2" aria-pressed={playing}>{playing ? "Pause animation" : "Play animation"}</button>
    </div>
  );
}

export function HardwareArchitectures() {
  const [id, setId] = useState(items[0].id);
  const it = items.find((x) => x.id === id)!;
  return (
    <div>
      <h2 className="text-xl font-semibold">Hardware architectures</h2>
      <p className="mt-2 max-w-prose text-sm text-mist-300">
        Reference diagrams for embedded products: connectivity, power, boot security and low-power networks. Illustrative designs, not client systems.
      </p>
      <div role="group" aria-label="Choose an architecture" className="mt-5 flex flex-wrap gap-2">
        {items.map((x) => (
          <button key={x.id} type="button" aria-pressed={id === x.id} onClick={() => setId(x.id)}
            className={`rounded-lg border px-4 py-2 text-sm transition-colors ${id === x.id ? "border-signal bg-signal/15" : "border-signal/30 text-mist-300 hover:border-signal/70"}`}>
            {x.label}
          </button>
        ))}
      </div>
      <div className="mt-5">
        {it.video ? <Clip item={it} /> : <Image src={it.src} alt={it.alt} width={1200} height={630} className="h-auto w-full max-w-3xl rounded-xl border border-signal/25" />}
      </div>
      <p className="mt-4 max-w-prose text-sm text-mist-300" aria-live="polite">{it.summary}</p>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-mist-300">{it.points.map((p) => <li key={p}>{p}</li>)}</ul>
    </div>
  );
}
