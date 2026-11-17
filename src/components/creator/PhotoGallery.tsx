import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { photographs } from '../../content/photographs';

/** CSS depth only. Pointer handlers store targets; one visible, on-demand loop
 * writes transforms and comes to rest. Touch and reduced motion never start it. */
export default function PhotoGallery() {
  const wall = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const previousOverflow = useRef('');
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(0);
  const [motion, setMotion] = useState<'static' | 'pointer'>('static');

  useEffect(() => {
    const host = wall.current!;
    const surface = grid.current!;
    const capable = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    let visible = false;
    let frame = 0;
    let x = 0;
    let y = 0;
    const target = { x: 0, y: 0 };
    const tick = () => {
      frame = 0;
      if (!visible || !capable.matches) return;
      x += (target.x - x) * 0.16;
      y += (target.y - y) * 0.16;
      const settled = Math.abs(target.x - x) + Math.abs(target.y - y) < 0.01;
      if (settled) { x = target.x; y = target.y; }
      surface.style.transform = `rotateX(${y}deg) rotateY(${x}deg)`;
      if (!settled) frame = requestAnimationFrame(tick);
    };
    const schedule = () => {
      if (visible && capable.matches && !frame) frame = requestAnimationFrame(tick);
    };
    const move = (event: PointerEvent) => {
      // No layout reads or DOM writes in pointer events.
      target.x = (event.clientX / window.innerWidth - 0.5) * 3;
      target.y = (0.5 - event.clientY / window.innerHeight) * 2;
      schedule();
    };
    const leave = () => { target.x = 0; target.y = 0; schedule(); };
    const configure = () => {
      cancelAnimationFrame(frame); frame = 0;
      x = y = target.x = target.y = 0;
      surface.style.removeProperty('transform');
      setMotion(capable.matches ? 'pointer' : 'static');
    };
    configure();
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) schedule();
      else { cancelAnimationFrame(frame); frame = 0; }
    });
    observer.observe(host);
    host.addEventListener('pointermove', move);
    host.addEventListener('pointerleave', leave);
    capable.addEventListener('change', configure);
    return () => {
      observer.disconnect(); cancelAnimationFrame(frame);
      host.removeEventListener('pointermove', move);
      host.removeEventListener('pointerleave', leave);
      capable.removeEventListener('change', configure);
    };
  }, []);

  useEffect(() => {
    const viewer = dialog.current!;
    return () => {
      if (viewer.open) document.body.style.overflow = previousOverflow.current;
    };
  }, []);

  const change = (delta: number) => setSelected((index) => (index + delta + photographs.length) % photographs.length);
  const current = photographs[selected];

  return (
    <>
      <div ref={wall} className="creator-photo-wall" data-motion={motion}>
        <div ref={grid} className="creator-photo-grid">
          {photographs.map((photo, index) => (
            <button
              key={photo.file}
              className="creator-photo"
              aria-label={`Open photograph: ${photo.alt}`}
              onClick={(event) => {
                opener.current = event.currentTarget;
                setSelected(index);
                setIsOpen(true);
                previousOverflow.current = document.body.style.overflow;
                document.body.style.overflow = 'hidden';
                dialog.current!.showModal();
              }}
            >
              <img
                src={photo.thumb}
                srcSet={`${photo.thumb} 360w, ${photo.src} ${photo.width}w`}
                sizes="(min-width: 1440px) 312px, (min-width: 1024px) 22vw, (min-width: 640px) 30vw, 44vw"
                alt={photo.alt} width={photo.width} height={photo.height}
                loading="lazy" decoding="async" fetchPriority="low"
              />
              <span className="creator-photo-open" aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
      </div>
      <dialog
        ref={dialog}
        className="creator-viewer"
        aria-label="Photograph viewer"
        onClose={() => {
          setIsOpen(false);
          document.body.style.overflow = previousOverflow.current;
          opener.current?.focus({ preventScroll: true });
        }}
        onClick={(event) => { if (event.target === event.currentTarget) dialog.current!.close(); }}
        onKeyDown={(event) => {
          // Keep the cycle inside the modal rather than handing focus to browser
          // chrome between its last and first controls in Chromium.
          if (event.key === 'Tab') {
            const controls = event.currentTarget.querySelectorAll<HTMLButtonElement>('button');
            const first = controls[0];
            const last = controls[controls.length - 1];
            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault(); last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault(); first.focus();
            }
          }
          if (event.key === 'ArrowRight') { event.preventDefault(); change(1); }
          if (event.key === 'ArrowLeft') { event.preventDefault(); change(-1); }
        }}
      >
        <div className="creator-viewer-bar">
          <p className="t-data" aria-live="polite">{selected + 1} / {photographs.length}</p>
          <button className="creator-viewer-control" aria-label="Close photograph" autoFocus onClick={() => dialog.current!.close()}>
            <X size={22} aria-hidden="true" />
          </button>
        </div>
        <div className="creator-viewer-image">
          {/* Load the full image only while the viewer is open. The selected grid
              image is already cached; arrows load the next original on demand. */}
          {isOpen && <img src={current.src} alt={current.alt} width={current.width} height={current.height} />}
        </div>
        <div className="creator-viewer-bar">
          <button className="creator-viewer-control" aria-label="Previous photograph" onClick={() => change(-1)}><ArrowLeft size={22} aria-hidden="true" /></button>
          <span className="text-sm text-fg-2">Use arrow keys to browse. Esc to close.</span>
          <button className="creator-viewer-control" aria-label="Next photograph" onClick={() => change(1)}><ArrowRight size={22} aria-hidden="true" /></button>
        </div>
      </dialog>
    </>
  );
}
