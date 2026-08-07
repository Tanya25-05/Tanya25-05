import type { CSSProperties } from "react";

// Delays are negative on purpose: a positive animation-delay leaves a
// bird frozen at the animation's starting keyframe (the left edge)
// until its delay elapses, which is exactly what produced the "all
// queued up waiting to go" look on first load. A negative delay makes
// the browser treat the animation as already having been running for
// that long, so every bird starts mid-flight — already spread across
// the sky — the instant the page renders.
const birds = [
  { top: "10%", duration: 24, delay: -0, scale: 0.9 },
  { top: "18%", duration: 30, delay: -5, scale: 0.75 },
  { top: "6%", duration: 26, delay: -10, scale: 0.8 },
  { top: "24%", duration: 20, delay: -14, scale: 1 },
  { top: "14%", duration: 27, delay: -7, scale: 0.7 },
  { top: "20%", duration: 23, delay: -17, scale: 0.85 },
];

export default function Birds() {
  return (
    <>
      {birds.map((b, i) => (
        <span
          key={i}
          className="bird absolute z-25 animate-bird-fly"
          style={{
            top: b.top,
            left: 0,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
            "--bird-scale": b.scale,
          } as CSSProperties}
          aria-hidden
        >
          <span className="bird-wing bird-wing-left" />
          <span className="bird-body" />
          <span className="bird-wing bird-wing-right" />
        </span>
      ))}
    </>
  );
}
