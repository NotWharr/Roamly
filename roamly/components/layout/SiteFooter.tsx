import Link from "next/link";

import SocialLinks from "@/components/design/SocialLinks";

const EXPLORE = [
  { label: "Explore", href: "/#explore" },
  { label: "The days", href: "/#days" },
  { label: "Gallery", href: "/gallery" },
  { label: "FAQ", href: "/#faq" },
];

const VISIT = [
  { label: "Contact", href: "/contact" },
  { label: "Terms", href: "/terms" },
  { label: "Book a tour", href: "/booking" },
];

const linkClass =
  "inline-flex min-h-10 items-center text-[var(--rl-text)] underline decoration-transparent underline-offset-[6px] hover:decoration-current";

/** The floor of the page: ways through the site, the direct line, the name. */
export default function SiteFooter() {
  return (
    <footer data-water className="rl-deep">
      <div className="mx-auto w-full max-w-[1400px] px-[var(--rl-gutter)] pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))] pt-14 sm:pt-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-5">
            <p className="rl-display max-w-[20ch] text-[clamp(1.5rem,2.6vw,2.25rem)] leading-[1.1]">
              Small-group guided days across Grenada, run by people who live here.
            </p>
            <a
              href="mailto:hello@roamlytours.com"
              className="mt-5 inline-flex min-h-10 items-center text-sm font-semibold underline decoration-[var(--rl-line-strong)] underline-offset-[6px] hover:decoration-current"
            >
              hello@roamlytours.com
            </a>
            <p className="mt-1 text-sm text-[var(--rl-mute)]">St George&apos;s, Grenada</p>
          </div>

          <nav aria-label="Footer" className="lg:col-span-2 lg:col-start-7">
            <h2 className="text-sm text-[var(--rl-mute)]">Explore</h2>
            <ul className="mt-3 flex flex-col">
              {EXPLORE.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-2">
            <h2 className="text-sm text-[var(--rl-mute)]">Visit</h2>
            <ul className="mt-3 flex flex-col">
              {VISIT.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="sm:col-span-2 lg:col-span-2 lg:[&_nav]:text-left lg:[&_ul]:justify-start [&_nav]:text-left [&_ul]:justify-start">
            <SocialLinks />
          </div>
        </div>

        <p className="mt-14 text-xs text-[var(--rl-mute)]">
          &copy; {new Date().getFullYear()} Roamly. Made in Grenada.
        </p>
      </div>
    </footer>
  );
}
