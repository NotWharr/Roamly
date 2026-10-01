"use client";

import Image from "next/image";
import { Check } from "lucide-react";

import type { Tour } from "@/lib/tours";

/** Photography per excursion. Real images, not placeholders. */
export const TOUR_IMAGES: Record<number, { src: string; alt: string }> = {
  1: {
    src: "https://images.unsplash.com/photo-1559908979-fcc7e044b600?auto=format&fit=crop&w=1400&q=85",
    alt: "The sun rising over a volcanic ridge on the Summit Sunrise tour",
  },
  2: {
    src: "https://images.unsplash.com/photo-1444290679983-dd3aabf671ec?auto=format&fit=crop&w=1400&q=85",
    alt: "A wide cascade running over rock in the rainforest on the Hidden Falls tour",
  },
  3: {
    src: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1400&q=85",
    alt: "Coral reef and small fish under clear water",
  },
};

const CHECK_ICON = 16;

interface TourCardProps {
  tour: Tour;
  selected: boolean;
  /** Pulls up to three to the same height so the row reads as one band. */
  priority?: boolean;
  onSelect: (id: number) => void;
}

/**
 * One excursion as a selectable card.
 *
 * A real radio underneath, so the choice is announced, reachable by arrow
 * keys, and grouped by the fieldset. Everything visible is the label, so there
 * is no button inside a label and nothing to click twice.
 *
 * Selected state is a hairline plus a check, not a fill. At this size a fill
 * would swamp the photograph, and the check is the thing a screen reader
 * announces anyway.
 */
export default function TourCard({
  tour,
  selected,
  priority = false,
  onSelect,
}: TourCardProps) {
  const image = TOUR_IMAGES[tour.id];

  return (
    <label className="bk-card">
      <input
        type="radio"
        name="booking-tour"
        value={tour.id}
        checked={selected}
        onChange={() => onSelect(tour.id)}
        className="rl-radio sr-only"
      />

      <span className="bk-card-media">
        {image ? (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 78vw"
            className="object-cover"
          />
        ) : null}

        {/* Scrim so the price below stays legible on any photograph. */}
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[rgb(4_14_18_/_0.92)] via-[rgb(4_14_18_/_0.18)] to-transparent"
        />

        <span className="bk-card-body">
          <span className="bk-card-name">{tour.name}</span>
          <span className="bk-card-meta">{tour.duration}</span>
        </span>

        <span className="bk-card-price">
          ${tour.price}
          <span className="bk-card-per">each</span>
        </span>

        {selected ? (
          <span className="bk-card-check" aria-hidden="true">
            <Check style={{ width: CHECK_ICON, height: CHECK_ICON }} strokeWidth={2.5} />
          </span>
        ) : null}
      </span>
    </label>
  );
}
