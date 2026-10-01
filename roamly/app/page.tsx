"use client";

import { useRef } from "react";

import "@/styles/roamly.css";

import BottomNavbar from "@/components/layout/BottomNavbar";
import HeroExploreBridge from "@/components/design/HeroExploreBridge";
import FeatureRail, { Chapter } from "@/components/design/FeatureRail";
import WorkProcess from "@/components/design/WorkProcess"; // <--- Import Work Process section
import GallerySection from "@/components/design/GallerySection";
import FAQSection from "@/components/design/FAQSection";
import ContactSection from "@/components/design/ContactSection";
import Hero from "@/components/design/Hero";

/* useScrollTheme (hooks/useScrollTheme.ts) is intentionally not called. The
   section colour journey is native CSS scroll-driven animations now
   (.rl-theme-* in styles/roamly.css); the GSAP hook would set an inline
   --page-text on <html> that overrides the live token mapping. The file
   remains for reference. */

/**
 * The three chapters of the island.
 *
 * Written as places with names rather than as moods. "Grand Etang" and
 * "Seven Sisters" are places a guide can actually take you; "the Spice Isle
 * tradition" is a brochure line.
 */
const GRENADA_CHAPTERS: Chapter[] = [
  {
    id: 'rainforest',
    num: '01',
    title: 'Rainforest',
    headline: 'Up into Grand Etang, where the island keeps its water.',
    text: 'A crater lake inside a cloud forest, reached by a trail that climbs hard for ninety minutes and then levels out. You walk in with a guide who has done it enough times to know where the ground is holding and where it is not.',
    image: {
      src: 'https://images.unsplash.com/photo-1733089048322-041903d7eff8?q=80&w=1828&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      alt: 'The Grand Etang crater lake in Grenada, ringed by rainforest',
    },
  },
  {
    id: 'waterfalls',
    num: '02',
    title: 'Waterfalls',
    headline: 'Annandale in the morning, before the coaches.',
    text: 'A short walk from the car park gets you to a river wide enough to swim and a seven-tier fall you can stand under. Seven Sisters is a harder day out and worth it if you want the walk rather than the photograph.',
    image: {
      src: 'https://images.unsplash.com/photo-1517800497904-3253a0f38be5?auto=format&fit=crop&w=1400&q=85',
      alt: 'A waterfall dropping into a dark plunge pool in dense rainforest',
    },
  },
  {
    id: 'reef',
    num: '03',
    title: 'Reef',
    headline: 'The west sand flats, and what is living on them.',
    text: 'Grenada sits on the edge of the Caribbean plate and the reef is close inshore here, which means the dive is short and the visibility is not negotiable. The Underwater Sculpture Park is on the same trip if the tide is right.',
    image: {
      src: 'https://images.unsplash.com/photo-1682687981630-cefe9cd73072?auto=format&fit=crop&w=1400&q=85',
      alt: 'A snorkeller over purple coral with orange fish in clear water',
    },
  },
];

export default function Page() {
  const heroRef = useRef<HTMLElement | null>(null);

  return (
    <main className="relative z-10 min-h-screen">
      <BottomNavbar />

      {/* HERO */}
      <Hero heroRef={heroRef} />

      {/* TRANSITION FROM HERO → FEATURE RAIL */}
      <HeroExploreBridge heroRef={heroRef} />

      {/* FEATURE RAIL */}
      <FeatureRail
        collectionTitle="Three parts of the island"
        chapters={GRENADA_CHAPTERS}
      />

      {/* WORK PROCESS SECTION */}
      <WorkProcess />

      {/* REST OF PAGE */}
      <GallerySection />
      <FAQSection />
      <ContactSection />
    </main>
  );
}
