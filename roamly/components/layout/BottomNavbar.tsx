"use client";

import { useState, useEffect, useRef, useId } from "react";
import Link from "next/link";
import Image from "next/image";
import BookingModal from "@/components/ui/booking/BookingModal";
import JigglyButton from "@/components/ui/JigglyButton";
import { gsap } from "gsap";

/**
 * Contact is a route rather than an in-page anchor, so it navigates rather
 * than jumping down the page.
 */
const CONTACT_ITEM = { name: "Contact", href: "/contact" };

const navItems = [
  { name: "Explore", href: "#explore" },
  { name: "Gallery", href: "#gallery" },
  CONTACT_ITEM,
  /* The sheet is opened by the click handler, so this href is only ever
     reached without JS. It points at the real page rather than the #booking
     anchor that has never existed on this page. */
  { name: "Booking", href: "/booking" },
];

/** Image slot inside the mobile menu panel */
const FEATURED = {
  href: "/booking",
  /* A 5.5MB full-screen aerial was being served as a 300px card thumbnail. This
     is the same frame, cut down to card size. The full-size original is still
     the hero's WebGL texture, which does need the resolution. */
  src: "/menu-card.webp",
  /* Alt describes the photograph. "Discover Hidden Destinations" was neither an
     accurate description nor copy worth reading. */
  alt: "An aerial view of Grenada's coastline and the shallow water along it",
  title: "Pick a day on the island",
  eyebrow: "Three excursions",
};

/* ---------- Tuning constants ---------- */
const EDGE = 24; // distance from viewport top
const R_OPEN = 30; // corner radius of the expanded mobile menu
const HIDDEN_Y = 115; // menu letters wait this far (%) below their clip box

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (t: number) => Math.max(0, Math.min(1, t));

/**
 * Letter-by-letter text that cascades in and rolls on hover.
 */
function RollText({ text }: { text: string }) {
  return (
    <span aria-hidden="true" className="inline-flex">
      {[...text].map((ch, i) => {
        const glyph = ch === " " ? "\u00A0" : ch;
        return (
          <span key={i} className="inline-block overflow-hidden align-bottom leading-[1.2]">
            <span data-letter className="block will-change-transform">
              <span
                className="relative block transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] group-hover:-translate-y-full group-focus-visible:-translate-y-full motion-reduce:transition-none"
                style={{ transitionDelay: `${i * 22}ms` }}
              >
                <span className="block">{glyph}</span>
                <span className="absolute left-0 top-full block">{glyph}</span>
              </span>
            </span>
          </span>
        );
      })}
    </span>
  );
}

