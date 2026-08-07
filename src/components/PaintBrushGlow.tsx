"use client";

import { useEffect, useRef, useState } from "react";

// The tip itself is round (a plain dab renders as a circle). Moving
// stretches that same round shape along the direction of travel — the
// faster/farther the cursor moves between frames, the more it
// elongates — which is what makes a pause read as a dot but a swipe
// read as a directional brush stroke.
const BRUSH_SIZE = 66;
const STAMP_ALPHA = 0.7;
const BRUSH_POOL_SIZE = 6;
const STRETCH_PER_PX = 0.09;
const MAX_STRETCH = 3;
// Blur controls halo size only — the shape itself always stays crisp
// (shadowBlur never touches the source pixels, only the shadow cast
// from them), so this can go wide for a real neon glow without
// reintroducing the "spreading" look overlapping stamps once had.
// Set to the same fresh yellow as the fill (not a fixed pink) — a
// blurred 24px halo covers far more area than the crisp core, so a
// constant pink glow was visually drowning out the yellow fill
// underneath on every new stamp. The per-frame age tint below repaints
// this halo's pixels toward pink right along with the fill, so it
// still ends up pink once the stroke has aged — just not from frame one.
const GLOW_COLOR_FRESH = "rgba(255,222,90,0.9)";
const GLOW_BLUR = 24;
const POINTER_QUERY = "(hover: hover) and (pointer: fine)";
// A stamp only lands once the cursor has moved at least this far
// since the last one — without it, every mousemove-driven frame
// stamps again, and at slow/jittery movement that piles dozens of
// overlapping, glowing dabs on nearly the same spot: exactly the
// "spreading blob" and jitter this was meant to fix. Real spacing
// between stamps is what makes a continuous stroke read as calm and
// deliberate instead of frantic, with the individual dabs still
// visibly distinct from each other rather than smeared solid.
const MIN_STAMP_SPACING = 16;
// A single stretched dab is capped at MAX_STRETCH, which can't always
// bridge a fast mouse's full per-frame travel distance — leaving a
// visible gap. Once the gap exceeds this, place several stamps along
// the straight line between the last position and the new one instead
// of just one, so the stroke stays unbroken regardless of speed.
const MAX_SINGLE_STAMP_GAP = BRUSH_SIZE * 0.9;
// Erasing this fraction of the canvas every frame fades a stroke to
// fully, imperceptibly gone by ~4 seconds (~240 frames at 60fps:
// (1-0.019)^240 ≈ 0.0098 opacity remaining — effectively zero, not
// just faint).
const FADE_PER_FRAME = 0.019;
// Every frame, in addition to fading, a translucent pink is tinted
// over the whole canvas's existing (non-transparent) content via
// source-atop — which recolors pixels without touching their alpha.
// Paint is stamped fresh in solid yellow; this pass then ages it
// toward pink over roughly the same ~4s lifetime as the alpha fade,
// so a stroke reads yellow where it was just laid down and pink as it
// nears the end of its life. Deliberately a canvas-wide pass rather
// than a per-stamp gradient — a per-stamp gradient was tried first,
// but consecutive overlapping stamps (spaced far closer than the
// brush's own width, to stay a continuous stroke) kept painting their
// own trailing half directly over the previous stamp's leading half,
// so only a thin sliver at the live tip ever stayed yellow and the
// rest of the stroke read as solid pink. Aging color over time instead
// of position is immune to that: every pixel ages at the same rate
// regardless of how much stamp overlap put it there.
//
// This rate must be much slower than it looks like it should be:
// exponential decay is front-loaded, so even matching FADE_PER_FRAME
// here shifts a stroke roughly halfway to pink within its first
// ~0.6s — long before the 4s fade is anywhere near done — which reads
// as "there's no yellow, just pink" almost immediately. At 0.0065,
// the half-life is ~1.8s, so freshly-drawn paint stays clearly
// yellow-dominant for the first second or so before gradually giving
// way to pink as it nears the end of its life.
const AGE_TINT_PER_FRAME = 0.0065;
const FRESH_COLOR = "rgba(255,222,90,1)";
const AGED_COLOR_RGB = "255,110,205";

// Two layers, not scattered bristle lines: a soft, lighter outer body
// (a closed path with a subtly wobbly radius, so the edge still reads
// as hand-drawn) plus a small, bright, saturated core at the center —
// both tinted the same fresh yellow at stamp time; see AGE_TINT_PER_FRAME
// above for how it ages toward pink afterward. The core is an ellipse
// — already thin along one axis before any stretch — so once the
// whole brush is scaled along the direction of travel, that core
// becomes a thin glowing centerline running through the middle of the
// stroke, like a neon tube. No separate edge/rim marks — those were
// concentrating extra opacity right at each stamp's boundary, and
// where stamps overlapped along a stroke that accumulated into a
// visible leftover "border" outline instead of fading evenly with
// the rest of the mark.
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

  ctx.globalCompositeOperation = "source-atop";
  ctx.fillStyle = FRESH_COLOR;
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
      const brush = brushPool[Math.floor(Math.random() * brushPool.length)];
      ctx.save();
      // shadowBlur/shadowColor glow the shape's own alpha silhouette
      // outward without blurring the shape itself — one draw gives a
      // crisp solid stamp with a neon halo around it for free.
      ctx.shadowColor = GLOW_COLOR_FRESH;
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

    // Plain "mousemove" is coalesced by the browser to (roughly) the
    // display refresh rate before it ever reaches JS — a fast flick
    // can travel further than one event's worth between dispatches,
    // no matter how well the queue below replays what it's given.
    // getCoalescedEvents() exposes the full raw hardware-rate path
    // for the events that did get merged, so every real point the
    // cursor visited is captured, not just what made it through.
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
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
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = `rgba(0,0,0,${FADE_PER_FRAME})`;
        ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        ctx.globalCompositeOperation = "source-over";

        // Ages existing paint toward pink (see AGE_TINT_PER_FRAME
        // above). Runs before this frame's new stamps are drawn, so
        // paint laid down just now stays pure fresh yellow rather than
        // getting nudged toward pink in the same frame it appears.
        ctx.globalCompositeOperation = "source-atop";
        ctx.fillStyle = `rgba(${AGED_COLOR_RGB},${AGE_TINT_PER_FRAME})`;
        ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        ctx.globalCompositeOperation = "source-over";

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
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-5 h-full w-full transition-opacity duration-500"
      style={{ opacity: active ? 0.9 : 0 }}
    />
  );
}
