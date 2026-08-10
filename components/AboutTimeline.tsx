"use client";

import { useEffect, useRef } from "react";

interface TimelineEntry {
  year: string;
  role: string;
  org: string;
}

// Edit this array to update the timeline — no other code changes needed.
const TIMELINE: TimelineEntry[] = [
  { year: "2023", role: "SMM Freelancer", org: "World Wide Media" },
  { year: "2024", role: "Social Media Secretary", org: "Pratishtha, SAKEC" },
  { year: "2024", role: "Production Freelancer", org: "Independent" },
  { year: "2025", role: "Directorial & Production", org: "TODO — confirm company/project name" },
];

// Deliberately built with plain DOM APIs (IntersectionObserver + a
// scroll listener), no animation library — the fade/slide-in and dot
// light-up are handled entirely by toggling one CSS class per entry
// when it scrolls into view; the actual animation is CSS transitions,
// not JS-driven.
export default function AboutTimeline() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const entryRefs = useRef<(HTMLLIElement | null)[]>([]);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Fade/slide-in + dot light-up.
  useEffect(() => {
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

  // Glowing fill line — height tracks how far the viewport's vertical
  // midpoint has progressed from the section's top to the LAST DOT's
  // own position specifically — not the section's full height, which
  // would include the last entry's role/org text sitting below that
  // dot. Measuring against the dot itself is what makes the line
  // actually finish connecting to the last dot, instead of stopping
  // short until you've also scrolled past its trailing text.
  useEffect(() => {
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
