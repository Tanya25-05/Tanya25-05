// Single source of truth for each mountain layer's row count, shared
// between Hero (generation) and anything else that needs their sizing.
export const BACK_ROWS = 24;
export const MID_ROWS = 21;
export const FRONT_ROWS = 17;

// BACK is the tallest layer — HeroText reserves exactly this much
// space at the bottom so its rest position clears every layer and
// sits entirely on the plain white background above the peaks.
export const BACK_HEIGHT_CSS = `calc(${BACK_ROWS} * clamp(7px, 1.3vw, 24px))`;
