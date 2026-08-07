import EnamelBadge from "./EnamelBadge";
import { socialLinks } from "./SocialIcons";

// Persistent vertical dock, pinned to the right edge and centered in
// the viewport — keeps the social links out of the navbar entirely so
// it never has to fight for space on small screens.
export default function SocialDock() {
  return (
    <div className="fixed right-3 top-1/2 z-40 flex -translate-y-1/2 flex-col items-center gap-3 sm:right-5 sm:gap-4">
      {socialLinks.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={l.label}
          className="transition-transform hover:scale-110"
        >
          <EnamelBadge tint="#ffffff" size={36}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-zinc-600">
              <path d={l.path} />
            </svg>
          </EnamelBadge>
        </a>
      ))}
    </div>
  );
}
