type EnamelBadgeProps = {
  children: React.ReactNode;
  size?: number;
  tint: string;
  rotate?: number;
  className?: string;
  style?: React.CSSProperties;
};

export default function EnamelBadge({
  children,
  size = 56,
  tint,
  rotate = 0,
  className = "",
  style,
}: EnamelBadgeProps) {
  return (
    <div
      className={`relative flex items-center justify-center rounded-full border-[3px] border-white shadow-[0_3px_10px_rgba(0,0,0,0.18)] ${className}`}
      style={{
        width: size,
        height: size,
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
