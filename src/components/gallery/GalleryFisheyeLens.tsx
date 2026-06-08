import { useEffect, useRef, type FC, type RefObject } from 'react';
import { FISHEYE_FILTER_ID } from '../../utils/fisheyeMap';

const LENS_SIZE = 250;
const LENS_RADIUS = LENS_SIZE / 2;
const ZOOM = 2.15;

export type FisheyePoint = {
  mx: number;
  my: number;
  cx: number;
  cy: number;
};

type GalleryFisheyeLensProps = {
  point: FisheyePoint | null;
  contentRef: RefObject<HTMLDivElement>;
  layoutKey: string;
  mapUrl: string;
};

export const GalleryFisheyeLens: FC<GalleryFisheyeLensProps> = ({
  point,
  contentRef,
  layoutKey,
  mapUrl,
}) => {
  const cloneHostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = cloneHostRef.current;
    const source = contentRef.current;
    if (!point || !host || !source) return;

    host.replaceChildren();
    const clone = source.cloneNode(true) as HTMLElement;
    clone.classList.add('gallery-fisheye__clone');
    clone.querySelectorAll('[data-scroll-section]').forEach((el) => {
      el.removeAttribute('data-scroll-section');
    });
    host.appendChild(clone);
  }, [point, layoutKey, contentRef]);

  if (!mapUrl) return null;

  return (
    <>
      <svg className='gallery-fisheye-filter' aria-hidden='true'>
        <defs>
          <filter
            id={FISHEYE_FILTER_ID}
            x='-35%'
            y='-35%'
            width='170%'
            height='170%'
            colorInterpolationFilters='sRGB'
          >
            <feImage href={mapUrl} result='dispMap' />
            <feDisplacementMap
              in='SourceGraphic'
              in2='dispMap'
              scale='42'
              xChannelSelector='R'
              yChannelSelector='G'
              result='fish'
            />
            <feTurbulence
              type='fractalNoise'
              baseFrequency='0.016 0.022'
              numOctaves='2'
              seed='4'
              result='warp'
            />
            <feDisplacementMap
              in='fish'
              in2='warp'
              scale='4'
              xChannelSelector='R'
              yChannelSelector='G'
            />
          </filter>
        </defs>
      </svg>

      {point && (
        <div
          className='gallery-fisheye'
          style={{
            width: LENS_SIZE,
            height: LENS_SIZE,
            transform: `translate(${point.mx - LENS_RADIUS}px, ${point.my - LENS_RADIUS}px)`,
          }}
          aria-hidden='true'
        >
          <div
            className='gallery-fisheye__shift'
            style={{
              transform: `translate(${LENS_RADIUS - point.cx * ZOOM}px, ${LENS_RADIUS - point.cy * ZOOM}px) scale(${ZOOM})`,
            }}
          >
            <div ref={cloneHostRef} className='gallery-fisheye__clone-host' />
          </div>
        </div>
      )}
    </>
  );
};

export const canUseGalleryFisheye = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
