// Grid + fisheye math, kept as pure functions so every value driving the
// tile transform can be produced inside a Framer Motion `useTransform`
// callback instead of React state — nothing here triggers a re-render.

export interface GridConfig {
  cols: number;
  rows: number;
  tileW: number;
  tileH: number;
}

// Tiles render this many px larger than their grid spacing (centered via
// negative offset) so the very slight curvature that's still applied
// never reveals a hairline gap between neighbors.
export const TILE_OVERLAP = 2;

export const DESKTOP_GRID: GridConfig = { cols: 10, rows: 8, tileW: 420, tileH: 300 };
export const MOBILE_GRID: GridConfig = { cols: 5, rows: 6, tileW: 220, tileH: 160 };
export const MOBILE_BREAKPOINT = 720;

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

// Deterministic pseudo-random in [0, 1), seeded by an integer. Same seed
// always produces the same value so a tile's "resting jitter" never
// changes between renders/drags — it's baked into that tile's identity.
export function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export interface TileJitter {
  rx: number;
  ry: number;
  rz: number;
}

// Per-tile resting rotation. Kept at 0 by default — independent random
// rotation per tile breaks the flush, stitched-together look between
// neighbors (each tile rotating around its own center by an uncorrelated
// amount opens visible seams). Bump JITTER_STRENGTH back up (0-1) if you
// want a bit of that "uneven glass pane" texture back; the seams will
// reappear proportionally.
const JITTER_STRENGTH = 0;

export function tileJitter(cellIndex: number): TileJitter {
  if (JITTER_STRENGTH === 0) return { rx: 0, ry: 0, rz: 0 };
  const r1 = seededRandom(cellIndex * 3 + 11);
  const r2 = seededRandom(cellIndex * 3 + 23);
  const r3 = seededRandom(cellIndex * 3 + 41);
  return {
    rx: (r1 * 2 - 1) * 3.5 * JITTER_STRENGTH,
    ry: (r2 * 2 - 1) * 3.5 * JITTER_STRENGTH,
    rz: (r3 * 2 - 1) * 2 * JITTER_STRENGTH,
  };
}

// Wrap `value` into the range [-span/2, span/2). This is what makes the
// grid feel infinite: a tile's on-screen position is always its nearest
// periodic copy to the viewport center, so as long as the base grid
// (cols*tileW, rows*tileH) is bigger than the viewport, the screen never
// runs out of tiles no matter how far or how long you drag.
export function wrapToNearest(value: number, span: number): number {
  return value - span * Math.round(value / span);
}

// Mixes row and col together before taking the modulo, instead of a plain
// cellIndex % mod. A plain modulo repeats in lockstep with the grid's
// column count whenever mod divides evenly into cols (e.g. 10 columns,
// 10 projects -> every tile in a column is identical forever). The cross
// term (row * col) and large odd multipliers break that alignment for
// any grid size / project count combination. `salt` lets two independent
// hashes (e.g. "which project" and "show title card") stay uncorrelated.
export function cellHash(row: number, col: number, mod: number, salt = 0): number {
  const h = (row * 92821 + col * 63421 + row * col * 15731 + salt * 7919) >>> 0;
  return h % mod;
}

export interface FisheyeResult {
  extraRotate: number;
  dirX: number;
  dirY: number;
  scale: number;
}

// Distance-based curve: rotation + compression increase the further a
// tile sits from the viewport center, on top of its own base jitter.
// Kept gentle and linear (not eased) so the rotation delta between two
// neighboring tiles stays small everywhere — that's what keeps edges
// reading as one continuous curved surface instead of fanning apart.
export function fisheyeCurve(x: number, y: number, maxDist: number): FisheyeResult {
  const dist = Math.sqrt(x * x + y * y);
  const t = clamp(dist / maxDist, 0, 1);
  return {
    // Rotation removed intentionally — tiles no longer tilt toward the
    // grid edges. Only a gentle scale falloff remains for a hint of
    // depth without any skew.
    extraRotate: 0,
    scale: 1 - t * 0.1,
    dirX: dist === 0 ? 0 : x / dist,
    dirY: dist === 0 ? 0 : y / dist,
  };
}
