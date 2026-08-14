"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SoundToggle from "./SoundToggle";
import { useIdle } from "@/lib/useIdle";
import { useOneTimeHint } from "@/lib/useOneTimeHint";

interface ShowreelChromeProps {
  onEnterArchive: () => void;
  onContactClick: () => void;
  totalCount: number;
}

const IDLE_MS = 4000;
const HINT_DELAY_MS = 5000;
const HINT_VISIBLE_MS = 3600;

// Mirrors SiteChrome's six-corner layout (same .chrome / .chrome-corner
// classes, same fixed positioning) so the Netflix-style landing panel
// reads as the same site as the infinite grid, not a separate app
// bolted on top of it.
export default function ShowreelChrome({ onEnterArchive, onContactClick, totalCount }: ShowreelChromeProps) {
  const idle = useIdle(IDLE_MS);
  const archiveHint = useOneTimeHint("aki-archive-hint-seen");
  const aboutBadge = useOneTimeHint("aki-about-badge-seen");
  const [showTooltip, setShowTooltip] = useState(false);

  // Fires once, ever, a fixed 5s after the panel mounts — deliberately
  // NOT tied to the idle/scroll state. Someone actively scrolling
  // through the rows (the most natural first thing to do) would keep
  // resetting an idle-based timer forever, so it would never fire for
  // exactly the people it's meant to help.
  useEffect(() => {
    if (!archiveHint.show) return;
    const showTimer = setTimeout(() => {
      setShowTooltip(true);
      archiveHint.markSeen();
    }, HINT_DELAY_MS);
    return () => clearTimeout(showTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [archiveHint.show]);

  useEffect(() => {
    if (!showTooltip) return;
    const hideTimer = setTimeout(() => setShowTooltip(false), HINT_VISIBLE_MS);
    return () => clearTimeout(hideTimer);
  }, [showTooltip]);

  return (
    <div className="chrome">
      <div className="chrome-corner chrome-top-left">
        <span className="wordmark">AKI</span>
        <SoundToggle />
      </div>

      <div className="chrome-corner chrome-top-center">
        <span className="tagline">Producing ads that don&rsquo;t look like ads.</span>
      </div>

      <div className="chrome-corner chrome-top-right">
        <button type="button" className="cta-pill" onClick={onContactClick}>
          Let&rsquo;s talk
        </button>
      </div>

      <div className="chrome-corner chrome-bottom-left">
        <div className="showreel-archive-nudge">
          <button
            type="button"
            className={`cta-pill showreel-archive-btn ${idle ? "showreel-pulse" : ""}`}
            onClick={onEnterArchive}
          >
            <span className="showreel-archive-btn-label">Full archive</span>
          </button>
          {showTooltip && (
            <span className="showreel-archive-hint" role="status">
              psst, there&rsquo;s more &rarr;
            </span>
          )}
        </div>
      </div>

      <div className="chrome-corner chrome-bottom-center">
        <nav className="site-nav" aria-label="Primary">
          <Link href="/about" className="site-nav-item" onClick={aboutBadge.markSeen}>
            About
            {aboutBadge.show && (
              <span className="nav-badge" aria-hidden>
                3D
              </span>
            )}
          </Link>
          <button type="button" className="site-nav-item" onClick={onContactClick}>
            Contact
          </button>
        </nav>
      </div>

      <div className="chrome-corner chrome-bottom-right">
        <span className="showreel-count-badge">{totalCount} PROJECTS</span>
      </div>
    </div>
  );
}
