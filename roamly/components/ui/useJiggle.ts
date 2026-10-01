"use client";

import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from "react";
import { gsap } from "gsap";

const REST = { scaleX: 1, scaleY: 1, x: 0, y: 0, rotation: 0 };
const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

interface JiggleOptions<T extends HTMLElement = HTMLElement> {
  /** Scales every squash, poke and wobble. 1 = default, 1.2 = hero, 0.6 = nav. */
  intensity?: number;
  disabled?: boolean;
  /** A ref the caller already owns. One is created here when omitted. */
  ref?: React.RefObject<T | null>;
}

/**
 * The jelly interaction behind `JigglyButton`, which is the only button in
 * the project. Split out as a hook so the press, poke and wobble live in one
 * place and the button component stays about appearance and semantics.
 *
 * Returns a ref to put on the element and the pointer handlers to spread on it.
 * Both are plain handlers, so whatever renders the element owns the markup and
 * this only owns the motion.
 */
export default function useJiggle<T extends HTMLElement = HTMLElement>({
  ref,
  intensity = 1,
  disabled = false,
}: JiggleOptions<T> = {}) {
  // Owned here so a caller can use the hook without the ref plumbing. Passed in
  // when the caller already needs the ref for something else.
  const ownRef = useRef<T>(null);
  const el = ref ?? ownRef;
  const pressed = useRef(false);
  const reduceMotion = useRef(false);

  useEffect(() => {
    reduceMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const node = el.current;
    if (node) gsap.set(node, { transformOrigin: "50% 50%" });

    return () => {
      if (node) gsap.killTweensOf(node);
    };
  }, [el]);

  /** Springy return to the resting shape, the wobble. */
  const wobbleBack = (node: HTMLElement) => {
    gsap.to(node, {
      ...REST,
      duration: 1.1,
      ease: "elastic.out(1, 0.3)",
      overwrite: true,
    });
  };

  /** Pointer position relative to the element centre, normalised to -1..1. */
  const offsets = (el: HTMLElement, clientX: number, clientY: number) => {
    const rect = el.getBoundingClientRect();
    return {
      dx: clamp(((clientX - (rect.left + rect.width / 2)) / (rect.width / 2)) || 0, -1, 1),
      dy: clamp(((clientY - (rect.top + rect.height / 2)) / (rect.height / 2)) || 0, -1, 1),
    };
  };

  /** Jelly squash while held: flatter, wider, tilted toward the press point. */
  const press = (clientX?: number, clientY?: number) => {
    const node = el.current;
    if (!node || disabled || reduceMotion.current) return;
    pressed.current = true;

    const { dx } =
      clientX === undefined ? { dx: 0 } : offsets(node, clientX, clientY ?? 0);

    gsap.to(node, {
      scaleX: 1 + 0.14 * intensity,
      scaleY: 1 - 0.17 * intensity,
      x: 0,
      y: 0,
      rotation: dx * 1.6 * intensity,
      duration: 0.12,
      ease: "power2.out",
      overwrite: true,
    });
  };

  const release = () => {
    const node = el.current;
    if (!node || !pressed.current) return;
    pressed.current = false;
    if (!reduceMotion.current) wobbleBack(node);
  };

  /** Poke from whichever side the pointer entered, dent that side, bulge the other. */
  const poke = (clientX: number, clientY: number) => {
    const node = el.current;
    if (!node || disabled || reduceMotion.current || pressed.current) return;

    const { dx, dy } = offsets(node, clientX, clientY);
    const horizontal = Math.abs(dx) >= Math.abs(dy);

    // Pushed away from the side the pointer came from.
    const fx = horizontal ? -Math.sign(dx) : 0;
    const fy = horizontal ? 0 : -Math.sign(dy);
    const torque = dx * fy - dy * fx;

    const squash = 0.11 * intensity;
    const bulge = 0.08 * intensity;
    const push = 5 * intensity;

    gsap.killTweensOf(node);
    gsap
      .timeline()
      .to(node, {
        scaleX: horizontal ? 1 - squash : 1 + bulge,
        scaleY: horizontal ? 1 + bulge : 1 - squash,
        x: fx * push,
        y: fy * push,
        rotation: clamp(torque, -1, 1) * 3 * intensity,
        duration: 0.11,
        ease: "power2.out",
      })
      .to(node, { ...REST, duration: 1.05, ease: "elastic.out(1, 0.3)" });
  };

  const handlers = {
    onPointerEnter: (event: ReactPointerEvent<HTMLElement>) => {
      if (event.pointerType !== "touch") poke(event.clientX, event.clientY);
    },
    onPointerDown: (event: ReactPointerEvent<HTMLElement>) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      press(event.clientX, event.clientY);
    },
    onPointerUp: release,
    onPointerLeave: release,
    onPointerCancel: release,
    onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
      if ((event.key === " " || event.key === "Enter") && !event.repeat) press();
    },
    onKeyUp: release,
    onBlur: release,
  };

  return { ref: el, handlers };
}
