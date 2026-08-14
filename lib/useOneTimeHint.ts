"use client";

import { useEffect, useState } from "react";

// Shows a one-time UI hint (badge, tooltip, etc.) exactly once per
// browser, then remembers it was seen via localStorage so it never
// reappears — even after a refresh or a new visit. Starts as `null`
// ("unknown yet") rather than `false`, so returning visitors never see
// a flash of the badge before the effect has a chance to hide it.
export function useOneTimeHint(key: string) {
  const [seen, setSeen] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      setSeen(!!window.localStorage.getItem(key));
    } catch {
      // localStorage unavailable (private mode, SSR edge case) — just
      // don't show the hint rather than risk it reappearing forever.
      setSeen(true);
    }
  }, [key]);

  function markSeen() {
    try {
      window.localStorage.setItem(key, "1");
    } catch {
      // ignore — worst case the hint shows again next visit
    }
    setSeen(true);
  }

  return { show: seen === false, markSeen };
}
