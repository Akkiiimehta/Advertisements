
"use client";

import { useEffect, useRef } from "react";

interface TimelineEntry {
  year: string;
  role: string;
  org: string;
}

// Change to true whenever you want to show the timeline again.
const SHOW_TIMELINE = false;

// Edit this array to update the timeline.
const TIMELINE: TimelineEntry[] = [
  { year: "2023", role: "SMM Freelancer", org: "World Wide Media" },
  { year: "2024", role: "Social Media Secretary", org: "Pratishtha, SAKEC" },
  { year: "2024", role: "Production Freelancer", org: "Independent" },
  { year: "2025", role: "Directorial & Production", org: "Numerous Production Houses" },
];

export default function AboutTimeline() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const entryRefs = useRef<(HTMLLIElement | null)[]>([]);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (!SHOW_TIMELINE) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.35, rootMargin: "0px 0px -10% 0px" }
    );

    entryRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!SHOW_TIMELINE) return;

    let ticking = false;

    function update() {
      const section = sectionRef.current;
      const fill = fillRef.current;
      const lastDot = dotRefs.current[dotRefs.current.length - 1];

      if (section && fill && lastDot) {
        const sectionTop = section.getBoundingClientRect().top;
        const dotRect = lastDot.getBoundingClientRect();
        const targetY = dotRect.top + dotRect.height / 2 - sectionTop;
        const viewportMid = window.innerHeight * 0.5;
        const progress = (viewportMid - sectionTop) / targetY;

        fill.style.height = `${Math.min(1, Math.max(0, progress)) * 100}%`;
      }

      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Hide the entire timeline without deleting its code.
  if (!SHOW_TIMELINE) return null;

  return (
    <section className="timeline" ref={sectionRef} aria-label="Career timeline">
      <div className="timeline-track" aria-hidden>
        <div className="timeline-fill" ref={fillRef} />
      </div>

      <ul className="timeline-entries">
        {TIMELINE.map((entry, i) => (
          <li
            key={i}
            className="timeline-entry"
            ref={(el) => {
              entryRefs.current[i] = el;
            }}
          >
            <span
              className="timeline-dot"
              aria-hidden
              ref={(el) => {
                dotRefs.current[i] = el;
              }}
            />

            <div className="timeline-content">
              <span className="timeline-year">{entry.year}</span>
              <h3 className="timeline-role">{entry.role}</h3>
              <p className="timeline-org">{entry.org}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
