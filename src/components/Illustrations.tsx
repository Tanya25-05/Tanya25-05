"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import EnamelBadge from "./EnamelBadge";
import SectionHeading from "./SectionHeading";

function IllustratorIcon() {
  return (
    <span className="font-serif text-[13px] font-bold italic text-white select-none">
      Ai
    </span>
  );
}

function PaintbrushIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M14.5 3.5c1.4-1.4 3.6-1.4 5 0s1.4 3.6 0 5l-6.8 6.8-5-5 6.8-6.8z"
        fill="#e8b978"
      />
      <path
        d="M12.7 9.3l-2.4 2.4c-.6 2.4-2 4.1-4.3 5-1 .4-2 .5-3 .5 1-.6 1.7-1.6 2-2.7.3-1 0-1.8-.6-2.4a3.3 3.3 0 0 1 3-3.8c1-.1 2 .1 2.9-.6l2.4-2.4 2 2z"
        fill="#ffd9ec"
      />
    </svg>
  );
}

// A wide track (170% of the panel) holding the collage, sitting inside
// a native horizontally-scrollable panel — real, always-functional
// scrolling (swipe, trackpad, scrollbar), not a JS re-implementation of
// it. On desktop it's additionally auto-panned by mouse position (see
// the effect below) so hovering toward an edge glides the view toward
// the designs sitting off that side, without fighting a user's own
// manual scroll/swipe (the auto-pan is skipped entirely on touch).
// left% below is relative to that 170%-wide track, not the viewport —
// a handful of items intentionally sit outside the ~59% that's visible
// at rest so there's something new to find at either edge.
// Drop images into public/illustrations/1.png .. 7.png.
const collage = [
  { src: "/illustrations/1.png", alt: "Illustration 1", top: "8%", left: "5%", size: "w-40 h-32 sm:w-60 sm:h-44", rotate: -6 },
  { src: "/illustrations/2.png", alt: "Illustration 2", top: "55%", left: "16%", size: "w-36 h-28 sm:w-52 sm:h-36", rotate: 4 },
  { src: "/illustrations/3.png", alt: "Illustration 3", top: "15%", left: "30%", size: "w-36 h-44 sm:w-48 sm:h-60", rotate: 3 },
  { src: "/illustrations/4.png", alt: "Illustration 4", top: "62%", left: "40%", size: "w-40 h-32 sm:w-56 sm:h-40", rotate: -3 },
  { src: "/illustrations/5.png", alt: "Illustration 5", top: "10%", left: "62%", size: "w-44 h-32 sm:w-64 sm:h-44", rotate: -5 },
  { src: "/illustrations/6.png", alt: "Illustration 6", top: "58%", left: "84%", size: "w-32 h-44 sm:w-44 sm:h-60", rotate: 6 },
  { src: "/illustrations/7.png", alt: "Illustration 7", top: "22%", left: "95%", size: "w-32 h-24 sm:w-44 sm:h-32", rotate: -2 },
];

const TRACK_WIDTH_VW = 170;
const TRACK_HEIGHT_VH = 150;
// Y needs heavier damping than X: the panel is wider than it is tall,
// so the same mouse-pixel movement swings normY past ±1 much faster
// than normX, making vertical pan feel twitchy at the default LERP.
const LERP_X = 0.07;
const LERP_Y = 0.045;

