"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import JigglyButton from "@/components/ui/JigglyButton";
import { GALLERY, type GalleryFrame } from "@/lib/gallery";
import { rlFonts } from "@/lib/roamlyFonts";

import "@/styles/roamly.css";

const ARROW_ICON = 20;

/**
 * The gallery strip on the home page.
 *
 * The photographs come from the shared list in `lib/gallery.ts`, so this and
 * the full gallery page cannot drift apart. Mixed portrait and square frames
 * give the row a rhythm instead of a uniform grid.
 */
export default function GallerySection() {
  const stripRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);

  // Progress line: width is visible share of the strip, position is scroll share.
  const updateProgress = useCallback(() => {
    const strip = stripRef.current;
    const bar = barRef.current;
    if (!strip || !bar) return;

    const max = strip.scrollWidth - strip.clientWidth;
    const visible = strip.clientWidth / strip.scrollWidth;
    const progress = max > 0 ? strip.scrollLeft / max : 0;

    bar.style.transform = `translateX(${progress * (1 - visible) * 100}%) scaleX(${visible})`;
  }, []);

  const onScroll = useCallback(() => {
    if (frameRef.current !== null) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      updateProgress();
    });
  }, [updateProgress]);

  useEffect(() => {
    updateProgress();
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("resize", updateProgress);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [updateProgress]);

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
    <figure
      key={frame.id}
      className={`w-[72vw] max-w-[320px] shrink-0 snap-start md:w-[30vw] md:max-w-[420px] ${
        index % 2 === 1 ? "mt-10 md:mt-16" : ""
      }`}
    >
      <div
        className={`relative w-full overflow-hidden rounded-[4px] border border-[var(--rl-line)] bg-[var(--rl-ink-2)] ${frame.ratio}`}
      >
        <Image
          src={frame.url}
          alt={frame.alt}
          fill
          sizes="(max-width: 767px) 72vw, 30vw"
          className="object-cover"
        />
      </div>
      <figcaption className="mt-3 text-sm text-[var(--rl-mute)]">
        {frame.title}
      </figcaption>
    </figure>
  );

  return (
    <section
      id="gallery"
      className={`rl-root rl-on-ink rl-theme rl-theme-sand rl-section-y rl-z-content relative overflow-hidden ${rlFonts}`}
    >
      <div className="rl-pad-x mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-6">
        <h2 className="rl-display rl-h2 max-w-[14ch]">
          The moments you&rsquo;ll remember
        </h2>

        <div className="flex shrink-0 items-center gap-3">
          {/* The arrows are desktop affordances only. On a touch screen the
              strip is dragged directly, and two 44px buttons either side of a
              swipe target is clutter. */}
          <div className="hidden gap-3 md:flex">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              aria-label="Scroll gallery back"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--rl-line-strong)] transition-colors duration-200 hover:border-[var(--rl-accent-text)] hover:text-[var(--rl-accent-text)]"
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
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--rl-line-strong)] transition-colors duration-200 hover:border-[var(--rl-accent-text)] hover:text-[var(--rl-accent-text)]"
            >
              <ArrowRight
                style={{ width: ARROW_ICON, height: ARROW_ICON }}
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </button>
          </div>

          {/* One label for one intent, so this is "see all" rather than a
              second "gallery" word next to the heading. */}
          <JigglyButton href="/gallery" size="nav" withArrow className="ml-1 min-h-[48px] px-6 font-semibold md:ml-2">
            See all {GALLERY.length}
          </JigglyButton>
        </div>
      </div>

      <div
        ref={stripRef}
        onScroll={onScroll}
        role="region"
        aria-label="Photo gallery, swipe or scroll sideways"
        tabIndex={0}
        className="rl-strip rl-pad-x mt-12 flex snap-x snap-mandatory items-start gap-4 overflow-x-auto scroll-px-[var(--rl-gutter)] pb-4 md:mt-16 md:gap-6"
      >
        {GALLERY.map(renderFrame)}
      </div>

      <div className="rl-pad-x mx-auto mt-8 max-w-7xl" aria-hidden="true">
        <div className="h-px w-full bg-[var(--rl-line)]">
          <div
            ref={barRef}
            className="h-px w-full origin-left bg-[var(--rl-accent-text)] will-change-transform"
          />
        </div>
      </div>
    </section>
  );
}
