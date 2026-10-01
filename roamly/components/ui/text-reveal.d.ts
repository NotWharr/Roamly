/**
 * Types for text-reveal.jsx.
 *
 * The component is plain JSX with a full JSDoc block, so without this file
 * TypeScript infers `as` as a bare string and rejects `<TextReveal as="h1">`,
 * which is the whole reason the prop exists. Declaring the shape here keeps the
 * runtime file untouched and gives call sites real autocomplete.
 */
import type { ReactNode } from "react";

export interface TextRevealProps {
  className?: string;
  children?: ReactNode;
  /** Split type. */
  type?: "lines" | "words" | "chars";
  /** ScrollTrigger start position. */
  start?: string;
  end?: string;
  /** Link the animation to scroll. */
  scrub?: boolean | number;
  /** Seconds. */
  duration?: number;
  /** Seconds between elements. */
  stagger?: number;
  ease?: string;
  /** Initial Y offset, in percent. */
  yPercent?: number;
  /** Show ScrollTrigger debug markers. */
  markers?: boolean;
  /** Seconds before the reveal starts. */
  delay?: number;
  /**
   * Element the split text lives in, so the page keeps one h1 and the visual
   * styling stays on the wrapper rather than the text.
   */
  as?: keyof JSX.IntrinsicElements;
  /** Skip the component's own typography so the caller's classes win. */
  unstyled?: boolean;
  onComplete?: () => void;
}

declare const TextReveal: (props: TextRevealProps) => ReactNode;

export default TextReveal;