export default function Illustrations() {
  const panelRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    const track = trackRef.current;
    if (!panel || !track) return;

    const centerScroll = () => {
      panel.scrollLeft = (track.scrollWidth - panel.clientWidth) / 2;
      panel.scrollTop = (track.scrollHeight - panel.clientHeight) / 2;
    };
    centerScroll();
    window.addEventListener("resize", centerScroll);

    // The hover auto-pan is a desktop nicety layered on top of always-
    // working native scroll — skip it on touch so it never fights a
    // swipe gesture.
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!canHover) {
      return () => window.removeEventListener("resize", centerScroll);
    }

    const target = { x: 0, y: 0 };
    const smooth = { x: 0, y: 0 };

    const handleMove = (e: MouseEvent) => {
      const rect = panel.getBoundingClientRect();
      const normX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2); // -1..1
      const normY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2); // -1..1
      const maxRangeX = (track.scrollWidth - panel.clientWidth) / 2;
      const maxRangeY = (track.scrollHeight - panel.clientHeight) / 2;
      target.x = normX * maxRangeX;
      target.y = normY * maxRangeY;
    };
    const handleLeave = () => {
      target.x = 0;
      target.y = 0;
    };

    panel.addEventListener("mousemove", handleMove);
    panel.addEventListener("mouseleave", handleLeave);

    let frameId: number;
    const tick = () => {
      smooth.x += (target.x - smooth.x) * LERP_X;
      smooth.y += (target.y - smooth.y) * LERP_Y;
      const centerX = (track.scrollWidth - panel.clientWidth) / 2;
      const centerY = (track.scrollHeight - panel.clientHeight) / 2;
      panel.scrollLeft = centerX + smooth.x;
      panel.scrollTop = centerY + smooth.y;
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", centerScroll);
      panel.removeEventListener("mousemove", handleMove);
      panel.removeEventListener("mouseleave", handleLeave);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <section
      id="designing"
      data-stream-checkpoint="Designing"
      data-stream-x="20"
      className="relative w-full h-[120vh] overflow-hidden bg-zinc-900"
    >
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at 20% 15%, rgba(74,222,128,0.10), transparent 55%), radial-gradient(ellipse at 80% 85%, rgba(236,72,153,0.14), transparent 55%)",
        }}
        aria-hidden
      />

      {/* heading overlaid on the panel itself — no white gap above it */}
      <div className="absolute top-10 inset-x-0 z-30 max-w-4xl mx-auto px-6">
        <SectionHeading index="03" variant="dark">
          Designing
        </SectionHeading>
      </div>

      {/* tool badges — pinned to the panel's right margin */}
      <div className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 flex-col items-center gap-4 z-30">
        <a
          href="https://www.adobe.com/products/illustrator.html"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Adobe Illustrator"
          className="animate-float"
        >
          <EnamelBadge tint="#ff9a3c" rotate={-8} size={44}>
            <IllustratorIcon />
          </EnamelBadge>
        </a>
        <div className="animate-float" style={{ animationDelay: "0.8s" }}>
          <EnamelBadge tint="#fff3c4" rotate={10} size={44}>
            <PaintbrushIcon />
          </EnamelBadge>
        </div>
      </div>

      {/* the scrollable wide + tall canvas */}
      <div
        ref={panelRef}
        className="absolute inset-0 overflow-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div
          ref={trackRef}
          className="relative"
          style={{
            width: `${TRACK_WIDTH_VW}vw`,
            height: `${TRACK_HEIGHT_VH}vh`,
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.16) 1.5px, transparent 1.5px)",
            backgroundSize: "32px 32px",
          }}
        >
          {collage.map((item) => (
            <div
              key={item.src}
              className={`absolute ${item.size} rounded-lg overflow-hidden bg-zinc-800 shadow-[0_12px_30px_rgba(0,0,0,0.45)] transition-[scale] duration-300 ease-out hover:scale-105 hover:z-20`}
              style={{
                top: item.top,
                left: item.left,
                transform: `rotate(${item.rotate}deg)`,
              }}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="260px"
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      {/* wordmark sits outside the scroll container so it stays put —
          generous side padding + a capped max size keeps the italic
          serif's swashes from getting clipped by overflow-hidden */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-10 sm:px-16 pointer-events-none z-10">
        <span className="font-mono text-[11px] tracking-[0.4em] text-zinc-400 uppercase mb-2">
          The
        </span>
        <span className="font-serif italic text-6xl sm:text-7xl lg:text-8xl leading-none bg-linear-to-r from-pink-400 to-amber-300 bg-clip-text text-transparent">
          Designs
        </span>
      </div>

      <p className="absolute bottom-4 inset-x-0 text-center text-[11px] text-zinc-500 pointer-events-none">
        hover toward an edge — or scroll — to see more
      </p>
    </section>
  );
}
