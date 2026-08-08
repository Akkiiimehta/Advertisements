"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

// How close the cursor has to get (px) before the label starts dodging.
const DODGE_DISTANCE = 90;
// How far the label can be pushed from its home spot (px). Keeps it
// leashed near the robot's arm instead of letting it roam the page.
const LEASH_RADIUS = 70;

// Sits near the robot's arm (same spot the old static "Skip Ad" label
// used) — permanently uncatchable, by design: there's no "you got it"
// state, it just always has somewhere left to go within its leash.
export default function SkipAdChaser() {
  const ref = useRef<HTMLSpanElement>(null);
  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);
  const springX = useSpring(offsetX, { stiffness: 300, damping: 22 });
  const springY = useSpring(offsetY, { stiffness: 300, damping: 22 });

  useEffect(() => {
    function handlePointerMove(e: PointerEvent) {
      const el = ref.current;
      if (!el) return;

      // Measure from the label's HOME position, not its current
      // (possibly already-offset) position — otherwise the dodge target
      // keeps compounding against itself as it moves, instead of always
      // reacting to where it actually started.
      const rect = el.getBoundingClientRect();
      const homeX = rect.left + rect.width / 2 - offsetX.get();
      const homeY = rect.top + rect.height / 2 - offsetY.get();

      const dx = homeX - e.clientX;
      const dy = homeY - e.clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < DODGE_DISTANCE) {
        const pushStrength = 1 - dist / DODGE_DISTANCE; // closer = stronger push, 0..1
        const angle = Math.atan2(dy, dx);
        offsetX.set(Math.cos(angle) * LEASH_RADIUS * pushStrength);
        offsetY.set(Math.sin(angle) * LEASH_RADIUS * pushStrength);
      } else {
        offsetX.set(0);
        offsetY.set(0);
      }
    }

    // Listens globally rather than only within the hero area — cheap
    // (just a distance check), and means the dodge already starts the
    // moment the cursor crosses into range, not only once it's already
    // over the hero container.
    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.span
      ref={ref}
      className="about-spline-callout about-spline-callout-chase"
      style={{ x: springX, y: springY }}
      aria-hidden
    >
      Skip Ad
    </motion.span>
  );
}
