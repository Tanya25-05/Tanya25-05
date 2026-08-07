"use client";

import { useEffect, useRef, useState } from "react";

// The tip itself is round (a plain dab renders as a circle). Moving
// stretches that same round shape along the direction of travel — the
// faster/farther the cursor moves between frames, the more it
// elongates — which is what makes a pause read as a dot but a swipe
// read as a directional brush stroke.
// Kept small relative to GLOW_BLUR on purpose — a wide halo around a
// small crisp core reads as "glowing brush tip"; a wide halo around a
// brush that's already large starts to look like one continuous soft
// cloud once strokes overlap, hiding the actual stroke shape.
const BRUSH_SIZE = 42;
const STAMP_ALPHA = 0.7;
const BRUSH_POOL_SIZE = 6;
const STRETCH_PER_PX = 0.09;
const MAX_STRETCH = 3;
// Blur controls halo size only — the shape itself always stays crisp
// (shadowBlur never touches the source pixels, only the shadow cast
// from them), so this can go wide for a real neon glow without
// reintroducing the "spreading" look overlapping stamps once had.
const GLOW_BLUR = 40;
const POINTER_QUERY = "(hover: hover) and (pointer: fine)";
// A stamp only lands once the cursor has moved at least this far
// since the last one — without it, every mousemove-driven frame
// stamps again, and at slow/jittery movement that piles dozens of
// overlapping, glowing dabs on nearly the same spot: exactly the
// "spreading blob" and jitter this was meant to fix. Real spacing
// between stamps is what makes a continuous stroke read as calm and
// deliberate instead of frantic, with the individual dabs still
// visibly distinct from each other rather than smeared solid.
const MIN_STAMP_SPACING = 10;
// A single stretched dab is capped at MAX_STRETCH, which can't always
// bridge a fast mouse's full per-frame travel distance — leaving a
// visible gap. Once the gap exceeds this, place several stamps along
// the straight line between the last position and the new one instead
// of just one, so the stroke stays unbroken regardless of speed.
const MAX_SINGLE_STAMP_GAP = BRUSH_SIZE * 0.9;

// A yellow-to-pink gradient over a stroke's life turned out to be
// genuinely hard to get right as a single canvas with a computed
// color aging over time (tried: per-stamp spatial gradients — killed
// by overlapping stamps repainting each other's color; a canvas-wide
// per-frame color tint — required the tint rate and the alpha-fade
// rate to line up almost exactly, or the color shift either happened
// before anyone could see it or arrived only after the stroke had
// already faded past visibility). Two independent layers sidesteps
// all of that: every stamp is drawn twice, once onto each canvas
// below, at the same position/angle/stretch. YELLOW is opaque and
// fades fast (~1s) so it's what you see the instant paint lands. PINK
// is drawn underneath at the same spot and fades slowly (~4s) — while
// yellow is still opaque on top it's completely hidden, and as yellow
// fades out from on top of it, pink is simply what's left showing
// through. No timing coordination needed for the transition to read
// correctly; it falls out of "fast fade on top of a slow fade"
// automatically regardless of the exact rates chosen for either.
type Layer = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  brushPool: HTMLCanvasElement[];
  fadePerFrame: number;
  glowColor: string;
};

// Two layers, not scattered bristle lines: a soft, lighter outer body
// (a closed path with a subtly wobbly radius, so the edge still reads
// as hand-drawn) plus a small, bright, saturated core at the center.
// The core is an ellipse — already thin along one axis before any
// stretch — so once the whole brush is scaled along the direction of
// travel, that core becomes a thin glowing centerline running through
// the middle of the stroke, like a neon tube. No separate edge/rim
// marks — those were concentrating extra opacity right at each
// stamp's boundary, and where stamps overlapped along a stroke that
// accumulated into a visible leftover "border" outline instead of
// fading evenly with the rest of the mark.
function makeBrush(color: string): HTMLCanvasElement {
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

  ctx.globalCompositeOperation = "source-atop";
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, BRUSH_SIZE, BRUSH_SIZE);
  ctx.globalCompositeOperation = "source-over";

  return brush;
}

