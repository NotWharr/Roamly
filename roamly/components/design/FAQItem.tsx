"use client";

import { useId } from "react";
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

export default function FAQItem({ entry, isOpen, onToggle }: FAQItemProps) {
  const uid = useId();
  const buttonId = `${uid}-question`;
  const panelId = `${uid}-answer`;

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
          <Plus
            aria-hidden="true"
            data-open={isOpen}
            strokeWidth={1.5}
            className="rl-icon-turn mt-0.5 h-6 w-6 shrink-0"
          />
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!isOpen}
        className="rl-answer-in pb-6 pr-12"
      >
        <p className="max-w-[56ch] text-base leading-relaxed text-[var(--rl-mute)] sm:text-[1.0625rem]">
          {entry.answer}
        </p>
      </div>
    </div>
  );
}
