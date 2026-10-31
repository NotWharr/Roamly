"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowDown } from "lucide-react";

import AnimatedText from "@/components/ui/AnimatedText";
import BookingModal from "@/components/ui/booking/BookingModal";
import JigglyButton from "@/components/ui/JigglyButton";
import WaterSurface from "@/components/ui/WaterSurface";

/*
  Photos, both from Unsplash (free licence), stored locally for the WebGL texture:
  - hero-water.webp           Hugh Whyte   https://unsplash.com/photos/VhwZx7YtFjQ
  - hero-water-portrait.webp  Romello Williams  https://unsplash.com/photos/VyXhQpX9VG8
  Neither is confirmed to be Grenada, so the alt text does not name a place.
*/
const WIDE = { src: "/hero-water.webp", width: 2400, height: 1347 };
const TALL = { src: "/hero-water-portrait.webp", width: 1400, height: 1867 };

const posterAlt = "Looking straight down on a small boat crossing clear turquoise water";

/**
 * The hero is the water.
 *
 * An overhead photo fills the viewport, so the ripple simulation reads as the
 * actual surface rather than an effect laid over a picture. The headline sits
 * in the deep water at the top, the booking action in the lower corner, and
 * the boat is left clear between them. The poster image is the complete hero
 * without JavaScript, WebGL or motion; the canvas only fades in over it.
 */
export default function Hero() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const actionsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tween = gsap.fromTo(
      actionsRef.current,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        delay: 0.45,
        ease: "power3.out",
        clearProps: "transform,opacity",
      },
    );
    return () => {
      tween.revert();
    };
  }, []);

  return (
    <section
      id="home"
      aria-label="Roamly guided tours of Grenada"
      data-water
      className="rl-on-water relative isolate flex min-h-[100svh] flex-col justify-between overflow-hidden bg-[var(--rl-sea)] text-white"
    >
      <WaterSurface wide={WIDE} tall={TALL} alt={posterAlt} priority />

      {/* Depth, not decoration: darkens the water behind the nav, headline and actions. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(6_38_44/0.62)_0%,rgb(6_38_44/0.28)_34%,transparent_56%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(90%_55%_at_100%_100%,rgb(6_38_44/0.72)_0%,transparent_100%)] max-[900px]:bg-[linear-gradient(0deg,rgb(6_38_44/0.82)_0%,rgb(6_38_44/0.5)_28%,transparent_52%)]"
      />

      <div className="mx-auto w-full max-w-[1400px] px-[var(--rl-gutter)] pt-[calc(72px+env(safe-area-inset-top,0px)+clamp(20px,4vh,48px))]">
        <AnimatedText
          as="h1"
          mode="words"
          trigger="load"
          delay={0.1}
          stagger={0.07}
          className="rl-display rl-hero-title"
        >
          Grenada,
          <br />
          before the coaches.
        </AnimatedText>
      </div>

      <div className="mx-auto mt-16 flex w-full max-w-[1400px] justify-end px-[var(--rl-gutter)] pb-[calc(clamp(28px,5vh,56px)+env(safe-area-inset-bottom,0px))]">
        <div ref={actionsRef} className="w-full sm:max-w-[27rem]">
          <p className="text-[1.0625rem] leading-relaxed sm:text-lg">
            Small-group days out of St George&apos;s into Grand Etang, Annandale
            Falls and the west sand flats, with guides who live here.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3">
            <JigglyButton
              size="hero"
              withArrow
              className="max-sm:w-full"
              onClick={() => setBookingOpen(true)}
            >
              Book a tour
            </JigglyButton>

            <Link
              href="#days"
              className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline decoration-white/50 underline-offset-[6px] hover:decoration-white"
            >
              See the days
              <ArrowDown size={16} strokeWidth={2} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        preSelectedOptionId={null}
      />
    </section>
  );
}
