"use client";

import { useRef } from "react";
import { useScroll } from "motion/react";
import AmbientAudio from "../AmbientAudio";
import CursorGlow from "../CursorGlow";
import HeroBadges from "../HeroBadges";
import { generateMountainLayer } from "./ascii";
import Birds from "./Birds";
import Dust from "./Dust";
import FrontMountainMask from "./FrontMountainMask";
import { HeroScrollContext } from "./HeroScrollContext";
import HeroText from "./HeroText";
import MountainLayer from "./MountainLayer";
import { BACK_ROWS, FRONT_ROWS, MID_ROWS } from "./mountainMetrics";
import { useMouseParallax } from "./useMouseParallax";

const COLS = 140;

const BACK = generateMountainLayer(COLS, BACK_ROWS, 7, 41);
const MID = generateMountainLayer(COLS, MID_ROWS, 8, 23);
const FRONT = generateMountainLayer(COLS, FRONT_ROWS, 8, 11);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  // Split into two independent parallax wrappers (rather than one
  // shared group) so BACK and MID can sit on opposite sides of
  // HeroText in the stacking order — a `transform` wrapper forms its
  // own stacking context, so a shared wrapper could never let text
  // slot in between its children. Different strengths give the two
  // layers relative motion against each other (the actual depth cue
  // that reads as "parallax" — moving in lockstep wouldn't).
  const backParallaxRef = useMouseParallax(0.6);
  const midParallaxRef = useMouseParallax(1.3);

  return (
    <HeroScrollContext.Provider value={scrollYProgress}>
      <section ref={sectionRef} className="relative h-[240vh] w-full bg-white">
        <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-white">
          {/* almost-transparent back layer — behind the text, free to overlap it */}
          <div ref={backParallaxRef} className="absolute inset-0 z-0" aria-hidden>
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
          <div ref={midParallaxRef} className="absolute inset-0 z-[15]" aria-hidden>
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

          <CursorGlow />
          <AmbientAudio />
          <div
            data-stream-checkpoint="Hero"
            data-stream-x="50"
            className="absolute bottom-0 left-1/2 h-px w-px"
          />

          <HeroBadges />
        </div>
      </section>
    </HeroScrollContext.Provider>
  );
}
