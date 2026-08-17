// Procedural ASCII rotary phone, in the same spirit as Hero/ascii.ts's
// mountain generator: shapes are defined as math (circles, ellipses,
// filled polygons, sampled bezier tubes) rather than hand-typed
// character art, so the geometry is precise even without ever seeing
// it rendered. Split into three independently-generated layers (base,
// dial, receiver) sharing one coordinate grid, so each can be
// animated separately (dial spins, receiver bounces) while still
// lining up pixel-for-pixel as one continuous drawing. Every layer is
// a filled silhouette (not an outline) shaded like a halftone dot
// screen, matching the reference rotary-phone icon this is modeled on.

export const PHONE_COLS = 96;
// Grown from 50 — the base/prongs/dial got pushed further down (see
// BASE_TOP_Y below) to open up a real gap above them for the receiver,
// which needed more total vertical room than the old grid had.
export const PHONE_ROWS = 66;
// Monospace character cells are roughly twice as tall as they are
// wide. Without correcting for that, a "circle" plotted in raw
// (col, row) space renders as a tall oval. Physical y = row *
// ROW_SCALE compensates so distances read as visually round.
const ROW_SCALE = 2;
// Width, in physical units, of the soft anti-aliased band at a
// silhouette's edge — inside it the fill fades from the lightest
// block character to the densest one instead of cutting straight
// from blank to solid.
const EDGE_SOFTNESS = 1.3;
// Past that solid band, the fill keeps fading the other way — dense
// right at the silhouette's rim, back down to fully transparent over
// this many physical units moving further inward — instead of staying
// solid all the way to a shape's center. Reference: the halftone
// rotary-phone icon this is modeled on has a clearly hollow, edge-lit
// look (colored rim, blank middle) rather than a flat-filled one.
const INNER_FADE = 9;

type Point = { x: number; y: number };

function distPointToSegment(px: number, py: number, ax: number, ay: number, bx: number, by: number): number {
  const abx = bx - ax;
  const aby = by - ay;
  const apx = px - ax;
  const apy = py - ay;
  const abLenSq = abx * abx + aby * aby;
  let t = abLenSq > 0 ? (apx * abx + apy * aby) / abLenSq : 0;
  t = Math.max(0, Math.min(1, t));
  const cx = ax + abx * t;
  const cy = ay + aby * t;
  return Math.hypot(px - cx, py - cy);
}

function distPointToPolyline(px: number, py: number, pts: Point[]): number {
  let min = Infinity;
  for (let i = 0; i < pts.length - 1; i++) {
    const d = distPointToSegment(px, py, pts[i].x, pts[i].y, pts[i + 1].x, pts[i + 1].y);
    if (d < min) min = d;
  }
  return min;
}

// All the "inside*" helpers below return a signed depth: positive and
// growing the further a point sits inside the filled shape, negative
// once it's outside — the same convention a 2D signed-distance field
// uses, which is what lets shapes combine with a plain Math.max
// (union) or get punched out with Math.min(d, -holeDepth) (subtract).

function insideRect(px: number, py: number, x0: number, y0: number, x1: number, y1: number): number {
  return Math.min(px - x0, x1 - px, py - y0, y1 - py);
}

// Like insideRect, but the top edge is inset from the bottom edge on
// each side — a trapezoid instead of a rectangle, which is what an
// actual rotary-phone base tapers like (narrower top, wider bottom)
// rather than a plain box.
function insideTrapezoid(
  px: number,
  py: number,
  xTop0: number,
  xTop1: number,
  y0: number,
  xBottom0: number,
  xBottom1: number,
  y1: number
): number {
  const t = (py - y0) / (y1 - y0);
  const xl = xTop0 + (xBottom0 - xTop0) * t;
  const xr = xTop1 + (xBottom1 - xTop1) * t;
  return Math.min(px - xl, xr - px, py - y0, y1 - py);
}

function insideCircle(px: number, py: number, cx: number, cy: number, r: number): number {
  return r - Math.hypot(px - cx, py - cy);
}

