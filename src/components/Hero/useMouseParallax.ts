"use client";

import { useEffect, useRef } from "react";

// Scoped to a ref (not document.documentElement — no reason to leak a
// global CSS variable across the whole site for a hero-only effect).
// Written directly via ref on every frame, never through React state,
// so 60fps mouse tracking never triggers a re-render. Desktop-only
// (skipped entirely without a fine pointer) so it never fights touch
// scrolling, and it drives only the back/mid decorative layers — the
// front mountain stays put since it doubles as the text's occluder and
// can't drift out of alignment with it.
export function useMouseParallax() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const target = { x: 0, y: 0 };
    const smooth = { x: 0, y: 0 };

    const handleMove = (e: MouseEvent) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 24;
      target.y = (e.clientY / window.innerHeight - 0.5) * 14;
    };
    window.addEventListener("mousemove", handleMove);

    let frameId: number;
    const tick = () => {
      smooth.x += (target.x - smooth.x) * 0.22;
      smooth.y += (target.y - smooth.y) * 0.22;
      el.style.transform = `translate3d(${smooth.x}px, ${smooth.y}px, 0)`;
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return ref;
}
