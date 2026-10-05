import { lazy, Suspense, useEffect, useState } from 'react';

const ShaderBackdrop = lazy(() => import('./ShaderBackdrop'));

/* A full-screen fragment shader on a CPU rasteriser (SwiftShader, llvmpipe, a
   remote desktop) burns a core for a background and makes Chromium log
   "GPU stall due to ReadPixels". Only use the shader when the GPU is real. */
function hasHardwareWebGL() {
  try {
    const c = document.createElement('canvas');
    const gl = (c.getContext('webgl2') || c.getContext('webgl')) as WebGLRenderingContext | null;
    if (!gl) return false;
    const info = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : '';
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return !/swiftshader|llvmpipe|software|basic render/i.test(renderer);
  } catch {
    return false;
  }
}

/** Fixed, non-interactive shader gradient behind the page. A plain CSS gradient
 *  of the same palette is always underneath, so there is no flash while the
 *  WebGL chunk loads, and it is all you get without a hardware GPU. Reduced motion
 *  renders the shader as a still frame. */
export default function GradientBackdrop() {
  const [gl, setGl] = useState(false);
  const [still, setStill] = useState(false);

  useEffect(() => {
    setGl(hasHardwareWebGL());
    setStill(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#12090a]">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 55% at 78% 8%, rgb(180 29 28 / 0.55), transparent 70%), radial-gradient(50% 50% at 8% 92%, rgb(255 90 60 / 0.22), transparent 70%)',
        }}
      />
      {gl && (
        <Suspense fallback={null}>
          <div className="absolute inset-0">
            <ShaderBackdrop animate={!still} />
          </div>
        </Suspense>
      )}
      {/* Keeps long-form text on the dark end of the gradient. */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#12090a]/50 via-[#12090a]/62 to-[#12090a]/88" />
    </div>
  );
}
