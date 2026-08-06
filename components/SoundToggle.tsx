"use client";

import { useSound } from "./SoundProvider";

export default function SoundToggle() {
  const { soundOn, toggleSound } = useSound();

  return (
    <button
      type="button"
      className="sound-toggle"
      onClick={toggleSound}
      aria-pressed={soundOn}
      aria-label={soundOn ? "Turn sound off" : "Turn sound on"}
    >
      Sound&nbsp;[{soundOn ? "ON" : "OFF"}]
    </button>
  );
}
