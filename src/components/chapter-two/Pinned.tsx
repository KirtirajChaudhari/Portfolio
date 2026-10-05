import type { CSSProperties, ReactNode } from 'react';

interface Props {
  /** Resting rotation in degrees. Keep within 5 to stay in grammar. */
  tilt?: number;
  /** Position in its group: drives the stagger and the overshoot side. */
  index?: number;
  innerClass?: string;
  children?: ReactNode;
}

/* Two nodes on purpose: the wrapper carries the entrance, the inner .pinned
   carries the resting tilt and the hover lift. Keeping them apart means the two
   transforms never overwrite each other. */
export default function Pinned({ tilt = 0, index = 0, innerClass = '', children }: Props) {
  const outer = {
    '--settle-from': `${index % 2 === 0 ? -5 : 5}deg`,
    '--settle-delay': `${(index % 4) * 70}ms`,
  } as CSSProperties;
  return (
    <div data-pinned style={outer}>
      <div className={`pinned ${innerClass}`.trim()} style={{ '--tilt': `${tilt}deg` } as CSSProperties}>
        {children}
      </div>
    </div>
  );
}
