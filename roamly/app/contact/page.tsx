"use client";

import ContactForm from "@/components/ui/contact/ContactForm";
import PageBanner from "@/components/layout/PageBanner";
import SiteFooter from "@/components/layout/SiteFooter";

import { rlFonts } from "@/lib/roamlyFonts";

import "@/styles/roamly.css";

/**
 * The contact page.
 *
 * A real route rather than a dialog, so it is linkable and shareable. Every
 * contact affordance on the site points here.
 *
 * Opens on the shared water banner rather than the full site navbar: on a
 * focused task page the navbar's other destinations are noise.
 */
export default function ContactPage() {
  return (
    <main
      className={`rl-root rl-on-ink rl-z-content relative flex min-h-dvh flex-col ${rlFonts}`}
    >
      <PageBanner backHref="/" backLabel="Back to exploring" title="Let's get in touch.">
        Questions about a tour, a custom itinerary, or a group booking? Tell us
        what you have in mind and we will come back to you within one working
        day.
      </PageBanner>

      <div className="mx-auto w-full max-w-[1400px] flex-1 px-[var(--rl-gutter)] py-12 sm:py-16 [&>*]:max-w-3xl">
        <ContactForm />
      </div>

      <SiteFooter />
    </main>
  );
}
