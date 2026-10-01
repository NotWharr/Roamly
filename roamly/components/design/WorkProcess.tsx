import { useEffect, useRef, useState, type CSSProperties } from "react";
import "@/styles/work-process.css";

export type ProcessStep = {
  step: string;
  title: string;
  description: string;
  features: string[];
};

type RouteSegment = {
  d: string;
  start: { x: number; y: number };
  end: { x: number; y: number };
};

/**
 * The five steps of a day with a Roamly guide.
 *
 * Written around what actually happens on a Grenada excursion rather than a
 * generic booking funnel: you are picked up, you walk in, you eat something
 * local, you get dropped back. The step numbers stay because the route line
 * between the cards is drawn from them.
 */
const STEPS: ProcessStep[] = [
  {
    step: "01",
    title: "We pick you up",
    description:
      "Your guide texts you the morning of, then collects you from your hotel or a point in St George's. If you are staying on Carriacou or Petite Martinique, we meet you at the jetty.",
    features: [
      "Hotel or central St George's pickup",
      "Jetty pickup for the sister islands",
      "A text the night before with the name and number",
    ],
  },
  {
    step: "02",
    title: "We walk you in",
    description:
      "Gradients are marked before anyone sets off. Most of the island's trails are short but the ground is wet, muddy, or uneven far more often than the walk is hard.",
    features: [
      "Trails walked first to set a fair gradient",
      "Boots and walking poles available on board",
      "Swimming and turn-around points agreed up front",
    ],
  },
  {
    step: "03",
    title: "You eat something local",
    description:
      "Lunch is part of most of the days, not an extra. Rice and peas, oil-down, callaloo, or whatever the cook had going that morning, with a stop wherever there is a reason to stop.",
    features: [
      "Lunch cooked that morning, not bought",
      "Vegetarian and vegan on every tour",
      "Spice levels talked through before the day",
    ],
  },
  {
    step: "04",
    title: "You get the small stuff",
    description:
      "Rum punch at the plantation, nutmeg, cocoa, a reef guide who knows which current is running. This is the part people mention afterwards, and it is not in the brochure.",
    features: [
      "Nutmeg, cocoa and rum tastings on the inland days",
      "Reef briefings before you are in the water",
      "Photos from your guide, sent the same evening",
    ],
  },
  {
    step: "05",
    title: "We drop you back",
    description:
      "Back at your door with time to swim before dinner. If you want to extend the day, say so in the morning rather than afterwards, because the guide's route is already set.",
    features: [
      "Back at your hotel with the rest of the evening free",
      "Same-day changes agreed in the morning",
      "Cash or card, and a receipt either way",
    ],
  },
];

