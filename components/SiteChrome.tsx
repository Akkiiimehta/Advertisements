"use client";

import { useState } from "react";
import Link from "next/link";
import { ViewMode } from "./types";

interface SiteChromeProps {
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onFilterClick: () => void;
  activeFilterCount: number;
  activeNav: "work" | "about" | "contact";
  onNavChange: (nav: "work" | "about" | "contact") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function SiteChrome({
  view,
  onViewChange,
  onFilterClick,
  activeFilterCount,
  activeNav,
  onNavChange,
  searchQuery,
  onSearchChange,
}: SiteChromeProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  function closeSearch() {
    setSearchOpen(false);
    onSearchChange("");
  }

  return (
    <div className="chrome" aria-hidden={false}>
      <div className="chrome-corner chrome-top-left">
        <div className="search-control" data-open={searchOpen}>
          <button
            type="button"
            className="search-icon-btn"
            aria-label={searchOpen ? "Close search" : "Search projects"}
            aria-expanded={searchOpen}
            onClick={() => (searchOpen ? closeSearch() : setSearchOpen(true))}
          >
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
              <circle cx="6" cy="6" r="4.4" stroke="currentColor" strokeWidth="1.4" />
              <line x1="9.3" y1="9.3" x2="13" y2="13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
          <input
            className="search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && closeSearch()}
            placeholder="Search brand or project"
            aria-label="Search projects"
            tabIndex={searchOpen ? 0 : -1}
          />
        </div>
      <span className="wordmark">AKI</span>
      </div>

      <div className="chrome-corner chrome-top-center">
        <span className="tagline">Producing ads that don&rsquo;t look like ads.</span>
      </div>

      <div className="chrome-corner chrome-top-right">
        <a className="cta-pill" href="#contact" onClick={() => onNavChange("contact")}>
          Let&rsquo;s talk
        </a>
      </div>

      <div className="chrome-corner chrome-bottom-left">
        <div className="view-toggle" role="group" aria-label="Switch view">
          <button
            className={`view-toggle-btn ${view === "grid" ? "active" : ""}`}
            onClick={() => onViewChange("grid")}
            aria-pressed={view === "grid"}
            aria-label="Grid view"
            title="Grid view"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="5" height="5" fill="currentColor" />
              <rect x="8" y="1" width="5" height="5" fill="currentColor" />
              <rect x="1" y="8" width="5" height="5" fill="currentColor" />
              <rect x="8" y="8" width="5" height="5" fill="currentColor" />
            </svg>
          </button>
          <button
            className={`view-toggle-btn ${view === "list" ? "active" : ""}`}
            onClick={() => onViewChange("list")}
            aria-pressed={view === "list"}
            aria-label="List view"
            title="List view"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1.5" width="12" height="2" fill="currentColor" />
              <rect x="1" y="6" width="12" height="2" fill="currentColor" />
              <rect x="1" y="10.5" width="12" height="2" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>

      <div className="chrome-corner chrome-bottom-center">
        <nav className="site-nav" aria-label="Primary">
          {(["work", "about", "contact"] as const).map((item) =>
            item === "about" ? (
              <Link key={item} href="/about" className="site-nav-item">
                About
              </Link>
            ) : (
              <button
                key={item}
                className={`site-nav-item ${activeNav === item ? "active" : ""}`}
                onClick={() => onNavChange(item)}
              >
                {item[0].toUpperCase() + item.slice(1)}
              </button>
            )
          )}
        </nav>
      </div>

      <div className="chrome-corner chrome-bottom-right">
        <button className="filter-btn" onClick={onFilterClick}>
          Filter
          {activeFilterCount > 0 && <span className="filter-count">{activeFilterCount}</span>}
        </button>
      </div>
    </div>
  );
}
