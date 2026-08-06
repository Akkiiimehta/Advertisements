"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

interface SoundContextValue {
  soundOn: boolean;
  toggleSound: () => void;
  duckAudio: () => void;
  unduckAudio: () => void;
}

const SoundContext = createContext<SoundContextValue | null>(null);

// Path to the background track — add your own file at this exact path
// (public/audio/background.mp3) and it just works, no code changes
// needed. Until that file exists, the toggle renders and is fully
// functional, it just has nothing to actually play (the browser fails
// the load silently, no crash).
const TRACK_SRC = "/audio/background.mp3";

// Lives in the root layout (see app/layout.tsx) so this single <audio>
// element survives client-side navigation between pages — going to
// /about and back doesn't restart the track or duplicate the element,
// because the layout tree that owns it never unmounts.
export function SoundProvider({ children }: { children: React.ReactNode }) {
  // Defaults to ON — see the effect below for why this alone doesn't
  // start playback immediately.
  const [soundOn, setSoundOn] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Mirrors soundOn but read inside duck/unduck via .current instead of
  // closure capture — a modal's effect calls unduckAudio() from a
  // cleanup function that could technically run after soundOn has
  // changed since the modal opened; reading a ref instead of a captured
  // value means it always sees the true current preference.
  const soundOnRef = useRef(soundOn);
  useEffect(() => {
    soundOnRef.current = soundOn;
  }, [soundOn]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (soundOn) {
      // .play() only resolves reliably when called from a real user
      // gesture (the toggle click) — calling it here in response to
      // state changing FROM that click satisfies that requirement.
      // Catch is required: browsers reject the promise if a user
      // manages to toggle twice fast enough to race the load.
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [soundOn]);

  useEffect(() => {
    // Browsers block audio.play() with sound until the visitor has
    // interacted with the page at least once — no code can bypass
    // this, it's a platform-level restriction. This listens for their
    // FIRST interaction anywhere on the site (most commonly clicking
    // or pressing a key to skip the intro screen, which nearly every
    // visitor does within their first second) and uses that as the
    // permission to start playing — so from the visitor's experience,
    // sound starts the moment they enter the site rather than
    // requiring them to specifically find and click the toggle.
    function unlock() {
      if (soundOnRef.current) audioRef.current?.play().catch(() => {});
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    }
    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  function toggleSound() {
    setSoundOn((prev) => !prev);
  }

  // Pause the track WITHOUT flipping the user's on/off preference — the
  // toggle should still show "ON" while a project video is open, and
  // resume automatically the moment it closes. Used by ProjectModal so
  // background music and a project's video never play over each other.
  function duckAudio() {
    audioRef.current?.pause();
  }

  function unduckAudio() {
    if (soundOnRef.current) audioRef.current?.play().catch(() => {});
  }

  return (
    <SoundContext.Provider value={{ soundOn, toggleSound, duckAudio, unduckAudio }}>
      {children}
      <audio ref={audioRef} src={TRACK_SRC} loop preload="none" />
    </SoundContext.Provider>
  );
}

export function useSound(): SoundContextValue {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSound must be used within SoundProvider");
  return ctx;
}
