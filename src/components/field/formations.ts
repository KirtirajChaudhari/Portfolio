/* Point formations for the home-page figure.

   23,756 points, the node count of RasaCare's knowledge graph, arranged three
   ways. The counts are real (the point total, and the 2,788 / 256 / 4 layer
   sizes of the DrishtiManas network). The positions are an illustration, and
   the caption beside the figure says so.

   Everything is generated from one seed, so every visitor and every test run
   sees the same figure. */

export const POINTS = 23_756;

/** Per-point attributes, interleaved: three positions, then one value per
 *  formation for trace (0 or 1), size and position along the traced path. */
export const STRIDE = 19;
export const OFFSET = { a: 0, b: 3, c: 6, trace: 9, size: 12, path: 15, seed: 18 } as const;

export const FORMATIONS = ['graph', 'network', 'track'] as const;
export type Formation = (typeof FORMATIONS)[number];

interface Point { x: number; y: number; z: number; trace: number; size: number; path: number }

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Roughly normal, cheap: the sum of three uniforms, centred. */
const gauss = (r: () => number) => (r() + r() + r() - 1.5) * 1.15;

const pt = (x: number, y: number, z: number, size = 1, trace = 0, path = 0): Point => ({ x, y, z, trace, size, path });

/** A clustered graph with one path through it marked as the trace. */
function graph(r: () => number): Point[] {
  const K = 34;
  const centers: [number, number, number][] = [];
  for (let i = 0; i < K; i++) {
    const y = 1 - (2 * (i + 0.5)) / K;
    const ring = Math.sqrt(1 - y * y);
    const phi = i * 2.399963;
    const rad = 0.42 + 0.58 * r();
    centers.push([Math.cos(phi) * ring * rad * 1.18, y * rad * 0.86, Math.sin(phi) * ring * rad * 0.95]);
  }
  const dist = (i: number, j: number) => Math.hypot(centers[i][0] - centers[j][0], centers[i][1] - centers[j][1], centers[i][2] - centers[j][2]);

  /* Each cluster links to its two nearest neighbours. */
  const edgeKey = new Set<string>();
  const edges: [number, number][] = [];
  const link = (i: number, j: number) => {
    const k = i < j ? `${i}-${j}` : `${j}-${i}`;
    if (i === j || edgeKey.has(k)) return;
    edgeKey.add(k);
    edges.push([i, j]);
  };
  for (let i = 0; i < K; i++) {
    const near = [...centers.keys()].filter((j) => j !== i).sort((p, q) => dist(i, p) - dist(i, q));
    link(i, near[0]);
    link(i, near[1]);
  }

  /* The trace: start at the leftmost cluster and keep stepping to the nearest
     cluster that lies further right. */
  const path: number[] = [centers.reduce((best, c, i) => (c[0] < centers[best][0] ? i : best), 0)];
  for (;;) {
    const cur = path[path.length - 1];
    const next = [...centers.keys()]
      .filter((j) => centers[j][0] > centers[cur][0] + 0.2)
      .sort((p, q) => dist(cur, p) - dist(cur, q))[0];
    if (next === undefined) break;
    path.push(next);
  }
  const hops = path.length - 1;
  for (let h = 0; h < hops; h++) link(path[h], path[h + 1]);

  const out: Point[] = [];
  /* Hubs: one large point at every cluster centre. */
  centers.forEach((c, i) => {
    const at = path.indexOf(i);
    out.push(pt(c[0], c[1], c[2], at >= 0 ? 4.2 : 2.6, at >= 0 ? 1 : 0, at >= 0 ? at / hops : 0));
  });
  /* Traced hops, drawn densely so the path reads as a line. */
  for (let h = 0; h < hops; h++) {
    const a = centers[path[h]];
    const b = centers[path[h + 1]];
    for (let n = 0; n < 190; n++) {
      const t = (n + r()) / 190;
      out.push(pt(a[0] + (b[0] - a[0]) * t + gauss(r) * 0.004, a[1] + (b[1] - a[1]) * t + gauss(r) * 0.004, a[2] + (b[2] - a[2]) * t + gauss(r) * 0.004, 1.5, 1, (h + t) / hops));
    }
  }
  /* Every other edge, as a thin filament. */
  const filament = Math.floor(POINTS * 0.2 / edges.length);
  for (const [i, j] of edges) {
    const a = centers[i];
    const b = centers[j];
    for (let n = 0; n < filament; n++) {
      const t = r();
      out.push(pt(a[0] + (b[0] - a[0]) * t + gauss(r) * 0.009, a[1] + (b[1] - a[1]) * t + gauss(r) * 0.009, a[2] + (b[2] - a[2]) * t + gauss(r) * 0.009, 0.8));
    }
  }
  /* The rest gathers around the centres. */
  const spread = centers.map(() => 0.05 + 0.1 * r());
  while (out.length < POINTS) {
    const k = Math.floor(r() * K);
    const s = spread[k] * (r() < 0.12 ? 2.4 : 1);
    out.push(pt(centers[k][0] + gauss(r) * s, centers[k][1] + gauss(r) * s, centers[k][2] + gauss(r) * s, r() < 0.04 ? 1.9 : 1));
  }
  return out;
}

/** DrishtiManas's network at its real layer sizes: 2,788 inputs (41 x 68),
 *  256 hidden units (16 x 16) and 4 classes. Connections are sampled. */
