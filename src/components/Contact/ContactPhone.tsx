"use client";

import { useEffect, useState } from "react";
import { DIAL_CENTER_GRID, PHONE_COLS, PHONE_ROWS, generatePhoneLayers } from "./phoneAscii";
import TrrBurst, { type BurstTint } from "./TrrBurst";

// Generated once — the layout is pure math with no per-render inputs,
// same as Hero.tsx hoisting its mountain layers to module scope.
const LAYERS = generatePhoneLayers();

// All four corners, touching the phone's own silhouette rather than
// floating off away from it, alternating tint around the loop so
// consecutive spawns are never the same color. Percentages are
// relative to the phone's bounding box (the ascii drawing is `w-fit`).
const BURST_SLOTS: { top: string; left: string; tint: BurstTint }[] = [
  { top: "-4%", left: "-6%", tint: "orange" }, // top-left
  { top: "-4%", left: "90%", tint: "pink" }, // top-right
  { top: "90%", left: "86%", tint: "orange" }, // bottom-right
  { top: "90%", left: "-6%", tint: "pink" }, // bottom-left
];
// Matches the burst-pop animation's own duration (globals.css)
// exactly, so the next callout's pop-in starts right as the previous
// one's pop-out finishes — back-to-back with no dead gap between them.
const BURST_CYCLE_MS = 550;
const BURST_TOTAL_MS = 6800;

export type PhonePhase =
  | "idle"
  | "drawing"
  | "dial"
  | "receiver"
  | "ready"
  | "ringing"
  | "connecting"
  | "revealed";

// One shared look for all three layers — an orange-to-pink gradient
// doubled up (200% width) so the same background can either sit still
// at its resting position (reads as a plain left-to-right gradient)
// or sweep via background-position for the hover shimmer, without
// swapping stylesheets between the two states.
const LAYER_CLASS =
  "whitespace-pre font-mono leading-[1.05] text-transparent bg-clip-text bg-[length:200%_100%] bg-[linear-gradient(90deg,#f97316,#ec4899,#f97316,#ec4899)] select-none";

type ContactPhoneProps = {
  // Owned and advanced entirely by the parent (ContactSection) — this
  // component just renders whatever phase it's told. Previously this
  // ran its own internal phase state *and* a separate "clickable"
  // prop the parent set from its own, different phase state, with the
  // two required to land in sync via a callback on every render for
  // hover/click (and even the "Click me" button showing up at all) to
  // work. One state, owned in one place, removes that entire class of
  // bug by construction instead of patching around it again.
  phase: PhonePhase;
  onActivate?: () => void;
};

