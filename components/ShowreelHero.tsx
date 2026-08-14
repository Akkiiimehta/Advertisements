"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Project, getThumbnailUrl, getHiResThumbnailUrl } from "@/lib/projects";

interface ShowreelHeroProps {
  projects: Project[];
  onOpen: (project: Project, layoutId: string) => void;
}

const ROTATE_MS = 7000;

export default function ShowreelHero({ projects, onOpen }: ShowreelHeroProps) {
  const [index, setIndex] = useState(0);
  const paused = useRef(false);

  useEffect(() => {
    if (projects.length <= 1) return;
    const id = setInterval(() => {
      if (!paused.current) setIndex((i) => (i + 1) % projects.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [projects.length]);

  if (projects.length === 0) return null;
  const active = projects[index];
  const layoutId = `showreel-hero-${active.id}`;

  function goPrev() {
    setIndex((i) => (i - 1 + projects.length) % projects.length);
  }

  function goNext() {
    setIndex((i) => (i + 1) % projects.length);
  }

  return (
    <div
      className="showreel-hero"
      onPointerEnter={() => (paused.current = true)}
      onPointerLeave={() => (paused.current = false)}
    >
      <AnimatePresence mode="sync">
        <motion.div
          key={active.id}
          className="showreel-hero-bg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
        >
          <img
            className="showreel-hero-bg-img"
            src={getHiResThumbnailUrl(active) ?? getThumbnailUrl(active) ?? undefined}
            alt=""
            draggable={false}
            onError={(e) => {
              // maxresdefault.jpg doesn't exist for every video — fall
              // back to hqdefault rather than showing a broken image
              // full-bleed across the hero.
              const fallback = getThumbnailUrl(active);
              if (fallback && e.currentTarget.src !== fallback) e.currentTarget.src = fallback;
            }}
          />
        </motion.div>
      </AnimatePresence>

      <div className="showreel-hero-scrim" />

      {projects.length > 1 && (
        <>
          <button
            type="button"
            className="showreel-hero-arrow showreel-hero-arrow-left"
            onClick={goPrev}
            aria-label="Previous featured project"
          >
            <svg width="9" height="15" viewBox="0 0 9 15" fill="none" aria-hidden>
              <path
                d="M7.5 1L1.5 7.5L7.5 14"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            className="showreel-hero-arrow showreel-hero-arrow-right"
            onClick={goNext}
            aria-label="Next featured project"
          >
            <svg width="9" height="15" viewBox="0 0 9 15" fill="none" aria-hidden>
              <path
                d="M1.5 1L7.5 7.5L1.5 14"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </>
      )}

      <div className="showreel-hero-content">
        <span className="showreel-hero-eyebrow">Featured</span>
        <h1 className="showreel-hero-title">{active.title}</h1>
        <p className="showreel-hero-brand">{active.brand}</p>
        <p className="showreel-hero-desc">{active.description}</p>

        <div className="showreel-hero-actions">
          <motion.button
            type="button"
            className="showreel-play-btn"
            layoutId={layoutId}
            onClick={() => onOpen(active, layoutId)}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M3 1.5L12 7L3 12.5V1.5Z" fill="currentColor" />
            </svg>
            Play
          </motion.button>

          <div className="showreel-hero-tags">
            {active.tags.slice(0, 2).map((tag) => (
              <span className="showreel-hero-tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {projects.length > 1 && (
          <div className="showreel-hero-dots" role="tablist" aria-label="Featured projects">
            {projects.map((p, i) => (
              <button
                key={p.id}
                type="button"
                className={`showreel-hero-dot ${i === index ? "active" : ""}`}
                aria-label={`Show ${p.title}`}
                aria-selected={i === index}
                role="tab"
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
