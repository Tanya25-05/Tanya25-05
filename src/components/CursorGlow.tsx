"use client";

import { useEffect, useRef, useState } from "react";

const BRUSH_SIZE = 520;
const FADE_PER_FRAME = 0.06;
const STAMP_ALPHA = 0.32;
const POINTER_QUERY = "(hover: hover) and (pointer: fine)";

function makeBrush(): HTMLCanvasElement {
  const brush = document.createElement("canvas");
  brush.width = BRUSH_SIZE;
  brush.height = BRUSH_SIZE;
  const ctx = brush.getContext("2d")!;
  const c = BRUSH_SIZE / 2;

  const glow = ctx.createRadialGradient(c * 0.9, c * 0.85, 0, c, c, c * 0.9);
  glow.addColorStop(0, "rgba(255, 224, 120, 0.42)");
  glow.addColorStop(0.38, "rgba(255, 124, 196, 0.28)");
  glow.addColorStop(0.72, "rgba(255, 238, 166, 0.12)");
  glow.addColorStop(1, "rgba(255, 231, 136, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(c, c, c, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalCompositeOperation = "source-atop";
  ctx.lineCap = "round";

  for (let i = 0; i < 18; i++) {
    const angle = -0.65 + i * 0.075;
    const length = c * (0.38 + (i % 4) * 0.07);
    const start = c * (0.1 + (i % 3) * 0.035);
    ctx.strokeStyle = i % 2 === 0 ? "rgba(255,255,255,0.2)" : "rgba(255,112,185,0.1)";
    ctx.lineWidth = 2 + (i % 3);
    ctx.beginPath();
    ctx.moveTo(c + Math.cos(angle) * start, c + Math.sin(angle) * start);
    ctx.lineTo(c + Math.cos(angle) * length, c + Math.sin(angle) * length);
    ctx.stroke();
  }

  for (let i = 0; i < 9; i++) {
    const offset = (i - 4) * 18;
    const dab = ctx.createRadialGradient(c + offset, c + offset * 0.25, 0, c + offset, c + offset * 0.25, c * 0.2);
    dab.addColorStop(0, i % 2 === 0 ? "rgba(255,236,136,0.14)" : "rgba(255,89,173,0.13)");
    dab.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = dab;
    ctx.beginPath();
    ctx.arc(c + offset, c + offset * 0.25, c * 0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalCompositeOperation = "source-over";
  return brush;
}

export default function CursorGlow() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const section = canvas.closest("section");

    const brush = makeBrush();
    const pointer = { x: -1000, y: -1000, active: false };

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
      pointer.x = x;
      pointer.y = y;
      pointer.active = inside;
    };
    window.addEventListener("mousemove", onMove);

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
          ctx.globalAlpha = STAMP_ALPHA;
          ctx.drawImage(
            brush,
            pointer.x - BRUSH_SIZE / 2,
            pointer.y - BRUSH_SIZE / 2,
            BRUSH_SIZE,
            BRUSH_SIZE
          );
          ctx.globalAlpha = 1;
          pointer.active = false;
        }
      }

      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
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
