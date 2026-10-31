"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowUpRight, Menu, X } from "lucide-react";

import BookingModal from "@/components/ui/booking/BookingModal";
import JigglyButton from "@/components/ui/JigglyButton";

const NAV = [
  { label: "Explore", href: "#explore" },
  { label: "The days", href: "#days" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "/contact" },
];

const motionDuration = (seconds: number) =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : seconds;

/** A nav link whose hover, focus and current-section marker is a drawn wave. */
function NavLink({
  href,
  label,
  current,
}: {
  href: string;
  label: string;
  current: boolean;
}) {
  const waveRef = useRef<SVGPathElement | null>(null);
  const [engaged, setEngaged] = useState(false);
  const drawn = current || engaged;

  useEffect(() => {
    gsap.to(waveRef.current, {
      strokeDashoffset: drawn ? 0 : 1,
      duration: motionDuration(0.55),
      ease: "power2.out",
    });
  }, [drawn]);

  return (
    <Link
      href={href}
      aria-current={current ? "true" : undefined}
      onPointerEnter={() => setEngaged(true)}
      onPointerLeave={() => setEngaged(false)}
      onFocus={() => setEngaged(true)}
      onBlur={() => setEngaged(false)}
      className="relative inline-flex min-h-11 items-center rounded-full px-4 text-sm font-medium"
    >
      {label}
      <svg
        aria-hidden="true"
        viewBox="0 0 44 6"
        fill="none"
        className="absolute bottom-[3px] left-1/2 h-[6px] w-11 -translate-x-1/2"
      >
        <path
          ref={waveRef}
          d="M1 3c3.5-2.6 7-2.6 10.5 0S18.500 5.600 22 3s7-2.600 10.500 0S39.500 5.600 43 3"
          pathLength={1}
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeDasharray={1}
          strokeDashoffset={1}
        />
      </svg>
    </Link>
  );
}

/**
 * The site header.
 *
 * Sits directly on the water with no surface of its own over any `data-water`
 * section, and becomes a salt-paper bar over the paper sections between them. It
 * stays fixed so the booking action is always one tap away. The wave marks the
 * section you are in; the mobile panel is a full-screen sheet whose links
 * arrive with a GSAP stagger. No CSS transitions are used in the header.
 */
