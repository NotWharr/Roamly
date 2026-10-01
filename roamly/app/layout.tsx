import type { Metadata } from "next";
import { Geist } from "next/font/google";
import SmoothScroll from "@/components/providers/SmoothScroll";
import "./globals.css";

/* Geist Sans only. Geist Mono was being loaded and its variable applied on every
   page, and nothing anywhere reads var(--font-geist-mono) or the font-mono
   utility. That was 31KB of woff2 downloaded and parsed for no rendered
   character. Tabular figures come from font-variant-numeric on the existing
   sans, so the numbers that relied on lining up still do. */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://roamlytours.com"),
  title: {
    default: "Roamly | Guided tours of Grenada",
    template: "%s | Roamly Grenada",
  },
  description:
    "Small-group guided days out of St George's into Grand Etang, Annandale Falls and the west sand flats. Rainforest, reef and cocoa, with guides who live here.",
  keywords: [
    "Grenada tours",
    "Grand Etang",
    "Annandale Falls",
    "snorkelling Grenada",
    "Grenada excursions",
    "Carriacou day trip",
  ],
  openGraph: {
    type: "website",
    siteName: "Roamly",
    title: "Roamly | Guided tours of Grenada",
    description:
      "Guided days out of St George's into Grand Etang and the west sand flats. Small groups, local guides, no coach queues.",
    /* og-card.webp is the same frame as the hero, cut to 1200x630 for the
       preview card. The 5.5MB 6000x4000 original is over the size most social
       scrapers accept, so it was being dropped. 22KB renders everywhere. */
    images: [{ url: "/og-card.webp", width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="relative min-h-full flex flex-col">
        <SmoothScroll>
          <div className="relative z-10 flex min-h-full flex-col">{children}</div>
        </SmoothScroll>
      </body>
    </html>
  );
}