function network(r: () => number): Point[] {
  const input: [number, number, number][] = [];
  for (let row = 0; row < 68; row++) for (let col = 0; col < 41; col++) input.push([-1.05, 0.86 - (row / 67) * 1.72, -0.52 + (col / 40) * 1.04]);
  const hidden: [number, number, number][] = [];
  for (let row = 0; row < 16; row++) for (let col = 0; col < 16; col++) hidden.push([0, 0.42 - (row / 15) * 0.84, -0.42 + (col / 15) * 0.84]);
  const output: [number, number, number][] = [0.36, 0.12, -0.12, -0.36].map((y) => [1.05, y, 0]);

  const out: Point[] = [];
  input.forEach((p) => out.push(pt(p[0], p[1], p[2], 1.05)));
  hidden.forEach((p) => out.push(pt(p[0], p[1], p[2], 2.1)));

  /* One forward path, traced: an input, a hidden unit, the predicted class. */
  const from = input[23 * 41 + 9];
  const via = hidden[5 * 16 + 10];
  const to = output[1];
  output.forEach((p, i) => out.push(pt(p[0], p[1], p[2], 5, i === 1 ? 1 : 0, 1)));
  for (let n = 0; n < 260; n++) {
    const t = (n + r()) / 260;
    out.push(pt(from[0] + (via[0] - from[0]) * t, from[1] + (via[1] - from[1]) * t, from[2] + (via[2] - from[2]) * t, 1.5, 1, t * 0.5));
    out.push(pt(via[0] + (to[0] - via[0]) * t, via[1] + (to[1] - via[1]) * t, via[2] + (to[2] - via[2]) * t, 1.5, 1, 0.5 + t * 0.5));
  }
  while (out.length < POINTS) {
    const first = r() < 0.62;
    const a = first ? input[Math.floor(r() * input.length)] : hidden[Math.floor(r() * hidden.length)];
    const b = first ? hidden[Math.floor(r() * hidden.length)] : output[Math.floor(r() * output.length)];
    const t = r();
    out.push(pt(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t, 0.62));
  }
  return out;
}

/** A length of track with one obstacle inside a detection frame. */
function track(r: () => number): Point[] {
  const out: Point[] = [];
  const Y = -0.42;
  const Z0 = -2.2;
  const Z1 = 1.05;
  for (const x of [-0.27, 0.27]) {
    for (let n = 0; n < 2600; n++) out.push(pt(x + gauss(r) * 0.006, Y + r() * 0.03, Z0 + r() * (Z1 - Z0), 1.1));
  }
  for (let z = Z0; z <= Z1; z += 0.13) {
    for (let n = 0; n < 130; n++) out.push(pt(-0.43 + r() * 0.86, Y - 0.02 + gauss(r) * 0.004, z + gauss(r) * 0.012, 0.9));
  }
  /* The obstacle, and the frame a detector would draw round it. */
  const box = { x0: -0.34, x1: 0.2, y0: Y, y1: 0.16, z0: -0.2, z1: 0.24 };
  for (let n = 0; n < 2400; n++) {
    const u = gauss(r) * 0.55;
    const v = Math.abs(gauss(r)) * 0.6;
    const w = gauss(r) * 0.55;
    out.push(pt(-0.07 + u * 0.2, Y + 0.02 + v * 0.42, 0.02 + w * 0.17, 1));
  }
  const corner = (i: number): [number, number, number] => [i & 1 ? box.x1 : box.x0, i & 2 ? box.y1 : box.y0, i & 4 ? box.z1 : box.z0];
  for (let a = 0; a < 8; a++) {
    for (const bit of [1, 2, 4]) {
      if (a & bit) continue;
      const p = corner(a);
      const q = corner(a | bit);
      for (let n = 0; n < 120; n++) {
        const t = n / 119;
        out.push(pt(p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t, p[2] + (q[2] - p[2]) * t, 1.5, 1, 0.5));
      }
    }
  }
  /* Ballast, thinning with distance from the rails. */
  while (out.length < POINTS) {
    const x = gauss(r) * 0.62;
    out.push(pt(x, Y - 0.04 - Math.abs(gauss(r)) * 0.012 - Math.max(0, Math.abs(x) - 0.5) * 0.12, Z0 + r() * (Z1 - Z0), 0.7));
  }
  return out;
}

function shuffle<T>(list: T[], r: () => number, from = 0) {
  for (let i = list.length - 1; i > from; i--) {
    const j = from + Math.floor(r() * (i - from + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
}

let cache: Float32Array | undefined;

/** The interleaved buffer for all three formations. Built once, about 15 ms. */
export function buildFormations(): Float32Array {
  if (cache) return cache;
  const r = mulberry32(23756);
  const sets = [graph(r), network(r), track(r)];
  /* Which point of one formation becomes which point of the next is random, so
     a morph reads as a swarm. Traced points are sorted last so they draw on top. */
  sets.forEach((s) => { shuffle(s, r); s.sort((p, q) => p.trace - q.trace); });

  const data = new Float32Array(POINTS * STRIDE);
  for (let i = 0; i < POINTS; i++) {
    const o = i * STRIDE;
    sets.forEach((s, f) => {
      const p = s[i];
      data[o + f * 3] = p.x;
      data[o + f * 3 + 1] = p.y;
      data[o + f * 3 + 2] = p.z;
      data[o + OFFSET.trace + f] = p.trace;
      data[o + OFFSET.size + f] = p.size;
      data[o + OFFSET.path + f] = p.path;
    });
    data[o + OFFSET.seed] = r();
  }
  return (cache = data);
}

/** Camera for each formation: yaw and pitch in radians, and a zoom factor
 *  applied to the distance that fits the figure in its frame (1 = exact fit). */
export const VIEW: Record<Formation, { yaw: number; pitch: number; zoom: number }> = {
  graph: { yaw: 0.3, pitch: 0.14, zoom: 1 },
  network: { yaw: -0.72, pitch: 0.2, zoom: 1.02 },
  track: { yaw: 0.36, pitch: 0.3, zoom: 1.08 },
};
