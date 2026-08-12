"use client";

import { useState } from "react";
import Spline from "@splinetool/react-spline";
import SkipAdChaser from "./SkipAdChaser";

interface AboutSplineSceneProps {
  sceneUrl: string;
  onLoaded?: () => void;
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
// than a spinner. That screenshot layer fades out the moment the real
// scene reports loaded.
//
// SkipAdChaser is a SEPARATE layer from that screenshot — deliberately,
// since it's meant to stay visible permanently, not just during the
// load. See SkipAdChaser.tsx for the dodge behavior itself.
export default function AboutSplineScene({ sceneUrl, onLoaded }: AboutSplineSceneProps) {
  const [loaded, setLoaded] = useState(false);

  function handleLoad() {
    setLoaded(true);
    onLoaded?.();
  }

  return (
    <div className="about-spline-wrap">
      <Spline scene={sceneUrl} onLoad={handleLoad} className="about-spline" />

      <div className={`about-spline-placeholder ${loaded ? "is-loaded" : ""}`} aria-hidden>
        <img
          className="about-spline-placeholder-img"
          src="/images/about-hero-placeholder.jpg"
          alt=""
          draggable={false}
        />
      </div>

      <div className="about-spline-callouts">
        <SkipAdChaser />
      </div>
    </div>
  );
}
