"use client";

import { Camera, Users, Share2 } from "lucide-react";
import { rlFonts } from "@/lib/roamlyFonts";

import "@/styles/roamly.css";

const ICON_SIZE = 18;

interface SocialLink {
  id: string;
  /** Accessible name. Doubles as the tooltip and the row's own text. */
  label: string;
  href: string;
  icon: React.ReactNode;
}

/**
 * Lucide ships no brand marks for social platforms, and SKILL section 9.E
 * forbids hand-rolling icon paths. These three carry the medium rather than
 * the brand: a camera for Instagram, a crowd for Facebook, a share node for X.
 * The platform is named in the accessible name and in the tooltip, so the
 * meaning does not depend on recognising a glyph.
 */
const LINKS: SocialLink[] = [
  {
    id: "instagram",
    label: "Instagram",
    href: "https://instagram.com/roamlytours",
    icon: <Camera style={{ width: ICON_SIZE, height: ICON_SIZE }} strokeWidth={1.5} />,
  },
  {
    id: "facebook",
    label: "Facebook",
    href: "https://facebook.com/roamlytours",
    icon: <Users style={{ width: ICON_SIZE, height: ICON_SIZE }} strokeWidth={1.5} />,
  },
  {
    id: "x",
    label: "X",
    href: "https://x.com/roamlytours",
    icon: <Share2 style={{ width: ICON_SIZE, height: ICON_SIZE }} strokeWidth={1.5} />,
  },
];

/**
 * A quiet row of social links.
 *
 * Deliberately small: this is a secondary path, not a section that competes
 * with the contact CTA above it. Icons only, with the platform name carried
 * by `aria-label` rather than printed, so the row reads as one quiet strip
 * instead of three competing cards.
 */
export default function SocialLinks() {
  return (
    <nav aria-label="Social media" className={`rl-root text-center ${rlFonts}`}>
      <h2 className="rl-label text-[var(--rl-mute)]">Follow the journey</h2>

      <ul className="mt-4 flex items-center justify-center gap-3">
        {LINKS.map((link) => (
          <li key={link.id}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              title={link.label}
              aria-label={`${link.label} (opens in a new tab)`}
              className="grid h-11 w-11 place-items-center rounded-full border border-[var(--rl-line-strong)] text-[var(--rl-mute)] transition-[color,border-color,background-color] duration-200 hover:border-[var(--rl-accent-text)] hover:bg-[color-mix(in_srgb,var(--rl-accent)_12%,transparent)] hover:text-[var(--rl-accent-text)]"
            >
              {link.icon}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
