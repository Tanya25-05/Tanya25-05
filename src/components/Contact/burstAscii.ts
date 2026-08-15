// Procedural ASCII starburst ("TRR TRR!!" callout) — generated the
// same way phoneAscii.ts builds the phone itself: a shape defined as a
// distance field, sampled onto a monospace grid, and shaded with the
// same block-character ramp. That's what makes the callouts read as
// the same drawing as the phone they surround, rather than a smooth
// vector shape dropped in next to a stippled one.

const BURST_COLS = 30;
const BURST_ROWS = 18;
const ROW_SCALE = 2;
const STROKE_WIDTH = 1.3;

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

// Alternating long/short spikes at slightly irregular radii — a
// perfectly even star reads as a flower, not an explosion. The center
// sits in physical (x, y*ROW_SCALE) space, same convention as
// phoneAscii.ts's dial.
const CENTER = { x: 15, y: 18 };
const OUTER_RADII = [15, 12, 16, 11, 15, 12, 17, 11, 14, 12, 16];
const INNER_R = 6;

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
// there — a soft, textured line instead of a single flat character.
const CHARS = ["░", "▒", "▓", "▓", "█"];
function shadeChar(dist: number): string {
  const ratio = dist / STROKE_WIDTH;
  if (ratio > 0.8) return CHARS[0];
  if (ratio > 0.6) return CHARS[1];
  if (ratio > 0.35) return CHARS[2];
  if (ratio > 0.15) return CHARS[3];
  return CHARS[4];
}

function generateBurstLayer(): string {
  const lines: string[] = [];
  for (let row = 0; row < BURST_ROWS; row++) {
    let line = "";
    for (let col = 0; col < BURST_COLS; col++) {
      const d = distPointToPolyline(col, row * ROW_SCALE, OUTLINE);
      line += d < STROKE_WIDTH ? shadeChar(d) : " ";
    }
    lines.push(line);
  }
  return lines.join("\n");
}

export const BURST_ART = generateBurstLayer();
