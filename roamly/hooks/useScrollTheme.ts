"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface SectionTheme {
  id: string;
  bg: string;
  text: string;
}

const SECTION_THEMES: SectionTheme[] = [
  { id: "home", bg: "#020617", text: "#f8fafc" },
  { id: "explore", bg: "#020617", text: "#f8fafc" },
  { id: "gallery", bg: "#020617", text: "#f8fafc" },
  { id: "faq", bg: "#020617", text: "#f8fafc" },
  { id: "contact", bg: "#020617", text: "#f8fafc" },
];

export function useScrollTheme() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      SECTION_THEMES.forEach(({ id, text }) => {
        const section = document.getElementById(id);
        if (!section) return;

        ScrollTrigger.create({
          trigger: section,
          start: "top 50%",
          end: "bottom 50%",
          onEnter: () => updateTheme(text),
          onEnterBack: () => updateTheme(text),
        });
      });
    });

    function updateTheme(text: string) {
      gsap.to("html", {
        "--page-text": text,
        duration: 0.6,
        ease: "power2.out",
        overwrite: "auto",
      });
    }

    return () => ctx.revert();
  }, []);
}
