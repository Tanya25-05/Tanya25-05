// Static stand-in for PaintBrushGlow's paint-trail effect, which only
// ever runs on a fine pointer with hover (see its own POINTER_QUERY
// gate) — there's no equivalent "hover and drag" gesture on a touch
// screen, so mobile visitors got none of the hero's paint motif at
// all. These are pre-drawn instead of interactive: a few soft,
// blurred, rotated gradient streaks in the same pink-to-amber palette
// as the cursor trail, sitting at the same z-5 layer (behind the
// hero text and mid mountain, in front of the back one) so mobile
// reads as a fixed variant of the same look rather than a different
// decoration.
const STROKES = [
  { top: "10%", left: "-8%", width: 190, height: 22, rotate: -20, from: "#ec4899", to: "#fbbf24" },
  { top: "62%", left: "70%", width: 160, height: 18, rotate: 14, from: "#fbbf24", to: "#ec4899" },
  { top: "34%", left: "58%", width: 120, height: 16, rotate: -32, from: "#ec4899", to: "#fbbf24" },
];

export default function HeroBrushStrokesMobile() {
  return (
    <div className="pointer-events-none absolute inset-0 z-5 overflow-hidden md:hidden" aria-hidden>
      {STROKES.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full opacity-30 blur-xl"
          style={{
            top: s.top,
            left: s.left,
            width: s.width,
            height: s.height,
            transform: `rotate(${s.rotate}deg)`,
            background: `linear-gradient(90deg, ${s.from}, ${s.to})`,
          }}
        />
      ))}
    </div>
  );
}
