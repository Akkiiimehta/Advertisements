"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import "@fontsource-variable/sora";

const AboutSplineScene = dynamic(() => import("@/components/AboutSplineScene"), {
  ssr: false,
});

const SPLINE_SCENE_URL = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

export default function AboutPage() {
  return (
    <main className="about-page">
      <div className="about-topbar">
        <Link href="/" className="about-back">
          &larr; Work
        </Link>
      </div>

      <div className="about-hero">
        <AboutSplineScene sceneUrl={SPLINE_SCENE_URL} />
        <div className="about-hero-text">
          <span className="about-eyebrow">About</span>
          <h1 className="about-heading">Yash &ldquo;Aki&rdquo; Mehta</h1>
        </div>
      </div>

      <div className="about-content">
        <p className="about-lede">
          Mumbai-based creative producer working across TVCs, brand films, and
          social-first campaigns — from concept and casting through the final
          export.
        </p>
        <p className="about-body-text">
          Recent work spans QSR, quick-commerce, and performance-focused
          campaigns, for brands including KFC India, Zepto, and MuscleBlaze.
        </p>

        <div className="about-links">
          <Link href="/#contact" className="about-link-pill">
            Get in touch
          </Link>
        </div>
      </div>
    </main>
  );
}
