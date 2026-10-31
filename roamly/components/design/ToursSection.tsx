"use client";

import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ArrowUpRight } from "lucide-react";

import AnimatedText from "@/components/ui/AnimatedText";
import Reveal from "@/components/ui/Reveal";
import { TOUR_IMAGES } from "@/components/ui/booking/TourCard";
import { TOURS } from "@/lib/tours";

const zoomPhoto = (link: HTMLElement, scale: number) => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  gsap.to(link.querySelector("img"), { scale, duration: 0.9, ease: "power3.out" });
};

/**
 * The three excursions, on the home page.
 *
 * The booking page is still the place where one is chosen. This section exists
 * so a visitor can see what a day costs before they commit to opening a
 * calendar. Three edge-to-edge panels, each one whole link; there is no second
 * call to action with a different label for the same booking intent.
 */
export default function ToursSection() {
  return (
    <section
      id="days"
      aria-labelledby="days-title"
      className="relative bg-[var(--rl-ink)] pt-[var(--rl-section-y)]"
    >
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 px-[var(--rl-gutter)] lg:flex-row lg:items-end lg:justify-between">
        <AnimatedText
          as="h2"
          id="days-title"
          mode="lines"
          className="rl-display max-w-[16ch] text-[clamp(2.75rem,7vw,6.5rem)] tracking-[-0.05em] leading-[0.98]"
        >
          Three days worth waking up early for.
        </AnimatedText>

        <AnimatedText
          as="p"
          mode="lines"
          delay={0.1}
          className="max-w-[36ch] text-base leading-relaxed text-[var(--rl-mute)] sm:text-lg lg:pb-3"
        >
          Each one runs with a guide who lives here, a group of six or fewer,
          and a route that can bend around the weather.
        </AnimatedText>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-px md:mt-16 md:grid-cols-3">
        {TOURS.map((tour, index) => {
          const image = TOUR_IMAGES[tour.id];

          return (
            <Reveal key={tour.id} delay={index * 0.08} y={24}>
              <Link
                href={`/booking?tour=${tour.id}`}
                aria-label={`Book ${tour.name}, ${tour.duration}, $${tour.price}`}
                onPointerEnter={(event) => zoomPhoto(event.currentTarget, 1.05)}
                onPointerLeave={(event) => zoomPhoto(event.currentTarget, 1)}
                className="relative isolate flex min-h-[32rem] flex-col justify-end overflow-hidden bg-[var(--rl-sea)] p-6 text-white md:h-[84svh] md:max-h-[860px] lg:p-8"
              >
                {image ? (
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 768px) 34vw, 100vw"
                    className="-z-20 object-cover"
                  />
                ) : null}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgb(6_38_44/0.92)_0%,rgb(6_38_44/0.5)_38%,transparent_64%)]"
                />

                <span className="flex items-end justify-between gap-4">
                  <span className="rl-display block text-[clamp(1.9rem,3.2vw,2.9rem)] leading-[1.02]">
                    {tour.name}
                  </span>
                  <span className="rl-display shrink-0 text-[clamp(1.25rem,2vw,1.75rem)] tabular-nums">
                    ${tour.price}
                  </span>
                </span>

                <span className="mt-2 block text-sm font-medium">{tour.duration}</span>

                <span className="mt-3 block max-w-[36ch] text-sm leading-relaxed text-white/85">
                  {tour.blurb}
                </span>

                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold underline decoration-white/50 underline-offset-[6px]">
                  Book a tour
                  <ArrowUpRight size={15} strokeWidth={2} aria-hidden="true" />
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
