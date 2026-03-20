import React from "react";
import CardSlider from "./CardSlider";
import { FiActivity, FiLock, FiZap } from "react-icons/fi";

const kpis = [
  { value: "99.9%", label: "Uptime" },
  { value: "2x", label: "Faster Retrieval" },
  { value: "10k+", label: "Trusted Users" },
  { value: "24/7", label: "Secure Access" },
];

const pillars = [
  {
    icon: FiLock,
    title: "Private by design",
    text: "Notes stay scoped to your account with strong access control.",
  },
  {
    icon: FiZap,
    title: "Fast daily flow",
    text: "Capture and retrieve notes quickly without noisy UI distractions.",
  },
  {
    icon: FiActivity,
    title: "Reliable platform",
    text: "Stable performance for personal and team note workflows.",
  },
];

const State = () => {
  return (
    <div className="space-y-6 py-4 sm:py-6">
      <div className="space-y-2 text-center">
        <p className="inline-flex rounded-full border border-border-subtle bg-bg-subtle px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
          Product Metrics
        </p>
        <h3 className="text-h2 font-semibold text-text-main">Clear Performance. Real Confidence.</h3>
        <p className="mx-auto max-w-xl text-body text-text-muted">
          A cleaner snapshot of what makes Incrypt dependable every day.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-border-subtle bg-bg-subtle/70 px-4 py-4 text-center transition-colors duration-200 hover:border-primary/30 hover:bg-bg-surface"
          >
            <p className="text-2xl font-semibold text-text-main sm:text-3xl">{item.value}</p>
            <p className="mt-1 text-sm text-text-muted">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="grid items-stretch gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="rounded-xl border border-border-subtle bg-bg-subtle/60 p-4 transition-colors duration-200 hover:border-primary/30 hover:bg-bg-surface"
              >
                <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="text-lg" />
                </div>
                <h4 className="text-body font-semibold text-text-main">{pillar.title}</h4>
                <p className="mt-1 text-sm text-text-muted">{pillar.text}</p>
              </div>
            );
          })}
        </div>

        <div className="flex h-full flex-col rounded-xl border border-border-subtle bg-bg-subtle/60 p-4 shadow-card-md">
          <h4 className="mb-3 text-body font-semibold text-text-main">Incrypt At A Glance</h4>
          <div className="flex flex-1 items-center justify-center">
            <CardSlider />
          </div>
        </div>
      </div>
    </div>
  );
};

export default State;
