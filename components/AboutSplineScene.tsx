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
export default function AboutSplineScene({ sceneUrl }: AboutSplineSceneProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="about-spline-wrap">
      <Spline scene={sceneUrl} onLoad={() => setLoaded(true)} className="about-spline" />
      {!loaded && <div className="about-spline-placeholder" aria-hidden />}
    </div>
  );
}
