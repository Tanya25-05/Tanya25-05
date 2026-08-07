const navLinks = [
  { page: "01", href: "#about", label: "About" },
  { page: "02", href: "#projects", label: "Projects" },
  { page: "03", href: "#designing", label: "Designing" },
  { page: "04", href: "#experience", label: "Experience" },
  { page: "05", href: "#contact", label: "Contact" },
];

// Editorial "table of contents" panel, sitting beside the hero
// headline on wide screens. Unlike HeroText it's given its own z-25
// (above every mountain layer, all the way to FrontMountainMask's
// z-20) rather than living behind the mountains — HeroText's
// "occluded until it rises" trick is fine for decorative type, but
// this has real clickable links, so it can never afford to be
// visually or pointer-wise blocked by the scenery.
// Only ever rendered at xl+ (see the hidden/xl:block pair below), so
// the lower-breakpoint positioning doesn't matter — offset is set
// directly for xl, pulled in from the edge to clear the fixed
// SocialDock badges docked at the viewport's right edge.
export default function HeroNavTable() {
  return (
    <div className="absolute top-[45%] z-25 hidden w-108 -translate-y-1/2 xl:right-32 xl:block">
      <div className="mb-1.5 flex items-baseline justify-between border-b border-zinc-200 pb-3">
        <span className="font-mono text-[15px] tracking-[0.25em] text-zinc-400 uppercase">
          In this edition
        </span>
        <span className="font-mono text-[15px] tracking-[0.1em] text-pink-500">
          01–{String(navLinks.length).padStart(2, "0")}
        </span>
      </div>

      <ul>
        {navLinks.map((l) => (
          <li key={l.href}>
            <a href={l.href} className="group flex items-end gap-3 py-4">
              <span className="font-serif text-[27px] leading-none text-zinc-800 transition-colors group-hover:text-pink-600">
                {l.label}
              </span>
              <span
                aria-hidden
                className="mb-1.5 h-0 flex-1 border-b border-dotted border-zinc-300 transition-colors group-hover:border-pink-300"
              />
              <span className="font-mono text-[17px] leading-none text-zinc-400 transition-colors group-hover:text-pink-500">
                p.{l.page}
              </span>
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-1.5 flex items-baseline justify-between border-t border-zinc-200 pt-3">
        <span className="font-mono text-[15px] tracking-[0.1em] text-zinc-400 uppercase">
          Portfolio · 2026 Edition
        </span>
        <span className="font-mono text-[15px] text-zinc-400">2026</span>
      </div>
    </div>
  );
}
