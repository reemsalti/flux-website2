import { publicPath } from '../utils/file';

export type PortfolioPiece = {
  src: string;
  title: string;
  /** Percentage trimmed from each edge to remove baked-in white borders */
  crop: number;
  /** Dominant tone used for gallery background wash */
  tone: string;
};

export const portfolio: PortfolioPiece[] = [
  {
    src: publicPath('/assets/images/photo4.webp'),
    title: 'Through the Looking Glass',
    crop: 10,
    tone: '#9e4a78',
  },
  {
    src: publicPath('/assets/images/photo2.webp'),
    title: 'Mandate of Heaven',
    crop: 8,
    tone: '#8f7844',
  },
  {
    src: publicPath('/assets/images/photo3.webp'),
    title: 'Meloncholy Reflections',
    crop: 9,
    tone: '#4a6878',
  },
  {
    src: publicPath('/assets/images/artwork1.webp'),
    title: 'Vibrant Melodies',
    crop: 10,
    tone: '#c86840',
  },
  {
    src: publicPath('/assets/images/photo5.webp'),
    title: 'Negative Space Monsters',
    crop: 9,
    tone: '#3a6858',
  },
];
