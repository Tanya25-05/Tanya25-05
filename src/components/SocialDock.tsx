import EnamelBadge from "./EnamelBadge";
import { socialLinks } from "./SocialIcons";

// Persistent vertical dock, pinned to the right edge and centered in
// the viewport — keeps the social links out of the navbar entirely so
// it never has to fight for space on small screens. Badge size and
// spacing are fluid (clamp/vw-driven) rather than fixed breakpoints,
// so it scales smoothly across every viewport instead of jumping.
export default function SocialDock() {
  return (
    <div className="fixed right-2 top-1/2 z-40 flex -translate-y-1/2 flex-col items-center gap-2 sm:right-4 sm:gap-3 md:right-6 md:gap-4">
      {socialLinks.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={l.label}
          className="shrink-0 transition-transform hover:scale-110"
        >
          <EnamelBadge
            tint="#ffffff"
            size={36}
            style={{ width: "clamp(28px, 7vw, 40px)", height: "clamp(28px, 7vw, 40px)" }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5 text-zinc-600 sm:h-4 sm:w-4">
              <path d={l.path} />
            </svg>
          </EnamelBadge>
        </a>
      ))}
    </div>
  );
}
