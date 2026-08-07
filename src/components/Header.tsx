"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#designing", label: "Designing" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

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
      <nav className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex flex-col items-start leading-none">
          <span className="text-sm font-semibold tracking-wide text-zinc-900">
            Portfolio <span className="font-normal text-zinc-400">/ 2026 Edition</span>
          </span>
          <span className="my-0.5 text-[8px] leading-none text-zinc-300">·</span>
          <span className="font-mono text-[10px] tracking-[0.08em] text-zinc-500 uppercase">
            Bangalore <span className="text-pink-400">→</span> Remote, Globally
          </span>
        </Link>

        <ul className="hidden sm:flex items-center gap-5 text-sm text-zinc-600">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="hover:text-pink-500 transition-colors">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="-mr-2 flex h-9 w-9 flex-col items-center justify-center gap-1.5 sm:hidden"
        >
          <span
            className={`block h-px w-5 bg-zinc-700 transition-transform ${menuOpen ? "translate-y-[6.5px] rotate-45" : ""}`}
          />
          <span className={`block h-px w-5 bg-zinc-700 transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
          <span
            className={`block h-px w-5 bg-zinc-700 transition-transform ${menuOpen ? "-translate-y-[6.5px] -rotate-45" : ""}`}
          />
        </button>
      </nav>

      <div
        className={`overflow-hidden border-t border-zinc-100 bg-white/95 backdrop-blur-sm transition-[max-height] duration-300 sm:hidden ${menuOpen ? "max-h-64" : "max-h-0"}`}
      >
        <ul className="flex flex-col gap-4 px-6 py-4 text-sm text-zinc-600">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="hover:text-pink-500 transition-colors"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
