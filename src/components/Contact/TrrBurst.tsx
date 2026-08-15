import { BURST_ART } from "./burstAscii";

export type BurstTint = "pink" | "orange";

// The phone's own two gradient stops (see ContactPhone.tsx's
// LAYER_CLASS) — reused solid rather than blended, since each callout
// in the reference is a single flat color, not a gradient.
const COLOR: Record<BurstTint, string> = {
  pink: "#ec4899",
  orange: "#f97316",
};

export default function TrrBurst({ tint }: { tint: BurstTint }) {
  const color = COLOR[tint];
  return (
    <div className="relative w-fit select-none" style={{ color }}>
      <pre className="whitespace-pre font-mono leading-[1.05] text-[clamp(4px,0.8vw,7px)]">
        {BURST_ART}
      </pre>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 font-mono text-[clamp(8px,1.6vw,13px)] font-bold leading-none tracking-tight">
        <span>TRR</span>
        <span>TRR!!</span>
      </div>
    </div>
  );
}
