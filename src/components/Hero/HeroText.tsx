"use client";

import { useContext } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";
import { HeroScrollContext } from "./HeroScrollContext";
import { BACK_HEIGHT_CSS } from "./mountainMetrics";

export default function HeroText() {
  const ctxProgress = useContext(HeroScrollContext);
  const fallback = useMotionValue(1);
  const scrollYProgress = ctxProgress ?? fallback;

  // No opacity fade — that was the bug. A block-wide fade makes the
  // whole thing pop in at once no matter how slow it's stretched out.
  // The reveal instead comes from physics: the text starts low enough
  // (50vh below rest) to sit entirely behind the mid/front mountains
  // in the stacking order, fully opaque the whole time, and is only
  // ever visible where it has already climbed clear of their opaque
  // silhouette — so it's genuinely, progressively uncovered as it
  // rises, never a flat fade-in. The rise itself starts instantly on
  // the first scroll input (no dead zone) but is stretched over a
  // wide scroll range so it reads as a slow climb, and finishes well
  // before the section unpins (~0.58 progress) leaving a long stable
  // stretch before the page moves on.
  const y = useTransform(scrollYProgress, [0, 0.35], ["50vh", "0vh"]);
  const blurPx = useTransform(scrollYProgress, [0, 0.35], [6, 0]);
  const filter = useTransform(blurPx, (v) => `blur(${v}px)`);

  return (
    <motion.div
      style={{ y, filter, bottom: BACK_HEIGHT_CSS }}
      className="absolute inset-x-0 z-10 flex flex-col items-center px-6 text-center"
    >
      <p className="mb-2 font-serif text-2xl italic text-zinc-700 sm:text-3xl">Hi, I&apos;m</p>
      <h1 className="font-serif text-7xl font-bold italic text-pink-600 sm:text-8xl lg:text-9xl">
        Tanya Verma
      </h1>
    </motion.div>
  );
}
