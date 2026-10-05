/* A shader on a CPU rasteriser (SwiftShader, llvmpipe, a remote desktop) burns a core and makes
   Chromium log "GPU stall due to ReadPixels". WebGL pieces only run on a real GPU; everything
   else gets its static fallback. Probed once and cached. */
let cached: boolean | undefined;

export function hasHardwareWebGL(): boolean {
  /* Test hook: the leak spec runs under a software rasteriser and still has to exercise the WebGL pages. */
  if ((window as unknown as { __FORCE_WEBGL__?: boolean }).__FORCE_WEBGL__) return true;
  if (cached !== undefined) return cached;
  try {
    const c = document.createElement('canvas');
    const gl = (c.getContext('webgl2') || c.getContext('webgl')) as WebGLRenderingContext | null;
    if (!gl) return (cached = false);
    const info = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : '';
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    cached = !/swiftshader|llvmpipe|software|basic render/i.test(renderer);
  } catch {
    cached = false;
  }
  return cached;
}

/** True when a decorative interactive effect should show its static version instead. */
export function prefersStill(): boolean {
  return (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    window.matchMedia('(hover: none)').matches
  );
}
