"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";

import WaterSurface from "@/components/ui/WaterSurface";

// Unsplash, Romello Williams: https://unsplash.com/photos/k-rigx00brA
const REEF = { src: "/hero-reef.webp", width: 2400, height: 1600 };

interface PageBannerProps {
  backHref: string;
  backLabel: string;
  title: string;
  children?: ReactNode;
  /** No ripple. For pages where someone is reading terms or paying. */
  still?: boolean;
}

/**
 * The top of every sub-page: the same water as the home page, cut short.
 * Carries only the wordmark and one way back, because the site navbar's other
 * destinations are noise on a focused task page.
 */
export default function PageBanner({
  backHref,
  backLabel,
  title,
  children,
  still = false,
}: PageBannerProps) {
  return (
    <header className="rl-on-water relative isolate overflow-hidden bg-[var(--rl-sea)] text-white">
      <WaterSurface wide={REEF} alt="" priority still={still} />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[rgb(6_38_44/0.56)]"
      />

      <div className="mx-auto flex h-[72px] w-full max-w-[1400px] items-center justify-between gap-6 px-[var(--rl-gutter)]">
        <Link href="/" className="rl-display text-[1.6rem] leading-none tracking-[-0.05em]">
          Roamly
        </Link>
        <Link
          href={backHref}
          className="inline-flex min-h-11 items-center gap-2 text-sm font-medium underline decoration-white/50 underline-offset-[6px] hover:decoration-white"
        >
          <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
          {backLabel}
        </Link>
      </div>

      <div className="mx-auto w-full max-w-[1400px] px-[var(--rl-gutter)] pb-[clamp(40px,7vh,72px)] pt-[clamp(48px,11vh,112px)]">
        <h1 className="rl-display max-w-[16ch] text-[clamp(2.75rem,7vw,6.5rem)] tracking-[-0.05em] leading-[0.98]">
          {title}
        </h1>
        {children ? (
          <div className="mt-5 max-w-[52ch] text-base leading-relaxed sm:text-lg">{children}</div>
        ) : null}
      </div>
    </header>
  );
}
