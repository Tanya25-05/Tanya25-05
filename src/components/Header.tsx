"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import SocialIcons from "./SocialIcons";

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
      <nav className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-wider text-sm">
          Portfolio
        </Link>
        <div className="flex items-center gap-5">
          <SocialIcons />
          <div className="h-4 w-px bg-zinc-200" />
          <ul className="flex items-center gap-5 text-sm text-zinc-600">
            <li><a href="#about" className="hover:text-pink-500 transition-colors">About</a></li>
            <li><a href="#projects" className="hover:text-pink-500 transition-colors">Projects</a></li>
            <li><a href="#designing" className="hover:text-pink-500 transition-colors">Designing</a></li>
            <li><a href="#experience" className="hover:text-pink-500 transition-colors">Experience</a></li>
            <li><a href="#contact" className="hover:text-pink-500 transition-colors">Contact</a></li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
