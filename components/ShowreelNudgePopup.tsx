"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useOneTimeHint } from "@/lib/useOneTimeHint";

interface ShowreelNudgePopupProps {
  onEnterArchive: () => void;
}

const SHOW_DELAY_MS = 12000;

// A single centered popup carrying both nudges — the full archive and
// the About page's 3D scene — with a blurred backdrop so it actually
// commands attention. Clicking the backdrop dismisses it (same pattern
// as ProjectModal) rather than fully trapping the visitor. Fires once
// per 1-hour window (see useOneTimeHint), 12s after the landing panel
// mounts, and stays up until dismissed or a CTA is used.
export default function ShowreelNudgePopup({ onEnterArchive }: ShowreelNudgePopupProps) {
  const hint = useOneTimeHint("aki-nudge-popup-seen");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!hint.show) return;
    const timer = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hint.show]);

  function dismiss() {
    setVisible(false);
    hint.markSeen();
  }

  if (!visible) return null;

  return (
    <div className="showreel-nudge-root">
      <div className="showreel-nudge-backdrop" onClick={dismiss} aria-hidden />

      <div className="showreel-nudge-popup" role="dialog" aria-label="More to explore">
        <button
          type="button"
          className="showreel-nudge-close"
          onClick={dismiss}
          aria-label="Dismiss"
        >
          &times;
        </button>

        <div className="showreel-nudge-row">
          <p className="showreel-nudge-text">
            Psst <span aria-hidden>&mdash;</span> there&rsquo;s a lot more where that came from.
          </p>
          <button
            type="button"
            className="showreel-nudge-btn"
            onClick={() => {
              dismiss();
              onEnterArchive();
            }}
          >
            Full Archive <span aria-hidden>&rarr;</span>
          </button>
        </div>

        <div className="showreel-nudge-divider" aria-hidden />

        <div className="showreel-nudge-row">
          <p className="showreel-nudge-text">Think you can outlast our 3D robot?</p>
          <Link href="/about" className="showreel-nudge-btn" onClick={dismiss}>
            Meet the Robot <span aria-hidden>&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
