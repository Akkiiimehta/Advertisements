"use client";

import { useEffect, useState } from "react";

// Permanent, until explicitly marked seen — unlike useOneTimeHint's
// 1-hour rolling window, this stays hidden forever once triggered and
// never reappears on a timer. Meant for things that should disappear
// the moment someone's actually clicked through once (e.g. the About
// nav "3D" badge), not nudges that should be able to resurface for a
// returning visitor.
export function useSeenFlag(key: string) {
  const [seen, setSeen] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      setSeen(!!window.localStorage.getItem(key));
    } catch {
      // localStorage unavailable — don't show rather than risk showing
      // every render.
      setSeen(true);
    }
  }, [key]);

  function markSeen() {
    try {
      window.localStorage.setItem(key, "1");
    } catch {
      // ignore — worst case it shows again next visit
    }
    setSeen(true);
  }

  return { show: seen === false, markSeen };
}
