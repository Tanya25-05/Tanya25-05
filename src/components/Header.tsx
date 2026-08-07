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
      <nav className="max-w-4xl mx-auto px-6 h-16 flex items-center">
        <Link href="/" className="text-sm font-semibold tracking-wide text-zinc-900">
          Portfolio <span className="font-normal text-zinc-400">/ 2026 Edition</span>{" "}
          <span className="font-normal text-zinc-400">· Bangalore → Remote, Globally</span>
        </Link>
      </nav>
    </header>
  );
}
