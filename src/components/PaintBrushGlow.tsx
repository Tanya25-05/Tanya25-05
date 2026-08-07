"use client";

import { useEffect, useRef, useState } from "react";

// The tip itself is round (a plain click/dot renders as a circle).
// Dragging stretches that same round shape along the direction of
// travel — the faster/farther the cursor moves between frames, the
// more it elongates — which is what makes a stationary dab read as a
// dot but a swipe read as a directional brush stroke.
const BRUSH_SIZE = 66;
const STAMP_ALPHA = 0.62;
const BRUSH_POOL_SIZE = 6;
const STRETCH_PER_PX = 0.09;
const MAX_STRETCH = 3;
// Kept tight on purpose — a wide blur balloons every stamp well past
// its actual solid silhouette, and with many overlapping stamps that
// reads as the paint "spreading" out instead of tracing the cursor's
// actual path.
const GLOW_COLOR = "rgba(255,64,190,0.95)";
const GLOW_BLUR = 8;
const POINTER_QUERY = "(hover: hover) and (pointer: fine)";
// A stamp only lands once the cursor has moved at least this far
// since the last one — without it, every mousemove-driven frame
// stamps again, and at slow/jittery movement that piles dozens of
// overlapping, glowing dabs on nearly the same spot: exactly the
// "spreading blob" and jitter this was meant to fix. Real spacing
// between stamps is what makes a continuous stroke read as calm and
// deliberate instead of frantic.
const MIN_STAMP_SPACING = 5;
// A single stretched dab is capped at MAX_STRETCH, which can't always
// bridge a fast mouse's full per-frame travel distance — leaving a
// visible gap. Once the gap exceeds this, place several stamps along
// the straight line between the last position and the new one instead
// of just one, so the stroke stays unbroken regardless of speed.
const MAX_SINGLE_STAMP_GAP = BRUSH_SIZE * 0.9;
// Erasing this fraction of the canvas every frame fades a stroke to
// fully, imperceptibly gone by ~3 seconds (~180 frames at 60fps:
// (1-0.025)^180 ≈ 0.011 opacity remaining — effectively zero, not
// just faint).
const FADE_PER_FRAME = 0.025;

