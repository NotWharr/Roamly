"use client";

import { useRef, type RefObject } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

interface HeroTransitionProps {
  heroRef: RefObject<HTMLElement | null>;
}

/**
 * The handoff from the hero to the section below it.
 *
 * This used to tear the hero photograph into fourteen strips and break it into
 * forty-eight patches, then blow both apart under two blur layers. That was
 * sixty-two elements each holding their own compositor layer and a piece of a
 * 5.8MB background image, animated together on scroll. It cost frames on every
 * device, and the effect was over in a scroll gesture's worth of travel.
 *
 * Now it is one fixed layer that fades the hero's colour up and back down as the
 * hero scrolls out. One element, two properties, no image work. If this ever
 * needs to be more than a fade, it should be a section that exists rather than
 * an effect painted over a boundary.
 */
export default function HeroTransition({ heroRef }: HeroTransitionProps) {
  const veilRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const veil = veilRef.current;
      const hero = heroRef.current;
      if (!veil || !hero) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) {
        gsap.set(veil, { autoAlpha: 0 });
        return;
      }

      gsap.set(veil, { autoAlpha: 0 });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: hero,
            // Start as the hero starts leaving, finish once it has gone.
            start: "bottom 88%",
            end: "bottom 8%",
            scrub: 0.4,
            invalidateOnRefresh: true,
          },
        })
        // Up through the first half, back down through the second, so the
        // section below is revealed rather than covered.
        .to(veil, { autoAlpha: 1, duration: 0.5, ease: "power2.inOut" })
        .to(veil, { autoAlpha: 0, duration: 0.5, ease: "power2.inOut" });
    },
    { scope: veilRef, dependencies: [heroRef] },
  );

  return (
    <div
      ref={veilRef}
      aria-hidden
      /* Locked dark: this veil covers the hero, and under light :root
         defaults var(--rl-ink) would turn it sand. */
      className="rl-darklock pointer-events-none fixed inset-0 z-40 bg-[var(--rl-ink)] opacity-0"
    />
  );
}
