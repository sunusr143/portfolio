import Link from "next/link";
import { FlowDiagram } from "@/components/diagrams/FlowDiagram";
import type { Diagram } from "@/content/projects";

const diagram: Diagram = {
  caption: "Personal reference implementation. Not a delivered client system.",
  lanes: [
    { label: "Device (embedded)", nodes: [
      { id: "sensor", label: "Sensors", detail: "Temperature, humidity, motion" },
      { id: "board", label: "Microcontroller board", detail: "ESP32, STM32 or Raspberry Pi" },
      { id: "fw", label: "Firmware", detail: "C/C++ or MicroPython" },
    ]},
    { label: "Connectivity", nodes: [
      { id: "mqtt", label: "MQTT over TLS", detail: "Per-device certificates", tone: "security" },
      { id: "broker", label: "Broker / AWS IoT Core" },
    ]},
    { label: "Cloud and operations", nodes: [
      { id: "rule", label: "Rules and Lambda", detail: "Validate, transform" },
      { id: "store", label: "Storage and dashboard", detail: "Time-series data" },
      { id: "mon", label: "Monitoring and alarms", detail: "Device offline, bad readings", tone: "approved" },
      { id: "ota", label: "Firmware update pipeline", detail: "Built and released by CI", tone: "proposed" },
    ]},
  ],
};

export function IotReference() {
  return (
    <div>
      <h2 className="text-xl font-semibold">Embedded and IoT: device to cloud</h2>
      <p className="mt-2 max-w-prose text-sm text-mist-300">
        How a hardware board connects to the cloud, and where DevOps fits: secure device identity, observable data flow, and a CI pipeline that builds and ships firmware.
        This is a <strong className="text-mist-100">personal reference build</strong> (firmware, Terraform and CI written and tested), not client work.
      </p>
      <div className="mt-5"><FlowDiagram diagram={diagram} /></div>
      <p className="mt-5 text-sm">
        <Link href="/projects/greenhouse-iot-esp32-aws" className="text-signal-strong underline">Read the full GreenSense case study &rarr;</Link>
      </p>
      <ul className="mt-5 grid gap-3 text-sm text-mist-300 sm:grid-cols-3">
        <li className="rounded-lg border border-signal/20 p-3"><strong className="block text-mist-100">Boards</strong>ESP32, STM32, Arduino, Raspberry Pi</li>
        <li className="rounded-lg border border-signal/20 p-3"><strong className="block text-mist-100">Protocols</strong>MQTT, HTTP, BLE, I2C, SPI, UART</li>
        <li className="rounded-lg border border-signal/20 p-3"><strong className="block text-mist-100">DevOps angle</strong>Firmware CI, OTA updates, device monitoring</li>
      </ul>
    </div>
  );
}
