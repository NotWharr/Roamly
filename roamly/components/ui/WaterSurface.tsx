"use client";

import dynamic from "next/dynamic";
import { getImageProps } from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

// The canvas reads window during render, so it only ever mounts on the client.
const WaterRipple = dynamic(() => import("@/components/providers/WaterRipple"), {
  ssr: false,
});

const PORTRAIT_QUERY = "(max-aspect-ratio: 1/1)";

const subscribePortrait = (onChange: () => void) => {
  const query = window.matchMedia(PORTRAIT_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

type Photo = { src: string; width: number; height: number };

interface WaterSurfaceProps {
  wide: Photo;
  /** Art-directed crop for portrait screens. Falls back to `wide`. */
  tall?: Photo;
  alt: string;
  /** Above the fold: preload the poster and mount the canvas straight away. */
  priority?: boolean;
  /** Poster only, for task pages where the ripple would just be a distraction. */
  still?: boolean;
}

/**
 * A photograph of water that can be touched.
 *
 * Fills its nearest `isolate` parent. The poster is the complete picture without
 * JavaScript, WebGL or motion; the ripple canvas fades in over it once the
 * section gets close to the viewport.
 */
export default function WaterSurface({
  wide,
  tall = wide,
  alt,
  priority = false,
  still = false,
}: WaterSurfaceProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [near, setNear] = useState(priority);

  const portrait = useSyncExternalStore(
    subscribePortrait,
    () => window.matchMedia(PORTRAIT_QUERY).matches,
    () => null,
  );

  useEffect(() => {
    if (near || still || !wrapRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setNear(true);
      },
      { rootMargin: "50% 0px" },
    );
    observer.observe(wrapRef.current);
    return () => observer.disconnect();
  }, [near, still]);

  const common = { alt, sizes: "100vw", priority };
  const {
    props: { srcSet: wideSet },
  } = getImageProps({ ...common, ...wide, quality: 75 });
  const {
    props: { srcSet: tallSet, ...poster },
  } = getImageProps({ ...common, ...tall, quality: 70 });

  const source = portrait ? tall.src : wide.src;

  return (
    <>
      <picture className="absolute inset-0 -z-20">
        <source media={PORTRAIT_QUERY} srcSet={tallSet} />
        <source srcSet={wideSet} />
        <img {...poster} alt={alt} className="h-full w-full object-cover" />
      </picture>

      <div ref={wrapRef} className="absolute inset-0 -z-10">
        {near && !still && portrait !== null ? (
          <WaterRipple key={source} imageSrc={source} />
        ) : null}
      </div>
    </>
  );
}
