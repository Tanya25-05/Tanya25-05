"use client";

import { motion } from "motion/react";

type SectionHeadingProps = {
  index: string;
  children: React.ReactNode;
  variant?: "light" | "dark";
};

export default function SectionHeading({ index, children, variant = "light" }: SectionHeadingProps) {
  return (
    <motion.h2
      initial={{ opacity: 0, scale: 1.6, y: 12 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="mb-8 flex flex-nowrap items-baseline gap-3 origin-bottom-left text-left whitespace-nowrap"
    >
      <span className="font-mono text-xs tracking-[0.2em] text-pink-500">
        § {index}
      </span>
      <span
        className={`font-serif italic font-medium text-[40px] ${variant === "dark" ? "text-zinc-50" : "text-zinc-800"}`}
      >
        {children}
      </span>
    </motion.h2>
  );
}
