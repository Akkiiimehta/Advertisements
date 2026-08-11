"use client";

import { useEffect, useState } from "react";

interface RouteProgressBarProps {
  done: boolean;
}

// A thin bar across the very top of the viewport. Mounts the instant
// the About page renders — before the Spline runtime has even started
// downloading — so it's the first thing a visitor sees change, which is
// what actually answers "did my click register" in the first half
// second. A static screenshot alone can't do that: it looks identical
// whether something is loading or stuck, since nothing about it moves.
//
// Progress shown is fake in the sense that we don't know the real
// percentage of an external asset load, but it's genuinely tied to
// the real completion event (`done`) — it just fills on a decelerating
// curve in the meantime so it reads as "still working," never
// stalled, and never dishonestly claims 100% before the scene is
// actually ready.
export default function RouteProgressBar({ done }: RouteProgressBarProps) {
  const [progress, setProgress] = useState(6); // starts non-zero — visible from the very first paint
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (done) {
      setProgress(100);
      const t = setTimeout(() => setVisible(false), 400);
      return () => clearTimeout(t);
    }

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 85) return p; // holds here — never fake-finishes before `done`
        const remaining = 85 - p;
        return p + remaining * 0.06;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [done]);

  if (!visible) return null;

  return (
    <div className="route-progress-track" aria-hidden>
      <div className="route-progress-fill" style={{ width: `${progress}%` }} />
    </div>
  );
}
