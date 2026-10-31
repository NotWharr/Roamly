"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Distance travelled upward. Small values keep the page calm. */
  y?: number;
  delay?: number;
  scale?: number;
}

/**
 * A quiet GSAP entrance for images and grouped content. Text gets its own
 * line-by-line reveal; this wrapper is for the things around it.
 */
export default function Reveal({
  children,
  className = "",
  y = 28,
  delay = 0,
  scale,
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tween = gsap.fromTo(
      el,
      { y, opacity: 0, scale: scale ?? 1 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        delay,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
        clearProps: "transform,opacity",
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(el, { clearProps: "transform,opacity" });
    };
  }, [delay, scale, y]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
