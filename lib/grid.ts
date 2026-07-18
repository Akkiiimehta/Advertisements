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
// negative offset) so rounding/subpixel rendering never reveals a
// hairline gap between neighbors.
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

export interface HasBrand {
  brand: string;
}

// Assigns a project to every cell in the (cols x rows) grid such that no
// cell shares a brand with its left or top neighbor, wherever that's
// possible.
//
// At each cell, this picks live — not from a precomputed sequence —
// whichever brand has gone the longest without being placed, filtered
// down to brands that won't clash with this cell's left/top neighbor.
// That combination (recency-based fairness + a live neighbor check)
// keeps a dominant brand spread evenly across the whole grid instead of
// clustering, and only produces a same-brand pair when it's genuinely
// unavoidable (i.e. one brand is more than half the catalog). A
// precomputed queue — round-robin or otherwise — can't react to the
// actual neighbors it lands next to; deciding at the moment of
// placement can.
//
// Deterministic (fixed seed) so the layout doesn't reshuffle on every
// re-render, only when the project set or grid size actually changes.
export function buildGridAssignment<T extends HasBrand>(cols: number, rows: number, items: T[]): number[] {
  const total = cols * rows;
  const assignment = new Array<number>(total).fill(0);
  if (items.length <= 1) return assignment;

  let seed = 1;
  const rand = () => seededRandom(seed++);

  function shuffle<A>(arr: A[]): A[] {
    const out = arr.slice();
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }

  const brands = shuffle(Array.from(new Set(items.map((i) => i.brand))));
  const indicesByBrand = new Map<string, number[]>(
    brands.map((b) => [b, items.map((it, i) => (it.brand === b ? i : -1)).filter((i) => i !== -1)])
  );
  const queues = new Map<string, number[]>(brands.map((b) => [b, shuffle(indicesByBrand.get(b)!)]));
  const lastUsedStep = new Map<string, number>(brands.map((b) => [b, -Infinity]));

  function takeFromBrand(brand: string): number {
    const q = queues.get(brand)!;
    if (q.length === 0) queues.set(brand, shuffle(indicesByBrand.get(brand)!));
    return queues.get(brand)!.shift()!;
  }

  let step = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cellIndex = row * cols + col;
      const leftBrand = col > 0 ? items[assignment[cellIndex - 1]].brand : undefined;
      const topBrand = row > 0 ? items[assignment[cellIndex - cols]].brand : undefined;

      // Candidates that won't clash, ordered so brands shuffled earlier
      // break ties randomly rather than always losing to array order —
      // then sorted so whichever brand is most "overdue" wins.
      let candidates = shuffle(brands.filter((b) => b !== leftBrand && b !== topBrand));
      if (candidates.length === 0) candidates = shuffle(brands); // every brand clashes — only 1-2 brands total

      candidates.sort((a, b) => lastUsedStep.get(a)! - lastUsedStep.get(b)!);
      const chosenBrand = candidates[0];

      assignment[cellIndex] = takeFromBrand(chosenBrand);
      lastUsedStep.set(chosenBrand, step);
      step++;
    }
  }

  return assignment;
}
