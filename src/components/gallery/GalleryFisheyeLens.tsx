import { useEffect, useRef, type FC, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { FISHEYE_FILTER_ID } from '../../utils/fisheyeMap';

const LENS_SIZE = 280;
const LENS_RADIUS = LENS_SIZE / 2;
const ZOOM = 2.15;

export type FisheyePoint = {
  x: number;
  y: number;
  cx: number;
  cy: number;
};

type GalleryFisheyeLensProps = {
  point: FisheyePoint | null;
  contentRef: RefObject<HTMLDivElement>;
  layoutKey: string;
  mapUrl: string;
};

const prepareClone = (source: HTMLElement): HTMLElement => {
  const clone = source.cloneNode(true) as HTMLElement;
  clone.classList.remove('gallery__clone-source');
  clone.classList.add('gallery-fisheye__clone');
  clone.querySelectorAll('[data-scroll-section]').forEach((el) => {
    el.removeAttribute('data-scroll-section');
  });
  clone.querySelectorAll('img').forEach((img) => {
    img.loading = 'eager';
    img.decoding = 'sync';
  });
  return clone;
};

export const GalleryFisheyeLens: FC<GalleryFisheyeLensProps> = ({
  point,
  contentRef,
  layoutKey,
  mapUrl,
}) => {
  const cloneHostRef = useRef<HTMLDivElement>(null);

  const syncClone = () => {
    const host = cloneHostRef.current;
    const source = contentRef.current;
    if (!host || !source) return;
    host.replaceChildren(prepareClone(source));
  };

  useEffect(() => {
    syncClone();
  }, [layoutKey, contentRef]);

  useEffect(() => {
    if (!point) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(syncClone);
    };

    window.addEventListener('scroll', onScroll, { passive: true, capture: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll, { capture: true });
    };
  }, [point, layoutKey, contentRef]);

  if (!mapUrl) return null;

  const lens = (
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

      <div
        className='gallery-fisheye'
        style={{
          width: LENS_SIZE,
          height: LENS_SIZE,
          opacity: point ? 1 : 0,
          visibility: point ? 'visible' : 'hidden',
          transform: point
            ? `translate3d(${point.x - LENS_RADIUS}px, ${point.y - LENS_RADIUS}px, 0)`
            : undefined,
        }}
        aria-hidden='true'
      >
        <div
          className='gallery-fisheye__shift'
          style={
            point
              ? {
                  transform: `translate3d(${LENS_RADIUS - point.cx * ZOOM}px, ${LENS_RADIUS - point.cy * ZOOM}px, 0) scale(${ZOOM})`,
                }
              : undefined
          }
        >
          <div ref={cloneHostRef} className='gallery-fisheye__clone-host' />
        </div>
      </div>
    </>
  );

  return createPortal(lens, document.body);
};

export const canUseGalleryFisheye = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
