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
      <div className="absolute inset-0 flex items-center justify-center whitespace-nowrap font-mono text-[clamp(10px,2vw,16px)] font-black leading-none tracking-tight text-white">
        <span>TRR TRR!!</span>
      </div>
    </div>
  );
}