// Ellipses don't have a simple closed-form boundary distance — this
// approximates it via the normalized radial distance, which is close
// enough at this grid resolution for a stylized silhouette.
function insideEllipse(px: number, py: number, cx: number, cy: number, rx: number, ry: number): number {
  const norm = Math.hypot((px - cx) / rx, (py - cy) / ry);
  return (1 - norm) * Math.min(rx, ry);
}

function insideTube(px: number, py: number, pts: Point[], halfWidth: number): number {
  return halfWidth - distPointToPolyline(px, py, pts);
}

function bezierPoint(p0: Point, p1: Point, p2: Point, t: number): Point {
  const mt = 1 - t;
  return {
    x: mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x,
    y: mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y,
  };
}

function sampleBezier(p0: Point, p1: Point, p2: Point, steps: number): Point[] {
  const pts: Point[] = [];
  for (let i = 0; i <= steps; i++) pts.push(bezierPoint(p0, p1, p2, i / steps));
  return pts;
}

// --- Shape layout, in physical units (x: 0-96, y: 0-100) ---

// Base trapezoid bounds, hoisted so both baseDistance and its
// top-corner rounding below stay in sync with a single source of
// truth instead of two copies of the same four numbers. Shifted down
// 29 units from where they sat before (30 to 98) — the receiver above
// has fixed coordinates of its own, and at the old position the
// prongs had already risen high enough to overlap it. Moving the base
// down instead of the receiver up is what the extra PHONE_ROWS room
// above was for.
const BASE_TOP_Y = 59;
const BASE_BOTTOM_Y = 127;
const BASE_TOP_X0 = 22;
const BASE_TOP_X1 = 74;
const BASE_BOTTOM_X0 = 8;
const BASE_BOTTOM_X1 = 88;

// Centered in the base's own vertical span ((59 + 127) / 2), not just
// horizontally.
const DIAL_CENTER = { x: 48, y: (BASE_TOP_Y + BASE_BOTTOM_Y) / 2 };
const DIAL_R = 15;
const DIAL_CENTER_HOLE_R = 5.3;
const DIAL_RING_R = 11;
const DIAL_HOLE_R = 2;
const DIGITS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
// How much to round off just the two top corners (where the base
// meets the cradle prongs) — the bottom two stay sharp, matching the
// reference art. Implemented as a radial "bump" subtracted from the
// sharp trapezoid's depth, centered on each vertex: zero effect
// beyond this radius, growing to fully exclude the vertex itself right
// at its tip, which softens a hard corner into a curve without a full
// tangent-circle construction.
const TOP_CORNER_ROUND = 7;

function holeCenter(i: number): Point {
  const angleDeg = -150 + i * (300 / 9);
  const angle = (angleDeg * Math.PI) / 180;
  return {
    x: DIAL_CENTER.x + DIAL_RING_R * Math.cos(angle),
    y: DIAL_CENTER.y + DIAL_RING_R * Math.sin(angle),
  };
}

function baseDistance(px: number, py: number): number {
  let d = insideTrapezoid(px, py, BASE_TOP_X0, BASE_TOP_X1, BASE_TOP_Y, BASE_BOTTOM_X0, BASE_BOTTOM_X1, BASE_BOTTOM_Y);
  d -= Math.max(0, TOP_CORNER_ROUND - Math.hypot(px - BASE_TOP_X0, py - BASE_TOP_Y));
  d -= Math.max(0, TOP_CORNER_ROUND - Math.hypot(px - BASE_TOP_X1, py - BASE_TOP_Y));
  // Prong/holder Y bounds move down with BASE_TOP_Y, keeping the same
  // protrusion-above/embedding-below the top edge as the original
  // (46,56)/(38,56) — so they stay raised nubs sitting just above the
  // base's own top edge instead of getting swallowed into its body.
  d = Math.max(d, insideRect(px, py, 29, 55, 39, 65)); // left cradle prong
  d = Math.max(d, insideRect(px, py, 57, 55, 67, 65)); // right cradle prong
  // Center holder: a vertical post between the two prongs, taller than
  // either of them, that the handset actually balances across —
  // rather than just two disconnected side bumps.
  d = Math.max(d, insideRect(px, py, 41, 47, 55, 65));
  return d;
}

