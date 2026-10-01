/**
 * The gallery set.
 *
 * One list, read by both the home page strip and the full gallery page, so the
 * two cannot show different photographs.
 *
 * `title` is the short visible label. `alt` is written separately on purpose:
 * alt text is read aloud to someone who cannot see the page, so it has to say
 * what is in the photograph and where it was, which a two-word label does not
 * do. Reusing `title` as `alt` was the pattern before, and it produced
 * announcements like "Tropical Shoreline Aerial", which tells a screen-reader
 * user nothing.
 *
 * `ratio` is deliberately mixed. A uniform grid of identical tiles is the
 * default everyone reaches for and it reads as a spreadsheet; the variation is
 * what makes a strip look like a selection of photographs.
 */

export interface GalleryFrame {
  id: number;
  /** Short visible caption. */
  title: string;
  /**
   * Describes the photograph for someone who cannot see it. What is in the
   * frame, then where it is, in that order.
   */
  alt: string;
  url: string;
  ratio: string;
  /** Where it was shot, in a few words. Shown on the full gallery only. */
  place: string;
}

export const GALLERY: GalleryFrame[] = [
  {
    id: 1,
    title: "The west sand flats",
    alt: "Aerial view of Grenada's west coast, pale sand flats meeting shallow turquoise water",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    ratio: "aspect-[4/5]",
    place: "West coast",
  },
  {
    id: 2,
    title: "Seven Sisters",
    alt: "A tall waterfall falling into a turquoise pool in the forest, Seven Sisters Falls",
    url: "https://images.unsplash.com/photo-1620658927695-c33df6fb8130?auto=format&fit=crop&w=800&q=80",
    ratio: "aspect-[3/4]",
    place: "Interior trail",
  },
  {
    id: 3,
    title: "Reef life",
    alt: "A snorkeller above a shallow coral reef in clear Caribbean water",
    url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    ratio: "aspect-square",
    place: "West sand flats",
  },
  {
    id: 4,
    title: "Grand Anse",
    alt: "Palm-lined beach at Grand Anse curving away into calm turquoise water",
    url: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80",
    ratio: "aspect-[4/5]",
    place: "Grand Anse",
  },
  {
    id: 5,
    title: "The north coast",
    alt: "Turquoise water meeting a rocky, tree-covered headland on the north coast",
    url: "https://images.unsplash.com/photo-1759082105473-34256c35ad0b?auto=format&fit=crop&w=800&q=80",
    ratio: "aspect-[3/4]",
    place: "North coast",
  },
  {
    id: 6,
    title: "Off the leeward coast",
    alt: "A sailboat on open blue water off the leeward coast",
    url: "https://images.unsplash.com/photo-1789419797258-94e8519d72c1?auto=format&fit=crop&w=800&q=80",
    ratio: "aspect-square",
    place: "Open sea",
  },
  {
    id: 7,
    title: "Grand Etang canopy",
    alt: "Dense rainforest canopy seen from directly above, Grand Etang",
    url: "https://images.unsplash.com/photo-1697350978674-4b40261b0dc3?auto=format&fit=crop&w=800&q=80",
    ratio: "aspect-[4/5]",
    place: "Grand Etang",
  },
  {
    id: 8,
    title: "Carriacou water",
    alt: "Turquoise Caribbean waves breaking over reef flat water off Carriacou",
    url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80",
    ratio: "aspect-[3/4]",
    place: "Carriacou",
  },
  {
    id: 9,
    title: "Below the surface",
    alt: "Soft corals and orange fish on the reef wall below the surface",
    url: "https://images.unsplash.com/photo-1651871756929-09d7bde4e97d?auto=format&fit=crop&w=800&q=80",
    ratio: "aspect-square",
    place: "West sand flats",
  },
];