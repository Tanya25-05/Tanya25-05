// Deterministic positions (not Math.random — this renders on the
// server too, and needs to match on the client exactly).
const dust = Array.from({ length: 24 }, (_, i) => ({
  left: `${(i * 53) % 100}%`,
  bottom: `${(i * 31) % 55}%`,
  delay: (i % 8) * 0.9,
  duration: 6 + (i % 5),
  char: i % 3 === 0 ? "'" : ".",
}));

export default function Dust() {
  return (
    <>
      {dust.map((d, i) => (
        <span
          key={i}
          className="absolute font-mono text-[10px] text-pink-700/40 animate-dust-float"
          style={{
            left: d.left,
            bottom: d.bottom,
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.duration}s`,
          }}
          aria-hidden
        >
          {d.char}
        </span>
      ))}
    </>
  );
}