export default function ContactPhone({ phase, onActivate }: ContactPhoneProps) {
  const [hovered, setHovered] = useState(false);

  const revealed = phase !== "idle";
  const interactive = phase === "ready";
  // Hover styling (shimmer, dial tilt, receiver lift) is cosmetic and
  // should keep working for as long as the phone is drawn on screen —
  // it used to be tied to `interactive` (phase === "ready" only), so
  // it silently stopped responding to the mouse forever after the
  // first click moved the phase past "ready". Only the click-to-call
  // behavior itself (cursor, onClick, aria role) stays gated on
  // `interactive`.
  const hoverActive = revealed && hovered;
  const dialOriginStyle = {
    transformOrigin: `${(DIAL_CENTER_GRID.col / PHONE_COLS) * 100}% ${(DIAL_CENTER_GRID.row / PHONE_ROWS) * 100}%`,
  };
  const dialHoverTransform = hoverActive ? "rotate(18deg)" : undefined;
  const receiverHoverTransform = hoverActive ? "translateY(-5px)" : undefined;

  // One callout on screen at a time: pick a random slot, hold it for
  // BURST_CYCLE_MS (the burst-pop animation's own length), then jump
  // to a different slot. `key` forces React to remount the burst on
  // every jump so its pop-in/pop-out animation replays from scratch
  // instead of just re-positioning mid-animation.
  //
  // Driven by clickPulse rather than `phase` — phase only ever passes
  // through "ringing" once (the state machine is one-directional, and
  // stays on "revealed" forever after), but the callouts should fire
  // every time the phone is clicked, including clicks after it's
  // already been revealed. Each click bumps clickPulse, which
  // restarts this effect regardless of what `phase` is doing.
  const [burst, setBurst] = useState<{ slot: number; key: number } | null>(null);
  const [clickPulse, setClickPulse] = useState(0);
  useEffect(() => {
    if (clickPulse === 0) return;
    let slot = 0;
    let key = 0;
    const spawn = () => {
      key += 1;
      setBurst({ slot, key });
      slot = (slot + 1) % BURST_SLOTS.length;
    };
    spawn();
    const id = setInterval(spawn, BURST_CYCLE_MS);
    const stop = setTimeout(() => {
      clearInterval(id);
      setBurst(null);
    }, BURST_TOTAL_MS);
    return () => {
      clearInterval(id);
      clearTimeout(stop);
    };
  }, [clickPulse]);

  return (
    <div
      className="relative mx-auto w-fit"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        setClickPulse((c) => c + 1);
        if (interactive) onActivate?.();
      }}
      role={interactive ? "button" : undefined}
      aria-label={interactive ? "Call to reveal contact details" : undefined}
    >
      {/* Wrapping clip-path wipe is what makes all three layers draw
          themselves in together, left to right, as one image instead
          of three separately-appearing pieces. Sized by the base
          layer's normal-flow content below — not a fixed/forced
          aspect-ratio, which wouldn't actually match this many rows
          and columns of monospace text and would stretch the phone
          out of shape. The dial/receiver layers are absolutely
          overlaid on top of that same box, at font sizes matched via
          shared classes, so they land in exact registration. */}
      <div
        className={`relative text-[clamp(4.5px,1vw,7.5px)] ${revealed ? "animate-phone-draw" : ""}`}
        style={revealed ? undefined : { clipPath: "inset(0 100% 0 0)" }}
      >
        <pre className={`${LAYER_CLASS} ${hoverActive ? "animate-ascii-shimmer" : ""}`}>
          {LAYERS.base}
        </pre>
        <pre
          className={`${LAYER_CLASS} absolute inset-0 ${phase === "dial" ? "animate-dial-spin-once" : ""} ${hoverActive ? "animate-ascii-shimmer" : ""}`}
          style={{
            ...dialOriginStyle,
            transform: dialHoverTransform,
            transition: revealed ? "transform 0.3s ease-out" : undefined,
          }}
        >
          {LAYERS.dial}
        </pre>
        <pre
          className={`${LAYER_CLASS} absolute inset-0 ${phase === "receiver" ? "animate-receiver-bounce-once" : ""} ${hoverActive ? "animate-ascii-shimmer" : ""}`}
          style={{
            transform: receiverHoverTransform,
            transition: revealed ? "transform 0.3s ease-out" : undefined,
          }}
        >
          {LAYERS.receiver}
        </pre>

        {/* Digits: a white badge behind each one for contrast against
            the filled dial underneath, bold, solid color rather than
            the thin gradient-clip text (which was hard to read at
            this size) — shares the dial's rotate transform/origin so
            the numbers spin and hover-tilt together with the dial
            they're printed on. */}
        <div
          className={`absolute inset-0 ${phase === "dial" ? "animate-dial-spin-once" : ""}`}
          style={{
            ...dialOriginStyle,
            transform: dialHoverTransform,
            transition: revealed ? "transform 0.3s ease-out" : undefined,
          }}
        >
          {LAYERS.digits.map((d) => (
            <span
              key={d.char}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-0.5 font-mono text-[1.1em] leading-none font-bold text-pink-600 shadow-sm"
              style={{ left: `${(d.col / PHONE_COLS) * 100}%`, top: `${(d.row / PHONE_ROWS) * 100}%` }}
            >
              {d.char}
            </span>
          ))}
        </div>
      </div>

      {burst && (
        <div
          key={burst.key}
          className="animate-burst-pop pointer-events-none absolute z-30"
          style={{ top: BURST_SLOTS[burst.slot].top, left: BURST_SLOTS[burst.slot].left }}
        >
          <TrrBurst tint={BURST_SLOTS[burst.slot].tint} />
        </div>
      )}
    </div>
  );
}
