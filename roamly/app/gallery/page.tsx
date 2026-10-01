"use client";

import Image from "next/image";

import BackLink from "@/components/layout/BackLink";
import SocialLinks from "@/components/design/SocialLinks";
import JigglyButton from "@/components/ui/JigglyButton";
import { GALLERY } from "@/lib/gallery";
import { rlFonts } from "@/lib/roamlyFonts";

import "@/styles/roamly.css";

/**
 * The full gallery.
 *
 * Same photographs as the home page strip, in a grid instead of a row. The
 * aspect ratios are kept from the source list rather than forced square: the
 * mixed shapes are what stop this from looking like a contact sheet.
 */
export default function GalleryPage() {
  return (
    <main
      className={`rl-root rl-on-ink rl-z-content relative flex min-h-dvh flex-col px-[length:var(--rl-gutter)] ${rlFonts}`}
    >
      <BackLink href="/">Back to home</BackLink>

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col pb-16 pt-32 sm:pt-36">
        <header className="max-w-[42ch]">
          <span className="rl-badge">{GALLERY.length} photographs</span>

          <h1 className="rl-display mt-5 text-balance text-[clamp(2.25rem,8vw,4rem)]">
            The whole collection
          </h1>

          <p className="mt-4 text-base leading-relaxed text-[var(--rl-mute)]">
            Water, forest and reef, from the west sand flats to the Annandale
            river. Ask your guide which frame is which and they will tell you.
          </p>
        </header>

        {/*
          A masonry-ish column layout rather than a fixed grid. CSS columns
          keep each photograph's own ratio and let the browser balance the
          heights, which a grid cannot do without either cropping or fixing a
          ratio and losing the variation.
        */}
        <div className="mt-12 columns-2 gap-4 md:mt-16 md:columns-3 md:gap-6">
          {GALLERY.map((frame, index) => (
            <figure key={frame.id} className="mb-4 break-inside-avoid md:mb-6">
              <div
                className={`relative w-full overflow-hidden rounded-[4px] border border-[var(--rl-line)] bg-[var(--rl-ink-2)] ${frame.ratio}`}
              >
                <Image
                  src={frame.url}
                  alt={frame.alt}
                  fill
                  // The first row is what lands above the fold, so only those
                  // skip lazy loading.
                  priority={index < 3}
                  sizes="(min-width: 768px) 30vw, 46vw"
                  className="object-cover"
                />
              </div>

              <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-x-3">
                <span className="text-sm text-[var(--rl-text)]">
                  {frame.title}
                </span>
                <span className="text-xs text-[var(--rl-mute)]">
                  {frame.place}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-16 border-t border-[var(--rl-line)] pt-10">
          <JigglyButton href="/#gallery" tone="outline" size="block" withArrow className="w-full sm:w-fit sm:px-8">
            Back to the home page
          </JigglyButton>
        </div>

        <p className="mt-10 max-w-[52ch] text-sm leading-relaxed text-[var(--rl-mute)]">
          Photography by our guides and by people who have taken these tours.
          If you want the exact spot for a frame, ask when you book and we will
          put it on your route.
        </p>

        <div className="mt-auto pt-16">
          <SocialLinks />
        </div>
      </div>
    </main>
  );
}