// Two layers, not scattered bristle lines: a soft, lighter outer body
// (a closed path with a subtly wobbly radius, so the edge still reads
// as hand-drawn) plus a small, bright, saturated core at the center.
// The core is an ellipse — already thin along one axis before any
// stretch — so once the whole brush is scaled along the direction of
// travel, that core becomes a thin glowing centerline running through
// the middle of the stroke, like a neon tube: soft light color
// around a bright thin line. No separate edge/rim marks — those were
// concentrating extra opacity right at each stamp's boundary, and
// where stamps overlapped along a stroke that accumulated into a
// visible leftover "border" outline instead of fading evenly with
// the rest of the mark. Tinted front-to-back along the local x-axis
// (pink → yellow); once rotated to the direction of travel at stamp
// time, local +x becomes the leading edge, so yellow always leads.
function makeBrush(): HTMLCanvasElement {
  const brush = document.createElement("canvas");
  brush.width = BRUSH_SIZE;
  brush.height = BRUSH_SIZE;
  const ctx = brush.getContext("2d")!;
  const c = BRUSH_SIZE / 2;
  const baseR = c * 0.84;

  const points = 26;
  ctx.beginPath();
  for (let i = 0; i <= points; i++) {
    const angle = (i / points) * Math.PI * 2;
    const wobble = 1 + (Math.random() - 0.5) * 0.1;
    const r = baseR * wobble;
    const x = c + Math.cos(angle) * r;
    const y = c + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(c, c, baseR * 0.34, baseR * 0.13, 0, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.fill();

  const tint = ctx.createLinearGradient(0, 0, BRUSH_SIZE, 0);
  tint.addColorStop(0, "rgba(236,72,153,0.98)");
  tint.addColorStop(1, "rgba(255,205,55,0.98)");
  ctx.globalCompositeOperation = "source-atop";
  ctx.fillStyle = tint;
  ctx.fillRect(0, 0, BRUSH_SIZE, BRUSH_SIZE);
  ctx.globalCompositeOperation = "source-over";

  return brush;
}

export default function PaintBrushGlow() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const section = canvas.closest("section");

    const brushPool = Array.from({ length: BRUSH_POOL_SIZE }, () => makeBrush());
    // `fresh` marks that there's no meaningful "last position" to
    // measure a drag distance from yet (first stamp ever, or the
    // cursor just re-entered after being outside) — without it, the
    // very first move would compute its distance from the initial
    // off-screen (-1000,-1000) sentinel and render one giant bogus
    // streak across the screen.
    const pointer = { x: -1000, y: -1000, active: false, wasInside: false, fresh: true };
    const last = { x: 0, y: 0 };

    const stamp = (x: number, y: number, angle: number, stretch: number) => {
      const brush = brushPool[Math.floor(Math.random() * brushPool.length)];
      ctx.save();
      // shadowBlur/shadowColor glow the shape's own alpha silhouette
      // outward without blurring the shape itself — one draw gives a
      // crisp solid stamp with a neon halo around it for free.
      ctx.shadowColor = GLOW_COLOR;
      ctx.shadowBlur = GLOW_BLUR;
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.scale(stretch, 1);
      ctx.globalAlpha = STAMP_ALPHA;
      ctx.drawImage(brush, -BRUSH_SIZE / 2, -BRUSH_SIZE / 2, BRUSH_SIZE, BRUSH_SIZE);
      ctx.globalAlpha = 1;
      ctx.restore();
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const inside = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;
      if (inside && !pointer.wasInside) pointer.fresh = true;
      pointer.wasInside = inside;
      pointer.x = x;
      pointer.y = y;
      pointer.active = inside;
    };
    window.addEventListener("mousemove", onMove);

    // A genuine click with no drag never fires mousemove, so it would
    // otherwise never get a mark — stamp a plain round dot for it.
    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || x > rect.width || y < 0 || y > rect.height) return;
      stamp(x, y, 0, 1);
      last.x = x;
      last.y = y;
      pointer.fresh = false;
      pointer.wasInside = true;
    };
    window.addEventListener("click", onClick);

    const mql = window.matchMedia(POINTER_QUERY);
    let hasFinePointer = mql.matches;
    let heroVisible = false;
    const updateActive = () => setActive(hasFinePointer && heroVisible);
    const onMqlChange = () => {
      hasFinePointer = mql.matches;
      updateActive();
    };
    mql.addEventListener("change", onMqlChange);

    let observer: IntersectionObserver | undefined;
    if (section) {
      observer = new IntersectionObserver(
        ([entry]) => {
          heroVisible = entry.isIntersecting;
          updateActive();
        },
        { threshold: 0.15 }
      );
      observer.observe(section);
    }

    let frameId: number;
    const tick = () => {
      if (hasFinePointer && heroVisible) {
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = `rgba(0,0,0,${FADE_PER_FRAME})`;
        ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        ctx.globalCompositeOperation = "source-over";

        if (pointer.active) {
          const dx = pointer.x - last.x;
          const dy = pointer.y - last.y;
          const dist = Math.hypot(dx, dy);

          if (pointer.fresh) {
            stamp(pointer.x, pointer.y, 0, 1);
          } else if (dist >= MIN_STAMP_SPACING) {
            const angle = dist > 0.5 ? Math.atan2(dy, dx) : 0;
            // Break a large jump into evenly spaced stamps along the
            // straight line from the last position to this one, each
            // covering only its own short segment — keeps the stroke
            // visually unbroken instead of one dab straining (and
            // failing, once capped) to bridge the whole distance.
            const steps = Math.max(1, Math.ceil(dist / MAX_SINGLE_STAMP_GAP));
            const segment = dist / steps;
            const segStretch = Math.min(1 + segment * STRETCH_PER_PX, MAX_STRETCH);
            for (let s = 1; s <= steps; s++) {
              const t = s / steps;
              stamp(last.x + dx * t, last.y + dy * t, angle, segStretch);
            }
          }

          if (pointer.fresh || dist >= MIN_STAMP_SPACING) {
            last.x = pointer.x;
            last.y = pointer.y;
            pointer.fresh = false;
          }
          pointer.active = false;
        }
      }

      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click", onClick);
      mql.removeEventListener("change", onMqlChange);
      observer?.disconnect();
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-30 h-full w-full transition-opacity duration-500"
      style={{ opacity: active ? 0.9 : 0 }}
    />
  );
}
