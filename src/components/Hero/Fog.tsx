const bands = [
  { bottom: "16%", duration: 40, opacity: 0.14 },
  { bottom: "24%", duration: 55, opacity: 0.12 },
  { bottom: "34%", duration: 70, opacity: 0.1 },
];

export default function Fog() {
  return (
    <>
      {bands.map((b, i) => (
        <div
          key={i}
          className="absolute inset-x-[-20%] h-40 blur-2xl animate-fog-drift"
          style={{
            bottom: b.bottom,
            opacity: b.opacity,
            animationDuration: `${b.duration}s`,
            background: "linear-gradient(90deg, transparent, #fff5f9, transparent)",
          }}
          aria-hidden
        />
      ))}
    </>
  );
}
