import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type RefObject,
} from 'react';
import { createPortal } from 'react-dom';
import { FISHEYE_FILTER_ID } from '../../utils/fisheyeMap';

export const LENS_SIZE = 280;
const LENS_RADIUS = LENS_SIZE / 2;
const ZOOM = 2.15;

export type FisheyeController = {
  show: (clientX: number, clientY: number) => void;
  hide: () => void;
};

type GalleryFisheyeLensProps = {
  contentRef: RefObject<HTMLDivElement>;
  layoutKey: string;
  mapUrl: string;
};

const preparePieceClone = (piece: HTMLElement): HTMLElement => {
  const clone = piece.cloneNode(true) as HTMLElement;
  const { width } = piece.getBoundingClientRect();

  clone.classList.add('gallery-fisheye__clone');
  clone.removeAttribute('data-scroll-section');
  clone.style.width = `${width}px`;
  clone.style.minWidth = `${width}px`;
  clone.style.height = 'auto';
  clone.style.minHeight = '0';
  clone.style.maxHeight = 'none';

  clone.querySelectorAll('[data-scroll-section]').forEach((el) => {
    el.removeAttribute('data-scroll-section');
  });
  clone.querySelectorAll('img').forEach((img) => {
    img.loading = 'eager';
    img.decoding = 'sync';
  });

  return clone;
};

const findPieceAt = (
  source: HTMLElement,
  clientX: number,
  clientY: number,
): HTMLElement | null => {
  const hit = document.elementFromPoint(clientX, clientY);
  const fromHit = hit?.closest('.gallery__piece') as HTMLElement | null;
  if (fromHit && source.contains(fromHit)) return fromHit;

  const pieces = [...source.querySelectorAll<HTMLElement>('.gallery__piece')];
  if (pieces.length === 0) return null;

  let closest = pieces[0];
  let closestDist = Infinity;

  pieces.forEach((piece) => {
    const rect = piece.getBoundingClientRect();
    const dx = clientX < rect.left ? rect.left - clientX : clientX > rect.right ? clientX - rect.right : 0;
    const dy = clientY < rect.top ? rect.top - clientY : clientY > rect.bottom ? clientY - rect.bottom : 0;
    const dist = dx * dx + dy * dy;
    if (dist < closestDist) {
      closestDist = dist;
      closest = piece;
    }
  });

  return closest;
};

export const GalleryFisheyeLens = forwardRef<FisheyeController, GalleryFisheyeLensProps>(
  function GalleryFisheyeLens({ contentRef, layoutKey, mapUrl }, ref) {
    const lensRef = useRef<HTMLDivElement>(null);
    const shiftRef = useRef<HTMLDivElement>(null);
    const cloneHostRef = useRef<HTMLDivElement>(null);
    const activePieceRef = useRef<HTMLElement | null>(null);

    const syncPieceClone = (piece: HTMLElement) => {
      const host = cloneHostRef.current;
      if (!host) return;

      const { width } = piece.getBoundingClientRect();
      host.style.width = `${width}px`;
      host.replaceChildren(preparePieceClone(piece));
      activePieceRef.current = piece;
    };

    useEffect(() => {
      activePieceRef.current = null;
      cloneHostRef.current?.replaceChildren();
    }, [layoutKey]);

    useImperativeHandle(ref, () => ({
      show(clientX: number, clientY: number) {
        const lens = lensRef.current;
        const shift = shiftRef.current;
        const source = contentRef.current;
        if (!lens || !shift || !source) return;

        const piece = findPieceAt(source, clientX, clientY);
        if (!piece) {
          lens.style.opacity = '0';
          lens.style.visibility = 'hidden';
          return;
        }

        if (piece !== activePieceRef.current) {
          syncPieceClone(piece);
        }

        const rect = piece.getBoundingClientRect();
        const cx = clientX - rect.left;
        const cy = clientY - rect.top;

        lens.style.opacity = '1';
        lens.style.visibility = 'visible';
        lens.style.transform = `translate3d(${clientX - LENS_RADIUS}px, ${clientY - LENS_RADIUS}px, 0)`;
        shift.style.transform = `translate3d(${LENS_RADIUS - cx * ZOOM}px, ${LENS_RADIUS - cy * ZOOM}px, 0) scale(${ZOOM})`;
      },
      hide() {
        const lens = lensRef.current;
        if (!lens) return;
        lens.style.opacity = '0';
        lens.style.visibility = 'hidden';
      },
    }));

    if (!mapUrl) return null;

    return createPortal(
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
          ref={lensRef}
          className='gallery-fisheye'
          style={{ width: LENS_SIZE, height: LENS_SIZE }}
          aria-hidden='true'
        >
          <div ref={shiftRef} className='gallery-fisheye__shift'>
            <div ref={cloneHostRef} className='gallery-fisheye__clone-host' />
          </div>
        </div>
      </>,
      document.body,
    );
  },
);

export const canUseGalleryFisheye = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
