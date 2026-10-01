/**
 * The excursions on sale.
 *
 * One source of truth, read by the booking sheet and the booking page so the
 * two cannot quote different prices for the same trip.
 *
 * `id` is part of the `/booking` URL, so treat these as permanent once a real
 * link has been shared.
 */

export interface Tour {
  id: number;
  name: string;
  /** Per person, in US dollars. */
  price: number;
  duration: string;
  /** One line on what the day actually involves. */
  blurb: string;
}

export const TOURS: Tour[] = [
  {
    id: 1,
    name: "Summit Sunrise",
    price: 299,
    duration: "3 days, 2 nights",
    blurb: "Up into the cloud forest before first light, then down the eastern coast.",
  },
  {
    id: 2,
    name: "Hidden Falls",
    price: 149,
    duration: "Full day",
    blurb: "A short walk in from the trailhead to three sets of falls you can swim at.",
  },
  {
    id: 3,
    name: "Reef Explorer",
    price: 119,
    duration: "Half day",
    blurb: "Two snorkel stops on the western sand flats, with the reef guide alongside.",
  },
];

export const DEFAULT_TOUR_ID = 1;

/**
 * Largest group one booking can take.
 *
 * This is the ceiling the stepper stops at, so a group that cannot be run on a
 * single excursion cannot be picked here. Raise it only once a guide can
 * actually take that many people out.
 */
export const MAX_GUESTS = 6;

export function findTour(id: number | null | undefined): Tour {
  return TOURS.find((tour) => tour.id === id) ?? TOURS[0];
}
