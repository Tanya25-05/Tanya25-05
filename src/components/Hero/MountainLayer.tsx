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

// vw-based clamp keeps every layer full-bleed at any viewport width
// while staying pixel-aligned with the other layers (they all share
// the same clamp expression).
const GRID_FONT = "text-[clamp(6px,1.2vw,22px)] leading-[clamp(7px,1.3vw,24px)]";

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
