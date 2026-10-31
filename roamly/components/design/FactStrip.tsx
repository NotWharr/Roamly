"use client";

import Reveal from "@/components/ui/Reveal";

const FACTS = [
  { title: "Local guides", detail: "One guide who lives here" },
  { title: "Six guests", detail: "Never a coach group" },
  { title: "Hotel pickup", detail: "Across St George's" },
  { title: "Free cancellation", detail: "Up to 24 hours before" },
];

/** The practical facts that belong under the hero, not inside it. */
export default function FactStrip() {
  return (
    <section
      data-water
      aria-label="What every Roamly tour includes"
      className="rl-deep"
    >
      <ul className="mx-auto grid w-full max-w-[1400px] grid-cols-2 gap-x-6 gap-y-9 px-[var(--rl-gutter)] py-12 lg:grid-cols-4 lg:py-16">
        {FACTS.map((fact, index) => (
          <li key={fact.title} className="border-t border-[var(--rl-line)] pt-4">
            <Reveal delay={index * 0.07} y={18}>
              <p className="rl-display text-[clamp(1.35rem,2.4vw,2.1rem)]">{fact.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--rl-mute)]">
                {fact.detail}
              </p>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
