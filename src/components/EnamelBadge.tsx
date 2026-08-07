type EnamelBadgeProps = {
  children: React.ReactNode;
  size?: number;
  tint: string;
  rotate?: number;
  className?: string;
  style?: React.CSSProperties;
  // Border color — white by default (matches the SocialDock badges).
  // Pass a metallic tone (e.g. gold) for a coin/pin look instead. The
  // inset shadow adds the thin dark separator ring between the border
  // and the interior that a real enamel pin has, regardless of ring
  // color.
  ring?: string;
};

export default function EnamelBadge({
  children,
  size = 56,
  tint,
  rotate = 0,
  className = "",
  style,
  ring = "#ffffff",
}: EnamelBadgeProps) {
  return (
    <div
      className={`relative flex items-center justify-center rounded-full shadow-[0_3px_10px_rgba(0,0,0,0.18)] ${className}`}
      style={{
        width: size,
        height: size,
        border: `3px solid ${ring}`,
        boxShadow: "inset 0 0 0 1.5px rgba(0,0,0,0.55)",
        background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.9), ${tint} 72%)`,
        transform: `rotate(${rotate}deg)`,
        ...style,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 30% 24%, rgba(255,255,255,0.65), transparent 45%)",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
