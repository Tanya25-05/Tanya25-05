"use client";

import { useEffect, useState } from "react";

// Live "what time is it for Tanya" badge, pinned to the bottom-right
// corner of the viewport. Time is IST-only (Intl.DateTimeFormat with
// a fixed timeZone) regardless of the visitor's own timezone, since
// the point is showing *her* local time, not theirs. Rendered as null
// until the first client-side tick so the server-rendered markup (no
// Date available server-side) always matches the initial client
// render — filling in a real time immediately on mount instead would
// otherwise mismatch and trigger a hydration warning.
function currentIST(): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).formatToParts(new Date());
  const hour = parts.find((p) => p.type === "hour")?.value ?? "--";
  const minute = parts.find((p) => p.type === "minute")?.value ?? "--";
  return `${hour}:${minute} IST`;
}

export default function StatusClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(currentIST());
    const firstTick = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(firstTick);
      clearInterval(id);
    };
  }, []);

  if (!time) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2.5 rounded-xl border border-zinc-200 bg-white/90 px-4 py-2.5 shadow-[0_6px_20px_rgba(0,0,0,0.08)] backdrop-blur-sm sm:bottom-6 sm:right-6">
      <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-red-500" aria-hidden />
      <div className="leading-tight">
        <p className="font-mono text-sm font-bold tracking-wide text-zinc-800">{time}</p>
        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-zinc-400">
          Probably grinding
        </p>
      </div>
    </div>
  );
}
