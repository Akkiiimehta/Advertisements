"use client";

import { useEffect, useRef, useState } from "react";

const EVENTS = ["mousemove", "scroll", "touchstart", "keydown", "wheel"] as const;

export function useIdle(delayMs: number) {
  const [idle, setIdle] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    function reset() {
      setIdle(false);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setIdle(true), delayMs);
    }
    reset();
    EVENTS.forEach((evt) => window.addEventListener(evt, reset, { passive: true }));
    return () => {
      EVENTS.forEach((evt) => window.removeEventListener(evt, reset));
      if (timer.current) clearTimeout(timer.current);
    };
  }, [delayMs]);

  return idle;
}
