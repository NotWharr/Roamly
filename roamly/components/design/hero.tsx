"use client";

import { useEffect, useRef, type RefObject } from "react";
import WaterRipple from "@/components/providers/WaterRipple";
import JigglyButton from "@/components/ui/JigglyButton";
import TextReveal from "@/components/ui/text-reveal";
interface HeroProps {
  heroRef?: RefObject<HTMLElement | null>;
}

export default function Hero({ heroRef }: HeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const ctaContainerRef = useRef<HTMLDivElement | null>(null);

  // Use the parent's ref when supplied.
  // Keep the local ref as a fallback.
  const resolvedHeroRef = heroRef ?? sectionRef;

  // CTA fade-up, timed to land just after the text reveals
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      if (ctaContainerRef.current) {
        ctaContainerRef.current.style.opacity = "1";
      }

      return;
    }

    if (ctaContainerRef.current) {
      ctaContainerRef.current.animate(
        [
          {
            opacity: 0,
            transform: "translate3d(0, 24px, 0)",
          },
          {
            opacity: 1,
            transform: "translate3d(0, 0, 0)",
          },
        ],
        {
          duration: 1200,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          delay: 2000,
          fill: "forwards",
        }
      );
    }
  }, []);

  return (
    <section
      id="home"
      ref={resolvedHeroRef}
      className="rl-darklock relative flex h-[100svh] min-h-[100dvh] w-full items-center justify-center overflow-hidden text-[var(--rl-text)] select-none"
      style={{ background: "var(--rl-ink)" }}
      aria-label="Hero Section"
    >
      {/* WEBGL WATER RIPPLE FLUID SIMULATION BACKGROUND */}
      <div className="absolute inset-0 z-0 h-full w-full overflow-hidden">
        <WaterRipple imageSrc="/hero-bg.webp" />

        <div className="absolute inset-0 z-10 bg-gradient-to-b from-[var(--rl-ink)]/60 via-[var(--rl-ink)]/20 to-[var(--rl-ink)]/70 pointer-events-none" />

        <div className="absolute inset-0 z-10 bg-radial-vignette opacity-60 pointer-events-none" />
      </div>

      {/* FOREGROUND CONTENT */}
      <div className="relative z-25 flex h-full w-full max-w-6xl flex-col justify-between px-6 py-8 sm:px-10 md:px-12 lg:px-16 pt-20 pb-10 sm:pt-24 sm:pb-12 pointer-events-none">
        <div className="my-auto flex flex-col items-center text-center">
          <TextReveal
            as="h1"
            type="words"
            unstyled
            duration={1.8}
            stagger={0.18}
            className="max-w-4xl font-sans text-[clamp(2.5rem,7.5vw,5.75rem)] font-black tracking-tight leading-[1.02] text-white [text-shadow:0_4px_32px_rgba(0,0,0,0.5)] pointer-events-auto [&_.split-line]:-my-[0.08em] [&_.split-line]:py-[0.08em]"
          >
            Grenada, on foot and underwater.
          </TextReveal>

          <TextReveal
            as="p"
            type="lines"
            unstyled
            delay={0.6}
            duration={1.6}
            stagger={0.22}
            className="mt-6 max-w-lg text-base md:text-lg font-semibold leading-relaxed text-white font-sans [text-shadow:0_2px_16px_rgba(0,0,0,0.5)] pointer-events-auto"
          >
            Guided days into Grand Etang and the west sand flats, in groups of
            six. No coach queues.
          </TextReveal>
        </div>

        <div
          ref={ctaContainerRef}
          className="will-change-transform flex flex-col items-center justify-center gap-4 pt-2 pointer-events-auto opacity-0"
        >
          <JigglyButton
            href="/booking"
            tone="glass"
            size="hero"
            withArrow
          >
            Book a tour
          </JigglyButton>
        </div>
      </div>

      <style jsx global>{`
        .bg-radial-vignette {
          background: radial-gradient(
            circle at center,
            transparent 30%,
            var(--rl-ink) 100%
          );
        }
      `}</style>
    </section>
  );
}