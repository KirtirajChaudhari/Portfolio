import { useEffect, useRef } from 'react';

/* A flowing red gradient drawn by one fragment shader on a plain WebGL canvas.
   No three.js: the earlier ShaderGradient build pulled ~285 kB gzipped, logged
   three console warnings (THREE.Clock deprecation, GPU-stall notices) and could
   not be paused. This one is ~2 kB, renders at half resolution, runs at 30fps,
   stops when the tab is hidden and draws a single still frame under reduced motion.
   Palette is the character video's red pulled toward oxblood. */
const VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
const FRAG = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
const vec3 c1 = vec3(0.706, 0.114, 0.110);   /* #b41d1c  video red  */
const vec3 c2 = vec3(0.290, 0.051, 0.063);   /* #4a0d10  oxblood    */
const vec3 c3 = vec3(0.839, 0.251, 0.173);   /* #d6402c  ember      */
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float a = 0.5, s = 0.0;
  for (int i = 0; i < 4; i++) { s += a * noise(p); p *= 2.02; a *= 0.5; }
  return s;
}
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  uv.x *= uRes.x / uRes.y;
  float t = uTime * 0.045;
  vec2 q = vec2(fbm(uv * 1.4 + t), fbm(uv * 1.4 + vec2(5.2, 1.3) - t));
  float f = fbm(uv * 1.1 + 2.2 * q + t);
  vec3 col = mix(c2, c1, smoothstep(0.25, 0.75, f));
  col = mix(col, c3, smoothstep(0.55, 0.95, f * q.x * 1.7));
  col += (hash(gl_FragCoord.xy) - 0.5) * 0.045;   /* grain */
  gl_FragColor = vec4(col, 1.0);
}`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
}

export default function ShaderBackdrop({ animate }: { animate: boolean }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /* A fresh canvas per run: loseContext() in cleanup kills a canvas for good, and StrictMode
       (dev) re-runs this effect on the same element, which left the backdrop flat and dark. */
    const canvas = document.createElement('canvas');
    canvas.className = 'absolute inset-0 h-full w-full';
    host.current?.appendChild(canvas);
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
    if (!gl) { canvas.remove(); return; }       /* the CSS gradient underneath stays */

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) { canvas.remove(); return; }
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { canvas.remove(); return; }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(prog, 'uRes');
    const uTime = gl.getUniformLocation(prog, 'uTime');

    let raf = 0;
    let alive = true;
    let last = 0;
    const t0 = performance.now();

    const draw = (now: number) => {
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, (now - t0) / 1000 + 12);   /* offset: start mid-flow, not at the noise origin */
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const resize = () => {
      /* Half resolution: it is a blurry gradient, and the canvas is stretched by CSS. */
      canvas.width = Math.max(2, Math.round(canvas.clientWidth * 0.5));
      canvas.height = Math.max(2, Math.round(canvas.clientHeight * 0.5));
      gl.viewport(0, 0, canvas.width, canvas.height);
      draw(performance.now());
    };
    const loop = (now: number) => {
      raf = 0;
      if (!alive || document.hidden) return;
      if (now - last >= 33) { last = now; draw(now); }   /* ~30fps */
      raf = requestAnimationFrame(loop);
    };
    const onVis = () => { if (!document.hidden && animate && !raf) raf = requestAnimationFrame(loop); };

    resize();
    window.addEventListener('resize', resize, { passive: true });
    if (animate) {
      document.addEventListener('visibilitychange', onVis);
      raf = requestAnimationFrame(loop);
    }

    return () => {
      alive = false;
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVis);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      canvas.remove();
    };
  }, [animate]);

  return <div ref={host} className="absolute inset-0" />;
}
