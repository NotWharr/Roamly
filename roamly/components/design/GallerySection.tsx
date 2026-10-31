"use client";

import Image from "next/image";
import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import AnimatedText from "@/components/ui/AnimatedText";
import JigglyButton from "@/components/ui/JigglyButton";
import Reveal from "@/components/ui/Reveal";
import { GALLERY, type GalleryFrame } from "@/lib/gallery";

const ARROW_ICON = 20;

/**
 * The gallery strip on the home page.
 *
 * Photographs come from the shared list in `lib/gallery.ts`, so this strip and
 * the full gallery page cannot drift apart. Mixed portrait and square frames
 * give the row a rhythm; the strip itself is native horizontal scrolling, not a
 * carousel that hijacks the wheel.
 */
export default function GallerySection() {
  const stripRef = useRef<HTMLDivElement | null>(null);

  const scrollByCard = (direction: 1 | -1) => {
    const strip = stripRef.current;
    if (!strip) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    strip.scrollBy({
      left: direction * strip.clientWidth * 0.6,
      behavior: reduce ? "auto" : "smooth",
    });
  };

  const renderFrame = (frame: GalleryFrame, index: number) => (
    <Reveal
      key={frame.id}
      delay={index * 0.06}
      y={26}
      className={`w-[78vw] max-w-[380px] shrink-0 snap-start md:w-[36vw] md:max-w-[560px] ${
        index % 2 === 1 ? "mt-10 md:mt-20" : ""
      }`}
    >
      <figure>
        <div
          className={`relative w-full overflow-hidden bg-[var(--rl-reef)] ${frame.ratio}`}
        >
          <Image
            src={frame.url}
            alt={frame.alt}
            fill
            sizes="(max-width: 767px) 78vw, 36vw"
            className="object-cover"
          />
        </div>
        <figcaption className="mt-3 text-sm text-[var(--rl-mute)]">
          {frame.title}
        </figcaption>
      </figure>
    </Reveal>
  );

  return (
    <section
      id="gallery"
      aria-labelledby="gallery-title"
      className="overflow-hidden bg-[var(--rl-ink)] py-[var(--rl-section-y)]"
    >
      <div className="mx-auto flex w-full max-w-[1400px] flex-wrap items-end justify-between gap-6 px-[var(--rl-gutter)]">
        <AnimatedText
          as="h2"
          id="gallery-title"
          mode="lines"
          className="rl-display max-w-[14ch] text-[clamp(2.75rem,7vw,6.5rem)] tracking-[-0.05em] leading-[0.98]"
        >
          The island, as we see it.
        </AnimatedText>

        <div className="flex shrink-0 items-center gap-3">
          {/* Arrows are desktop affordances only. On touch, the strip is dragged. */}
          <div className="hidden gap-3 md:flex">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              aria-label="Scroll gallery back"
              className="grid h-12 w-12 place-items-center rounded-full border border-[var(--rl-line-strong)] text-[var(--rl-text)] hover:border-[var(--rl-accent-text)] hover:text-[var(--rl-accent-text)]"
            >
              <ArrowLeft
                style={{ width: ARROW_ICON, height: ARROW_ICON }}
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              aria-label="Scroll gallery forward"
              className="grid h-12 w-12 place-items-center rounded-full border border-[var(--rl-line-strong)] text-[var(--rl-text)] hover:border-[var(--rl-accent-text)] hover:text-[var(--rl-accent-text)]"
            >
              <ArrowRight
                style={{ width: ARROW_ICON, height: ARROW_ICON }}
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </button>
          </div>

          <JigglyButton
            href="/gallery"
            size="nav"
            withArrow
            className="ml-1 min-h-12 px-6 font-semibold md:ml-2"
          >
            See all {GALLERY.length}
          </JigglyButton>
        </div>
      </div>

      <div
        ref={stripRef}
        role="region"
        aria-label="Photo gallery, swipe or scroll sideways"
        tabIndex={0}
        className="rl-strip mt-12 flex snap-x snap-proximity items-start gap-4 overflow-x-auto scroll-px-[var(--rl-gutter)] px-[var(--rl-gutter)] pb-4 md:mt-16 md:gap-6"
      >
        {GALLERY.map(renderFrame)}
      </div>
    </section>
  );
}