export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [overWater, setOverWater] = useState(true);
  const [atTop, setAtTop] = useState(true);
  const deepBarRef = useRef<HTMLDivElement | null>(null);
  const [currentHref, setCurrentHref] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);
  const ids = useId();

  const onWater = overWater && !menuOpen;

  useEffect(() => {
    // A thin band at header height: whatever crosses it is what the header sits on.
    const under = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) under.add(entry.target);
          else under.delete(entry.target);
        });
        setOverWater(under.size > 0);
      },
      { rootMargin: "-4% 0px -95% 0px" },
    );
    document.querySelectorAll("[data-water]").forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const href = `#${entry.target.id}`;
          if (entry.isIntersecting) setCurrentHref(href);
          else setCurrentHref((now) => (now === href ? null : now));
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    NAV.forEach(({ href }) => {
      const section = href.startsWith("#") ? document.querySelector(href) : null;
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

  // Clear only at the very top: anything scrolling under the links needs a surface.
  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY < 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const duration = motionDuration(0.4);
    gsap.to(barRef.current, { autoAlpha: onWater ? 0 : 1, duration, ease: "power2.out" });
    gsap.to(deepBarRef.current, {
      autoAlpha: onWater && !atTop ? 1 : 0,
      duration,
      ease: "power2.out",
    });
    gsap.to(headerRef.current, {
      color: onWater ? "#ffffff" : "#102e29",
      duration,
      ease: "power2.out",
    });
  }, [onWater, atTop]);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      gsap.fromTo(
        panelRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" },
      );
      gsap.fromTo(
        ".mobile-nav-item",
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          delay: 0.08,
          stagger: 0.06,
          ease: "power3.out",
        },
      );
    }, panelRef);

    requestAnimationFrame(() => firstLinkRef.current?.focus());

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      ctx.revert();
    };
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
    requestAnimationFrame(() => menuButtonRef.current?.focus());
  };

  const openBooking = () => {
    setMenuOpen(false);
    setBookingOpen(true);
  };

  return (
    <>
      <header
        ref={headerRef}
        className="rl-focus-current fixed inset-x-0 top-0 z-[var(--rl-z-nav)] pt-[env(safe-area-inset-top,0px)]"
        style={{ color: "#ffffff" }}
      >
        <div
          ref={deepBarRef}
          aria-hidden="true"
          className="invisible absolute inset-0 -z-10 bg-[rgb(6_38_44/0.78)] opacity-0 backdrop-blur-xl"
        />
        <div
          ref={barRef}
          aria-hidden="true"
          className="invisible absolute inset-0 -z-10 border-b border-[var(--rl-line)] bg-[color-mix(in_srgb,var(--rl-ink)_90%,transparent)] opacity-0 backdrop-blur-xl"
        />

        <div className="mx-auto grid h-[72px] w-full max-w-[1400px] grid-cols-[1fr_auto] items-center gap-6 px-[var(--rl-gutter)] lg:grid-cols-[1fr_auto_1fr]">
          <Link
            href="/"
            className="rl-display justify-self-start text-[1.6rem] leading-none tracking-[-0.05em]"
            onClick={() => setMenuOpen(false)}
          >
            Roamly
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV.map((item) => (
                <li key={item.label}>
                  <NavLink
                    href={item.href}
                    label={item.label}
                    current={currentHref === item.href}
                  />
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2 justify-self-end">
            <JigglyButton
              size="nav"
              tone="solid"
              onClick={openBooking}
              className="font-semibold"
            >
              <span className="hidden sm:inline">Book a tour</span>
              <span className="sm:hidden">Book</span>
            </JigglyButton>

            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls={`${ids}-menu`}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="grid h-11 w-11 place-items-center rounded-full border border-current lg:hidden"
            >
              {menuOpen ? (
                <X size={19} strokeWidth={1.8} aria-hidden="true" />
              ) : (
                <Menu size={19} strokeWidth={1.8} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </header>

      {menuOpen ? (
        <div
          ref={panelRef}
          id={`${ids}-menu`}
          className="fixed inset-0 z-40 overflow-y-auto bg-[var(--rl-ink)] px-[var(--rl-gutter)] pb-10 pt-28 lg:hidden"
        >
          <nav aria-label="Mobile">
            <ul className="flex flex-col border-t border-[var(--rl-line)]">
              {NAV.map((item, index) => (
                <li key={item.label} className="border-b border-[var(--rl-line)]">
                  <Link
                    ref={index === 0 ? firstLinkRef : undefined}
                    href={item.href}
                    onClick={closeMenu}
                    className="mobile-nav-item flex min-h-[72px] items-center justify-between gap-4 text-[clamp(1.75rem,8vw,2.5rem)] font-semibold tracking-[-0.04em] text-[var(--rl-text)] hover:text-[var(--rl-accent-text)]"
                    style={{
                      fontFamily: "var(--font-rl-display), ui-sans-serif, system-ui, sans-serif",
                    }}
                  >
                    {item.label}
                    <ArrowUpRight
                      size={22}
                      strokeWidth={1.5}
                      aria-hidden="true"
                      className="text-[var(--rl-mute)]"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mobile-nav-item mt-10 flex flex-col gap-3">
            <JigglyButton size="block" withArrow onClick={openBooking}>
              Book a tour
            </JigglyButton>

            <a
              href="mailto:hello@roamlytours.com"
              className="inline-flex min-h-11 items-center text-sm font-medium text-[var(--rl-mute)] hover:text-[var(--rl-accent-text)]"
            >
              hello@roamlytours.com
            </a>
            <p className="text-sm text-[var(--rl-mute)]">
              St George&apos;s, Grenada
            </p>
          </div>
        </div>
      ) : null}

      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        preSelectedOptionId={null}
      />
    </>
  );
}