function dialDistance(px: number, py: number): number {
  let d = insideCircle(px, py, DIAL_CENTER.x, DIAL_CENTER.y, DIAL_R);

  const centerHole = insideCircle(px, py, DIAL_CENTER.x, DIAL_CENTER.y, DIAL_CENTER_HOLE_R);
  if (centerHole > 0) d = Math.min(d, -centerHole);

  for (let i = 0; i < 10; i++) {
    const h = holeCenter(i);
    const hole = insideCircle(px, py, h.x, h.y, DIAL_HOLE_R);
    if (hole > 0) d = Math.min(d, -hole);
  }
  return d;
}

const RECEIVER_BRIDGE = sampleBezier({ x: 20, y: 40 }, { x: 48, y: 10 }, { x: 76, y: 40 }, 40);

function receiverDistance(px: number, py: number): number {
  let d = insideEllipse(px, py, 14, 40, 11, 8.5);
  d = Math.max(d, insideEllipse(px, py, 82, 40, 11, 8.5));
  d = Math.max(d, insideTube(px, py, RECEIVER_BRIDGE, 6));
  return d;
}

// The same block-shading set the Hero mountains use (Hero/ascii.ts),
// for visual consistency between the two ASCII drawings on the site —
// a halftone-dot look, fading from the lightest character right at a
// silhouette's edge to the densest one a short distance inside it.
const CHARS = ["░", "▒", "▓", "▓", "█"];
// Rises 0→1 across the edge's anti-aliased band (rim reads as solid),
// then falls 1→0 across INNER_FADE moving further inward — a ridge,
// not a plateau, so density peaks right at the silhouette's rim and
// empties back out toward its center.
function fillRatio(insideDist: number): number {
  if (insideDist <= EDGE_SOFTNESS) return insideDist / EDGE_SOFTNESS;
  return Math.max(0, 1 - (insideDist - EDGE_SOFTNESS) / INNER_FADE);
}
function shadeChar(ratio: number): string {
  if (ratio < 0.15) return CHARS[0];
  if (ratio < 0.35) return CHARS[1];
  if (ratio < 0.6) return CHARS[2];
  if (ratio < 0.85) return CHARS[3];
  return CHARS[4];
}

function generateLayer(distFn: (px: number, py: number) => number): string {
  const lines: string[] = [];
  for (let row = 0; row < PHONE_ROWS; row++) {
    let line = "";
    for (let col = 0; col < PHONE_COLS; col++) {
      const px = col;
      const py = row * ROW_SCALE;
      const d = distFn(px, py);
      const ratio = d > 0 ? fillRatio(d) : 0;
      line += ratio > 0 ? shadeChar(ratio) : " ";
    }
    lines.push(line);
  }
  return lines.join("\n");
}

export type PhoneDigit = { row: number; col: number; char: string };

export type PhoneLayers = {
  base: string;
  dial: string;
  receiver: string;
  // Rendered separately, bold, on top of the dial layer — a hole's
  // exact center point is already blank space (it's inside the
  // punched-out hole, not the filled disc) in the dial string above;
  // this just says what belongs in that blank spot instead of baking
  // a plain, unstyled digit character into the silhouette text
  // directly.
  digits: PhoneDigit[];
};

export function generatePhoneLayers(): PhoneLayers {
  const digits: PhoneDigit[] = DIGITS.map((char, i) => {
    const h = holeCenter(i);
    return { row: h.y / ROW_SCALE, col: h.x, char };
  });
  return {
    base: generateLayer(baseDistance),
    dial: generateLayer(dialDistance),
    receiver: generateLayer(receiverDistance),
    digits,
  };
}

// In grid (col, row) units — for transform-origin of the
// independently-animated dial layer.
export const DIAL_CENTER_GRID = { col: DIAL_CENTER.x, row: DIAL_CENTER.y / ROW_SCALE };
