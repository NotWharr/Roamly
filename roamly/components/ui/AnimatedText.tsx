"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText, ScrollTrigger);
}

type SplitMode = "lines" | "words" | "chars";
type AnimatedTag = "h1" | "h2" | "h3" | "p" | "span" | "div";

interface AnimatedTextProps {
  as?: AnimatedTag;
  children: ReactNode;
  className?: string;
  id?: string;
  /** What to split on. Lines read best for headings; words for short leads. */
  mode?: SplitMode;
  /** Hero text plays on load; everything below the fold plays in view. */
  trigger?: "load" | "scroll";
  delay?: number;
  duration?: number;
  stagger?: number;
}

/**
 * GSAP text reveal.
 *
 * The text is readable in the server HTML, so nothing disappears if JavaScript
 * fails. SplitText takes over on the client, waits for the web font to settle
 * (otherwise the line breaks are measured against the fallback face), then
 * lifts each line or word into place. Reduced motion returns before splitting,
 * leaving plain static text.
 */
export default function AnimatedText({
  as = "p",
  children,
  className = "",
  id,
  mode = "lines",
  trigger = "scroll",
  delay = 0,
  duration = 1,
  stagger = 0.055,
}: AnimatedTextProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let split: SplitText | null = null;
    let ctx: gsap.Context | null = null;

    const play = () => {
      if (cancelled) return;

      ctx = gsap.context(() => {
        split = new SplitText(el, {
          type:
            mode === "lines"
              ? "lines"
              : mode === "words"
                ? "lines,words"
                : "lines,words,chars",
          linesClass: "anim-line",
          wordsClass: "anim-word",
          charsClass: "anim-char",
          reduceWhiteSpace: false,
        });

        const targets =
          mode === "chars"
            ? split.chars
            : mode === "words"
              ? split.words
              : split.lines;

        gsap.set(targets, { yPercent: 110, opacity: 0 });
        gsap.to(targets, {
          yPercent: 0,
          opacity: 1,
          duration,
          delay,
          stagger,
          ease: "power4.out",
          // Hand back plain text so the lines can rewrap on resize or rotation.
          onComplete: () => split?.revert(),
          scrollTrigger:
            trigger === "scroll"
              ? { trigger: el, start: "top 88%", once: true }
              : undefined,
        });
      }, el);
    };

    if (document.fonts?.status === "loaded") play();
    else if (document.fonts?.ready) void document.fonts.ready.then(play);
    else play();

    return () => {
      cancelled = true;
      ctx?.revert();
      split?.revert();
    };
  }, [delay, duration, mode, stagger, trigger]);

  const setRef = useCallback((node: HTMLElement | null) => {
    ref.current = node;
  }, []);

  const props = { ref: setRef, id, className };

  switch (as) {
    case "h1":
      return <h1 {...props}>{children}</h1>;
    case "h2":
      return <h2 {...props}>{children}</h2>;
    case "h3":
      return <h3 {...props}>{children}</h3>;
    case "span":
      return <span {...props}>{children}</span>;
    case "div":
      return <div {...props}>{children}</div>;
    default:
      return <p {...props}>{children}</p>;
  }
}