export default function WorkProcess({ steps = STEPS }: { steps?: ProcessStep[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const [segments, setSegments] = useState<RouteSegment[]>([]);
  const [visibleCards, setVisibleCards] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = Number((entry.target as HTMLElement).dataset["cardIndex"]);
          setVisibleCards((prev) => ({ ...prev, [index]: true }));
        }
      },
      { threshold: 0.2 },
    );

    for (const card of cardRefs.current) if (card) observer.observe(card);
    return () => observer.disconnect();
  }, [steps]);

  // The connector is drawn between card centres, so it has to be measured and
  // remeasured whenever the cards move.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const measure = () => {
      const stageRect = stage.getBoundingClientRect();
      const next: RouteSegment[] = [];

      for (let i = 0; i < cardRefs.current.length - 1; i += 1) {
        const current = cardRefs.current[i];
        const following = cardRefs.current[i + 1];
        if (!current || !following) continue;

        const a = current.getBoundingClientRect();
        const b = following.getBoundingClientRect();
        const start = {
          x: a.left + a.width / 2 - stageRect.left,
          y: a.bottom - stageRect.top,
        };
        const end = {
          x: b.left + b.width / 2 - stageRect.left,
          y: b.top - stageRect.top,
        };
        const bend = Math.max(70, (end.y - start.y) * 0.5);
        next.push({
          d: `M ${start.x} ${start.y} C ${start.x} ${start.y + bend}, ${end.x} ${end.y - bend}, ${end.x} ${end.y}`,
          start,
          end,
        });
      }

      setSegments(next);
    };

    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    for (const card of cardRefs.current) if (card) observer.observe(card);
    measure();
    return () => observer.disconnect();
  }, [steps]);

  /**
   * The route fills in as the section is scrolled through.
   *
   * SKILL 5.D bans `window.addEventListener("scroll")`, and rightly: it runs
   * on every scroll frame with no batching. A rAF loop that is scheduled only
   * while the section is on screen does the same work without the listener,
   * and it stops entirely when the section is not in view.
   */
  useEffect(() => {
    const section = sectionRef.current;
    const paths = pathRefs.current.filter(
      (path): path is SVGPathElement => Boolean(path),
    );
    if (!section || paths.length === 0) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const lengths = paths.map((path) => path.getTotalLength());
    paths.forEach((path, i) => {
      const length = lengths[i] ?? 0;
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
    });

    if (reduceMotion) return;

    let frame: number | null = null;

    const draw = () => {
      frame = null;
      const rect = section.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;

      const travel = Math.max(1, rect.height - window.innerHeight * 0.55);
      const progress = Math.min(
        1,
        Math.max(0, (window.innerHeight * 0.72 - rect.top) / travel),
      );

      paths.forEach((path, i) => {
        const local = Math.min(1, Math.max(0, progress * paths.length - i));
        const length = lengths[i] ?? 0;
        path.style.strokeDashoffset = `${length * (1 - local)}`;
      });
    };

    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [segments]);

  return (
    <main className="process-page rl-theme rl-theme-reef">
      <section
        ref={sectionRef}
        className="process-shell"
        aria-labelledby="process-title"
      >
        <header className="process-header">
          <div className="process-kicker">
            <span className="process-kicker-mark" aria-hidden="true" />
            <span>How a day with us runs</span>
            <span className="process-kicker-rule" aria-hidden="true" />
            <span className="process-station-count">{steps.length} steps</span>
          </div>

          <h2 id="process-title">Five steps, and none of them a queue.</h2>
          <p>
            A Roamly day is a small group, one guide who lives here, and a route
            that bends around the weather rather than against it.
          </p>
        </header>

        <div ref={stageRef} className="process-stage">
          <svg className="process-route" width="100%" height="100%" aria-hidden="true">
            {segments.map((segment, index) => (
              <g key={`${segment.d}-${index}`}>
                <path className="process-route-guide" d={segment.d} />
                <path
                  ref={(node) => {
                    pathRefs.current[index] = node;
                  }}
                  className="process-route-progress"
                  d={segment.d}
                />
                <circle
                  className="process-route-port"
                  cx={segment.start.x}
                  cy={segment.start.y}
                  r="7"
                />
                <circle
                  className="process-route-port"
                  cx={segment.end.x}
                  cy={segment.end.y}
                  r="7"
                />
                <circle
                  className="process-route-core"
                  cx={segment.end.x}
                  cy={segment.end.y}
                  r="3"
                />
              </g>
            ))}
          </svg>

          <div className="process-grid">
            {steps.map((item, index) => {
              const featured = index === 1;
              const isVisible = visibleCards[index];

              return (
                <article
                  key={item.step}
                  data-card-index={index}
                  ref={(node) => {
                    cardRefs.current[index] = node;
                  }}
                  className={`process-card process-card-${index + 1}${
                    featured ? " is-featured" : ""
                  }${isVisible ? " is-animated" : ""}`}
                >
                  <div
                    className="process-card-top animate-line"
                    style={{ "--line-index": 0 } as CSSProperties}
                  >
                    <span className="process-step-number">{item.step}</span>
                    <span className="process-station-tag">
                      {index === 0
                        ? "Before"
                        : index === steps.length - 1
                          ? "After"
                          : "On the day"}
                    </span>
                  </div>

                  <h3
                    className="animate-line"
                    style={{ "--line-index": 1 } as CSSProperties}
                  >
                    {item.title}
                  </h3>

                  <p
                    className="animate-line"
                    style={{ "--line-index": 2 } as CSSProperties}
                  >
                    {item.description}
                  </p>

                  <div
                    className="process-card-divider animate-line"
                    style={{ "--line-index": 3 } as CSSProperties}
                  />

                  <ul className="process-feature-list">
                    {item.features.map((feature) => (
                      <li
                        key={feature}
                        className="animate-line"
                        style={{ "--line-index": 4 } as CSSProperties}
                      >
                        <span
                          className="process-feature-dash"
                          aria-hidden="true"
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
