"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { navLinks } from "./Hero/navLinks";

export default function Header() {
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const designing = document.getElementById("designing");
    if (!designing) return;

    const observer = new IntersectionObserver(
      ([entry]) => setHidden(entry.intersectionRatio > 0.5),
      { threshold: [0, 0.5, 1] }
    );
    observer.observe(designing);
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-zinc-100 transition-transform duration-300 ${hidden ? "-translate-y-full" : "translate-y-0"}`}
    >
      <nav className="h-16 flex items-center gap-3 pl-8 pr-6 sm:pl-16 lg:pl-24">
        <Link href="/" className="font-serif text-lg text-zinc-900">
          <span className="font-bold">Portfolio</span>{" "}
          <span className="italic text-zinc-400">/ 2026 Edition</span>
        </Link>
        {/* Dropped below sm, not just shrunk — there's no room left for
            both this and the hamburger on a narrow phone, and the
            tagline is decorative, not essential nav. */}
        <span className="hidden text-pink-500 sm:inline">·</span>
        <span className="hidden font-mono text-[11px] uppercase tracking-[0.15em] text-zinc-400 sm:inline">
          Bangalore <span className="text-pink-500">→</span> Remote, Globally
        </span>

        {/* HeroNavTable (the "In this edition" panel) only ever renders
            inside the Hero section on lg+ — below that it's not shown
            anywhere at all, so this is the mobile/tablet way to reach
            the same links, from anywhere on the page rather than only
            while the hero is in view. */}
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-panel"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="ml-auto flex h-8 w-8 flex-col items-center justify-center gap-1.5 lg:hidden"
        >
          <span
            className={`h-px w-5 bg-zinc-700 transition-transform ${menuOpen ? "translate-y-[3.5px] rotate-45" : ""}`}
          />
          <span className={`h-px w-5 bg-zinc-700 transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
          <span
            className={`h-px w-5 bg-zinc-700 transition-transform ${menuOpen ? "-translate-y-[3.5px] -rotate-45" : ""}`}
          />
        </button>
      </nav>

      {menuOpen && (
        <div id="mobile-nav-panel" className="border-t border-zinc-100 bg-white px-8 py-4 sm:px-16 lg:hidden">
          <div className="mb-3 flex items-baseline justify-between">
            <span className="font-mono text-[11px] tracking-[0.25em] text-zinc-400 uppercase">
              In this edition
            </span>
            <span className="font-mono text-[11px] tracking-[0.1em] text-pink-500">
              01–{String(navLinks.length).padStart(2, "0")}
            </span>
          </div>
          {/* text-sm/text-xs + whitespace-nowrap is what keeps every
              row — even the longest label, "Experience" — on one line
              instead of wrapping the page number onto its own. */}
          <ul className="flex flex-col gap-1">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between gap-3 whitespace-nowrap py-2 text-sm"
                >
                  <span className="font-serif text-zinc-800">{l.label}</span>
                  <span className="font-mono text-xs text-zinc-400">p.{l.page}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
