export interface Peak {
  x: number;
  height: number;
  width: number;
}

const CHARS = ["░", "▒", "▓", "▓", "█"];

function hash(seed: number): number {
  const v = Math.abs(Math.sin(seed * 12.9898) * 43758.5453);
  return v - Math.floor(v);
}

function seededPeaks(cols: number, rows: number, count: number, seed: number): Peak[] {
  const peaks: Peak[] = [];
  for (let i = 0; i < count; i++) {
    const s = seed + i * 17.31;
    peaks.push({
      x: (cols / count) * i + hash(s) * (cols / count),
      height: rows * (0.5 + hash(s + 1) * 0.44),
      width: 16 + hash(s + 2) * 26,
    });
  }
  return peaks;
}

function silhouetteProfile(cols: number, rows: number, peaks: Peak[]): number[] {
  const profile: number[] = [];
  for (let x = 0; x < cols; x++) {
    let highest = rows;
    for (const p of peaks) {
      const dx = Math.abs(x - p.x);
      const influence = Math.max(0, 1 - dx / p.width);
      const h = rows - p.height * influence;
      if (h < highest) highest = h;
    }
    profile.push(highest);
  }
  return profile;
}

function shade(ratio: number): string {
  if (ratio > 0.86) return CHARS[0];
  if (ratio > 0.66) return CHARS[1];
  if (ratio > 0.46) return CHARS[2];
  if (ratio > 0.24) return CHARS[3];
  return CHARS[4];
}

function asciiFromProfile(cols: number, rows: number, profile: number[]): string {
  const lines: string[] = [];
  for (let y = 0; y < rows; y++) {
    let line = "";
    for (let x = 0; x < cols; x++) {
      const highest = profile[x];
      if (y >= highest) {
        const ratio = (y - highest) / Math.max(1, rows - highest);
        line += shade(ratio);
      } else {
        line += " ";
      }
    }
    lines.push(line);
  }
  return lines.join("\n");
}

export interface MountainLayerData {
  ascii: string;
}

export function generateMountainLayer(
  cols: number,
  rows: number,
  peakCount: number,
  seed: number
): MountainLayerData {
  const peaks = seededPeaks(cols, rows, peakCount, seed);
  const profile = silhouetteProfile(cols, rows, peaks);
  return {
    ascii: asciiFromProfile(cols, rows, profile),
  };
}
