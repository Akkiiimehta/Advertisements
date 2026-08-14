"use client";

import { useEffect, useState } from "react";

const WINDOW_MS = 60 * 60 * 1000; // 1 hour

// Shows a UI hint (popup, badge, tooltip, etc.) once, then hides it for
// a rolling 1-hour window on this browser before it's eligible to show
// again — rather than "forever" (too easy to burn permanently while
// testing) or "every refresh" (too naggy for someone re-visiting
// mid-session). Starts as `null` ("unknown yet") rather than `false`,
// so a browser mid-cooldown never sees a flash of the hint before the
// effect has a chance to check localStorage.
export function useOneTimeHint(key: string) {
  const [eligible, setEligible] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const last = window.localStorage.getItem(key);
      const lastShown = last ? parseInt(last, 10) : 0;
      setEligible(Date.now() - lastShown > WINDOW_MS);
    } catch {
      // localStorage unavailable (private mode, SSR edge case) — just
      // don't show the hint rather than risk it showing every render.
      setEligible(false);
    }
  }, [key]);

  function markSeen() {
    try {
      window.localStorage.setItem(key, String(Date.now()));
    } catch {
      // ignore — worst case the hint shows again next time
    }
    setEligible(false);
  }

  return { show: eligible === true, markSeen };
}
