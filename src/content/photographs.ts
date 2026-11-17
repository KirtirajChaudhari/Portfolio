/* Owner's photographs. Selection is stable, based on source quality and varied
   orientations. Descriptions name visible subjects, never inferred locations. */
import image0 from '../assets/gallery/20250126-26.webp';
import image1 from '../assets/gallery/20250125-42.webp';
import image2 from '../assets/gallery/20250125-47.webp';
import image3 from '../assets/gallery/20250126-25.webp';
import image4 from '../assets/gallery/20250126-28.webp';
import image5 from '../assets/gallery/20250126-32.webp';
import image6 from '../assets/gallery/20250126-36.webp';
import image7 from '../assets/gallery/20230911-56.webp';
import image8 from '../assets/gallery/20250702-22.webp';
import image9 from '../assets/gallery/20250721-19.webp';
import image10 from '../assets/gallery/20250927-13.webp';
import image11 from '../assets/gallery/20250930-09.webp';
import image12 from '../assets/gallery/20251007-04.webp';
import image13 from '../assets/gallery/20251022-03.webp';
const assets: Record<string, string> = {
  '20250126-26': image0,
  '20250125-42': image1,
  '20250125-47': image2,
  '20250126-25': image3,
  '20250126-28': image4,
  '20250126-32': image5,
  '20250126-36': image6,
  '20230911-56': image7,
  '20250702-22': image8,
  '20250721-19': image9,
  '20250927-13': image10,
  '20250930-09': image11,
  '20251007-04': image12,
  '20251022-03': image13,
};
// Below-fold slots are at most about 320 CSS px wide; preserve the originals
// for high-density displays and the viewer, and serve small copies on mobile.
const thumbnails = import.meta.glob<string>('../assets/gallery/thumbs/*.webp', { eager: true, query: '?url', import: 'default' });
const photo = (file: string, width: number, height: number, alt: string) => ({
  file, src: assets[file], thumb: thumbnails[`../assets/gallery/thumbs/${file}.webp`], width, height, alt,
});

export const photographs = [
  photo('20250126-26', 900, 484, 'A narrow bank and its reflection stretch across still water, with mountains in the distance'),
  photo('20250125-42', 900, 675, 'Green trees and dry undergrowth surround a weathered building'),
  photo('20250125-47', 900, 675, 'Branches and buildings silhouetted against pink and purple clouds'),
  photo('20250126-25', 900, 487, 'A bird perched on a domed roof in silhouette against an orange sky'),
  photo('20250126-28', 675, 900, 'Tall palm trees silhouetted above water against a pale sky'),
  photo('20250126-32', 900, 899, 'A pale hibiscus flower with a bright red centre against dark leaves'),
  photo('20250126-36', 900, 899, 'A small bird perched on a metal rod in front of green leaves'),
  photo('20230911-56', 900, 506, 'Sunlight breaks through clouds over water bordered by green grass'),
  photo('20250702-22', 675, 900, 'A waterbird stands on wet paving with its reflection beneath it'),
  photo('20250721-19', 900, 279, 'Low clouds hang between steep green hills'),
  photo('20250927-13', 900, 506, 'A domed pavilion stands in water below densely built stone steps'),
  photo('20250930-09', 520, 900, 'A sunlit road runs beneath a canopy of green trees'),
  photo('20251007-04', 900, 507, 'Palm trees and branches frame orange clouds above rooftops'),
  photo('20251022-03', 506, 900, 'Clay pots stand beside a doorway beneath tiled and corrugated roofs in a shaded courtyard'),
];
