"use client";

import Link from "next/link";
import SoundToggle from "./SoundToggle";
import { useIdle } from "@/lib/useIdle";
import { useSeenFlag } from "@/lib/useSeenFlag";

interface ShowreelChromeProps {
  onEnterArchive: () => void;
  onContactClick: () => void;
  totalCount: number;
}

const IDLE_MS = 4000;

// Mirrors SiteChrome's six-corner layout (same .chrome / .chrome-corner
// classes, same fixed positioning) so the Netflix-style landing panel
// reads as the same site as the infinite grid, not a separate app
// bolted on top of it.
//
// The old one-time tooltip + nav badge that lived here have been
// consolidated into ShowreelNudgePopup (rendered by ShowreelLanding) —
// one popup instead of several small competing hints. This component
// keeps the ambient idle-pulse + shimmer on the archive button, since
// that's ongoing decoration rather than a one-time nudge.
export default function ShowreelChrome({ onEnterArchive, onContactClick, totalCount }: ShowreelChromeProps) {
  const idle = useIdle(IDLE_MS);
  const aboutBadge = useSeenFlag("aki-about-badge-seen");

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
        <button
          type="button"
          className={`cta-pill showreel-archive-btn ${idle ? "showreel-pulse" : ""}`}
          onClick={onEnterArchive}
        >
          <span className="showreel-archive-btn-label">Full archive</span>
        </button>
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
