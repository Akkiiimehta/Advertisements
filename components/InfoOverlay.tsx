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
const INSTAGRAM_HANDLE = "@akkiiimehta";
const INSTAGRAM_URL = "https://instagram.com/akkiiimehta";

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

const BackIcon = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path
      d="M12.5 8H3.5M3.5 8 8 3.5M3.5 8 8 12.5"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

type Stage = "start" | "contact";

export default function InfoOverlay({ onClose }: InfoOverlayProps) {
  const [stage, setStage] = useState<Stage>("start");

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
            <AnimatePresence mode="wait" initial={false}>
              {stage === "contact" ? (
                <motion.button
                  key="back"
                  type="button"
                  className="lt-back"
                  onClick={() => setStage("start")}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  <BackIcon />
                  Back
                </motion.button>
              ) : (
                <motion.span
                  key="label"
                  className="lt-eyebrow-label"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="lt-dot" aria-hidden />
                  Let&rsquo;s talk
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <h2 className="lt-heading">
            {stage === "start" ? "Welcome! It's great to meet you." : "Great — pick your favourite way to reach me."}
          </h2>

          <AnimatePresence mode="wait">
            {stage === "start" ? (
              <motion.div
                key="start"
                className="lt-cards"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <button
                  type="button"
                  className="lt-card lt-card-image"
                  onClick={() => setStage("contact")}
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
                </button>

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
              </motion.div>
            ) : (
              <motion.div
                key="contact"
                className="lt-cards"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <a className="lt-card" href={`mailto:${EMAIL}`}>
                  <div className="lt-card-top">
                    <span className="lt-tag-dot" aria-hidden />
                    Email
                  </div>
                  <div className="lt-card-title">{EMAIL}</div>
                  <span className="lt-arrow">
                    <ArrowIcon />
                  </span>
                </a>

                <a
                  className="lt-card"
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="lt-card-top">
                    <span className="lt-tag-dot" aria-hidden />
                    WhatsApp
                  </div>
                  <div className="lt-card-title">{PHONE_DISPLAY}</div>
                  <span className="lt-arrow">
                    <ArrowIcon />
                  </span>
                </a>

                <a className="lt-card" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                  <div className="lt-card-top">
                    <span className="lt-tag-dot" aria-hidden />
                    Instagram
                  </div>
                  <div className="lt-card-title">{INSTAGRAM_HANDLE}</div>
                  <span className="lt-arrow">
                    <ArrowIcon />
                  </span>
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
