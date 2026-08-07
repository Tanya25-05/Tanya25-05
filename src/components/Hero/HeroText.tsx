// Static — no scroll-linked motion. Bottom offset lifts it clear of
// the mountain peaks (which occupy roughly the bottom fifth of the
// hero at rest) instead of sitting dead-center in the viewport.
export default function HeroText() {
  return (
    <div className="absolute inset-x-0 top-0 bottom-[8%] z-10 flex -translate-y-5 flex-col items-start justify-center pl-8 pr-14 text-left sm:bottom-[30%] sm:pl-16 sm:pr-6 lg:pl-24">
      <p className="mb-2 font-serif text-2xl italic text-zinc-700 sm:text-3xl">Hi, I&apos;m</p>
      <h1 className="font-serif text-7xl leading-tight font-bold italic text-pink-600 sm:text-6xl lg:text-7xl">
        {/* Ladder layout on mobile — each line indented further right
            than the last. Collapses back to a single inline line at
            sm and up, where there's room for the full name on one row. */}
        <span className="ml-4 block sm:ml-0 sm:inline">Tanya</span>{" "}
        <span className="ml-10 block sm:ml-0 sm:inline">Verma</span>
      </h1>
    </div>
  );
}
