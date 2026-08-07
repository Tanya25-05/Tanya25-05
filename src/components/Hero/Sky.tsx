export default function Sky() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0 animate-sky-hue"
        style={{
          background: "linear-gradient(180deg, #f472b6 0%, #fbcfe8 45%, #fde68a 100%)",
        }}
      />
      <div
        className="absolute inset-0 animate-sun-pulse"
        style={{
          background: "radial-gradient(circle at 50% 88%, rgba(255,214,120,0.65), transparent 45%)",
        }}
      />
    </div>
  );
}
