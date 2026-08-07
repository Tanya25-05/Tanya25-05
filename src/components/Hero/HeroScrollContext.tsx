"use client";

import { createContext } from "react";
import type { MotionValue } from "motion/react";

// Shared scroll progress for the hero section, measured against the
// section itself (not a small nested text block) so the window is the
// full hero height — reveal starts reacting from the very first pixel
// of scroll instead of needing a "dead zone" of scrolling before
// anything visibly happens.
export const HeroScrollContext = createContext<MotionValue<number> | null>(null);
