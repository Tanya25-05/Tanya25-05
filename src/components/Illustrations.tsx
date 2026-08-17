"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import EnamelBadge from "./EnamelBadge";
import SectionHeading from "./SectionHeading";

// react-icons' bundled simple-icons set has no Adobe brand icons at
// all (Illustrator, Photoshop, etc.) — Adobe has a documented history
// of sending takedown requests over its marks, so simple-icons
// dropped them entirely. There's no package with a real Illustrator
// glyph to pull in, so this stays a hand-built "Ai" mark instead, at
// least matching the app icon's actual dark-badge/orange-text
// convention rather than a wrong library import that crashes at
// render time (which is what SiAdobeillustrator — a name that
// doesn't exist in the package — just did).
function IllustratorIcon() {
  return (
    <span
      className="select-none"
      style={{
        fontFamily: "'Arial Black', Arial, sans-serif",
        fontWeight: 900,
        fontSize: 22,
        color: "#f2811d",
        WebkitTextStroke: "1.4px #7a3d00",
        letterSpacing: "-0.03em",
      }}
    >
      Ai
    </span>
  );
}

// A diagonal artist's brush, like a real enamel pin: dark maroon
// handle with a glossy highlight stripe, a brass ferrule band, and a
// pointed dark-brown bristle tip — built from simple vertical shapes
// then rotated 45°, rather than the previous flat, hard-to-read glyph.
function PaintbrushIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
      <g transform="rotate(45 16 16)">
        <rect x="13.5" y="15" width="5" height="15" rx="2.5" fill="#5c1a2b" />
        <rect x="14.4" y="16" width="1.1" height="12.5" rx="0.55" fill="#e69bb0" opacity="0.7" />
        <rect x="12.5" y="9.5" width="7" height="6" rx="1" fill="#d4af37" />
        <rect x="12.5" y="9.5" width="7" height="1.6" rx="0.8" fill="#f4d878" />
        <path d="M13 9.5c0-2.8 1.3-5.7 3-7.5 1.7 1.8 3 4.7 3 7.5h-6z" fill="#3b2412" />
      </g>
    </svg>
  );
}

function FigmaIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path
        d="M8 24c2.21 0 4-1.79 4-4v-4H8c-2.21 0-4 1.79-4 4s1.79 4 4 4z"
        fill="#0ACF83"
        stroke="#d4af37"
        strokeWidth="0.6"
      />
      <path
        d="M4 12c0-2.21 1.79-4 4-4h4v8H8c-2.21 0-4-1.79-4-4z"
        fill="#A259FF"
        stroke="#d4af37"
        strokeWidth="0.6"
      />
      <path
        d="M4 4c0-2.21 1.79-4 4-4h4v8H8C5.79 8 4 6.21 4 4z"
        fill="#F24E1E"
        stroke="#d4af37"
        strokeWidth="0.6"
      />
      <path
        d="M12 0h4c2.21 0 4 1.79 4 4s-1.79 4-4 4h-4V0z"
        fill="#FF7262"
        stroke="#d4af37"
        strokeWidth="0.6"
      />
      <path
        d="M20 12c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4z"
        fill="#1ABCFE"
        stroke="#d4af37"
        strokeWidth="0.6"
      />
    </svg>
  );
}

// Floated inside the scrollable track alongside the collage, at
// positions picked to sit in the gaps between the illustration items
// rather than on the fixed right margin — so they're something you
// come across while panning around, not a static sidebar.
const toolBadges = [
  {
    key: "illustrator",
    top: "38%",
    left: "22%",
    tint: "#000000",
    rotate: -8,
    size: 54,
    href: "https://www.adobe.com/products/illustrator.html",
    label: "Adobe Illustrator",
    icon: <IllustratorIcon />,
  },
  {
    key: "figma",
    top: "80%",
    left: "58%",
    tint: "#000000",
    rotate: 6,
    size: 54,
    href: "https://www.figma.com/",
    label: "Figma",
    icon: <FigmaIcon />,
  },
  {
    key: "brush",
    top: "35%",
    left: "78%",
    tint: "#fff3c4",
    rotate: 10,
    size: 44,
    href: null,
    label: "Hyperrealistic Brush",
    icon: <PaintbrushIcon />,
  },
];

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
// left is deliberately kept out of the ~35-65% band — that's where
// the viewport center (and the wordmark sitting on it) lands at rest,
// and an image directly behind the text there just reads as clutter
// even though the text itself always renders on top.
const collage = [
  { src: "/illustrations/1.png", alt: "Illustration 1", top: "8%", left: "5%", size: "w-44 h-36 sm:w-64 sm:h-48", rotate: -6 },
  { src: "/illustrations/2.png", alt: "Illustration 2", top: "55%", left: "14%", size: "w-40 h-32 sm:w-56 sm:h-40", rotate: 4 },
  { src: "/illustrations/8.png", alt: "Illustration 3", top: "15%", left: "26%", size: "w-40 h-48 sm:w-52 sm:h-64", rotate: 3 },
  { src: "/illustrations/4.png", alt: "Illustration 4", top: "62%", left: "68%", size: "w-44 h-36 sm:w-60 sm:h-44", rotate: -3 },
  { src: "/illustrations/5.png", alt: "Illustration 5", top: "10%", left: "78%", size: "w-48 h-36 sm:w-72 sm:h-48", rotate: -5 },
  { src: "/illustrations/6.png", alt: "Illustration 6", top: "58%", left: "90%", size: "w-36 h-48 sm:w-48 sm:h-64", rotate: 6 },
  { src: "/illustrations/7.png", alt: "Illustration 7", top: "22%", left: "98%", size: "w-36 h-28 sm:w-48 sm:h-36", rotate: -2 },
];

