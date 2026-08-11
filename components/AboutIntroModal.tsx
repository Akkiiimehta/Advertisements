"use client";

interface AboutIntroModalProps {
  onSkip: () => void;
}

// Shown only on a visitor's first time hitting the About page in a
// session (see app/about/page.tsx) — sits in front of the loading
// scene while RouteProgressBar fills behind it, then unmounts the
// instant the real scene reports loaded.
//
// The skip button is a deliberate safety net, not part of the original
// ask: if the Spline scene ever fails to load (network issue, CDN
// outage), this would otherwise be a permanent, undismissable wall
// between the visitor and the rest of the page. Skipping just closes
// the modal early — the placeholder screenshot is still there
// underneath, same as before this modal existed.
export default function AboutIntroModal({ onSkip }: AboutIntroModalProps) {
  return (
    <div className="about-intro-backdrop">
      <div className="about-intro-card" role="dialog" aria-label="About Yash Mehta">
        <span className="about-intro-eyebrow">While that loads</span>
        <h2 className="about-intro-heading">Yash &ldquo;Aki&rdquo; Mehta</h2>
        <p className="about-intro-text">
          Mumbai-based creative producer working across TVCs, brand films, and
          social-first campaigns — from concept and casting through the final
          export. Recent work spans QSR, quick-commerce, and performance-focused
          campaigns, for brands including KFC India, Zepto, and MuscleBlaze.
        </p>
        <button className="about-intro-skip" onClick={onSkip}>
          Skip &rarr;
        </button>
      </div>
    </div>
  );
}
