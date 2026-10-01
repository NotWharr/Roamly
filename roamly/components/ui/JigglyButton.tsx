"use client";

import Link from "next/link";
import {
  forwardRef,
  useRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ReactNode,
  type RefObject,
} from "react";

import useJiggle from "@/components/ui/useJiggle";

/**
 * THE button for this site.
 *
 * Every call to action in the project renders this component. It is the only
 * place the press, the glass and the type scale of a button are defined, so
 * there is one button language rather than three that drifted apart.
 *
 * Tones are the visual states. Size is separate, because the same action needs
 * to be a hero-sized statement in one place and a nav-sized item in another.
 */

export type ButtonTone = "solid" | "glass" | "outline";
export type ButtonSize = "hero" | "nav" | "block";

const ARROW_ICON = 16;

const SIZE: Record<ButtonSize, { pad: string; text: string; shadow: string }> = {
  // A standalone call to action on an empty background. Wide pad, deep shadow.
  hero: {
    pad: "px-8 py-4",
    text: "text-sm font-semibold",
    shadow: "shadow-[0_18px_50px_-12px_rgb(4_20_26_/_0.7)]",
  },
  // Inside the glass navbar, which is already blurred and shadowed. The same
  // shadow at this size reads as mud and the same pad reads as shouting.
  // min-h-11 rather than letting the padding decide: at py-2 these measured
  // 38px, and an iPad at 768px is still a touch device.
  nav: {
    pad: "px-4 py-2 min-h-11",
    text: "text-sm font-medium",
    shadow: "",
  },
  // Full-width form submit. The minimum target height, not a visual choice.
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
  /** Squash and wobble strength. Lower on small controls. */
  intensity?: number;
  /** Trailing arrow that slides away from the label on hover. */
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

/**
 * Resolves the visual language once for both the button and the link rendering.
 */
function useButtonSurface({
  children,
  tone = "solid",
  size = "hero",
  intensity,
  withArrow = false,
  className = "",
  disabled = false,
  ref: refProp,
}: SharedProps & {
  disabled?: boolean;
  ref?: RefObject<HTMLElement | null>;
}) {
  const config = SIZE[size];
  const { handlers } = useJiggle<HTMLElement>({
    ref: refProp,
    disabled,
    intensity: intensity ?? (size === "nav" ? 0.45 : 1.1),
  });

  const base =
    "relative inline-flex cursor-pointer select-none items-center justify-center overflow-hidden " +
    "rounded-full tracking-tight outline-none will-change-transform " +
    "[touch-action:manipulation] " +
    "focus-visible:ring-2 focus-visible:ring-[var(--rl-accent-text)] focus-visible:ring-offset-2 " +
    "focus-visible:ring-offset-[var(--rl-ink)] " +
    "disabled:cursor-not-allowed " +
    `${config.pad} ${config.text} ${config.shadow} ${className}`;

  /*
    Three surfaces.
      solid   Coral Flame fill. The label is --rl-ink: navy on flame is 4.8:1
              on sand, near-black on flame is 6.3:1 on the dark base.
      glass   The hero's own treatment: translucent fill over a heavy blur, a
              bright outer edge, and a dimmer inner edge one pixel in. That
              inner line is what reads as a lens rather than a tinted
              rectangle. The fill follows the active ground, so the same
              component refracts sand, reef and forest.
      outline Transparent with a hairline. Secondary actions.

    Disabled is a fourth surface rather than an opacity, because a half-faded
    accent still reads as live and a dead CTA that looks live is worse than one
    that looks off. Flat ink surface, muted label, no glow.
  */
  const surface: React.CSSProperties =
    disabled
      ? {
          border: "1px solid var(--rl-line)",
          background: "var(--rl-ink)",
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

  const labelTone =
    tone === "solid" ? "text-[var(--rl-on-accent)]" : "text-[var(--rl-text)]";

  const content = (
    <>
      {tone === "glass" && !disabled ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-[1px] rounded-[inherit]"
          style={{ border: "1px solid var(--rl-glass-edge)" }}
        />
      ) : null}

      <span
        className={`group relative z-10 inline-flex items-center gap-2.5 ${
          disabled ? "text-[var(--rl-mute)]" : labelTone
        }`}
      >
        {children}

        {withArrow ? (
          <svg
            className="shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transition-none"
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
    </>
  );

  // No hover or press feedback while disabled, so a dead button cannot invite a
  // tap.
  const hover = disabled
    ? ""
    : tone === "solid"
      ? "hover:brightness-1.08"
      : tone === "glass"
        ? "hover:bg-[rgb(255_255_255_/_0.2)]"
        : "hover:border-[var(--rl-accent-text)] hover:text-[var(--rl-accent-text)]";

  const press = disabled ? "" : "active:scale-[0.98]";

  return {
    handlers,
    className: `${base} ${hover} ${press}`.replace(/\s+/g, " "),
    surface,
    content,
  };
}

/**
 * The call to action, as a real button.
 *
 * Given an `href` it renders a `next/link` instead, so the same component
 * serves both without a wrapper that would break one-focusable-per-item and
 * force a full page load.
 */
const JigglyButton = forwardRef<HTMLButtonElement, JigglyButtonProps>(
  function JigglyButton(
    {
      children,
      tone = "solid",
      size = "hero",
      intensity,
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
    // Owned here and handed to the hook, so nothing reads `ref.current` while
    // rendering. The hook writes to it from effects and event handlers only.
    const jiggleRef = useRef<HTMLElement>(null);

    const surface = useButtonSurface({
      children,
      tone,
      size,
      intensity,
      withArrow,
      className,
      disabled,
      ref: jiggleRef,
    });

    const merged: React.CSSProperties = { ...surface.surface, ...style };

    // The caller's handler runs first, then the jelly, which is the order this
    // control has always used.
    const jelly = {
      onPointerEnter: (event: React.PointerEvent<HTMLElement>) => {
        onPointerEnter?.(event as never);
        surface.handlers.onPointerEnter(event);
      },
      onPointerDown: (event: React.PointerEvent<HTMLElement>) => {
        onPointerDown?.(event as never);
        surface.handlers.onPointerDown(event);
      },
      onPointerUp: (event: React.PointerEvent<HTMLElement>) => {
        onPointerUp?.(event as never);
        surface.handlers.onPointerUp();
      },
      onPointerLeave: (event: React.PointerEvent<HTMLElement>) => {
        onPointerLeave?.(event as never);
        surface.handlers.onPointerLeave();
      },
      onPointerCancel: (event: React.PointerEvent<HTMLElement>) => {
        onPointerCancel?.(event as never);
        surface.handlers.onPointerCancel();
      },
      onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
        onKeyDown?.(event as never);
        surface.handlers.onKeyDown(event);
      },
      onKeyUp: (event: React.KeyboardEvent<HTMLElement>) => {
        onKeyUp?.(event as never);
        surface.handlers.onKeyUp();
      },
      onBlur: (event: React.FocusEvent<HTMLElement>) => {
        onBlur?.(event as never);
        surface.handlers.onBlur();
      },
    };

    if (href) {
      /* `rest` is typed as button attributes because the two renderings share
         one prop surface. Nothing button-only is ever set by a caller using
         href, so this is a widening of the declared type, not a change of
         behaviour. */
      const linkProps = rest as Omit<
        React.AnchorHTMLAttributes<HTMLAnchorElement>,
        "className" | "children"
      >;

      return (
        <Link
          {...linkProps}
          {...jelly}
          href={href}
          ref={jiggleRef as RefObject<HTMLAnchorElement | null>}
          style={merged}
          className={surface.className}
        >
          {surface.content}
        </Link>
      );
    }

    return (
      <button
        {...rest}
        {...jelly}
        ref={(node: HTMLButtonElement | null) => {
          // Written in a callback, never read during render.
          jiggleRef.current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        type={type}
        disabled={disabled}
        style={merged}
        className={surface.className}
      >
        {surface.content}
      </button>
    );
  },
);

export default JigglyButton;
