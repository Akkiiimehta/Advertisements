"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects, getHiResThumbnailUrl } from "@/lib/projects";

interface InfoOverlayProps {
  onClose: () => void;
}

const EMAIL = "yashmehtaoffice@gmail.com";
const PHONE_DISPLAY = "+91 70212 91405";
const WHATSAPP_NUMBER = "917021291405";

const ArrowIcon = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path
      d="M3.5 12.5 12.5 3.5M12.5 3.5H5M12.5 3.5V11"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function InfoOverlay({ onClose }: InfoOverlayProps) {
  // A rotating peek at past collaborations behind the "Collaboration"
  // card — one thumbnail per distinct brand so it doesn't just repeat
  // the same campaign three times in a row.
  const showcase = useMemo(() => {
    const seen = new Set<string>();
    const items: { brand: string; image: string }[] = [];
    for (const p of projects) {
      const url = getHiResThumbnailUrl(p);
      if (!url || seen.has(p.brand)) continue;
      seen.add(p.brand);
      items.push({ brand: p.brand, image: url });
    }
    return items;
  }, []);

  const [index, setIndex] = useState(0);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (!hovering || showcase.length < 2) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % showcase.length);
    }, 1000);
    return () => clearInterval(id);
  }, [hovering, showcase.length]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const current = showcase[index];

  return (
    <div className="lt-root" id="contact">
      <motion.div
        className="lt-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        onClick={onClose}
      />

      <button className="lt-close" onClick={onClose} aria-label="Close">
        <span aria-hidden>&times;</span>
      </button>

      <motion.div
        className="lt-content"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="lt-inner">
          <div className="lt-eyebrow">
            <span className="lt-dot" aria-hidden />
            Let&rsquo;s talk
          </div>
          <h2 className="lt-heading">Welcome! It&rsquo;s great to meet you.</h2>

          <div className="lt-cards">
            <a
              className="lt-card lt-card-image"
              href={`mailto:${EMAIL}?subject=${encodeURIComponent("Let's work together")}`}
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
              onTouchStart={() => setHovering(true)}
              onTouchEnd={() => setHovering(false)}
            >
              <div className="lt-card-media" aria-hidden="true">
                <AnimatePresence mode="wait">
                  {current && (
                    <motion.img
                      key={current.brand}
                      src={current.image}
                      alt=""
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35 }}
                    />
                  )}
                </AnimatePresence>
                <div className="lt-card-media-scrim" />
                {current && <span className="lt-card-media-label">{current.brand}</span>}
              </div>

              <div className="lt-card-top">
                <span className="lt-tag-dot" aria-hidden />
                Collaboration
              </div>
              <div className="lt-card-title">
                I&rsquo;m interested in
                <br />
                working together.
              </div>
              <span className="lt-arrow">
                <ArrowIcon />
              </span>
            </a>

            <a
              className="lt-card"
              href={`mailto:${EMAIL}?subject=${encodeURIComponent("I'd like to join the team")}`}
            >
              <div className="lt-card-top">
                <span className="lt-tag-dot" aria-hidden />
                Hiring
              </div>
              <div className="lt-card-title">
                I&rsquo;d like to join
                <br />
                the team.
              </div>
              <span className="lt-arrow">
                <ArrowIcon />
              </span>
            </a>

            <div className="lt-card lt-card-links">
              <div className="lt-card-top">
                <span className="lt-tag-dot" aria-hidden />
                Anything else
              </div>
              <div className="lt-card-title">Just saying hi.</div>
              <div className="lt-links">
                <a className="lt-pill" href={`mailto:${EMAIL}`}>
                  <span className="lt-pill-label">Email</span>
                  <span className="lt-pill-value">{EMAIL}</span>
                </a>
                <a
                  className="lt-pill"
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="lt-pill-label">WhatsApp</span>
                  <span className="lt-pill-value">{PHONE_DISPLAY}</span>
                </a>
              </div>
            </div>
          </div>

          <div className="lt-footer">
            <span className="lt-footer-text">Rivtara Studio &middot; Mumbai</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
