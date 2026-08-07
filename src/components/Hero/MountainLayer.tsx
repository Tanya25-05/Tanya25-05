"use client";

import { motion } from "motion/react";

interface Props {
  ascii: string;
  opacity: number;
  blur: number;
  gradient: string;
  sway: number;
  duration: number;
}

// Font-size stays purely vw-driven — it sets the total canvas width
// (140 monospace columns × char width), which must track viewport
// *width* only or it'll overflow and get clipped on narrow phones.
// Leading (row height) instead blends vw with vh: on tall, narrow
// phones a vw-only row height collapses to a thin sliver at the
// bottom, leaving the mountains and the birds (positioned by top %)
// looking like two disconnected scenes. Mixing in vh lets the range
// grow with screen *height* too, so the silhouette stays a reasonable
// fraction of the viewport on any aspect ratio.
const GRID_FONT =
  "text-[clamp(3px,1.2vw,22px)] leading-[clamp(4px,calc(0.6vw+1vh),26px)]";

// Decorative back/mid layers only — a slow idle sway for atmosphere.
// The front layer (FrontMountainMask) stays perfectly still since it
// doubles as the physical occluder for the hero text.
export default function MountainLayer({ ascii, opacity, blur, gradient, sway, duration }: Props) {
  return (
    <motion.pre
      className={`absolute inset-x-0 bottom-0 font-mono ${GRID_FONT} whitespace-pre text-left select-none ${gradient} bg-clip-text text-transparent`}
      style={{ opacity, filter: blur ? `blur(${blur}px)` : undefined }}
      animate={{ y: [0, -sway, 0] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden
    >
      {ascii}
    </motion.pre>
  );
}
