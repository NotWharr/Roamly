"use client";

import Link from "next/link";

import AnimatedText from "@/components/ui/AnimatedText";
import JigglyButton from "@/components/ui/JigglyButton";
import WaterSurface from "@/components/ui/WaterSurface";

const EMAIL = "hello@roamlytours.com";

// Unsplash, Romello Williams: https://unsplash.com/photos/k-rigx00brA
const REEF = { src: "/hero-reef.webp", width: 2400, height: 1600 };

/**
 * The closing call to action.
 *
 * The page ends back in the water it opened on, with the same surface to touch.
 * One heading, one contact route, and the practical details that stop someone
 * having to open a second page just to find an email address.
 */
export default function ContactSection() {
  return (
    <section
      id="contact"
      data-water
      aria-labelledby="contact-cta-title"
      className="rl-on-water relative isolate flex min-h-[100svh] flex-col justify-between gap-16 overflow-hidden bg-[var(--rl-sea)] text-white"
    >
      <WaterSurface wide={REEF} alt="" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(6_38_44/0.6)_0%,rgb(6_38_44/0.22)_50%,rgb(6_38_44/0.86)_100%)]"
      />

      <div className="mx-auto w-full max-w-[1400px] px-[var(--rl-gutter)] pt-[calc(72px+var(--rl-section-y)*0.6)]">
        <AnimatedText
          as="h2"
          id="contact-cta-title"
          mode="lines"
          className="rl-display rl-hero-title max-w-[14ch]"
        >
          Tell us the day you have in mind.
        </AnimatedText>

        <AnimatedText
          as="p"
          mode="lines"
          delay={0.1}
          className="mt-7 max-w-[44ch] text-[1.0625rem] leading-relaxed sm:text-lg"
        >
          A private boat, a group of nine, or a week that has to work around the
          children&apos;s swimming lesson. Send the shape of it and we will say
          what is actually possible.
        </AnimatedText>

        <JigglyButton href="/contact" size="hero" withArrow className="mt-9 max-sm:w-full">
          Contact us
        </JigglyButton>
      </div>

      <div className="mx-auto w-full max-w-[1400px] px-[var(--rl-gutter)] pb-[calc(clamp(28px,5vh,56px)+env(safe-area-inset-bottom,0px))]">
        <dl className="grid gap-x-8 gap-y-5 border-t border-white/30 pt-6 sm:grid-cols-3">
          <div>
            <dt className="text-sm text-white/75">Email</dt>
            <dd className="mt-1">
              <a
                href={`mailto:${EMAIL}`}
                className="inline-flex min-h-11 items-center break-all text-base font-semibold underline decoration-white/50 underline-offset-[6px] hover:decoration-white"
              >
                {EMAIL}
              </a>
            </dd>
          </div>

          <div>
            <dt className="text-sm text-white/75">Where</dt>
            <dd className="mt-1 flex min-h-11 items-center text-base font-semibold">
              St George&apos;s, Grenada
            </dd>
          </div>

          <div>
            <dt className="text-sm text-white/75">Tours</dt>
            <dd className="mt-1">
              <Link
                href="#days"
                className="inline-flex min-h-11 items-center text-base font-semibold underline decoration-white/50 underline-offset-[6px] hover:decoration-white"
              >
                See the three days
              </Link>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
