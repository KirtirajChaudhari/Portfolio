import type { CSSProperties } from "react";

export interface ArtGalleryProps {
  /** Image URLs (or data URLs). One tile per image. */
  images: string[];
  /** Caption per tile (cycled if shorter than `images`). `year` is optional. */
  items: { title: string; year?: string | number }[];
  cellSize?: number;
  zoomLevel?: number;
  showHint?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function ArtGallery(props: ArtGalleryProps): JSX.Element;
