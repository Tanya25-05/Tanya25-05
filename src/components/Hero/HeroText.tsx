"use client";

import { useContext } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";
import { HeroScrollContext } from "./HeroScrollContext";

export default function HeroText() {
  const ctxProgress = useContext(HeroScrollContext);
  const fallback = useMotionValue(1);
  const scrollYProgress = ctxProgress ?? fallback;

  // Hidden on first view — only fades and rises into place once the
  // user starts scrolling, free to overlap the back mountain layer.
  const opacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.28], ["24vh", "0vh"]);
  const blurPx = useTransform(scrollYProgress, [0, 0.28], [5, 0]);
  const filter = useTransform(blurPx, (v) => `blur(${v}px)`);

  return (
    <motion.div
      style={{ opacity, y, filter }}
      className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
    >
      <p className="mb-2 font-serif text-xl italic text-zinc-700 sm:text-2xl">Hi, I&apos;m</p>
      <h1 className="lowercase italic bg-linear-to-r from-zinc-700 via-pink-600 to-amber-500 bg-clip-text font-serif text-6xl font-bold text-transparent sm:text-7xl lg:text-8xl">
        Tanya Verma
      </h1>
    </motion.div>
  );
}
