"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import AnimatedText from "@/components/ui/AnimatedText";
import Reveal from "@/components/ui/Reveal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type ProcessStep = {
  step: string;
  title: string;
  description: string;
};

const TIDE_LINE = `M0 20 Q50 -8 100 20 ${Array.from(
  { length: 11 },
  (_, index) => `T${(index + 2) * 100} 20`,
).join(" ")}`;

/**
 * The five beats of a day with a Roamly guide.
 *
 * Five short things, read in order. On wide screens one tide line runs over
 * them and is drawn by scrolling, so the line is the day passing. Without
 * motion it is simply already drawn, and phones get a plain ruled list.
 */
const STEPS: ProcessStep[] = [
  {
    step: "01",
    title: "We pick you up",
    description:
      "Your guide texts you the morning of, then collects you from your hotel or a point in St George's.",
  },
  {
    step: "02",
    title: "We walk you in",
    description:
      "Trails are walked before you arrive. Gradients and turn-around points are agreed up front.",
  },
  {
    step: "03",
    title: "You eat something local",
    description:
      "Lunch is cooked that morning, with vegetarian and vegan plates on every tour.",
  },
  {
    step: "04",
    title: "You get the small stuff",
    description:
      "Nutmeg, cocoa, a reef briefing from someone who knows the water, and photos the same evening.",
  },
  {
    step: "05",
    title: "We drop you back",
    description:
      "Back at your hotel with the evening free. Same-day changes are agreed in the morning.",
  },
];

export default function WorkProcess({ steps = STEPS }: { steps?: ProcessStep[] }) {
  const tideRef = useRef<SVGPathElement | null>(null);

  useEffect(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference) and (min-width: 1024px)", () => {
      gsap.fromTo(
        tideRef.current,
        { strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: tideRef.current,
            start: "top 85%",
            end: "top 35%",
            scrub: true,
          },
        },
      );
    });
    return () => media.revert();
  }, []);

  return (
    <section
      data-water
      aria-labelledby="process-title"
      className="rl-deep py-[var(--rl-section-y)]"
    >
      <div className="mx-auto w-full max-w-[1400px] px-[var(--rl-gutter)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <AnimatedText
            as="h2"
            id="process-title"
            mode="lines"
            className="rl-display max-w-[15ch] text-[clamp(2.75rem,7vw,6.5rem)] tracking-[-0.05em] leading-[0.98]"
          >
            A day with a guide, start to finish.
          </AnimatedText>

          <AnimatedText
            as="p"
            mode="lines"
            delay={0.1}
            className="max-w-[36ch] text-base leading-relaxed text-[var(--rl-mute)] sm:text-lg lg:pb-3"
          >
            A small group, one guide who lives here, and a route that bends
            around the weather rather than against it.
          </AnimatedText>
        </div>

        <svg
          aria-hidden="true"
          viewBox="0 0 1200 40"
          fill="none"
          className="mt-20 hidden w-full lg:block"
        >
          <path
            ref={tideRef}
            d={TIDE_LINE}
            pathLength={1}
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeDasharray={1}
          />
        </svg>

        <ol className="mt-12 grid grid-cols-1 lg:mt-8 lg:grid-cols-5 lg:gap-8">
          {steps.map((step, index) => (
            <li
              key={step.step}
              className="border-t border-[var(--rl-line)] py-6 lg:border-t-0 lg:py-0"
            >
              <Reveal delay={index * 0.07} y={24}>
                <span className="text-sm font-semibold tabular-nums text-[var(--rl-accent-text)]">
                  {step.step}
                </span>
                <h3 className="rl-display mt-2 text-[1.6rem] leading-[1.08]">{step.title}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-[var(--rl-mute)]">
                  {step.description}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
