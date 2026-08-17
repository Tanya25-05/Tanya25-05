"use client";

import { useEffect, useState } from "react";
import { DIAL_CENTER_GRID, PHONE_COLS, PHONE_ROWS, generatePhoneLayers } from "./phoneAscii";
import TrrBurst, { type BurstTint } from "./TrrBurst";

// Generated once — the layout is pure math with no per-render inputs,
// same as Hero.tsx hoisting its mountain layers to module scope.
const LAYERS = generatePhoneLayers();

// Top-right only, touching the phone's own silhouette rather than
// floating off away from it. Two entries at the same spot rather than
// one so the three back-to-back spawns still alternate tint instead
// of repeating the same color every time. Percentages are relative to
// the phone's bounding box (the ascii drawing is `w-fit`).
const BURST_SLOTS: { top: string; left: string; tint: BurstTint }[] = [
  { top: "-4%", left: "90%", tint: "orange" }, // top-right
  { top: "-4%", left: "90%", tint: "pink" }, // top-right
];
// BURST_DISPLAY_MS has to match the burst-pop animation's own duration
// (globals.css) — how long one callout is actually visible for. A
// further BURST_GAP_MS of nothing (the previous one already faded out
// and is holding at opacity: 0 — see that animation's `forwards`)
// plays before the next one pops in, so it reads as a paced
// ring...ring...ring rather than a continuous flicker.
const BURST_DISPLAY_MS = 1000;
const BURST_GAP_MS = 500;
const BURST_CYCLE_MS = BURST_DISPLAY_MS + BURST_GAP_MS;
// Exactly three callouts per click, then stop — not an open-ended
// flurry for as long as the phone happens to stay in "ringing".
const BURST_COUNT = 3;

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
  // on clicks after it's already been revealed too. Each click bumps
  // clickPulse, which restarts this effect regardless of what `phase`
  // is doing. The very first click (clickPulse === 1, the one that
  // actually answers the call) is skipped on purpose — the callouts
  // start from the click after that, not the first one.
  const [burst, setBurst] = useState<{ slot: number; key: number } | null>(null);
  const [clickPulse, setClickPulse] = useState(0);
  useEffect(() => {
    if (clickPulse <= 1) return;
    let slot = 0;
    let key = 0;
    let count = 0;
    const spawn = () => {
      count += 1;
      key += 1;
      setBurst({ slot, key });
      slot = (slot + 1) % BURST_SLOTS.length;
      if (count >= BURST_COUNT) clearInterval(id);
    };
    spawn();
    const id = setInterval(spawn, BURST_CYCLE_MS);
    // Let the last one's own pop-out animation finish before clearing —
    // otherwise it'd cut off mid-fade instead of completing the cycle.
    const stop = setTimeout(() => setBurst(null), (BURST_COUNT - 1) * BURST_CYCLE_MS + BURST_DISPLAY_MS);
    return () => {
      clearInterval(id);
      clearTimeout(stop);
    };
  }, [clickPulse]);

  // Two different spin triggers share the same dial/digits elements:
  // the automatic intro spin (phase === "dial", once, on first reveal)
  // and this click-triggered one (every click thereafter, driven by
  // the same clickPulse the burst effect above uses). A `key` change
  // is what actually replays a CSS animation on an element that
  // already has the class — just toggling the className string again
  // wouldn't restart it if it was still holding the intro spin's
  // finished state, so each trigger gets its own distinct key to force
  // a fresh mount.
  const dialSpinClass =
    phase === "dial" ? "animate-dial-spin-once" : clickPulse > 0 ? "animate-dial-click-spin" : "";
  const dialSpinKey = phase === "dial" ? "phase-dial" : `click-${clickPulse}`;

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
          key={dialSpinKey}
          className={`${LAYER_CLASS} absolute inset-0 ${dialSpinClass} ${hoverActive ? "animate-ascii-shimmer" : ""}`}
          style={{
            ...dialOriginStyle,
            // Suppressed while the spin animation is running: an inline
            // transform and a CSS animation both driving `transform` on
            // the same element fight each other (the animation wins,
            // but only once it's actually taken over the property),
            // which is what read as a little shake/twitch right at the
            // start of every click — the cursor is still sitting on the
            // phone right after clicking it, so dialHoverTransform is
            // almost always active at exactly the moment the spin key
            // remounts this element.
            transform: dialSpinClass ? undefined : dialHoverTransform,
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
          key={dialSpinKey}
          className={`absolute inset-0 ${dialSpinClass}`}
          style={{
            ...dialOriginStyle,
            // See the matching dial <pre>'s style above for why this is
            // suppressed during a spin.
            transform: dialSpinClass ? undefined : dialHoverTransform,
            transition: revealed ? "transform 0.3s ease-out" : undefined,
          }}
        >
          {LAYERS.digits.map((d) => (
            <span
              key={d.char}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-1 font-mono text-[1.5em] leading-none font-bold text-pink-600 shadow-sm"
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
