"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Reduced motion: no smoothing at all, native scroll only.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Touch stays native: a multiplier above 1 makes flings overshoot on
      // phones and fights the browser's own momentum. Wheel-only smoothing.
      touchMultiplier: 1,
      syncTouch: false,
    });

    let rafId = 0;
    let stopped = false;

    function raf(time: number) {
      if (stopped) return;
      // Skip work while the tab is hidden: constant RAF is pure battery drain
      // on phones and Lenis timestamps jump on return.
      if (!document.hidden) lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    const onVisibility = () => {
      if (!document.hidden) {
        rafId = requestAnimationFrame(raf);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stopped = true;
      cancelAnimationFrame(rafId);
      document.removeEventListener("visibilitychange", onVisibility);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
