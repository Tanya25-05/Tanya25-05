// Static — no scroll-linked motion. Bottom offset lifts it clear of
// the mountain peaks (which occupy roughly the bottom fifth of the
// hero at rest) instead of sitting dead-center in the viewport.
export default function HeroText() {
  return (
    <div className="absolute inset-x-0 top-0 bottom-[8%] z-10 flex -translate-y-2.5 flex-col items-start justify-center pl-8 pr-6 text-left sm:bottom-[26%] sm:pl-16 lg:pl-24">
      <p className="mb-2 font-serif text-2xl italic text-zinc-700 sm:text-3xl">Hi, I&apos;m</p>
      <h1 className="font-serif text-7xl font-bold italic text-pink-600 sm:text-8xl lg:text-9xl">
        Tanya<br className="sm:hidden" /> Verma
      </h1>
    </div>
  );
}
