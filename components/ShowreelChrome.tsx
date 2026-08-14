"use client";

import Link from "next/link";
import SoundToggle from "./SoundToggle";

interface ShowreelChromeProps {
  onEnterArchive: () => void;
  onContactClick: () => void;
  totalCount: number;
}

// Mirrors SiteChrome's six-corner layout (same .chrome / .chrome-corner
// classes, same fixed positioning) so the Netflix-style landing panel
// reads as the same site as the infinite grid, not a separate app
// bolted on top of it.
export default function ShowreelChrome({ onEnterArchive, onContactClick, totalCount }: ShowreelChromeProps) {
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
        <button type="button" className="cta-pill" onClick={onEnterArchive}>
          Full archive
        </button>
      </div>

      <div className="chrome-corner chrome-bottom-center">
        <nav className="site-nav" aria-label="Primary">
          <Link href="/about" className="site-nav-item">
            About
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
