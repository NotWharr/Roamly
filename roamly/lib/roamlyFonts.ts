import { Bricolage_Grotesque, Figtree } from "next/font/google";

/* Self-hosted through next/font and exposed as --font-rl-* CSS variables. */
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-rl-display",
  display: "swap",
});

const text = Figtree({
  subsets: ["latin"],
  variable: "--font-rl-text",
  display: "swap",
});

export const rlFonts = `${display.variable} ${text.variable}`;
