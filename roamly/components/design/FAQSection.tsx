"use client";

import { useState } from "react";

import FAQItem, { type FAQEntry } from "@/components/design/FAQItem";
import JigglyButton from "@/components/ui/JigglyButton";
import { rlFonts } from "@/lib/roamlyFonts";

/**
 * Answers written for people actually booking a Grenada excursion.
 *
 * The old copy was "what is included in each package" answered generically.
 * These answer the questions a visitor to this island actually has: how wet it
 * is, whether the reef is safe, how far the boat is, and what happens to the
 * money if the sea is flat.
 */
const faqData: FAQEntry[] = [
  {
    id: 1,
    question: "What does a tour day include?",
    answer:
      "Your guide, transport from your hotel or a point in St George's, park and entry fees, water, and lunch on the inland days. Snorkelling gear, boots and walking poles come out of the same boat. Anything not included is listed on the tour before you book rather than on the day.",
  },
  {
    id: 2,
    question: "How wet or rough are the trails?",
    answer:
      "Wet. That is the short answer. The interior trails hold mud after rain even when the forecast is clear, and the walk into Grand Etang climbs for most of its length. Every guide walks the route before the day and will tell you honestly whether it suits your group, and you can turn around without losing the fee.",
  },
  {
    id: 3,
    question: "Is the reef safe to snorkel and dive?",
    answer:
      "The west sand flats are sheltered and the visibility is usually excellent, which is why we snorkel there rather than off the exposed south coast. We go in with a reef guide, we brief you on the current first, and we do not enter the water when the swell is running.",
  },
  {
    id: 4,
    question: "Do you cook for dietary needs?",
    answer:
      "Vegetarian and vegan on every tour, and gluten-free where the kitchen can manage it. Put it in the booking notes and the cook knows before the morning rather than the afternoon.",
  },
  {
    id: 5,
    question: "What if the weather turns?",
    answer:
      "Guides move the day, shorten it, or swap an inland stop for a boat trip, and you are told before you leave the hotel rather than at the trailhead. If we cancel outright you get the full amount back.",
  },
  {
    id: 6,
    question: "How do cancellations work?",
    answer:
      "Free up to 24 hours before your start time, in full. Inside 24 hours the cost is already committed, because the guide and the boat are booked against your booking. Weather reschedules are moved rather than charged.",
  },
];

export default function FAQSection() {
  const [openId, setOpenId] = useState<number | null>(1);

  return (
    <>
      <section
        id="faq"
        className={`rl-root rl-on-ink rl-theme rl-theme-forest rl-section-y rl-pad-x rl-z-content relative ${rlFonts}`}
      >
        {/* Mobile order: heading, questions, action. Desktop: heading + action pinned left. */}
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-12 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-5 lg:row-start-1">
            <h2 className="rl-display rl-h2">Before you book.</h2>
            <p className="mt-6 max-w-[38ch] text-base leading-relaxed text-[var(--rl-mute)]">
              The six questions people ask us most, answered honestly. If yours
              is not here, ask it and we will tell you straight.
            </p>
          </div>

          <div className="lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1">
            {faqData.map((entry) => (
              <FAQItem
                key={entry.id}
                entry={entry}
                isOpen={openId === entry.id}
                onToggle={() =>
                  setOpenId((prev) => (prev === entry.id ? null : entry.id))
                }
              />
            ))}
          </div>

          <div className="lg:col-span-5 lg:row-start-2 lg:self-end">
            {/* The arrow comes from withArrow. Passing an icon as a child too
                would draw two of them. */}
            <JigglyButton href="/contact" size="block" withArrow className="w-full sm:w-auto">
              Ask us something
            </JigglyButton>
          </div>
        </div>
      </section>
    </>
  );
}
