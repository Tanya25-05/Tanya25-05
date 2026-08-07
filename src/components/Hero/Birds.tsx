import type { CSSProperties } from "react";

const birds = [
  { top: "10%", duration: 24, delay: 0, scale: 0.9 },
  { top: "18%", duration: 30, delay: 5, scale: 0.75 },
  { top: "6%", duration: 26, delay: 10, scale: 0.8 },
  { top: "24%", duration: 20, delay: 14, scale: 1 },
  { top: "14%", duration: 27, delay: 7, scale: 0.7 },
  { top: "20%", duration: 23, delay: 17, scale: 0.85 },
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
