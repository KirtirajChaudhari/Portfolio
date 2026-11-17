import { camera, drawPoints2d, perspective, readColor } from './engine';
import { buildFormations, FORMATIONS, VIEW, type Formation } from './formations';

/** Draws one formation, once, on a 2D canvas sized to its box. */
export function drawStill(canvas: HTMLCanvasElement, formation: Formation) {
  const ctx = canvas.getContext('2d');
  const rect = canvas.getBoundingClientRect();
  if (!ctx || rect.width < 2) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = (canvas.width = Math.round(rect.width * dpr));
  const h = (canvas.height = Math.round(rect.height * dpr));
  const view = VIEW[formation];
  const aspect = w / h;
  /* Keep the whole figure in frame whatever the box's shape. */
  const tan = Math.tan((35 * Math.PI) / 360);
  const dist = Math.max(1.2 / (tan * aspect * 0.92), 1.2 / (tan * 0.9)) * view.zoom;
  const proj = new Float32Array(16);
  const mvp = new Float32Array(16);
  perspective(proj, aspect);
  camera(mvp, proj, view.yaw, view.pitch, dist);
  drawPoints2d(ctx, buildFormations(), FORMATIONS.indexOf(formation), mvp, {
    w, h, dist, shiftX: 0, shiftY: 0,
    px: dist * Math.max(1.25 * dpr, h / 420),
    minPx: dpr,
    ink: readColor(canvas, '--fg'),
    signal: readColor(canvas, '--signal'),
  });
  canvas.style.color = '';
}
