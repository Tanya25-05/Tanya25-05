"use client";

import { useEffect, useId, useRef, useState } from "react";
import SpotlightText from "./SpotlightText";

export type TimelineItem = {
  role: string;
  company: string;
  duration: string;
  points: string[];
};

// A thick, wavy, gradient-filled ribbon down the left edge — built as
// a closed shape (a sine-wave centerline, offset left/right by half
// the ribbon thickness at each sample, then stitched into one path)
// rather than a stroked line, so it can actually be filled with a
// gradient and given its own outline instead of just being a colored
// line. Same page-wide "flows as you scroll" idea as WaterStream, but
// scoped to this timeline and always visible rather than dimming
// while the section is in view.
const WAVE_CENTER = 16;
const AMPLITUDE = 6;
const WAVELENGTH = 26;
const THICKNESS = 4.5;
const STEPS = 60;

function buildRibbonPath(): string {
  const left: string[] = [];
  const right: string[] = [];
  for (let i = 0; i <= STEPS; i++) {
    const y = (i / STEPS) * 100;
    const cx = WAVE_CENTER + AMPLITUDE * Math.sin((y / WAVELENGTH) * Math.PI * 2);
    left.push(`${(cx - THICKNESS).toFixed(2)} ${y.toFixed(2)}`);
    right.push(`${(cx + THICKNESS).toFixed(2)} ${y.toFixed(2)}`);
  }
  right.reverse();
  return `M ${left[0]} L ${left.slice(1).join(" L ")} L ${right.join(" L ")} Z`;
}

const RIBBON_PATH = buildRibbonPath();

export default function Timeline({ items }: { items: TimelineItem[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [revealHeight, setRevealHeight] = useState(0);
  // clipPath ids must be unique per instance — Experience and
  // Education both render a Timeline, and two elements sharing one
  // hardcoded id would leave the browser free to resolve either
  // ribbon's clip to whichever id it finds first.
  const clipId = useId();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onScroll = () => {
      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 as the container's top just enters the bottom of the
      // viewport, 1 once its bottom reaches the top — i.e. how far
      // you've scrolled "through" it, not just whether it's visible.
      const progress = Math.min(1, Math.max(0, (vh - rect.top) / (rect.height + vh)));
      setRevealHeight(progress * 100);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative pl-12 space-y-10">
      <svg
        className="absolute left-0 top-0 h-full w-8 overflow-visible"
        viewBox="0 0 32 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id={`${clipId}-gradient`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
          <clipPath id={`${clipId}-clip`}>
            {/* height set via style, not a plain attribute — only
                style-driven SVG geometry gets CSS transitions */}
            <rect x="0" y="0" width="32" style={{ height: revealHeight, transition: "height 150ms linear" }} />
          </clipPath>
        </defs>

        {/* faint base ribbon, the wave's full course through this timeline */}
        <path
          d={RIBBON_PATH}
          fill={`url(#${clipId}-gradient)`}
          fillOpacity="0.25"
          stroke="#f9a8d4"
          strokeWidth="0.6"
        />

        {/* vivid ribbon, flows further down as the timeline scrolls by */}
        <g clipPath={`url(#${clipId}-clip)`}>
          <path
            d={RIBBON_PATH}
            fill={`url(#${clipId}-gradient)`}
            stroke="#ec4899"
            strokeWidth="0.9"
            style={{ filter: "drop-shadow(0 0 4px rgba(236,72,153,0.55))" }}
          />
        </g>
      </svg>

      {items.map((e, i) => (
        <div key={e.role + e.company} className="relative">
          <p className="font-mono text-xs tracking-[0.15em] text-zinc-400 mb-2">
            № {String(i + 1).padStart(2, "0")} — {e.duration.toUpperCase()}
          </p>
          <h3 className="font-serif text-3xl text-zinc-900 mb-3">{e.role}</h3>
          <div className="w-10 h-px bg-pink-300 mb-3" aria-hidden />
          <SpotlightText className="text-sm leading-6" baseColor="#52525b">
            {`${e.company} — ${e.points.join(" ")}`}
          </SpotlightText>
        </div>
      ))}
    </div>
  );
}
