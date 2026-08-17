"use client";

import AmbientAudio from "../AmbientAudio";
import HeroBadges from "../HeroBadges";
import PaintBrushGlow from "../PaintBrushGlow";
import { generateMountainLayer } from "./ascii";
import Birds from "./Birds";
import Dust from "./Dust";
import FrontMountainMask from "./FrontMountainMask";
import HeroBrushStrokesMobile from "./HeroBrushStrokesMobile";
import HeroNavTable from "./HeroNavTable";
import HeroText from "./HeroText";
import MountainLayer from "./MountainLayer";
import { BACK_ROWS, FRONT_ROWS, MID_ROWS } from "./mountainMetrics";

const COLS = 140;

const BACK = generateMountainLayer(COLS, BACK_ROWS, 7, 41);
const MID = generateMountainLayer(COLS, MID_ROWS, 8, 23);
const FRONT = generateMountainLayer(COLS, FRONT_ROWS, 8, 11);

export default function Hero() {
  return (
    // h-dvh, not h-screen: on mobile browsers, a static 100vh is sized
    // for the largest possible viewport (address bar collapsed), which
    // is taller than what's actually visible on first load (address
    // bar still showing) — bottom-anchored content like the mountains
    // below ends up positioned below the fold until the page is
    // nudged. The dynamic viewport unit tracks the real visible height
    // instead, so bottom-0 content lines up with what's on screen.
    <section className="relative flex h-dvh w-full flex-col items-center justify-center overflow-hidden bg-white">
      {/* almost-transparent back layer — behind the text, free to overlap it */}
      <div className="absolute inset-0 z-0" aria-hidden>
        <MountainLayer
          ascii={BACK.ascii}
          opacity={0.42}
          blur={1}
          gradient="bg-linear-to-r from-zinc-400 via-pink-300 to-amber-300"
          sway={6}
          duration={16}
        />
      </div>

      <Dust />
      <Birds />
      <HeroText />

      {/* mid layer sits in front of the text — occludes it, never overlapped */}
      <div className="absolute inset-0 z-15" aria-hidden>
        <MountainLayer
          ascii={MID.ascii}
          opacity={0.64}
          blur={0}
          gradient="bg-linear-to-r from-zinc-600 via-pink-500 to-yellow-500"
          sway={10}
          duration={13}
        />
      </div>

      <FrontMountainMask ascii={FRONT.ascii} />

      <HeroNavTable />

      <PaintBrushGlow />
      <HeroBrushStrokesMobile />
      <AmbientAudio />
      <div
        data-stream-checkpoint="Hero"
        data-stream-x="50"
        className="absolute bottom-0 left-1/2 h-px w-px"
      />

      <HeroBadges />
    </section>
  );
}
