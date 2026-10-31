"use client";

import Link from "next/link";
import {
  forwardRef,
  useEffect,
  useRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type ReactNode,
} from "react";
import gsap from "gsap";

/**
 * THE button for this site.
 *
 * One component, one button language. The old jelly press has been replaced
 * with a quieter GSAP response: the arrow eases forward, the label lifts a
 * hair, and the press is a small scale. No CSS transitions are involved.
 */

export type ButtonTone = "solid" | "glass" | "outline";
export type ButtonSize = "hero" | "nav" | "block";

const ARROW_ICON = 16;

const SIZE: Record<ButtonSize, { pad: string; text: string; shadow: string }> = {
  hero: {
    pad: "px-8 py-4",
    text: "text-sm font-semibold",
    shadow: "",
  },
  nav: {
    pad: "px-4 py-2 min-h-11",
    text: "text-sm font-medium",
    shadow: "",
  },
  block: {
    pad: "px-7 py-4",
    text: "text-base font-semibold",
    shadow: "",
  },
};

interface SharedProps {
  children: ReactNode;
  tone?: ButtonTone;
  size?: ButtonSize;
  withArrow?: boolean;
  className?: string;
}

export type JigglyButtonProps = SharedProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className"> & {
    href?: string;
  };

export type JigglyLinkProps = SharedProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "className"> & {
    href: string;
  };

function getSurface({
  tone = "solid",
  size = "hero",
  withArrow = false,
  className = "",
  disabled = false,
}: SharedProps & { disabled?: boolean }) {
  const config = SIZE[size];

  const base =
    "relative inline-flex cursor-pointer select-none items-center justify-center overflow-hidden " +
    "rounded-full tracking-tight outline-none will-change-transform " +
    "[touch-action:manipulation] " +
    "focus-visible:ring-2 focus-visible:ring-[var(--rl-accent-text)] focus-visible:ring-offset-2 " +
    "focus-visible:ring-offset-[var(--rl-ink)] " +
    "disabled:cursor-not-allowed " +
    `${config.pad} ${config.text} ${config.shadow} ${className}`;

  const surface: CSSProperties = disabled
    ? {
        border: "1px solid var(--rl-line)",
        background: "color-mix(in srgb, var(--rl-text) 6%, var(--rl-ink))",
        color: "var(--rl-mute)",
      }
    : tone === "glass"
      ? {
          border: "1px solid var(--rl-glass-border)",
          background: "var(--rl-glass-fill)",
          backdropFilter: "var(--rl-glass-blur)",
          WebkitBackdropFilter: "var(--rl-glass-blur)",
          color: "var(--rl-text)",
        }
      : tone === "outline"
        ? {
            border: "1px solid var(--rl-line-strong)",
            background: "transparent",
            color: "var(--rl-text)",
          }
        : {
            border: "1px solid transparent",
            background: "var(--rl-accent)",
            color: "var(--rl-on-accent)",
          };

  const labelTone = disabled
    ? "text-[var(--rl-mute)]"
    : tone === "solid"
      ? "text-[var(--rl-on-accent)]"
      : "text-[var(--rl-text)]";

  const hover = disabled
    ? ""
    : tone === "solid"
      ? "hover:brightness-[1.06]"
      : tone === "glass"
        ? "hover:bg-white"
        : "hover:border-[var(--rl-accent-text)] hover:text-[var(--rl-accent-text)]";

  return {
    className: `${base} ${hover}`.replace(/\s+/g, " "),
    surface,
    labelTone,
    withArrow,
  };
}

