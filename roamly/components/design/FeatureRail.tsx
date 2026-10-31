"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import AnimatedText from "@/components/ui/AnimatedText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export type Chapter = {
  id: string;
  num: string;
  title: string;
  headline: string;
  text: string;
  image: {
    src: string;
    alt: string;
  };
};

export type FeatureRailProps = {
  collectionTitle?: string;
  chapters: Chapter[];
  className?: string;
};

/**
 * Three parts of the island.
 *
 * Each chapter is a full-screen photograph that sticks while the next slides
 * over it, so the island arrives one place at a time. Sticky is plain CSS: it
 * needs no pinning, survives touch scrolling, and still reads in order with
 * motion off. The only scripted motion is the photo settling as it arrives.
 */
export default function FeatureRail({
  collectionTitle = "Explore Grenada",
  chapters,
  className = "",
}: FeatureRailProps) {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray<HTMLElement>(".rl-chapter", rootRef.current).forEach((chapter) => {
        gsap.fromTo(
          chapter.querySelector(".rl-chapter-photo"),
          { scale: 1.12 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: chapter,
              start: "top bottom",
              end: "top top",
              scrub: true,
            },
          },
        );
      });
    });
    return () => media.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="explore"
      data-water
      aria-label={collectionTitle}
      className={`rl-deep ${className}`.trim()}
    >
      <div className="mx-auto grid w-full max-w-[1400px] gap-6 px-[var(--rl-gutter)] pb-[var(--rl-section-y)] pt-[calc(var(--rl-section-y)*0.6)] lg:grid-cols-12 lg:items-end">
        <AnimatedText
          as="h2"
          mode="lines"
          className="rl-display text-[clamp(2.75rem,7vw,6.5rem)] tracking-[-0.05em] leading-[0.98] lg:col-span-8"
        >
          Three parts of one island.
        </AnimatedText>

        <AnimatedText
          as="p"
          mode="lines"
          delay={0.12}
          className="max-w-[40ch] text-base leading-relaxed text-[var(--rl-mute)] sm:text-lg lg:col-span-4 lg:pb-3"
        >
          Rainforest, waterfall and reef, each within a day of St George&apos;s.
          These are the three routes we know best.
        </AnimatedText>
      </div>

      {chapters.map((chapter) => (
        <article
          key={chapter.id}
          className="rl-chapter sticky isolate flex h-[100svh] min-h-[640px] flex-col justify-end overflow-hidden bg-[var(--rl-sea)] text-white [top:min(0px,calc(100svh-640px))]"
        >
          <div className="rl-chapter-photo absolute inset-0 -z-20">
            <Image
              src={chapter.image.src}
              alt={chapter.image.alt}
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgb(6_38_44/0.88)_0%,rgb(6_38_44/0.42)_42%,transparent_66%),linear-gradient(180deg,rgb(6_38_44/0.5)_0%,transparent_18%)]"
          />

          <div className="mx-auto grid w-full max-w-[1400px] gap-5 px-[var(--rl-gutter)] pb-[calc(clamp(28px,6vh,64px)+env(safe-area-inset-bottom,0px))] lg:grid-cols-12 lg:items-end lg:gap-8">
            <div className="lg:col-span-7">
              <span className="text-sm font-semibold tabular-nums">{chapter.num}</span>
              <h3 className="rl-display mt-2 text-[clamp(3.25rem,10.5vw,10rem)] tracking-[-0.05em] leading-[0.94]">
                {chapter.title}
              </h3>
            </div>

            <div className="lg:col-span-5 lg:pb-3">
              <AnimatedText
                as="p"
                mode="lines"
                className="rl-display text-[clamp(1.3rem,2.2vw,1.8rem)] leading-[1.14]"
              >
                {chapter.headline}
              </AnimatedText>
              <p className="mt-3 max-w-[52ch] text-[0.9375rem] leading-relaxed text-white/85">
                {chapter.text}
              </p>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
