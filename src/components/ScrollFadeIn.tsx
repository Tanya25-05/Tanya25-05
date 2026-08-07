"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

// Opacity-only scroll reveal (no y/scale) so it never becomes a CSS
// containing block for absolutely-positioned children — used to keep
// hero chrome (badges, audio control) fully invisible on first paint,
// in sync with the name/role text fading in on the same scroll range.
export default function ScrollFadeIn({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.45], [0, 1]);

  return (
    <motion.div ref={ref} style={{ opacity }} className={className}>
      {children}
    </motion.div>
  );
}
