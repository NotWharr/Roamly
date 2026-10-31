import type { Metadata, Viewport } from "next";
import SmoothScroll from "@/components/providers/SmoothScroll";
import { rlFonts } from "@/lib/roamlyFonts";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#06262C",
};

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
    images: [{ url: "/og-card.webp", width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${rlFonts} h-full antialiased`}>
      <body className="relative min-h-full bg-[var(--rl-ink)] text-[var(--rl-text)]">
        <SmoothScroll>
          <div className="relative z-10 flex min-h-full flex-col">{children}</div>
        </SmoothScroll>
      </body>
    </html>
  );
}
