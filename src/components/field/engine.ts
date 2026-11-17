import { buildFormations, FORMATIONS, OFFSET, POINTS, STRIDE, VIEW } from './formations';

/* The home-page figure.

   CLAUDE.md rules this file is built around:
   - One requestAnimationFrame loop. Pointer events write to a plain object and
     the loop is the only code that reads layout or writes to the DOM.
   - Per frame the page itself changes nothing but this canvas and, when the
     step changes, one data attribute.
   - Reduced motion and software GPUs are first-class: `stepped` mode draws one
     still frame per scroll step and runs no loop at all.

   Raw WebGL2, one program, one draw call. No library. */

export interface FieldOptions {
  /** Draw with WebGL. False draws the same formations once per step on a 2D canvas. */
  webgl: boolean;
  /** Continuous loop with morphs, sway and the travelling pulse. False = one frame per step. */
  live: boolean;
  /** Let the pointer lean the camera. */
  pointer: boolean;
}

const FOV = (35 * Math.PI) / 180;
const TAN = Math.tan(FOV / 2);
const RADIUS = 1.2;          /* scene units the camera must keep in frame */
const TAU = 0.16;            /* s, smoothing of every scroll-driven value */
const MAX_DT = 0.05;         /* s, a stalled tab must not integrate one giant step */

const VERT = `#version 300 es
precision highp float;
in vec3 aA; in vec3 aB; in vec3 aC;
in vec3 aTrace; in vec3 aSize; in vec3 aPath;
in float aSeed;
uniform mat4 uMVP;
uniform vec2 uShift;
uniform float uMorph;
uniform float uPx;
uniform float uMinPx;
uniform float uDist;
uniform float uPulse;
out float vTrace;
out float vAlpha;
float ease(float t) { return t * t * (3.0 - 2.0 * t); }
void main() {
  /* Each point leaves on its own delay, so a morph travels through the cloud. */
  float w1 = ease(clamp((uMorph - aSeed * 0.4) / 0.6, 0.0, 1.0));
  float w2 = ease(clamp((uMorph - 1.0 - aSeed * 0.4) / 0.6, 0.0, 1.0));
  vec3 p = mix(mix(aA, aB, w1), aC, w2);
  float transit = w1 * (1.0 - w1) + w2 * (1.0 - w2);
  p += (vec3(aSeed, fract(aSeed * 7.31), fract(aSeed * 13.73)) - 0.5) * transit * 1.5;

  float trace = mix(mix(aTrace.x, aTrace.y, w1), aTrace.z, w2);
  float size = mix(mix(aSize.x, aSize.y, w1), aSize.z, w2);
  float along = mix(mix(aPath.x, aPath.y, w1), aPath.z, w2);
  float hot = trace * exp(-pow((along - uPulse) * 7.0, 2.0)) * (1.0 - min(1.0, transit * 4.0));

  gl_Position = uMVP * vec4(p, 1.0);
  float depth = gl_Position.w;
  gl_Position.xy += uShift * depth;
  gl_PointSize = max(uMinPx, uPx * size * (1.0 + hot * 1.3) / depth);
  vTrace = trace;
  /* Nearer points are stronger; the far side of the figure recedes. */
  vAlpha = mix(clamp(1.15 - (depth - uDist) * 0.5, 0.22, 1.0) * 0.74, 1.0, trace);
}`;

const FRAG = `#version 300 es
precision mediump float;
in float vTrace;
in float vAlpha;
uniform vec3 uInk;
uniform vec3 uSignal;
out vec4 color;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.32, d) * vAlpha;
  if (a < 0.01) discard;
  color = vec4(mix(uInk, uSignal, step(0.5, vTrace)) * a, a);
}`;

type Mat = Float32Array;

export function perspective(out: Mat, aspect: number) {
  const f = 1 / TAN;
  const near = 0.1;
  const far = 40;
  out.fill(0);
  out[0] = f / aspect;
  out[5] = f;
  out[10] = (far + near) / (near - far);
  out[11] = -1;
  out[14] = (2 * far * near) / (near - far);
}

