"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const ARROW_ICON = 16;

interface BackLinkProps {
  href: string;
  children: React.ReactNode;
}

/**
 * The floating back link on a sub-page.
 *
 * Glass, not the accent: this is a way out of the page, not the thing the page
 * wants you to do. The hero's glass is the material a control of this weight
 * should be made of, so it reads as part of the same system.
 */

/**
 * The floating back link on a sub-page.
 *
 * A small glass pill pinned to the top of the viewport, matching the material
 * the site navbar is made from so a sub-page does not feel like a different
 * site. Used by both `/contact` and `/terms` rather than being written twice,
 * which is what previously let the two drift apart.
 *
 * Fixed, so the page needs enough top padding to clear it.
 */
export default function BackLink({ href, children }: BackLinkProps) {
  return (
    <Link
      href={href}
      className="rl-root fixed left-1/2 top-6 z-50 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border px-4 py-3 text-sm font-semibold text-[var(--rl-text)] transition-colors duration-200"
      style={{
        zIndex: "var(--rl-z-nav)",
        border: "1px solid var(--rl-glass-border)",
        background: "var(--rl-glass-fill)",
        backdropFilter: "var(--rl-glass-blur)",
        WebkitBackdropFilter: "var(--rl-glass-blur)",
        boxShadow: "0 14px 34px -18px rgb(4 20 26 / 0.8)",
      }}
    >
      <ArrowLeft
        style={{ width: ARROW_ICON, height: ARROW_ICON }}
        strokeWidth={1.5}
        aria-hidden="true"
      />
      {children}
    </Link>
  );
}