export default function BottomNavbar({
  spring = 0.19,
  damping = 0.7,
}: {
  spring?: number;
  damping?: number;
}) {
  const [activeTab, setActiveTab] = useState("Explore");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const contentId = useId();

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const desktopListRef = useRef<HTMLUListElement | null>(null);

  // Animation state for mobile menu morphing
  const anim = useRef({ h: 0, w: 0 });
  const menuOpenRef = useRef(false);
  const menuTlRef = useRef<gsap.core.Timeline | null>(null);
  const setMenuRef = useRef<((next: boolean, instant?: boolean) => void) | null>(null);

  // Spring physics state per desktop nav item
  const itemStates = useRef<Array<{ value: number; velocity: number }>>(
    navItems.map(() => ({ value: 0, velocity: 0 }))
  );
  const hoveredIndex = useRef<number | null>(null);
  const focusedIndex = useRef<number | null>(null);
  const rafId = useRef<number | null>(null);

  // Direct Hover Spring Animation Loop for Desktop Nav Items
  useEffect(() => {
    const listEl = desktopListRef.current;
    if (!listEl) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const loop = () => {
      const items = Array.from(listEl.children) as HTMLElement[];

      items.forEach((_, idx) => {
        const state = itemStates.current[idx];
        if (!state) return;

        const isHovered = hoveredIndex.current === idx;
        const isFocused = focusedIndex.current === idx;
        const targetInfluence = isHovered || isFocused ? 1 : 0;

        // Spring integration
        state.velocity += (targetInfluence - state.value) * spring;
        state.velocity *= damping;
        state.value += state.velocity;

        const itemEl = items[idx];
        if (itemEl) {
          const ty = state.value * 3.5;
          const scale = 1 + state.value * 0.05;
          itemEl.style.transform = `translateY(${ty}px) scale(${scale})`;
        }
      });

      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [spring, damping]);

  useEffect(() => {
    const nav = navRef.current;
    const content = contentRef.current;
    if (!nav || !content) return;

    const st = anim.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let m = {
      navH: 58,
      closedW: 280,
      openW: 340,
      contentH: 0,
    };

    const letters = () => content.querySelectorAll("[data-letter]");
    const fades = () => content.querySelectorAll("[data-fade]");

    const measure = () => {
      const vw = document.documentElement.clientWidth;
      const vh = window.innerHeight;
      const menuIsOpen = menuOpenRef.current;

      if (!menuIsOpen) {
        nav.style.width = "";
        nav.style.height = "";
      }
      const navH = menuIsOpen ? m.navH : nav.offsetHeight;
      const closedW = menuIsOpen ? m.closedW : nav.offsetWidth;

      const openW = Math.min(360, vw - 32);
      content.style.width = `${openW - 2}px`;
      content.style.maxHeight = `${Math.max(120, vh - EDGE * 2 - navH - 2)}px`;

      m = {
        navH,
        closedW,
        openW,
        contentH: content.offsetHeight,
      };
    };

    const placeContent = () => {
      content.style.left = "0px";
      content.style.top = `${m.navH - 2}px`;
      content.style.bottom = "auto";
    };

    const render = () => {
      const { h, w } = st;
      const extra = h * m.contentH;

      if (w > 0.001 || h > 0.001) {
        nav.style.width = `${lerp(m.closedW, m.openW, w)}px`;
        nav.style.height = `${m.navH + extra}px`;
      } else {
        nav.style.width = "";
        nav.style.height = "";
      }
      nav.style.borderRadius = `${lerp(m.navH / 2, R_OPEN, clamp01(w))}px`;
    };

    const resetMenuVisuals = (open: boolean) => {
      gsap.set(letters(), { yPercent: open ? 0 : HIDDEN_Y });
      gsap.set(fades(), { autoAlpha: open ? 1 : 0, y: 0 });
    };

    const setMenu = (next: boolean, instant = false) => {
      if (menuOpenRef.current === next && !instant) return;

      menuTlRef.current?.kill();
      if (next) measure();
      menuOpenRef.current = next;
      setMenuOpen(next);

      if (instant || reduceMotion) {
        gsap.set(st, { h: next ? 1 : 0, w: next ? 1 : 0 });
        resetMenuVisuals(next);
        render();
        return;
      }

      const tl = gsap.timeline({ onUpdate: render });
      menuTlRef.current = tl;

      if (next) {
        tl.to(st, { w: 1, duration: 0.7, ease: "power4.inOut" }, 0)
          .to(st, { h: 1, duration: 0.85, ease: "back.out(1.15)" }, 0.06)
          .fromTo(
            letters(),
            { yPercent: HIDDEN_Y },
            { yPercent: 0, duration: 0.7, ease: "power4.out", stagger: 0.016 },
            0.3
          )
          .fromTo(
            fades(),
            { autoAlpha: 0, y: 14 },
            { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.07 },
            0.45
          );
      } else {
        tl.to(fades(), { autoAlpha: 0, duration: 0.2, ease: "power1.in" }, 0)
          .to(
            letters(),
            {
              yPercent: -HIDDEN_Y,
              duration: 0.25,
              ease: "power2.in",
              stagger: { each: 0.004, from: "end" },
            },
            0
          )
          .to(st, { h: 0, duration: 0.55, ease: "power4.inOut" }, 0.12)
          .to(st, { w: 0, duration: 0.6, ease: "power4.inOut" }, 0.15)
          .set(letters(), { yPercent: HIDDEN_Y });
      }
    };
    setMenuRef.current = setMenu;

    resetMenuVisuals(false);
    measure();
    placeContent();
    render();

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        measure();
        placeContent();
        render();
      });
    }

    const handleResize = () => {
      measure();
      placeContent();
      render();
    };
    window.addEventListener("resize", handleResize);

    const desktopMq = window.matchMedia("(min-width: 640px)");
    const handleBreakpoint = () => {
      if (menuOpenRef.current) setMenu(false, true);
      handleResize();
    };
    desktopMq.addEventListener("change", handleBreakpoint);

    return () => {
      window.removeEventListener("resize", handleResize);
      desktopMq.removeEventListener("change", handleBreakpoint);
      menuTlRef.current?.kill();
      setMenuRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuRef.current?.(false);
    };
    const onPointer = (e: PointerEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setMenuRef.current?.(false);
      }
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [menuOpen]);

  const handleNavClick = (name: string, e?: React.MouseEvent) => {
    setActiveTab(name);
    setMenuRef.current?.(false);

    // Contact is a real page, so it navigates. Booking opens the dialog
    // because choosing a tour is a transient task, not a destination.
    if (name === "Booking") {
      e?.preventDefault();
      setIsModalOpen(true);
    }
  };

  return (
    <>
      {/* Navbar fixed at the top of the viewport. It inherits the page's own
          glass and ink, so the pill is a light lens on the sand sections and
          the original dark lens in the dark scheme. The "ly" keeps its Coral
          Flame in every state: a wordmark is a logotype, which WCAG 1.4.3
          exempts from contrast minimums, and the brand split is the logo. */}
      <div
        ref={wrapperRef}
        className="rl-root fixed left-1/2 top-6 z-50 w-max max-w-[calc(100vw-1.5rem)] -translate-x-1/2 will-change-transform isolation-auto"
        style={{ zIndex: "var(--rl-z-nav)" }}
      >
        <nav
          ref={navRef}
          className="relative flex flex-col overflow-hidden p-2 justify-start transition-[background-color,border-color,box-shadow,color] duration-500 rounded-full text-[var(--rl-text)]"
          style={{
            border: "1px solid var(--rl-glass-border)",
            background: "var(--rl-glass-fill)",
            backdropFilter: "var(--rl-glass-blur)",
            WebkitBackdropFilter: "var(--rl-glass-blur)",
            boxShadow: "0 18px 50px -12px rgb(4 20 26 / 0.7)",
          }}
        >
          <div
            className="absolute inset-[1px] pointer-events-none rounded-[inherit]"
            style={{ border: "1px solid var(--rl-glass-edge)" }}
          />

          {/* Header row: Brand logo on the left + desktop links or mobile menu button */}
          <div className="relative z-10 flex w-full flex-none items-center justify-between px-3">
            {/* Brand wordmark.
                The two-tone split is the brand, so it stays. The colour of the
                second half moved from a hard-coded blue-400 to the accent token:
                a second hue here was the one place the old palette leaked a
                colour the rest of the site did not use.
                Padding and a matching negative margin give it a 44px touch
                target without growing the navbar pill. */}
            <Link
              href="/"
              className="inline-flex min-h-11 items-center -my-1.5 mr-6 py-1.5 text-lg font-extrabold leading-7 tracking-tight text-[var(--rl-text)] select-none drop-shadow-sm"
            >
              Roam
              <span className="text-[var(--rl-accent)]">ly</span>
            </Link>

            {/* Desktop links with Direct Hover Spring Physics */}
            <ul ref={desktopListRef} className="hidden sm:flex items-center gap-1">
              {navItems.map((item, index) => {
                const isActive = activeTab === item.name;

                return (
                  <li
                    key={item.name}
                    className="transition-transform will-change-transform duration-75 ease-out"
                    onMouseEnter={() => {
                      hoveredIndex.current = index;
                    }}
                    onMouseLeave={() => {
                      if (hoveredIndex.current === index) hoveredIndex.current = null;
                    }}
                    onFocus={() => {
                      focusedIndex.current = index;
                    }}
                    onBlur={() => {
                      if (focusedIndex.current === index) focusedIndex.current = null;
                    }}
                  >
                    <JigglyButton
                      href={item.href}
                      size="nav"
                      tone="glass"
                      className={isActive ? "is-active" : ""}
                      style={
                        isActive
                          ? {
                              background: "var(--rl-glass-fill-active)",
                            }
                          : undefined
                      }
                      onClick={(e) => handleNavClick(item.name, e)}
                    >
                      {item.name}
                    </JigglyButton>
                  </li>
                );
              })}
            </ul>

            {/* Mobile menu toggle */}
            <JigglyButton
              size="nav"
              tone="glass"
              onClick={() => setMenuRef.current?.(!menuOpenRef.current)}
              aria-expanded={menuOpen}
              aria-controls={contentId}
              className="sm:hidden min-h-11 grow justify-between font-semibold tracking-wide"
            >
              <span>Menu</span>
              <span
                aria-hidden="true"
                className={`relative block h-3.5 w-3.5 transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] motion-reduce:transition-none ${
                  menuOpen ? "rotate-45" : ""
                }`}
              >
                <span className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 rounded bg-current" />
                <span className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 rounded bg-current" />
              </span>
            </JigglyButton>
          </div>

          {/* Mobile menu panel. Light lens like the pill: the local surface at
              high opacity plus blur, so navy links hold contrast over any
              page behind it, hero photo included. */}
          <div
            ref={contentRef}
            id={contentId}
            aria-hidden={!menuOpen}
            className="sm:hidden absolute z-0 overflow-y-auto overscroll-contain px-4 py-3 backdrop-blur-xl border border-[var(--rl-line)] rounded-[28px] mt-1"
            style={{ background: "color-mix(in srgb, var(--rl-ink-2) 92%, transparent)" }}
          >
            <ul className="flex flex-col">
              {navItems.map((item, i) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    tabIndex={menuOpen ? 0 : -1}
                    aria-label={item.name}
                    onClick={(e) => handleNavClick(item.name, e)}
                    className="group flex items-baseline gap-3 rounded-lg py-1.5 text-3xl font-semibold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-[var(--rl-accent-text)] text-[var(--rl-text)]"
                  >
                    {/* Full ink rather than muted: at 12px the muted tone drops
                        under 4.5:1 on the light panel, and these sit beside
                        the link they number. */}
                    <span data-fade className="w-5 text-xs font-medium tabular-nums text-[var(--rl-text)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <RollText text={item.name} />
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              href={FEATURED.href}
              tabIndex={menuOpen ? 0 : -1}
              data-fade
              onClick={() => setMenuRef.current?.(false)}
              className="group relative mt-3 block aspect-[16/9] overflow-hidden rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[var(--rl-accent-text)] border border-white/20"
            >
              {/* next/image handles the sizing here: this is a fixed-aspect card,
                  so a plain img served the full aerial. */}
              <Image
                src={FEATURED.src}
                alt={FEATURED.alt}
                fill
                sizes="320px"
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 motion-reduce:transition-none"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/85 text-[var(--rl-on-accent)] shadow-md">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M9 7h8v8" />
                </svg>
              </span>
              {/* The title is repeated to screen readers by the alt, so it is
                  hidden from them here rather than announced twice. */}
              <span className="absolute inset-x-3 bottom-3 text-white" aria-hidden="true">
                <span className="block text-[11px] font-medium uppercase tracking-widest text-white/70">
                  {FEATURED.eyebrow}
                </span>
                <span className="block text-base font-semibold leading-tight">{FEATURED.title}</span>
              </span>
            </Link>
          </div>
        </nav>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        preSelectedOptionId={null}
      />
    </>
  );
}