const JigglyButton = forwardRef<HTMLButtonElement, JigglyButtonProps>(
  function JigglyButton(
    {
      children,
      tone = "solid",
      size = "hero",
      withArrow = false,
      className = "",
      href,
      type = "button",
      disabled,
      style,
      onPointerEnter,
      onPointerDown,
      onPointerUp,
      onPointerLeave,
      onPointerCancel,
      onKeyDown,
      onKeyUp,
      onBlur,
      ...rest
    },
    forwardedRef,
  ) {
    const rootRef = useRef<HTMLElement | null>(null);
    const labelRef = useRef<HTMLSpanElement | null>(null);
    const arrowRef = useRef<SVGSVGElement | null>(null);

    const surface = getSurface({
      children,
      tone,
      size,
      withArrow,
      className,
      disabled,
    });

    useEffect(() => {
      const root = rootRef.current;
      const label = labelRef.current;
      const arrow = arrowRef.current;

      return () => {
        if (root) gsap.killTweensOf(root);
        if (label) gsap.killTweensOf(label);
        if (arrow) gsap.killTweensOf(arrow);
      };
    }, []);

    const setRootRef = (node: HTMLElement | null) => {
      rootRef.current = node;
      if (typeof forwardedRef === "function") {
        forwardedRef(node as HTMLButtonElement | null);
      } else if (forwardedRef) {
        (
          forwardedRef as unknown as { current: HTMLButtonElement | null }
        ).current = node as HTMLButtonElement | null;
      }
    };

    const reduced = () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const setHover = (hovered: boolean) => {
      if (disabled || reduced()) return;
      if (labelRef.current) {
        gsap.to(labelRef.current, {
          y: hovered ? -1 : 0,
          duration: 0.32,
          ease: "power3.out",
        });
      }
      if (arrowRef.current) {
        gsap.to(arrowRef.current, {
          x: hovered ? 4 : 0,
          duration: 0.35,
          ease: "power3.out",
        });
      }
    };

    const setPressed = (pressed: boolean) => {
      if (disabled || reduced() || !rootRef.current) return;
      gsap.to(rootRef.current, {
        scale: pressed ? 0.98 : 1,
        duration: pressed ? 0.12 : 0.35,
        ease: pressed ? "power2.out" : "power3.out",
      });
    };

    const merged: CSSProperties = { ...surface.surface, ...style };

    const handlers = {
      onPointerEnter: (event: React.PointerEvent<HTMLElement>) => {
        onPointerEnter?.(event as never);
        if (event.pointerType !== "touch") setHover(true);
      },
      onPointerDown: (event: React.PointerEvent<HTMLElement>) => {
        onPointerDown?.(event as never);
        if (event.pointerType === "mouse" && event.button !== 0) return;
        setPressed(true);
      },
      onPointerUp: (event: React.PointerEvent<HTMLElement>) => {
        onPointerUp?.(event as never);
        setPressed(false);
      },
      onPointerLeave: (event: React.PointerEvent<HTMLElement>) => {
        onPointerLeave?.(event as never);
        setHover(false);
        setPressed(false);
      },
      onPointerCancel: (event: React.PointerEvent<HTMLElement>) => {
        onPointerCancel?.(event as never);
        setHover(false);
        setPressed(false);
      },
      onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
        onKeyDown?.(event as never);
        if ((event.key === " " || event.key === "Enter") && !event.repeat) {
          setPressed(true);
        }
      },
      onKeyUp: (event: React.KeyboardEvent<HTMLElement>) => {
        onKeyUp?.(event as never);
        setPressed(false);
      },
      onBlur: (event: React.FocusEvent<HTMLElement>) => {
        onBlur?.(event as never);
        setHover(false);
        setPressed(false);
      },
    };

    const content = (
      <span
        ref={labelRef}
        className={`relative z-10 inline-flex items-center gap-2.5 ${surface.labelTone}`}
      >
        {children}

        {withArrow ? (
          <svg
            ref={arrowRef}
            className="shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.2}
            aria-hidden="true"
            style={{ width: ARROW_ICON, height: ARROW_ICON }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        ) : null}
      </span>
    );

    if (href) {
      const linkProps = rest as Omit<
        React.AnchorHTMLAttributes<HTMLAnchorElement>,
        "className" | "children"
      >;

      return (
        <Link
          {...linkProps}
          {...handlers}
          href={href}
          ref={(node) => setRootRef(node)}
          style={merged}
          className={surface.className}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        {...rest}
        {...handlers}
        ref={setRootRef}
        type={type}
        disabled={disabled}
        style={merged}
        className={surface.className}
      >
        {content}
      </button>
    );
  },
);

export default JigglyButton;
