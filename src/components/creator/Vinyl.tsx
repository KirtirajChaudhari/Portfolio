import { useId } from 'react';

/** A record, drawn: grooves, the label in the release's own black and white. Decorative. */
export default function Vinyl({ className = '' }: { className?: string }) {
  const id = `vinyl-${useId().replace(/:/g, '')}`;
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={id} cx="35%" cy="30%" r="75%">
          <stop offset="0" stopColor="#3a3533" />
          <stop offset="0.55" stopColor="#141110" />
          <stop offset="1" stopColor="#080606" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="99" fill={`url(#${id})`} />
      {[92, 86, 80, 74, 68, 62, 56, 50].map((r) => (
        <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="#ffffff" strokeOpacity={r % 12 === 0 ? 0.09 : 0.05} />
      ))}
      <path d="M100 8 A92 92 0 0 1 178 54" fill="none" stroke="#ffffff" strokeOpacity="0.16" strokeWidth="3" strokeLinecap="round" />
      <circle cx="100" cy="100" r="34" fill="#f4efe8" />
      <circle cx="100" cy="100" r="30" fill="none" stroke="#1f1a17" strokeOpacity="0.25" />
      <path d="M84 104 h32 M84 110 h24" stroke="#1f1a17" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="100" cy="100" r="3.5" fill="#1f1a17" />
    </svg>
  );
}
