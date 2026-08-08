"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

// How close the cursor has to get (px) before it bolts.
const DODGE_DISTANCE = 150;
// Ignore further triggers while a flee is still animating, so rapid
// cursor movement mid-chase doesn't retarget it several times a second.
const FLEE_COOLDOWN = 650;

// Picks a spot in the opposite half of the viewport from the cursor —
// both horizontally and vertically — so a "flee" is a genuine dash to
// the other side of the screen, not a small nudge in a random direction.
function randomFleeTarget(cursorX: number, cursorY: number, vw: number, vh: number) {
  const xRange = cursorX < vw / 2 ? [vw * 0.55, vw * 0.9] : [vw * 0.1, vw * 0.45];
  const yRange = cursorY < vh / 2 ? [vh * 0.55, vh * 0.82] : [vh * 0.14, vh * 0.42];
  return {
    x: xRange[0] + Math.random() * (xRange[1] - xRange[0]),
    y: yRange[0] + Math.random() * (yRange[1] - yRange[0]),
  };
}

// Permanently uncatchable, by design — no "you got it" state. Fixed to
// the viewport (not the hero box) so it can run anywhere on the page,
// not just near the robot's arm.
export default function SkipAdChaser() {
  const ref = useRef<HTMLSpanElement>(null);
  const fleeing = useRef(false);
  const [ready, setReady] = useState(false);

  const left = useMotionValue(0);
  const top = useMotionValue(0);
  const springLeft = useSpring(left, { stiffness: 260, damping: 24 });
  const springTop = useSpring(top, { stiffness: 260, damping: 24 });

  // Starting spot — roughly where it used to sit, near the robot's
  // right arm. Needs real window dimensions, so this only runs once
  // mounted client-side.
  useEffect(() => {
    left.set(window.innerWidth * 0.68);
    top.set(window.innerHeight * 0.32);
    setReady(true);
  }, [left, top]);

  useEffect(() => {
    function handlePointerMove(e: PointerEvent) {
      const el = ref.current;
      if (!el || fleeing.current) return;

      const rect = el.getBoundingClientRect();
      const labelX = rect.left + rect.width / 2;
      const labelY = rect.top + rect.height / 2;
      const dist = Math.hypot(labelX - e.clientX, labelY - e.clientY);

      if (dist < DODGE_DISTANCE) {
        const target = randomFleeTarget(e.clientX, e.clientY, window.innerWidth, window.innerHeight);
        left.set(target.x);
        top.set(target.y);
        fleeing.current = true;
        setTimeout(() => {
          fleeing.current = false;
        }, FLEE_COOLDOWN);
      }
    }

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.span
      ref={ref}
      className="about-spline-callout-chase"
      style={{ left: springLeft, top: springTop, opacity: ready ? 1 : 0 }}
      aria-hidden
    >
      Skip Ad
    </motion.span>
  );
}
