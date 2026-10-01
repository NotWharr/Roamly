"use client";

import SocialLinks from "./SocialLinks";
import JigglyButton from "@/components/ui/JigglyButton";

import { rlFonts } from "@/lib/roamlyFonts";

import "@/styles/roamly.css";

/**
 * The closing call to action.
 *
 * A single point of contact: one heading, one link, leading to the same
 * `/contact` page the navbar and FAQ point to. One label for one intent, so
 * the page never asks for the same action twice in different words.
 */
export default function ContactSection() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-cta-title"
      className={`rl-root rl-on-ink rl-theme rl-theme-sand rl-section-y rl-clear-nav rl-z-content relative px-[length:var(--rl-gutter)] text-center ${rlFonts}`}
    >
      <div className="mx-auto flex max-w-2xl flex-col items-center">
        <h2
          id="contact-cta-title"
          className="rl-display rl-h2 max-w-[16ch] text-balance"
        >
          Tell us the day you have in mind.
        </h2>

        <p className="mt-6 max-w-[46ch] text-base leading-relaxed text-[var(--rl-mute)]">
          A private boat, a group of nine, a reef trip that starts at seven, or
          a week that has to work around the children&rsquo;s swimming lesson.
          Send the shape of it and we will say what is actually possible.
        </p>

        {/* The arrow comes from withArrow, not from a second icon child. */}
        <JigglyButton href="/contact" size="hero" withArrow className="mt-10">
          Start planning
        </JigglyButton>

        <div className="mt-14 w-full border-t border-[var(--rl-line)] pt-12">
          <SocialLinks />
        </div>
      </div>
    </section>
  );
}
