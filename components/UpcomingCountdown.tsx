"use client";

import { useEffect, useState } from "react";

// ---------------------------------------------------------------------
// The only line you need to touch. Set to a real ISO date-time string
// to show the countdown, or to `null` to hide this whole section —
// nothing renders, no empty gap left behind, when there's nothing
// upcoming to point to.
//
// Format: "YYYY-MM-DDTHH:MM:SS" (24-hour clock, your local time zone).
// Example: "2026-09-15T23:00:00"
// ---------------------------------------------------------------------
const TARGET_DATE: string | null = "2026-09-15T23:00:00";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(target: Date): TimeLeft | null {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return null; // already passed — treat same as no countdown set
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export default function UpcomingCountdown() {
  const target = TARGET_DATE ? new Date(TARGET_DATE) : null;
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(() => (target ? getTimeLeft(target) : null));

  useEffect(() => {
    if (!target) return;
    const interval = setInterval(() => setTimeLeft(getTimeLeft(target)), 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [TARGET_DATE]);

  if (!target || !timeLeft) return null;

  const formattedDate = target.toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <section className="countdown-section" aria-label="Countdown to upcoming project">
      <div className="countdown-bar">
        <span className="countdown-bar-line" aria-hidden />
        <span className="countdown-bar-label">Upcoming Scene</span>
        <span className="countdown-bar-line" aria-hidden />
      </div>

      <div className="countdown-body">
        <h2 className="countdown-heading">Countdown to next scene</h2>

        <div className="countdown-digits">
          <div className="countdown-unit">
            <span className="countdown-number">{pad(timeLeft.days)}</span>
            <span className="countdown-label">Days</span>
          </div>
          <div className="countdown-unit">
            <span className="countdown-number">{pad(timeLeft.hours)}</span>
            <span className="countdown-label">Hours</span>
          </div>
          <div className="countdown-unit">
            <span className="countdown-number">{pad(timeLeft.minutes)}</span>
            <span className="countdown-label">Minutes</span>
          </div>
          <div className="countdown-unit">
            <span className="countdown-number">{pad(timeLeft.seconds)}</span>
            <span className="countdown-label">Seconds</span>
          </div>
        </div>

        <p className="countdown-date">{formattedDate}</p>
      </div>
    </section>
  );
}