export default function PaintBrushGlow() {
  const pinkCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const yellowCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const pinkCanvas = pinkCanvasRef.current;
    const yellowCanvas = yellowCanvasRef.current;
    if (!pinkCanvas || !yellowCanvas) return;
    const pinkCtx = pinkCanvas.getContext("2d");
    const yellowCtx = yellowCanvas.getContext("2d");
    if (!pinkCtx || !yellowCtx) return;
    const section = yellowCanvas.closest("section");

    const layers: Layer[] = [
      {
        canvas: pinkCanvas,
        ctx: pinkCtx,
        brushPool: Array.from({ length: BRUSH_POOL_SIZE }, () => makeBrush("rgba(255,90,195,1)")),
        // ~4s: (1-0.019)^240 ≈ 0.0098 remaining.
        fadePerFrame: 0.019,
        glowColor: "rgba(255,90,195,0.9)",
      },
      {
        canvas: yellowCanvas,
        ctx: yellowCtx,
        brushPool: Array.from({ length: BRUSH_POOL_SIZE }, () => makeBrush("rgba(255,222,90,1)")),
        // ~1s: (1-0.075)^60 ≈ 0.0089 remaining.
        fadePerFrame: 0.075,
        glowColor: "rgba(255,222,90,0.9)",
      },
    ];

    // `fresh` marks that there's no meaningful "last position" to
    // measure a drag distance from yet (first stamp ever, or the
    // cursor just re-entered after being outside) — without it, the
    // very first move would compute its distance from the initial
    // off-screen (-1000,-1000) sentinel and render one giant bogus
    // streak across the screen.
    const pointer = { wasInside: false, fresh: true };
    const last = { x: 0, y: 0 };
    // Every real mousemove event queues its point here instead of
    // just overwriting a single "latest position" — sampling only the
    // latest position once per animation frame silently drops
    // whatever intermediate events fired in between, which is exactly
    // what can leave a stroke looking broken on fast movement. The
    // queue guarantees every actual point the cursor visited gets
    // interpolated through, not just a frame-boundary snapshot of it.
    let pending: { x: number; y: number }[] = [];

    const stamp = (x: number, y: number, angle: number, stretch: number) => {
      for (const layer of layers) {
        const brush = layer.brushPool[Math.floor(Math.random() * layer.brushPool.length)];
        layer.ctx.save();
        // shadowBlur/shadowColor glow the shape's own alpha silhouette
        // outward without blurring the shape itself — one draw gives
        // a crisp solid stamp with a neon halo around it for free.
        layer.ctx.shadowColor = layer.glowColor;
        layer.ctx.shadowBlur = GLOW_BLUR;
        layer.ctx.translate(x, y);
        layer.ctx.rotate(angle);
        layer.ctx.scale(stretch, 1);
        layer.ctx.globalAlpha = STAMP_ALPHA;
        layer.ctx.drawImage(brush, -BRUSH_SIZE / 2, -BRUSH_SIZE / 2, BRUSH_SIZE, BRUSH_SIZE);
        layer.ctx.globalAlpha = 1;
        layer.ctx.restore();
      }
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      for (const layer of layers) {
        layer.canvas.width = layer.canvas.clientWidth * dpr;
        layer.canvas.height = layer.canvas.clientHeight * dpr;
        layer.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    };
    resize();
    window.addEventListener("resize", resize);

    // Plain "mousemove" is coalesced by the browser to (roughly) the
    // display refresh rate before it ever reaches JS — a fast flick
    // can travel further than one event's worth between dispatches,
    // no matter how well the queue below replays what it's given.
    // getCoalescedEvents() exposes the full raw hardware-rate path
    // for the events that did get merged, so every real point the
    // cursor visited is captured, not just what made it through.
    const onMove = (e: PointerEvent) => {
      const rect = yellowCanvas.getBoundingClientRect();
      const events = typeof e.getCoalescedEvents === "function" ? e.getCoalescedEvents() : [];
      const points = events.length ? events : [e];
      for (const ev of points) {
        const x = ev.clientX - rect.left;
        const y = ev.clientY - rect.top;
        const inside = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;
        if (inside && !pointer.wasInside) pointer.fresh = true;
        pointer.wasInside = inside;
        if (inside) pending.push({ x, y });
      }
    };
    window.addEventListener("pointermove", onMove);

    // Lays a stroke segment from `last` to (x, y): a plain round dot
    // if there's no meaningful last position yet, otherwise one or
    // more stamps interpolated along the straight line between them
    // (see MAX_SINGLE_STAMP_GAP) so nothing is ever skipped.
    const layTo = (x: number, y: number) => {
      if (pointer.fresh) {
        stamp(x, y, 0, 1);
        last.x = x;
        last.y = y;
        pointer.fresh = false;
        return;
      }

      const dx = x - last.x;
      const dy = y - last.y;
      const dist = Math.hypot(dx, dy);
      if (dist < MIN_STAMP_SPACING) return;

      const angle = Math.atan2(dy, dx);
      const steps = Math.max(1, Math.ceil(dist / MAX_SINGLE_STAMP_GAP));
      const segment = dist / steps;
      const segStretch = Math.min(1 + segment * STRETCH_PER_PX, MAX_STRETCH);
      for (let s = 1; s <= steps; s++) {
        const t = s / steps;
        stamp(last.x + dx * t, last.y + dy * t, angle, segStretch);
      }
      last.x = x;
      last.y = y;
    };

    const mql = window.matchMedia(POINTER_QUERY);
    let hasFinePointer = mql.matches;
    // Checked synchronously here instead of defaulting to false and
    // waiting on the IntersectionObserver's first (async) callback —
    // on a normal page load the hero is already on screen, and there
    // is no reason the canvas should sit fully transparent for that
    // extra tick with nothing telling the user why.
    let heroVisible = section
      ? (() => {
          const r = section.getBoundingClientRect();
          return r.top < window.innerHeight && r.bottom > 0;
        })()
      : false;
    const updateActive = () => setActive(hasFinePointer && heroVisible);
    updateActive();
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
        for (const layer of layers) {
          layer.ctx.globalCompositeOperation = "destination-out";
          layer.ctx.fillStyle = `rgba(0,0,0,${layer.fadePerFrame})`;
          layer.ctx.fillRect(0, 0, layer.canvas.clientWidth, layer.canvas.clientHeight);
          layer.ctx.globalCompositeOperation = "source-over";
        }

        if (pending.length) {
          // Every point actually visited since the last frame, laid
          // down in order — not just wherever the cursor happens to
          // be right now — so a fast flick still traces its real path
          // continuously instead of skipping straight to the end.
          for (const p of pending) layTo(p.x, p.y);
          pending = [];
        }
      }

      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      mql.removeEventListener("change", onMqlChange);
      observer?.disconnect();
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <>
      <canvas
        ref={pinkCanvasRef}
        className="pointer-events-none absolute inset-0 z-5 h-full w-full transition-opacity duration-500"
        style={{ opacity: active ? 0.5 : 0 }}
      />
      <canvas
        ref={yellowCanvasRef}
        className="pointer-events-none absolute inset-0 z-5 h-full w-full transition-opacity duration-500"
        style={{ opacity: active ? 0.5 : 0 }}
      />
    </>
  );
}
