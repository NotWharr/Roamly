"use client";

import ContactForm from "@/components/ui/contact/ContactForm";
import SocialLinks from "@/components/design/SocialLinks";
import BackLink from "@/components/layout/BackLink";

import { rlFonts } from "@/lib/roamlyFonts";

import "@/styles/roamly.css";

/**
 * The contact page.
 *
 * A real route rather than a dialog, so it is linkable and shareable. Every
 * contact affordance on the site points here.
 *
 * Carries the same floating back pill as `/terms` rather than the full site
 * navbar: on a focused task page the navbar's other destinations are noise,
 * and one consistent sub-page treatment reads as deliberate.
 */
export default function ContactPage() {
  return (
    <main
      className={`rl-root rl-on-ink rl-z-content relative flex min-h-dvh flex-col px-[length:var(--rl-gutter)] ${rlFonts}`}
    >
      <BackLink href="/">Back to exploring</BackLink>

      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col pb-16 pt-32 sm:pt-36">
        <header className="flex flex-col items-center text-center">
          <span className="rl-badge">Contact Us</span>

          <h1 className="rl-display mt-5 text-[clamp(2.25rem,8vw,3.5rem)]">
            Let&apos;s Get In Touch.
          </h1>

          <p className="mt-4 max-w-[42ch] text-base leading-relaxed text-[var(--rl-mute)]">
            Questions about a tour, a custom itinerary, or a group booking? Tell
            us what you have in mind and we will come back to you within one
            working day.
          </p>
        </header>

        <div className="mt-10 sm:mt-12">
          <ContactForm />
        </div>

        <div className="mt-auto pt-16">
          <SocialLinks />
        </div>
      </div>
    </main>
  );
}
