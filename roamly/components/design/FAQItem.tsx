"use client";

import { useEffect, useId, useRef } from "react";
import gsap from "gsap";
import { Plus } from "lucide-react";

export interface FAQEntry {
  id: number;
  question: string;
  answer: string;
}

interface FAQItemProps {
  entry: FAQEntry;
  isOpen: boolean;
  onToggle: () => void;
}

/**
 * One question.
 *
 * The answer is always in the DOM, with its height animated by GSAP. That
 * keeps the open and close motion honest (no CSS transition, no `hidden`
 * attribute fighting the animation) while `aria-hidden` keeps the closed text
 * out of the accessibility tree.
 */
export default function FAQItem({ entry, isOpen, onToggle }: FAQItemProps) {
  const uid = useId();
  const buttonId = `${uid}-question`;
  const panelId = `${uid}-answer`;
  const answerRef = useRef<HTMLDivElement | null>(null);
  const iconRef = useRef<HTMLSpanElement | null>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    const answer = answerRef.current;
    if (!answer) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (firstRender.current) {
      firstRender.current = false;
      answer.style.height = isOpen ? "auto" : "0px";
      answer.style.opacity = isOpen ? "1" : "0";
      if (iconRef.current) {
        gsap.set(iconRef.current, { rotate: isOpen ? 45 : 0 });
      }
      return;
    }

    gsap.killTweensOf(answer);
    if (iconRef.current) gsap.killTweensOf(iconRef.current);

    if (reduce) {
      answer.style.height = isOpen ? "auto" : "0px";
      answer.style.opacity = isOpen ? "1" : "0";
      if (iconRef.current) {
        gsap.set(iconRef.current, { rotate: isOpen ? 45 : 0 });
      }
      return;
    }

    gsap.to(answer, {
      height: isOpen ? "auto" : 0,
      opacity: isOpen ? 1 : 0,
      duration: 0.45,
      ease: isOpen ? "power3.out" : "power3.inOut",
    });

    if (iconRef.current) {
      gsap.to(iconRef.current, {
        rotate: isOpen ? 45 : 0,
        duration: 0.32,
        ease: "power2.out",
      });
    }
  }, [isOpen]);

  return (
    <div className="border-t border-[var(--rl-line)] last:border-b">
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex min-h-[72px] w-full items-start justify-between gap-6 py-5 text-left [-webkit-tap-highlight-color:transparent]"
        >
          <span className="rl-display text-[clamp(1.25rem,5vw,1.875rem)] leading-[1.12] tracking-[-0.02em]">
            {entry.question}
          </span>

          <span
            ref={iconRef}
            className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center text-[var(--rl-accent-text)]"
            aria-hidden="true"
          >
            <Plus size={24} strokeWidth={1.5} />
          </span>
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        aria-hidden={!isOpen}
        ref={answerRef}
        className="overflow-hidden"
        style={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
      >
        <div className="pb-6 pr-0 sm:pr-12">
          <p className="max-w-[56ch] text-base leading-relaxed text-[var(--rl-mute)] sm:text-[1.0625rem]">
            {entry.answer}
          </p>
        </div>
      </div>
    </div>
  );
}