const TRACK_WIDTH_VW = 170;
// Horizontal panning only — the track is exactly as tall as the panel
// (no vertical scroll room at all). Giving this element any vertical
// scroll capacity means a mouse wheel or a touch swipe gets captured
// by the canvas instead of the page: the canvas always has more room
// to consume, so the scroll never chains up and the section becomes
// impossible to scroll past. Horizontal-only avoids that entirely,
// since vertical wheel/swipe input has nothing here to grab onto.
const LERP_X = 0.07;

export default function Illustrations() {
  const panelRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    const track = trackRef.current;
    if (!panel || !track) return;

    const centerScroll = () => {
      panel.scrollLeft = (track.scrollWidth - panel.clientWidth) / 2;
    };
    centerScroll();
    window.addEventListener("resize", centerScroll);

    // A mouse wheel/trackpad gesture over an overflow-x:auto element is
    // browser-dependent about whether it chains up to the page — some
    // trackpads report enough incidental deltaX that the panel keeps
    // consuming the gesture for horizontal panning instead of letting
    // it scroll the page, which is exactly the "stuck here" bug. Take
    // wheel input over unconditionally and always forward it to the
    // page's own vertical scroll, so it can never get captured here.
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      window.scrollBy(0, e.deltaY);
    };
    panel.addEventListener("wheel", onWheel, { passive: false });

    // Native touch-action can't express "prefer horizontal, but still
    // let vertical escape": touch-action:pan-x blocked vertical panning
    // outright, and touch-action:pan-y (letting the browser handle Y
    // "natively") relied on that gesture chaining up to the document
    // once it saw the panel itself has no vertical scroll room
    // (overflow-y:hidden) — which is exactly the "stuck, can't scroll
    // out of the section" bug, since not every mobile browser chains a
    // pan-y gesture off an element that was never a real Y scrollport
    // to begin with. Deciding per-gesture from the touch's own initial
    // direction, then manually driving *both* axes ourselves — the
    // page's own scrollBy for a vertical swipe, exactly like the wheel
    // handler above already does — removes that dependency on native
    // chaining entirely, so escaping the section can't get stuck on a
    // particular browser's touch-action behavior.
    let touchStart: { x: number; y: number } | null = null;
    let touchIsHorizontal: boolean | null = null;
    const DIRECTION_LOCK_PX = 12;
    // A real thumb swipe is rarely perfectly vertical — some sideways
    // drift is normal even when someone means to scroll the page. A
    // plain dx > dy comparison locked onto "horizontal" (panning the
    // carousel) far too easily on that drift, silently eating the
    // vertical scroll for the rest of the gesture — which is exactly
    // what "stuck, can't scroll up/down" was. Requiring dx to clearly
    // beat dy, not just barely, biases ambiguous swipes toward the
    // page scroll instead — getting stuck is a much worse outcome than
    // occasionally needing a more deliberate sideways swipe to pan.
    const HORIZONTAL_BIAS = 1.4;

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      touchStart = { x: t.clientX, y: t.clientY };
      touchIsHorizontal = null;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!touchStart) return;
      const t = e.touches[0];
      const dx = t.clientX - touchStart.x;
      const dy = t.clientY - touchStart.y;

      if (touchIsHorizontal === null) {
        if (Math.hypot(dx, dy) < DIRECTION_LOCK_PX) return;
        touchIsHorizontal = Math.abs(dx) > Math.abs(dy) * HORIZONTAL_BIAS;
      }
      e.preventDefault();
      if (touchIsHorizontal) {
        panel.scrollLeft -= dx;
      } else {
        window.scrollBy(0, -dy);
      }
      touchStart = { x: t.clientX, y: t.clientY };
    };
    const onTouchEnd = () => {
      touchStart = null;
      touchIsHorizontal = null;
    };
    panel.addEventListener("touchstart", onTouchStart, { passive: true });
    panel.addEventListener("touchmove", onTouchMove, { passive: false });
    panel.addEventListener("touchend", onTouchEnd, { passive: true });

    // The hover auto-pan is a desktop nicety layered on top of always-
    // working native scroll — skip it on touch so it never fights a
    // swipe gesture.
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!canHover) {
      return () => {
        window.removeEventListener("resize", centerScroll);
        panel.removeEventListener("wheel", onWheel);
        panel.removeEventListener("touchstart", onTouchStart);
        panel.removeEventListener("touchmove", onTouchMove);
        panel.removeEventListener("touchend", onTouchEnd);
      };
    }

    const target = { x: 0 };
    const smooth = { x: 0 };
    // Below this, the pan is close enough to its target that another
    // frame of scrollLeft writes wouldn't be visible — stop the loop
    // instead of forcing a scroll/layout recompute 60 times a second
    // forever, including while the mouse sits still doing nothing.
    const SETTLE_EPSILON = 0.3;

    const handleMove = (e: MouseEvent) => {
      const rect = panel.getBoundingClientRect();
      const normX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2); // -1..1
      const maxRangeX = (track.scrollWidth - panel.clientWidth) / 2;
      target.x = normX * maxRangeX;
      ensureTicking();
    };
    const handleLeave = () => {
      target.x = 0;
      ensureTicking();
    };

    panel.addEventListener("mousemove", handleMove);
    panel.addEventListener("mouseleave", handleLeave);

    let frameId: number | null = null;
    const tick = () => {
      smooth.x += (target.x - smooth.x) * LERP_X;
      const centerX = (track.scrollWidth - panel.clientWidth) / 2;
      panel.scrollLeft = centerX + smooth.x;
      if (Math.abs(target.x - smooth.x) > SETTLE_EPSILON) {
        frameId = requestAnimationFrame(tick);
      } else {
        frameId = null;
      }
    };
    const ensureTicking = () => {
      if (frameId === null) frameId = requestAnimationFrame(tick);
    };

    return () => {
      window.removeEventListener("resize", centerScroll);
      panel.removeEventListener("wheel", onWheel);
      panel.removeEventListener("touchstart", onTouchStart);
      panel.removeEventListener("touchmove", onTouchMove);
      panel.removeEventListener("touchend", onTouchEnd);
      panel.removeEventListener("mousemove", handleMove);
      panel.removeEventListener("mouseleave", handleLeave);
      if (frameId !== null) cancelAnimationFrame(frameId);
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

      {/* touch-action history here: pan-x blocked vertical panning
          outright (the original "trapped, can't scroll out" bug);
          plain auto let the page's vertical scroll win most real-world
          diagonal swipes before horizontal panning could ever engage (a
          "horizontal lock" the other way); pan-y handed vertical swipes
          to the browser's native handling, which on some mobile
          browsers never chained up to the document (this panel has no
          vertical scroll room of its own) and reintroduced the
          "trapped" bug from a different angle. touch-none hands *both*
          axes to the touchstart/touchmove/touchend handlers above,
          which decide from each gesture's own initial direction and
          then drive either scrollLeft (sideways) or the page's own
          window.scrollBy (vertical) themselves — no native chaining
          involved, so there's nothing left for a particular browser to
          get stuck on. */}
      <div
        ref={panelRef}
        className="absolute inset-0 overflow-x-auto overflow-y-hidden touch-none overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div
          ref={trackRef}
          className="relative h-full"
          style={{
            width: `${TRACK_WIDTH_VW}vw`,
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.16) 1.5px, transparent 1.5px)",
            backgroundSize: "32px 32px",
          }}
        >
          {collage.map((item) => (
            <div
              key={item.src}
              className={`absolute ${item.size} rounded-lg overflow-hidden bg-zinc-800 shadow-[0_12px_30px_rgba(0,0,0,0.45)] transition-[scale] duration-300 ease-out hover:scale-110 hover:z-20`}
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
                className="object-contain select-none"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
              />
            </div>
          ))}

          {toolBadges.map((badge, i) => {
            const content = (
              <EnamelBadge tint={badge.tint} rotate={badge.rotate} size={badge.size} ring="#d4af37">
                {badge.icon}
              </EnamelBadge>
            );
            return (
              <div
                key={badge.key}
                className="absolute animate-float z-20"
                style={{ top: badge.top, left: badge.left, animationDelay: `${i * 0.8}s` }}
              >
                {badge.href ? (
                  <a href={badge.href} target="_blank" rel="noopener noreferrer" aria-label={badge.label}>
                    {content}
                  </a>
                ) : (
                  <div aria-label={badge.label}>{content}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* wordmark sits outside the scroll container so it stays put —
          generous side padding + a capped max size keeps the italic
          serif's swashes from getting clipped by overflow-hidden */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-10 sm:px-16 pointer-events-none z-10">
        <span className="font-mono text-[11px] tracking-[0.4em] text-zinc-400 uppercase mb-2">
          The
        </span>
        {/* leading-none clipped the italic serif "g"'s descender —
            line-height:1 doesn't leave room for it, and with
            bg-clip-text there's no visible box to notice the cutoff
            until it's rendered. A touch of extra line-height and
            bottom padding gives the descender room to actually show. */}
        <span className="font-serif italic text-6xl sm:text-7xl lg:text-8xl leading-[1.2] pb-2 bg-linear-to-r from-pink-400 to-amber-300 bg-clip-text text-transparent">
          Designs
        </span>
      </div>

      <p className="absolute bottom-4 inset-x-0 text-center text-[11px] text-zinc-500 pointer-events-none">
        hover toward an edge to see more — scroll to move on
      </p>
    </section>
  );
}
