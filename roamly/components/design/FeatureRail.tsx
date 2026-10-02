"use client";

import { useRef, useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { rlFonts } from '@/lib/roamlyFonts'
import '@/components/providers/feature-rail.css'

if (typeof window !== 'undefined') {
  // Only CustomEase now. ScrollTrigger was registered here for the image
  // reveal, and that reveal is gone, so it is no longer imported or needed.
  gsap.registerPlugin(CustomEase)
  CustomEase.create('railPunch', 'M0,0 C0.3,0.9 0.1,1 1,1')
}

export type Chapter = {
  id: string
  num: string
  title: string
  headline: string
  text: string
  image: {
    src: string
    alt: string
  }
}

export type FeatureRailProps = {
  collectionTitle?: string
  chapters: Chapter[]
  className?: string
}

export default function FeatureRail({
  collectionTitle = 'Explore Grenada',
  chapters,
  className = '',
}: FeatureRailProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLElement>(null)
  const indicatorRef = useRef<HTMLDivElement>(null)
  const linksRef = useRef<(HTMLButtonElement | null)[]>([])
  const contentRefs = useRef<(HTMLElement | null)[]>([])

  const [activeIndex, setActiveIndex] = useState(0)

  // Update hairline indicator position and size to match the active nav link
  const updateIndicator = useCallback((index: number, immediate = false) => {
    const rail = railRef.current
    const indicator = indicatorRef.current
    const activeLink = linksRef.current[index]

    if (!rail || !indicator || !activeLink) return

    const isMobile = window.innerWidth < 768

    const targetTop = activeLink.offsetTop
    const targetHeight = activeLink.offsetHeight
    const targetLeft = activeLink.offsetLeft
    const targetWidth = activeLink.offsetWidth

    gsap.killTweensOf(indicator)

    if (isMobile) {
      gsap.to(indicator, {
        x: targetLeft,
        y: 0,
        width: targetWidth,
        height: 2,
        duration: immediate ? 0 : 0.4,
        ease: 'railPunch',
        overwrite: 'auto',
      })
    } else {
      gsap.to(indicator, {
        x: 0,
        y: targetTop,
        width: 2,
        height: targetHeight,
        duration: immediate ? 0 : 0.4,
        ease: 'railPunch',
        overwrite: 'auto',
      })
    }
  }, [])

  /**
   * Scroll spy, as an IntersectionObserver.
   *
   * This was a `window.addEventListener("scroll")` handler running
   * getBoundingClientRect on every chapter on every scroll frame, which
   * SKILL 5.D bans outright. The observer gives the same answer, picks the
   * chapter closest to the upper third, and does no work while the section is
   * off screen.
   */
  useEffect(() => {
    const sections = contentRefs.current.filter(
      (el): el is HTMLDivElement => Boolean(el),
    );
    if (!sections.length) return;

    const ratios = new Map<number, number>();

    const pick = () => {
      let bestIndex = activeIndex;
      let bestRatio = -1;

      ratios.forEach((ratio, index) => {
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestIndex = index;
        }
      });

      if (bestIndex !== activeIndex) {
        setActiveIndex(bestIndex);
        updateIndicator(bestIndex);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const index = sections.indexOf(
            entry.target as HTMLDivElement,
          );
          if (index === -1) continue;
          if (entry.isIntersecting) {
            ratios.set(index, entry.intersectionRatio);
          } else {
            ratios.delete(index);
          }
        }
        pick();
      },
      { threshold: [0, 0.15, 0.3, 0.5, 0.75, 1], rootMargin: "-20% 0px -40% 0px" },
    );

    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, [activeIndex, updateIndicator]);

  useEffect(() => {
    updateIndicator(0, true)

    const handleResize = () => updateIndicator(activeIndex, true)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [activeIndex, updateIndicator])

  const handleChapterClick = (index: number) => {
    const targetSection = contentRefs.current[index]
    if (!targetSection) return

    setActiveIndex(index)
    updateIndicator(index)

    // Offset by the sticky rail + navbar clearance, so the chapter heading
    // does not land under the bar. Uses the live token rather than a hard
    // number: the bar is 88px sticky top + ~46px itself on phones.
    const clearance =
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--rl-nav-clearance"
        )
      ) || 96;
    const topOffset =
      targetSection.getBoundingClientRect().top + window.scrollY - clearance - 56;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: topOffset, behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <div
      ref={containerRef}
      /* The navbar's "Explore" item points at #explore. There was no element
         with that id anywhere on the page, so the link scrolled nowhere. */
      id="explore"
      /* Explicit ground, not inherited. This section was transparent over a
         fixed photo texture, so it sampled as almost-but-not-quite flat ink.
         It now paints --rl-ink itself. */
      className={`rl-root rl-on-ink rl-theme rl-theme-sand fr_container ${rlFonts} ${className}`.trim()}
    >
      <div className="fr_layout">
        <aside className="fr_rail_wrapper">
          <nav ref={railRef} className="fr_rail" aria-label="Chapter Navigation">
            <div className="fr_collection_title">{collectionTitle}</div>
            <div ref={indicatorRef} className="fr_indicator" aria-hidden="true" />
            <div className="fr_links">
              {chapters.map((chap, idx) => (
                <button
                  key={chap.id}
                  ref={(el) => {
                    linksRef.current[idx] = el
                  }}
                  type="button"
                  className={`fr_link ${activeIndex === idx ? 'is-active' : ''}`}
                  onClick={() => handleChapterClick(idx)}
                >
                  <span className="fr_link_num">{chap.num}</span>
                  <span className="fr_link_text">{chap.title}</span>
                </button>
              ))}
            </div>
          </nav>
        </aside>

        <div className="fr_content">
          {chapters.map((chap, idx) => (
            <section
              key={chap.id}
              ref={(el) => {
                contentRefs.current[idx] = el
              }}
              className="fr_chapter"
            >
              <div className="fr_chapter_header">
                <h2 className="fr_headline">{chap.headline}</h2>
                <p className="fr_text">{chap.text}</p>
              </div>

              <div className="fr_image_wrapper">
                {/* next/image rather than a raw img: these are remote Unsplash
                    URLs at 1400px wide, and a bare img ships the full file to
                    every viewport including phones. The wrapper already sets an
                    aspect ratio, so fill + sizes needs no layout shift. */}
                <Image
                  src={chap.image.src}
                  alt={chap.image.alt}
                  fill
                  sizes="(max-width: 768px) 92vw, 860px"
                  className="fr_image"
                />
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
