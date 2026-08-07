"use client";

import { useEffect, useRef, useState } from "react";
import ScrollFadeIn from "./ScrollFadeIn";

// Bird-chirping/wind loop for the hero scenery. Browsers block
// autoplay-with-sound until a genuine user gesture, so playback only
// starts on the visitor's first click/tap anywhere on the page — never
// on load. The mute control itself stays invisible until the visitor
// scrolls, same as the rest of the hero chrome, so the very first paint
// is pure scenery with no UI on top of it.
// Drop the loop file at public/audio/ambience.mp3; until it exists the
// <audio> tag simply has nothing to play and stays silent.
export default function AmbientAudio() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const start = () => {
      const audio = audioRef.current;
      if (audio && audio.paused) {
        audio.volume = 0.7;
        audio.play().catch(() => {});
      }
    };
    window.addEventListener("pointerdown", start, { once: true });
    return () => window.removeEventListener("pointerdown", start);
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted;
  }, [muted]);

  return (
    <>
      <audio ref={audioRef} src="/audio/ambience.mp3" loop preload="none" />
      <ScrollFadeIn className="absolute bottom-5 left-5 z-30">
        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? "Unmute ambient sound" : "Mute ambient sound"}
          className="pointer-events-auto w-9 h-9 rounded-full bg-white/70 backdrop-blur-sm border border-zinc-200 flex items-center justify-center font-mono text-[11px] text-zinc-500 hover:text-pink-500 transition-colors"
        >
          {muted ? "×" : "))"}
        </button>
      </ScrollFadeIn>
    </>
  );
}
