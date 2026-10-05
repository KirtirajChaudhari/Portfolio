import type { CSSProperties } from 'react';

/** Inline CSS custom properties without a cast at every call site. */
export const vars = (o: Record<`--${string}`, string | number>) => o as CSSProperties;
