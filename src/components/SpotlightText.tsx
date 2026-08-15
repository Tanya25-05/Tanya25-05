import type { CSSProperties } from "react";

type SpotlightTextProps = {
  className?: string;
  baseColor: string;
  children: string;
};

// The zoom/color effect (see globals.css's .spotlight-text::after and
// SpotlightCursor.tsx) works by rendering a second, white, scaled-up
// copy of the same text via a ::after pseudo-element's content:
// attr(data-text) — which needs the text as a plain HTML attribute
// value, not JSX children (which can carry markup/interpolation a
// plain string attribute can't). Routing every usage through this one
// component keeps the visible text and the data-text copy guaranteed
// identical — no risk of them drifting out of sync the way manually
// repeating the string at each call site would risk.
export default function SpotlightText({ className = "", baseColor, children }: SpotlightTextProps) {
  return (
    <p
      className={`spotlight-text ${className}`}
      data-text={children}
      style={{ "--spotlight-base": baseColor } as CSSProperties}
    >
      {children}
    </p>
  );
}
