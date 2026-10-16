"use client";

import Image from "next/image";
import { useState } from "react";

const buses = [
  { id: "uart", name: "UART", wires: "2 (TX, RX)", clock: "Asynchronous, agreed baud rate", topology: "Point to point", speed: "Typically up to ~1 Mbit/s", use: "Debug console, GPS and modem modules", gotcha: "Both sides must agree on baud rate, parity and stop bits. Mismatches show up as garbage characters." },
  { id: "i2c", name: "I2C", wires: "2 (SDA, SCL) + pull-ups", clock: "Synchronous, controller drives SCL", topology: "Multi-device, 7-bit addresses", speed: "100 kHz to 400 kHz common", use: "Environmental sensors, EEPROMs, small displays", gotcha: "Needs pull-up resistors, and two devices with the same address will collide. A stuck bus needs a recovery routine." },
  { id: "spi", name: "SPI", wires: "4+ (CLK, MOSI, MISO, one CS per device)", clock: "Synchronous, controller drives CLK", topology: "Multi-device via chip-select lines", speed: "Often several MHz or more", use: "Flash memory, IMUs, displays, ADCs", gotcha: "Clock polarity and phase (mode 0 to 3) must match the device datasheet, and each device costs a chip-select pin." },
] as const;

export function BusCompare() {
  const [id, setId] = useState<(typeof buses)[number]["id"]>("i2c");
  const b = buses.find((x) => x.id === id)!;
  return (
    <div>
      <h2 className="text-xl font-semibold">Serial buses: UART, I2C and SPI</h2>
      <p className="mt-2 max-w-prose text-sm text-mist-300">
        The three buses I reach for most on microcontroller boards. Pick one to see how it is wired and what usually goes wrong. The waveforms are an illustration, not captured data.
      </p>
      <Image src="/images/lab-uart-i2c-spi.webp" alt="Illustrative waveforms for UART, I2C and SPI signals" width={1200} height={630} className="mt-5 h-auto w-full max-w-3xl rounded-xl border border-signal/25" />
      <div role="group" aria-label="Choose a bus" className="mt-5 flex gap-2">
        {buses.map((x) => (
          <button key={x.id} type="button" aria-pressed={id === x.id} onClick={() => setId(x.id)}
            className={`rounded-lg border px-4 py-2 text-sm transition-colors ${id === x.id ? "border-signal bg-signal/15" : "border-signal/30 text-mist-300 hover:border-signal/70"}`}>
            {x.name}
          </button>
        ))}
      </div>
      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2" aria-live="polite">
        <div className="rounded-lg border border-signal/20 p-3"><dt className="font-medium">Wires</dt><dd className="mt-1 text-mist-300">{b.wires}</dd></div>
        <div className="rounded-lg border border-signal/20 p-3"><dt className="font-medium">Clocking</dt><dd className="mt-1 text-mist-300">{b.clock}</dd></div>
        <div className="rounded-lg border border-signal/20 p-3"><dt className="font-medium">Topology</dt><dd className="mt-1 text-mist-300">{b.topology}</dd></div>
        <div className="rounded-lg border border-signal/20 p-3"><dt className="font-medium">Typical speed</dt><dd className="mt-1 text-mist-300">{b.speed}</dd></div>
        <div className="rounded-lg border border-signal/20 p-3"><dt className="font-medium">Common uses</dt><dd className="mt-1 text-mist-300">{b.use}</dd></div>
        <div className="rounded-lg border border-warn/40 p-3"><dt className="font-medium">Common gotcha</dt><dd className="mt-1 text-mist-300">{b.gotcha}</dd></div>
      </dl>
    </div>
  );
}
