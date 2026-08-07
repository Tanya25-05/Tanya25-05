// Kept in sync with MountainLayer's GRID_FONT — see the comment there
// for why font-size is vw-only but leading blends in vh.
const GRID_FONT =
  "text-[clamp(3px,1.2vw,22px)] leading-[clamp(4px,calc(0.6vw+1vh),26px)]";

export default function FrontMountainMask({ ascii }: { ascii: string }) {
  return (
    <div className="absolute inset-x-0 bottom-0 z-20 pointer-events-none" aria-hidden>
      <pre
        className={`font-mono font-semibold ${GRID_FONT} whitespace-pre text-left select-none bg-linear-to-r from-zinc-800 via-pink-600 to-yellow-500 bg-clip-text text-transparent opacity-90`}
      >
        {ascii}
      </pre>
    </div>
  );
}
