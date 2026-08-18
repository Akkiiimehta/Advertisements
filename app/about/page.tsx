"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import "@fontsource-variable/sora";
import SoundToggle from "@/components/SoundToggle";
import SkipAdChaser from "@/components/SkipAdChaser";
import AboutTimeline from "@/components/AboutTimeline";
import BrandMarquee from "@/components/BrandMarquee";
import RouteProgressBar from "@/components/RouteProgressBar";
// Intro bio popup — removed per request. The component itself is left
// in place at components/AboutIntroModal.tsx if you want it back later;
// just re-add this import and the <AboutIntroModal /> line below.
// import AboutIntroModal from "@/components/AboutIntroModal";

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

// Session-only, deliberately — a fresh browser session (new tab, next
// day) sees the full loading experience again, since the actual scene
// does need to load fresh each time regardless. This just stops it
// from re-showing on every single Work <-> About hop within one visit.
const ABOUT_SEEN_KEY = "ad-portfolio:about-hero-seen";

export default function AboutPage() {
  const [heroLoaded, setHeroLoaded] = useState(false);

  // Defaults to true (show the loading UI) — matching what the server
  // always builds, since it has no sessionStorage to check. Flipped to
  // false in an effect, AFTER hydration, if this session's already seen
  // it. This is the same fix as the intro-replay bug from earlier: the
  // check has to happen after hydration, never inside a useState
  // initializer, or a returning visitor's first client render
  // structurally diverges from the server's output and hydration fails
  // outright rather than just flashing something briefly.
  const [showLoadingUI, setShowLoadingUI] = useState(true);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(ABOUT_SEEN_KEY) === "1") setShowLoadingUI(false);
    } catch {
      // sessionStorage unavailable — just show the loading UI normally
    }
  }, []);

  function handleHeroLoaded() {
    setHeroLoaded(true);
    try {
      sessionStorage.setItem(ABOUT_SEEN_KEY, "1");
    } catch {
      // sessionStorage unavailable — fine, it'll just show again next time
    }
  }

  return (
    <main className="about-page">
      {showLoadingUI && <RouteProgressBar done={heroLoaded} />}

      <div className="about-topbar">
        <Link href="/" className="about-back">
          &larr; Work
        </Link>
        <SoundToggle />
      </div>

      <div className="about-hero">
        <AboutSplineScene sceneUrl={SPLINE_SCENE_URL} onLoaded={handleHeroLoaded} />
        <div className="about-hero-text">
          <span className="about-eyebrow">About</span>
          <h1 className="about-heading">Yash &ldquo;Aki&rdquo; Mehta</h1>
          <p className="about-hero-lede">
              Mumbai-based AI Engineer who found his way into advertising as an Assistant Director & Creative Producer  
          where analytical thinking meets creative instinct, 
          turning complex problems into sharp ideas and bringing them to life across TVCs,
          brand films, and social-first campaigns.

          </p>
        </div>
      </div>

      <div className="about-content">
        <p className="about-body-text">
 Recent work spans QSR, quick-commerce, and performance-focused
          campaigns, for brands including KFC India, Zepto, MuscleBlaze,etc..
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
