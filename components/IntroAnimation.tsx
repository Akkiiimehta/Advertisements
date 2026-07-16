"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Edit this array to change the wording/timing of the intro sequence.
// Each entry's `hold` is how long (ms) that word stays on screen before
// the next one replaces it.
const SEQUENCE = [
  { word: "LIGHTS.", hold: 300 },
  { word: "CAMERA.", hold: 300 },
  { word: "ACTION.", hold: 340 },
];

const STORAGE_KEY = "ad-portfolio:intro-seen";

interface IntroAnimationProps {
  onDone: () => void;
}

// Renders the full-bleed LIGHTS / CAMERA / ACTION sequence once per
// session, then calls onDone. The parent is responsible for wrapping this
// in <AnimatePresence> so the flash-punch exit transition can play as it
// unmounts. Isolated here so the wording/timing is easy to tweak later
// without touching the grid or chrome.
export default function IntroAnimation({ onDone }: IntroAnimationProps) {
  const [step, setStep] = useState(0);
  const [punching, setPunching] = useState(false);

  function finish() {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // sessionStorage unavailable (e.g. privacy mode) — fine, intro just replays
    }
    onDone();
  }

  useEffect(() => {
    if (step >= SEQUENCE.length) {
      setPunching(true);
      const t = setTimeout(finish, 220);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep((s) => s + 1), SEQUENCE[step].hold);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  useEffect(() => {
    const skip = () => {
      if (!punching) {
        setPunching(true);
        setTimeout(finish, 140);
      }
    };
    window.addEventListener("keydown", skip);
    return () => window.removeEventListener("keydown", skip);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [punching]);

  const current = SEQUENCE[Math.min(step, SEQUENCE.length - 1)].word;

  return (
    <motion.div
      className="intro-overlay"
      role="presentation"
      onClick={() => {
        if (!punching) {
          setPunching(true);
          setTimeout(finish, 140);
        }
      }}
      animate={punching ? { scale: 1.15, opacity: 0 } : { scale: 1, opacity: 1 }}
      transition={{ duration: 0.22, ease: [0.6, 0, 0.4, 1] }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={current}
          className="intro-word"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.14, ease: "easeOut" }}
        >
          {current}
        </motion.span>
      </AnimatePresence>
      <span className="intro-skip">click, or press any key, to skip</span>
    </motion.div>
  );
}
