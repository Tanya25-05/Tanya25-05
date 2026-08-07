"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const [hidden, setHidden] = useState(false);

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
        <span className="text-zinc-300">·</span>
        <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-zinc-400">
          Bangalore → Remote, Globally
        </span>
      </nav>
    </header>
  );
}
