"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

// How close the cursor has to get (px) before it bolts.
const DODGE_DISTANCE = 60;
// Ignore further triggers while a flee is still animating, so rapid
// cursor movement mid-chase doesn't retarget it several times a second.
const FLEE_COOLDOWN = 650;

// Picks a spot within the container's own bounds, in the opposite half
// (both axes) from the cursor's position relative to that container —
// so a "flee" reads as a genuine dash across the hero, not a nudge.
function randomFleeTarget(cursorX: number, cursorY: number, w: number, h: number) {
  const xRange = cursorX < w / 2 ? [w * 0.55, w * 0.88] : [w * 0.08, w * 0.42];
  const yRange = cursorY < h / 2 ? [h * 0.55, h * 0.85] : [h * 0.1, h * 0.42];
  return {
    x: xRange[0] + Math.random() * (xRange[1] - xRange[0]),
    y: yRange[0] + Math.random() * (yRange[1] - yRange[0]),
  };
}

// Permanently uncatchable, by design — no "you got it" state.
// position:absolute, confined to its nearest positioned ancestor (the
// hero box) rather than position:fixed — deliberately NOT viewport-
// fixed, so it scrolls away with the hero once the visitor scrolls past
// it instead of trailing them down through the timeline/marquee below.
export default function SkipAdChaser() {
  const ref = useRef<HTMLSpanElement>(null);
  const fleeing = useRef(false);
  const [ready, setReady] = useState(false);

  const left = useMotionValue(0);
  const top = useMotionValue(0);
  const springLeft = useSpring(left, { stiffness: 260, damping: 24 });
  const springTop = useSpring(top, { stiffness: 260, damping: 24 });

  // Starting spot — roughly where it used to sit, near the robot's
  // right arm. Measured against the actual container size rather than
  // window dimensions, now that it's bounded to the hero.
  useEffect(() => {
    const container = ref.current?.offsetParent as HTMLElement | null;
    if (!container) return;
    left.set(container.clientWidth * 0.7);
    top.set(container.clientHeight * 0.42);
    setReady(true);
  }, [left, top]);

  useEffect(() => {
    function handlePointerMove(e: PointerEvent) {
      const el = ref.current;
      const container = el?.offsetParent as HTMLElement | null;
      if (!el || !container || fleeing.current) return;

      const elRect = el.getBoundingClientRect();
      const labelX = elRect.left + elRect.width / 2;
      const labelY = elRect.top + elRect.height / 2;
      const dist = Math.hypot(labelX - e.clientX, labelY - e.clientY);

      if (dist < DODGE_DISTANCE) {
        const containerRect = container.getBoundingClientRect();
        const cursorLocalX = e.clientX - containerRect.left;
        const cursorLocalY = e.clientY - containerRect.top;
        const target = randomFleeTarget(cursorLocalX, cursorLocalY, container.clientWidth, container.clientHeight);
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
