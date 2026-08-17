// Procedural ASCII starburst ("TRR TRR!!" callout) — generated the
// same way phoneAscii.ts builds the phone itself: a shape defined as a
// distance field, sampled onto a monospace grid, and shaded with the
// same block-character ramp. That's what makes the callouts read as
// the same drawing as the phone they surround, rather than a smooth
// vector shape dropped in next to a stippled one.

const BURST_COLS = 30;
const BURST_ROWS = 18;
const ROW_SCALE = 2;
// Width, in physical units, of the soft anti-aliased band at the
// star's edge — see phoneAscii.ts's EDGE_SOFTNESS for the same idea.
const EDGE_SOFTNESS = 1.2;

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

// Standard ray-casting point-in-polygon test — this is what turns the
// star from a hollow outline (the old look, which at this thinness
// read as a delicate snowflake rather than a solid "offer" burst) into
// a filled shape.
function pointInPolygon(px: number, py: number, pts: Point[]): boolean {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const xi = pts[i].x;
    const yi = pts[i].y;
    const xj = pts[j].x;
    const yj = pts[j].y;
    const intersect = yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

// Fewer, blunter spikes than a snowflake's thin needles — a shallower
// gap between INNER_R and the outer radii keeps each point wide at its
// base, closer to a classic "sale sticker" starburst than a sharp,
// spindly star. The center sits in physical (x, y*ROW_SCALE) space,
// same convention as phoneAscii.ts's dial.
const CENTER = { x: 15, y: 18 };
const OUTER_RADII = [13, 11, 14, 10, 13, 11, 14, 10, 13, 11];
const INNER_R = 8;

function burstOutline(): Point[] {
  const pts: Point[] = [];
  const step = Math.PI / OUTER_RADII.length;
  let rot = -Math.PI / 2;
  for (let i = 0; i < OUTER_RADII.length; i++) {
    const outerR = OUTER_RADII[i];
    pts.push({ x: CENTER.x + Math.cos(rot) * outerR, y: CENTER.y + Math.sin(rot) * outerR });
    rot += step;
    pts.push({ x: CENTER.x + Math.cos(rot) * INNER_R, y: CENTER.y + Math.sin(rot) * INNER_R });
    rot += step;
  }
  pts.push(pts[0]);
  return pts;
}

const OUTLINE = burstOutline();

// Same shading ramp as phoneAscii.ts, for the same reason it's used
// there — a soft, textured edge instead of a single flat character,
// fading from the lightest block right at the star's boundary to the
// densest one a short distance inside it (and staying solid all the
// way to the center — an "offer" badge reads as a filled shape, not a
// hollow one).
const CHARS = ["░", "▒", "▓", "▓", "█"];
function shadeChar(insideDist: number): string {
  const ratio = Math.min(insideDist / EDGE_SOFTNESS, 1);
  if (ratio < 0.15) return CHARS[0];
  if (ratio < 0.35) return CHARS[1];
  if (ratio < 0.6) return CHARS[2];
  if (ratio < 0.85) return CHARS[3];
  return CHARS[4];
}

function generateBurstLayer(): string {
  const lines: string[] = [];
  for (let row = 0; row < BURST_ROWS; row++) {
    let line = "";
    for (let col = 0; col < BURST_COLS; col++) {
      const px = col;
      const py = row * ROW_SCALE;
      if (pointInPolygon(px, py, OUTLINE)) {
        line += shadeChar(distPointToPolyline(px, py, OUTLINE));
      } else {
        line += " ";
      }
    }
    lines.push(line);
  }
  return lines.join("\n");
}

export const BURST_ART = generateBurstLayer();
