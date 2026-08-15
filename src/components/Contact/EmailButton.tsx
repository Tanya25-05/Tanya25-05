"use client";

import { useEffect, useState } from "react";
import ContactModal from "./ContactModal";

export default function EmailButton() {
  const [pulsing, setPulsing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // This only ever mounts once the contact content has been revealed
  // (see ContactSection), so mounting itself is the "just became
  // visible" signal — a short beat, then start the soft pulse.
  useEffect(() => {
    const t = setTimeout(() => setPulsing(true), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className={`group inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-pink-500 to-amber-400 px-5 py-2.5 text-sm text-white transition-all hover:brightness-105 ${pulsing ? "animate-button-pulse" : ""}`}
      >
        <span>Email Me</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className="transition-transform group-hover:translate-x-1"
        >
          <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <ContactModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
