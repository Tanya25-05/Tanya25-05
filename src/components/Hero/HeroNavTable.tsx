import { navLinks } from "./navLinks";

// Editorial "table of contents" panel, sitting beside the hero
// headline on wide screens. Unlike HeroText it's given its own z-25
// (above every mountain layer, all the way to FrontMountainMask's
// z-20) rather than living behind the mountains — HeroText's
// "occluded until it rises" trick is fine for decorative type, but
// this has real clickable links, so it can never afford to be
// visually or pointer-wise blocked by the scenery.
// Rendered from lg+ up (see the hidden/lg:block pair below), with
// every dimension — width, right offset, font sizes — driven by
// clamp() instead of fixed px or a handful of breakpoint steps. A
// fixed size looked fine at exactly the xl breakpoint but was
// disproportionately small on a 1440p+ display and cramped just below
// xl; clamp() scales continuously with viewport width across the
// whole lg-and-up range instead of jumping between a couple of sizes.
export default function HeroNavTable() {
  return (
    <div
      className="absolute top-[38%] z-25 hidden -translate-y-1/2 lg:block"
      style={{
        width: "clamp(280px, 22vw, 380px)",
        // Pushed further in from the edge (was 16-128px) — further
        // from the fixed SocialDock badges docked at the right edge,
        // and closer toward center/the "Tanya Verma" headline instead
        // of hugging the viewport's right side.
        right: "clamp(96px, 14vw, 260px)",
      }}
    >
      <div className="mb-1.5 flex items-baseline justify-between border-b border-zinc-200 pb-3">
        <span
          className="font-mono tracking-[0.25em] text-zinc-400 uppercase"
          style={{ fontSize: "clamp(11px, 0.85vw, 14px)" }}
        >
          In this edition
        </span>
        <span
          className="font-mono tracking-[0.1em] text-pink-500"
          style={{ fontSize: "clamp(11px, 0.85vw, 14px)" }}
        >
          01–{String(navLinks.length).padStart(2, "0")}
        </span>
      </div>

      <ul>
        {navLinks.map((l) => (
          <li key={l.href}>
            <a href={l.href} className="group flex items-end gap-3 py-3">
              <span
                className="font-serif leading-none text-zinc-800 transition-colors group-hover:text-pink-600"
                style={{ fontSize: "clamp(17px, 1.35vw, 22px)" }}
              >
                {l.label}
              </span>
              <span
                aria-hidden
                className="mb-1.5 h-0 flex-1 border-b border-dotted border-zinc-300 transition-colors group-hover:border-pink-300"
              />
              <span
                className="font-mono leading-none text-zinc-400 transition-colors group-hover:text-pink-500"
                style={{ fontSize: "clamp(12px, 1vw, 15px)" }}
              >
                p.{l.page}
              </span>
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-1.5 flex items-baseline justify-between border-t border-zinc-200 pt-3">
        <span
          className="font-mono tracking-[0.1em] text-zinc-400 uppercase"
          style={{ fontSize: "clamp(11px, 0.85vw, 14px)" }}
        >
          Portfolio · 2026 Edition
        </span>
        <span className="font-mono text-zinc-400" style={{ fontSize: "clamp(11px, 0.85vw, 14px)" }}>
          2026
        </span>
      </div>
    </div>
  );
}