/** out = projection * translate(0, 0, -dist) * rotateX(pitch) * rotateY(yaw) */
export function camera(out: Mat, proj: Mat, yaw: number, pitch: number, dist: number) {
  const cy = Math.cos(yaw), sy = Math.sin(yaw), cx = Math.cos(pitch), sx = Math.sin(pitch);
  /* The view matrix, column-major. */
  const v = [cy, sx * sy, -cx * sy, 0, 0, cx, sx, 0, sy, -sx * cy, cx * cy, 0, 0, 0, -dist, 1];
  for (let c = 0; c < 4; c++) {
    for (let r = 0; r < 4; r++) {
      out[c * 4 + r] = proj[r] * v[c * 4] + proj[4 + r] * v[c * 4 + 1] + proj[8 + r] * v[c * 4 + 2] + proj[12 + r] * v[c * 4 + 3];
    }
  }
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (v: number) => v * v * (3 - 2 * v);
/** Holds near 0 and 1 so a formation rests while its panel is being read. */
const hold = (v: number) => smooth(clamp01((v - 0.2) / 0.6));

/** Resolves any CSS colour (the tokens are OKLCH inside light-dark()) to sRGB in 0..1. */
export function readColor(probe: HTMLElement, cssVar: string): [number, number, number] {
  probe.style.color = `var(${cssVar})`;
  const c = document.createElement('canvas');
  c.width = c.height = 1;
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  ctx.fillStyle = getComputedStyle(probe).color;
  ctx.fillRect(0, 0, 1, 1);
  const d = ctx.getImageData(0, 0, 1, 1).data;
  return [d[0] / 255, d[1] / 255, d[2] / 255];
}

/** The same projection on the CPU: one formation, no morph. Used where there is no
 *  real GPU, and for the still figures on the Work and case-study pages. */
export function drawPoints2d(
  c: CanvasRenderingContext2D,
  data: Float32Array,
  f: number,
  mvp: Mat,
  o: { w: number; h: number; dist: number; shiftX: number; shiftY: number; px: number; minPx: number; ink: [number, number, number]; signal: [number, number, number] },
) {
  c.clearRect(0, 0, o.w, o.h);
  const rgb = (v: [number, number, number]) => `${Math.round(v[0] * 255)} ${Math.round(v[1] * 255)} ${Math.round(v[2] * 255)}`;
  const ink = rgb(o.ink);
  const signal = rgb(o.signal);
  let fill = '';
  for (let i = 0; i < POINTS; i++) {
    const at = i * STRIDE;
    const x = data[at + f * 3], y = data[at + f * 3 + 1], z = data[at + f * 3 + 2];
    const w = mvp[3] * x + mvp[7] * y + mvp[11] * z + mvp[15];
    if (w <= 0.1) continue;
    const sx = ((mvp[0] * x + mvp[4] * y + mvp[8] * z + mvp[12]) / w + o.shiftX + 1) * 0.5 * o.w;
    const sy = (1 - ((mvp[1] * x + mvp[5] * y + mvp[9] * z + mvp[13]) / w + o.shiftY)) * 0.5 * o.h;
    const trace = data[at + OFFSET.trace + f] > 0.5;
    const size = Math.max(o.minPx, (o.px * data[at + OFFSET.size + f]) / w) * 0.8;
    const alpha = trace ? 1 : Math.min(1, Math.max(0.22, 1.15 - (w - o.dist) * 0.5)) * 0.7;
    const next = `rgb(${trace ? signal : ink} / ${alpha.toFixed(2)})`;
    if (next !== fill) c.fillStyle = fill = next;
    c.fillRect(sx - size / 2, sy - size / 2, size, size);
  }
}

export function mountField(canvas: HTMLCanvasElement, stage: HTMLElement, opts: FieldOptions) {
  const data = buildFormations();
  const panels = Array.from(stage.querySelectorAll<HTMLElement>('[data-panel]'));
  const probe = document.createElement('span');
  probe.style.display = 'none';
  stage.appendChild(probe);

  const pointer = { x: 0, y: 0 };
  const state = {
    raf: 0,
    visible: false,
    alive: true,
    last: 0,
    time: 0,
    dirtySize: true,
    wide: true,
    dirtyColor: true,
    step: -1,
    /* shown (smoothed) values */
    dolly: 0,
    morph: 0,
    leanX: 0,
    leanY: 0,
    w: 0,
    h: 0,
    dpr: 1,
    ink: [0, 0, 0] as [number, number, number],
    signal: [1, 0, 0] as [number, number, number],
  };
  const proj = new Float32Array(16);
  const mvp = new Float32Array(16);

  /* ---- renderers ---- */
  let gl: WebGL2RenderingContext | null = null;
  let ctx2d: CanvasRenderingContext2D | null = null;
  const U: Record<string, WebGLUniformLocation | null> = {};

  if (opts.webgl) {
    gl = canvas.getContext('webgl2', { alpha: true, antialias: false, premultipliedAlpha: true, powerPreference: 'high-performance' });
  }
  if (gl) {
    const compile = (type: number, src: string) => {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      return s;
    };
    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) gl = null;
    else {
      gl.useProgram(program);
      gl.bindVertexArray(gl.createVertexArray());
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      const attr = (name: string, size: number, offset: number) => {
        const loc = gl!.getAttribLocation(program, name);
        if (loc < 0) return;
        gl!.enableVertexAttribArray(loc);
        gl!.vertexAttribPointer(loc, size, gl!.FLOAT, false, STRIDE * 4, offset * 4);
      };
      attr('aA', 3, OFFSET.a);
      attr('aB', 3, OFFSET.b);
      attr('aC', 3, OFFSET.c);
      attr('aTrace', 3, OFFSET.trace);
      attr('aSize', 3, OFFSET.size);
      attr('aPath', 3, OFFSET.path);
      attr('aSeed', 1, OFFSET.seed);
      for (const name of ['uMVP', 'uShift', 'uMorph', 'uPx', 'uMinPx', 'uDist', 'uPulse', 'uInk', 'uSignal']) U[name] = gl.getUniformLocation(program, name);
      gl.disable(gl.DEPTH_TEST);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.clearColor(0, 0, 0, 0);
    }
  }
  if (!gl) ctx2d = canvas.getContext('2d');

  /* ---- scroll position, as a step number with a fraction ---- */
  function progress(): number {
    if (panels.length < 2) return 0;
    const top = stage.getBoundingClientRect().top;
    const centre = -top + window.innerHeight / 2;
    let prev = panels[0].offsetTop + panels[0].offsetHeight / 2;
    if (centre <= prev) return 0;
    for (let i = 1; i < panels.length; i++) {
      const next = panels[i].offsetTop + panels[i].offsetHeight / 2;
      if (centre < next) return i - 1 + (centre - prev) / (next - prev);
      prev = next;
    }
    return panels.length - 1;
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    // CSS owns both the copy layout and the scene framing. Read only on resize.
    state.wide = getComputedStyle(stage).getPropertyValue('--field-wide').trim() === '1';
    state.dpr = Math.min(window.devicePixelRatio || 1, gl ? 2 : 1.5);
    state.w = Math.max(1, Math.round(rect.width * state.dpr));
    state.h = Math.max(1, Math.round(rect.height * state.dpr));
    canvas.width = state.w;
    canvas.height = state.h;
    gl?.viewport(0, 0, state.w, state.h);
    perspective(proj, state.w / state.h);
    state.dirtySize = false;
  }

  function draw(s: number, dt: number) {
    if (state.dirtySize) resize();
    if (state.dirtyColor) {
      state.ink = readColor(probe, '--fg');
      state.signal = readColor(probe, '--signal');
      state.dirtyColor = false;
    }
    const step = Math.round(s);
    if (step !== state.step) {
      state.step = step;
      stage.dataset.step = String(step);
    }

    /* Targets: the first step dollies in on the graph, the next two morph. */
    const dollyTo = opts.live ? hold(s) : clamp01(step);
    const morphTo = opts.live ? hold(s - 1) + hold(s - 2) : clamp01(step - 1) + clamp01(step - 2);
    const k = opts.live ? 1 - Math.exp(-dt / TAU) : 1;
    state.dolly += (dollyTo - state.dolly) * k;
    state.morph += (morphTo - state.morph) * k;
    state.leanX += (pointer.x - state.leanX) * k * 0.6;
    state.leanY += (pointer.y - state.leanY) * k * 0.6;

    const w1 = smooth(clamp01(state.morph));
    const w2 = smooth(clamp01(state.morph - 1));
    const [g, n, t] = FORMATIONS.map((f) => VIEW[f]);
    const mix3 = (a: number, b: number, c: number) => a + (b - a) * w1 + (c - b) * w2;
    const sway = opts.live ? Math.sin(state.time * 0.11) * 0.26 * (1 - w1 * 0.55) : 0;
    const yaw = mix3(g.yaw + state.dolly * 0.5, n.yaw, t.yaw) + sway + state.leanX * 0.16;
    const pitch = mix3(g.pitch, n.pitch, t.pitch) - state.leanY * 0.1;

    /* Wide screens: the figure sits right of the copy, small beside the hero
       headline and pushed in once the first project is on screen. Tall screens:
       it sits above the copy. Distance is whatever keeps RADIUS inside that frame. */
    const aspect = state.w / state.h;
    const wide = state.wide;
    const halfX = wide ? 0.4 + 0.07 * state.dolly : 0.92;
    const halfY = wide ? 0.88 : 0.46;
    const dist = Math.max(RADIUS / (TAN * aspect * halfX), RADIUS / (TAN * halfY)) * mix3(g.zoom, n.zoom, t.zoom);
    const shiftX = wide ? 0.56 - 0.05 * state.dolly : 0;
    const shiftY = wide ? 0 : 0.47;
    camera(mvp, proj, yaw, pitch, dist);

    /* Point size is set in screen pixels, so it does not change as the camera moves. */
    const px = dist * (state.h / 900) * (wide ? 1.8 : 1.5);
    const pulse = opts.live ? ((state.time * 0.2) % 1.5) - 0.2 : 0.62;

    if (gl) {
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniformMatrix4fv(U.uMVP, false, mvp);
      gl.uniform2f(U.uShift, shiftX, shiftY);
      gl.uniform1f(U.uMorph, state.morph);
      gl.uniform1f(U.uPx, px);
      gl.uniform1f(U.uMinPx, 1.1 * state.dpr);
      gl.uniform1f(U.uDist, dist);
      gl.uniform1f(U.uPulse, pulse);
      gl.uniform3f(U.uInk, ...state.ink);
      gl.uniform3f(U.uSignal, ...state.signal);
      gl.drawArrays(gl.POINTS, 0, POINTS);
    } else if (ctx2d) {
      drawPoints2d(ctx2d, data, Math.min(2, Math.round(state.morph)), mvp, { w: state.w, h: state.h, dist, shiftX, shiftY, px, minPx: 1.1 * state.dpr, ink: state.ink, signal: state.signal });
    }
  }


  /* ---- the loop (live mode) ---- */
  function frame(now: number) {
    state.raf = 0;
    if (!state.alive) return;
    const dt = Math.min(MAX_DT, state.last ? (now - state.last) / 1000 : 0.016);
    state.last = now;
    state.time += dt;
    draw(progress(), dt);
    if (opts.live && state.visible && !document.hidden) state.raf = requestAnimationFrame(frame);
  }
  const wake = () => {
    if (!state.raf && state.alive) {
      state.last = 0;
      state.raf = requestAnimationFrame(frame);
    }
  };

  /* ---- wiring: none of these touch the DOM, they only set flags and wake the loop ---- */
  const seen = new IntersectionObserver(([entry]) => {
    state.visible = entry.isIntersecting;
    if (state.visible) wake();
  });
  seen.observe(stage);

  /* Stepped mode has no loop, so each panel crossing the middle of the screen asks for one frame. */
  const stepper = new IntersectionObserver(() => wake(), { rootMargin: '-50% 0px -50% 0px' });
  if (!opts.live) panels.forEach((p) => stepper.observe(p));

  const sized = new ResizeObserver(() => { state.dirtySize = true; wake(); });
  sized.observe(canvas);

  const onPointer = (e: PointerEvent) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  };
  if (opts.pointer && opts.live) window.addEventListener('pointermove', onPointer, { passive: true });

  const onTheme = () => { state.dirtyColor = true; wake(); };
  const scheme = window.matchMedia('(prefers-color-scheme: dark)');
  scheme.addEventListener('change', onTheme);
  window.addEventListener('themechange', onTheme);
  document.addEventListener('visibilitychange', wake);

  const onLost = (e: Event) => { e.preventDefault(); state.alive = false; cancelAnimationFrame(state.raf); };
  canvas.addEventListener('webglcontextlost', onLost);

  return {
    destroy() {
      state.alive = false;
      cancelAnimationFrame(state.raf);
      seen.disconnect();
      stepper.disconnect();
      sized.disconnect();
      window.removeEventListener('pointermove', onPointer);
      scheme.removeEventListener('change', onTheme);
      window.removeEventListener('themechange', onTheme);
      document.removeEventListener('visibilitychange', wake);
      canvas.removeEventListener('webglcontextlost', onLost);
      probe.remove();
    },
  };
}
