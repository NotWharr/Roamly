"use client";

import { useState } from "react";

import FAQItem, { type FAQEntry } from "@/components/design/FAQItem";
import AnimatedText from "@/components/ui/AnimatedText";
import JigglyButton from "@/components/ui/JigglyButton";

/**
 * Answers written for people actually booking a Grenada excursion.
 *
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
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="border-t border-[var(--rl-line)] bg-[var(--rl-ink)] pb-[var(--rl-section-y)] pt-[calc(var(--rl-section-y)*0.7)]"
    >
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-x-12 gap-y-12 px-[var(--rl-gutter)] lg:grid-cols-12">
        <div className="lg:col-span-4">
          <AnimatedText
            as="h2"
            id="faq-title"
            mode="lines"
            className="rl-display max-w-[10ch] text-[clamp(2.75rem,6vw,5.5rem)] tracking-[-0.05em] leading-[0.98]"
          >
            Before you book.
          </AnimatedText>

          <AnimatedText
            as="p"
            mode="lines"
            delay={0.1}
            className="mt-5 max-w-[36ch] text-base leading-relaxed text-[var(--rl-mute)]"
          >
            The six questions people ask us most, answered honestly. If yours is
            not here, ask it and we will tell you straight.
          </AnimatedText>

          <JigglyButton
            href="/contact"
            tone="outline"
            size="block"
            withArrow
            className="mt-8 w-full sm:w-auto"
          >
            Contact us
          </JigglyButton>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
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
      </div>
    </section>
  );
}
