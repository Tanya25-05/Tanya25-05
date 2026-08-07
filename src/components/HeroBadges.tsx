import EnamelBadge from "./EnamelBadge";
import ScrollFadeIn from "./ScrollFadeIn";
import { socialLinks } from "./SocialIcons";

function IceCreamIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <defs>
        <radialGradient id="scoop1" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#ffeef7" />
          <stop offset="55%" stopColor="#ffb6d9" />
          <stop offset="100%" stopColor="#f28fc0" />
        </radialGradient>
        <radialGradient id="scoop2" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#fffbe8" />
          <stop offset="55%" stopColor="#ffe066" />
          <stop offset="100%" stopColor="#f2c94c" />
        </radialGradient>
        <linearGradient id="cone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0c088" />
          <stop offset="100%" stopColor="#c9924f" />
        </linearGradient>
      </defs>
      <circle cx="9" cy="7" r="3.4" fill="url(#scoop1)" />
      <circle cx="14.5" cy="6.5" r="3.6" fill="url(#scoop2)" />
      <ellipse cx="8" cy="5.6" rx="0.9" ry="0.5" fill="#ffffff" opacity="0.85" />
      <ellipse cx="13.4" cy="5.1" rx="0.9" ry="0.5" fill="#ffffff" opacity="0.85" />
      <path d="M7.5 11h9L13.2 20.6a1.4 1.4 0 0 1-2.4 0L7.5 11z" fill="url(#cone)" />
      <path
        d="M9 13l1.2 6.5M12 13v6.8M15 13l-1.2 6.5"
        stroke="#a9743a"
        strokeWidth="0.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function AstronautIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="suit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#d7d7e0" />
        </linearGradient>
        <radialGradient id="visor" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#cdeaff" />
          <stop offset="55%" stopColor="#6fb8e6" />
          <stop offset="100%" stopColor="#3f7fb0" />
        </radialGradient>
      </defs>
      <path
        d="M8 13c-2 .7-3.2 2.1-3.2 3.6 0 1.8 3.2 2.9 7.2 2.9s7.2-1.1 7.2-2.9c0-1.5-1.2-2.9-3.2-3.6"
        fill="url(#suit)"
        stroke="#b8b8c4"
        strokeWidth="0.5"
      />
      <circle cx="12" cy="8" r="4.6" fill="url(#suit)" stroke="#b8b8c4" strokeWidth="0.5" />
      <circle cx="12" cy="8" r="2.8" fill="url(#visor)" />
      <ellipse cx="10.6" cy="6.6" rx="0.7" ry="0.4" fill="#ffffff" opacity="0.9" />
      <circle cx="4.6" cy="15.2" r="1.3" fill="url(#suit)" stroke="#b8b8c4" strokeWidth="0.4" />
      <circle cx="19.4" cy="15.2" r="1.3" fill="url(#suit)" stroke="#b8b8c4" strokeWidth="0.4" />
    </svg>
  );
}

function RetroCharacterIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="overalls" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0954f" />
          <stop offset="100%" stopColor="#d5722c" />
        </linearGradient>
      </defs>
      <rect x="7" y="14" width="10" height="7" rx="2.4" fill="url(#overalls)" />
      <rect x="8.4" y="11" width="2" height="4" fill="url(#overalls)" />
      <rect x="13.6" y="11" width="2" height="4" fill="url(#overalls)" />
      <circle cx="12" cy="9" r="4.2" fill="#f6c99a" />
      <path
        d="M7.2 8.6a4.8 4.8 0 0 1 9.6 0c-1.6-.6-2.4.6-4.8.6s-3.2-1.2-4.8-.6z"
        fill="#3fae5c"
      />
      <rect x="6.6" y="7.5" width="10.8" height="1.6" rx="0.8" fill="#2f8c47" />
      <circle cx="10.4" cy="9.4" r="0.5" fill="#3f2a1a" />
      <circle cx="13.6" cy="9.4" r="0.5" fill="#3f2a1a" />
    </svg>
  );
}

function FlowerIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <g fill="#ffffff" stroke="#e6e6e6" strokeWidth="0.4">
        <ellipse cx="12" cy="6.6" rx="2.6" ry="3.4" />
        <ellipse cx="17" cy="10.6" rx="3.4" ry="2.6" />
        <ellipse cx="12" cy="15" rx="2.6" ry="3.4" />
        <ellipse cx="7" cy="10.6" rx="3.4" ry="2.6" />
        <ellipse cx="15.2" cy="7.3" rx="2.6" ry="3.1" transform="rotate(45 15.2 7.3)" />
        <ellipse cx="15.2" cy="13.9" rx="2.6" ry="3.1" transform="rotate(-45 15.2 13.9)" />
        <ellipse cx="8.8" cy="13.9" rx="2.6" ry="3.1" transform="rotate(45 8.8 13.9)" />
        <ellipse cx="8.8" cy="7.3" rx="2.6" ry="3.1" transform="rotate(-45 8.8 7.3)" />
      </g>
      <circle cx="12" cy="10.6" r="2.3" fill="#ffe066" />
    </svg>
  );
}

const themeBadges = [
  { icon: <AstronautIcon />, tint: "#3a3a6b", rotate: 6, size: 46 },
  { icon: <IceCreamIcon />, tint: "#ffd9ec", rotate: -8, size: 46 },
  { icon: <FlowerIcon />, tint: "#dff0e6", rotate: -4, size: 42 },
  { icon: <RetroCharacterIcon />, tint: "#fff3c4", rotate: 5, size: 44 },
];

// A single vertical rail pinned to the actual right edge of the viewport
// — keeps every floating badge clear of the centered hero text.
export default function HeroBadges() {
  return (
    <ScrollFadeIn className="pointer-events-none absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col items-center gap-4">
      {themeBadges.map((b, i) => (
        <div
          key={i}
          className="animate-float"
          style={{ animationDuration: `${5 + i * 0.6}s`, animationDelay: `${i * 0.4}s` }}
        >
          <EnamelBadge tint={b.tint} rotate={b.rotate} size={b.size}>
            {b.icon}
          </EnamelBadge>
        </div>
      ))}

      <div className="h-px w-6 bg-zinc-200 my-1" />

      {socialLinks.map((link, i) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
          className="pointer-events-auto animate-float"
          style={{ animationDuration: `${5.5 + i * 0.5}s`, animationDelay: `${i * 0.3}s` }}
        >
          <EnamelBadge tint="#f4f4f5" size={32}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#52525b">
              <path d={link.path} />
            </svg>
          </EnamelBadge>
        </a>
      ))}
    </ScrollFadeIn>
  );
}
