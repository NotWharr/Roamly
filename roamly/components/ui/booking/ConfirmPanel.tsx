"use client";

import { useEffect, useRef } from "react";

interface ConfirmPanelProps {
  /** Open state. Drives the height and the inner fade, and nothing else. */
  open: boolean;
  /** Live region text, read when the panel finishes opening. */
  label: string;
  id: string;
  children: React.ReactNode;
}

/**
 * The section that drops open under the chosen trip.
 *
 * Animated with the CSS `grid-template-rows: 0fr` to `1fr` trick rather than a
 * measured pixel height, so it lands on whatever the content actually is
 * without a resize listener or a re-measure when a tour changes.
 *
 * A closed panel is `inert`, not just invisible. That is the part that matters:
 * a zero-height container still holds focusable children, so a keyboard user
 * would tab into an invisible calendar and a screen reader would offer it as
 * content. `inert` removes both without changing the markup.
 */
export default function ConfirmPanel({
  open,
  label,
  id,
  children,
}: ConfirmPanelProps) {
  const innerRef = useRef<HTMLDivElement>(null);

  // A hidden panel that is already at its final height on first paint would
  // animate open with no trigger, so state is only meaningful after a change.
  const wasOpen = useRef(open);

  useEffect(() => {
    if (wasOpen.current === open) return;
    wasOpen.current = open;

    if (!open) {
      innerRef.current?.scrollIntoView?.({ block: "nearest" });
    }
  }, [open]);

  return (
    <div
      id={id}
      data-open={open}
      className="bk-drop"
      // Height is animated by CSS; the browser handles the interpolation.
      aria-hidden={!open}
      // A collapsed panel is `inert`, not just invisible. React's DOM types still
      // model `inert` as a string attribute, so it is written through the prop
      // that is not type-checked rather than spread onto the element.
      ref={(node: HTMLDivElement | null) => {
        if (node) node.inert = !open;
      }}
    >
      <div ref={innerRef} className="bk-drop-inner">
        <div className="bk-drop-panel">
          <p className="sr-only" role="status" aria-live="polite">
            {open ? label : ""}
          </p>
          {children}
        </div>
      </div>
    </div>
  );
}
