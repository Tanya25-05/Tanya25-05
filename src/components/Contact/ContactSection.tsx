"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import SocialIcons from "../SocialIcons";
import SpotlightText from "../SpotlightText";
import ContactPhone, { type PhonePhase } from "./ContactPhone";
import EmailButton from "./EmailButton";
import { DIAL_MS, DRAW_MS, RECEIVER_MS } from "./timing";

// "Call to reveal" flow, one phase state machine owned entirely here
// and just handed down to ContactPhone as a prop (see ContactPhone.tsx
// for why — this used to be two separately-managed phase states that
// had to stay in sync via a callback, which was fragile). Scrolling
// into view draws the phone in, spins the dial, bounces the receiver,
// then waits for a click; clicking rings, then connects, then the
// layout itself animates — the phone slides over to the right as a
// column for the contact content grows in from nothing on the left.
const RING_MS = 1800;
const CONNECTING_MS = 700;

const PHASE_AFTER: Partial<Record<PhonePhase, { next: PhonePhase; ms: number }>> = {
  drawing: { next: "dial", ms: DRAW_MS },
  dial: { next: "receiver", ms: DIAL_MS },
  receiver: { next: "ready", ms: RECEIVER_MS },
  ringing: { next: "connecting", ms: RING_MS },
  connecting: { next: "revealed", ms: CONNECTING_MS },
};

export default function ContactSection() {
  const [phase, setPhase] = useState<PhonePhase>("idle");
  const triggerRef = useRef<HTMLDivElement | null>(null);

  // Starts the whole sequence once, the first time this section
  // scrolls into view.
  useEffect(() => {
    const el = triggerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setPhase("drawing");
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Every timed phase automatically advances to the next one after
  // its own duration — one table (PHASE_AFTER) instead of a hand-
  // chained pile of setTimeouts with manually-summed delays.
  useEffect(() => {
    const step = PHASE_AFTER[phase];
    if (!step) return;
    const t = setTimeout(() => setPhase(step.next), step.ms);
    return () => clearTimeout(t);
  }, [phase]);

  const activate = () => setPhase((p) => (p === "ready" ? "ringing" : p));

  const statusLabel =
    phase === "ringing" ? "Trr Trr!!" : phase === "connecting" ? "Connecting..." : "Click me";

  const revealed = phase === "revealed";

  return (
    <div
      ref={triggerRef}
      // grid-cols-1 below is what makes this stack on mobile — the
      // two-column "0fr auto" / "1fr auto" trick (used to grow the
      // content column in from nothing on reveal) only ever applies at
      // md+ via the arbitrary-value class; setting it through
      // style.gridTemplateColumns instead used to apply it at every
      // width, forcing a cramped two-column layout on phones no matter
      // what grid-cols-1 said.
      className="mx-auto grid w-full grid-cols-1 items-center justify-items-center gap-x-10 gap-y-8 transition-[grid-template-columns] duration-700 ease-out md:justify-items-stretch md:grid-cols-(--contact-cols)"
      style={{ "--contact-cols": revealed ? "1fr auto" : "0fr auto" } as CSSProperties}
    >
      <div
        // overflow-hidden only while collapsed (w-0, pre-reveal) — it's
        // what hides the not-yet-revealed content, but left on
        // permanently it also clips the cursor magnifier's scaled-up
        // ::after (see globals.css's .spotlight-text::after) any time
        // it extends past this box's own edges, which is what made the
        // hover effect look broken specifically on this section once
        // revealed.
        className={`transition-all duration-700 ease-out ${
          revealed ? "overflow-visible opacity-100" : "overflow-hidden pointer-events-none w-0 -translate-x-4 opacity-0"
        } flex flex-col items-center text-center md:items-start md:text-left`}
      >
        <SpotlightText
          className="mb-6 font-serif italic text-xl sm:whitespace-nowrap sm:text-2xl"
          baseColor="#3f3f46"
        >
          Let&apos;s work together.
        </SpotlightText>
        <EmailButton />
        <div className="mt-10 flex flex-col items-center gap-3 md:items-start">
          <p className="text-xs text-zinc-500">Find me elsewhere</p>
          <SocialIcons />
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 justify-self-center">
        <ContactPhone phase={phase} onActivate={activate} />

        {(phase === "ready" || phase === "ringing" || phase === "connecting") && (
          <button
            type="button"
            onClick={activate}
            disabled={phase !== "ready"}
            className={`relative inline-flex h-11 w-40 -rotate-3 items-center justify-center overflow-hidden rounded-full bg-pink-500 font-mono text-xs uppercase tracking-[0.15em] text-white shadow-md transition-colors hover:bg-pink-600 disabled:cursor-default ${phase === "ringing" ? "animate-button-breathe" : ""}`}
          >
            <span
              key={statusLabel}
              className={phase === "ringing" ? "animate-ring-pulse" : "animate-calling-fade"}
            >
              {statusLabel}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
