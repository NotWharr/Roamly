import { Bricolage_Grotesque, Figtree } from "next/font/google";

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

/** Put on the root element of each redesigned section (variables are scoped, never global). */
export const rlFonts = `${display.variable} ${text.variable}`;
