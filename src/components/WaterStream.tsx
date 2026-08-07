"use client";

import { useEffect, useRef, useState } from "react";

type Point = { x: number; y: number };

function buildPath(points: Point[]): string {
  if (points.length === 0) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const cur = points[i];
    const midY = (prev.y + cur.y) / 2;
    d += ` C ${prev.x} ${midY}, ${cur.x} ${midY}, ${cur.x} ${cur.y}`;
  }
  return d;
}

export default function WaterStream() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const glowPathRef = useRef<SVGPathElement | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [path, setPath] = useState("");
  const [glowOffset, setGlowOffset] = useState(0);
  const [glowLength, setGlowLength] = useState(0);
  const [dimmed, setDimmed] = useState(false);
  const [heroCleared, setHeroCleared] = useState(false);
  const heroThresholdRef = useRef(0);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-stream-checkpoint]")
    );
    const heroAnchor = nodes.find((n) => n.dataset.streamCheckpoint === "Hero");
    const heroSection = heroAnchor?.closest("section");

    const measure = () => {
      const wrapperRect = wrapper.getBoundingClientRect();
      const wrapperTop = wrapperRect.top + window.scrollY;
      const width = wrapper.clientWidth;
      const height = wrapper.scrollHeight;

      const points = nodes.map((n) => {
        const xPct = Number(n.dataset.streamX ?? "50");
        const rect = n.getBoundingClientRect();
        return {
          x: (xPct / 100) * width,
          y: rect.top + window.scrollY - wrapperTop,
        };
      });

      setSize({ width, height });
      setPath(buildPath(points));

      // The stream only starts once the hero heading has finished
      // revealing (roughly the first half of the hero's own
      // scroll-through height) — recomputed on resize so it stays
      // accurate if the hero's height changes.
      heroThresholdRef.current = heroSection ? heroSection.offsetHeight * 0.5 : 0;
    };

    measure();
    window.addEventListener("resize", measure);

    const onScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(1, Math.max(0, window.scrollY / docHeight)) : 0;
      setHeroCleared(window.scrollY > heroThresholdRef.current);
      const el = glowPathRef.current;
      if (!el) return;
      const length = el.getTotalLength();
      setGlowLength(length);
      setGlowOffset(length * (1 - progress));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Fade the stream out while a content section is substantially in
    // view, so it never visually cuts through a block of text — it
    // reappears in the transition gaps between sections.
    const contentNodes = nodes.filter(
      (n) => n.dataset.streamCheckpoint !== "Hero"
    );
    const active = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) active.add(entry.target);
          else active.delete(entry.target);
        });
        setDimmed(active.size > 0);
      },
      { threshold: 0.4 }
    );
    contentNodes.forEach((n) => observer.observe(n));

    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, [path]);

  return (
    <div
      ref={wrapperRef}
      className="pointer-events-none absolute inset-0 hidden md:block transition-opacity duration-700"
      style={{ opacity: !heroCleared ? 0 : dimmed ? 0.08 : 1 }}
    >
      <svg
        width={size.width}
        height={size.height}
        viewBox={`0 0 ${size.width} ${size.height}`}
        className="overflow-visible"
      >
        {/* faint always-visible dot-dash guide — the stream's full course */}
        <path
          d={path}
          fill="none"
          stroke="#bfe3f5"
          strokeWidth="2"
          strokeDasharray="1 6 9 6"
          strokeLinecap="round"
          opacity="0.6"
        />
        {/* glowing water — flows further down as the page is scrolled */}
        <path
          ref={glowPathRef}
          d={path}
          fill="none"
          stroke="#22b8e0"
          strokeWidth="3"
          strokeLinecap="round"
          style={{
            strokeDasharray: glowLength,
            strokeDashoffset: glowOffset,
            filter: "drop-shadow(0 0 10px rgba(34,184,224,0.85)) drop-shadow(0 0 22px rgba(34,184,224,0.4))",
            transition: "stroke-dashoffset 150ms linear",
          }}
        />
      </svg>
    </div>
  );
}
