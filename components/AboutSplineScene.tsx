"use client";

import { useState } from "react";
import Spline from "@splinetool/react-spline";

interface AboutSplineSceneProps {
  sceneUrl: string;
}

// Spline's runtime is client-only and fairly heavy (WebGL), so this is
// always loaded via next/dynamic with ssr:false from the page — see
// app/about/page.tsx. Keeping it in its own component makes that easy to
// swap out later (different scene, or drop it entirely) without touching
// the page layout.
//
// While the real scene loads (several seconds — the runtime itself is a
// few MB before the scene file even starts fetching), a static
// screenshot of the loaded scene sits on top instead of a bare loading
// state, so visitors see a finished-looking hero immediately rather
// than a spinner. Two small floating labels sit either side of the
// robot as a lightweight "still working" signal. Both fade out together
// the moment the real scene reports loaded, crossfading into it rather
// than cutting.
export default function AboutSplineScene({ sceneUrl }: AboutSplineSceneProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="about-spline-wrap">
      <Spline scene={sceneUrl} onLoad={() => setLoaded(true)} className="about-spline" />

      <div className={`about-spline-placeholder ${loaded ? "is-loaded" : ""}`} aria-hidden>
        <img
          className="about-spline-placeholder-img"
          src="/images/about-hero-placeholder.jpg"
          alt=""
          draggable={false}
        />
        <span className="about-spline-callout about-spline-callout-left">Skip AD</span>
        <span className="about-spline-callout about-spline-callout-right">Not Here</span>
      </div>
    </div>
  );
}
