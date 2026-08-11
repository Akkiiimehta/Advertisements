"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import "@fontsource-variable/sora";
import SoundToggle from "@/components/SoundToggle";
import SkipAdChaser from "@/components/SkipAdChaser";
import AboutTimeline from "@/components/AboutTimeline";
import BrandMarquee from "@/components/BrandMarquee";
import RouteProgressBar from "@/components/RouteProgressBar";

const AboutSplineScene = dynamic(() => import("@/components/AboutSplineScene"), {
  ssr: false,
  loading: () => (
    <div className="about-spline-wrap">
      <div className="about-spline-placeholder is-loading-chunk" aria-hidden>
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
  ),
});

const SPLINE_SCENE_URL = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

export default function AboutPage() {
  const [heroLoaded, setHeroLoaded] = useState(false);

  return (
    <main className="about-page">
      <RouteProgressBar done={heroLoaded} />

      <div className="about-topbar">
        <Link href="/" className="about-back">
          &larr; Work
        </Link>
        <SoundToggle />
      </div>

      <div className="about-hero">
        <AboutSplineScene sceneUrl={SPLINE_SCENE_URL} onLoaded={() => setHeroLoaded(true)} />
        <div className="about-hero-text">
          <span className="about-eyebrow">About</span>
          <h1 className="about-heading">Yash &ldquo;Aki&rdquo; Mehta</h1>
          <p className="about-hero-lede">
            Mumbai-based creative producer working across TVCs, brand films, and
            social-first campaigns — from concept and casting through the final
            export.
          </p>
        </div>
      </div>

      <div className="about-content">
        <p className="about-body-text">
          Recent work spans QSR, quick-commerce, and performance-focused
          campaigns, for brands including KFC India, Zepto, and MuscleBlaze.
        </p>

        <div className="about-links">
          <Link href="/#contact" className="about-link-pill">
            Get in touch
          </Link>
        </div>

        <AboutTimeline />
        <BrandMarquee />
      </div>
    </main>
  );
}
