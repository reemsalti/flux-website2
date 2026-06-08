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

type LensTarget = {
  key: string;
  el: HTMLElement;
  cloneEl: HTMLElement;
};

const prepareClone = (el: HTMLElement): HTMLElement => {
  const clone = el.cloneNode(true) as HTMLElement;
  const rect = el.getBoundingClientRect();

  clone.classList.add('gallery-fisheye__clone');
  clone.removeAttribute('data-scroll-section');
  clone.style.width = `${rect.width}px`;
  clone.style.height = `${rect.height}px`;
  clone.style.minWidth = `${rect.width}px`;
  clone.style.minHeight = `${rect.height}px`;
  clone.style.boxSizing = 'border-box';

  clone.querySelectorAll('[data-scroll-section]').forEach((node) => {
    node.removeAttribute('data-scroll-section');
  });
  clone.querySelectorAll('img').forEach((img) => {
    img.loading = 'eager';
    img.decoding = 'sync';
    img.style.opacity = '1';
  });

  if (clone.classList.contains('gallery__figure')) {
    clone.style.opacity = '1';
    clone.style.transform = 'none';
  }

  return clone;
};

const findPieceAt = (
  source: HTMLElement,
  clientX: number,
  clientY: number,
): HTMLElement | null => {
  const stack = document.elementsFromPoint(clientX, clientY);
  for (const el of stack) {
    if (el.closest('.gallery-fisheye')) continue;
    const fromHit = el.closest('.gallery__piece') as HTMLElement | null;
    if (fromHit && source.contains(fromHit)) return fromHit;
  }

  const pieces = [...source.querySelectorAll<HTMLElement>('.gallery__piece')];
  if (pieces.length === 0) return null;

  let closest = pieces[0];
  let closestDist = Infinity;

  pieces.forEach((piece) => {
    const rect = piece.getBoundingClientRect();
    const dx =
      clientX < rect.left ? rect.left - clientX : clientX > rect.right ? clientX - rect.right : 0;
    const dy =
      clientY < rect.top ? rect.top - clientY : clientY > rect.bottom ? clientY - rect.bottom : 0;
    const dist = dx * dx + dy * dy;
    if (dist < closestDist) {
      closestDist = dist;
      closest = piece;
    }
  });

  return closest;
};

const resolveLensTarget = (
  piece: HTMLElement,
  clientX: number,
  clientY: number,
): LensTarget => {
  const figure = piece.querySelector<HTMLElement>('.gallery__figure');
  const title = piece.querySelector('.gallery__title')?.textContent ?? piece.dataset.title ?? '';

  if (figure) {
    const figRect = figure.getBoundingClientRect();
    const overFigure =
      clientX >= figRect.left - 2 &&
      clientX <= figRect.right + 2 &&
      clientY >= figRect.top - 2 &&
      clientY <= figRect.bottom + 2;

    if (overFigure) {
      return { key: `${title}-figure`, el: figure, cloneEl: figure };
    }
  }

  return { key: `${title}-piece`, el: piece, cloneEl: piece };
};

export const GalleryFisheyeLens = forwardRef<FisheyeController, GalleryFisheyeLensProps>(
  function GalleryFisheyeLens({ contentRef, layoutKey, mapUrl }, ref) {
    const lensRef = useRef<HTMLDivElement>(null);
    const shiftRef = useRef<HTMLDivElement>(null);
    const cloneHostRef = useRef<HTMLDivElement>(null);
    const turbRef = useRef<SVGFETurbulenceElement>(null);
    const warpRef = useRef<SVGFEDisplacementMapElement>(null);
    const activeTargetKeyRef = useRef('');
    const visibleRef = useRef(false);
    const liquidTimeRef = useRef(0);

    const syncClone = (target: LensTarget) => {
      const host = cloneHostRef.current;
      if (!host) return;

      const { width, height } = target.cloneEl.getBoundingClientRect();
      host.style.width = `${width}px`;
      host.style.height = `${height}px`;
      host.replaceChildren(prepareClone(target.cloneEl));
      activeTargetKeyRef.current = target.key;
    };

    useEffect(() => {
      activeTargetKeyRef.current = '';
    }, [layoutKey]);

    useEffect(() => {
      if (!mapUrl) return;

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reducedMotion) return;

      let raf = 0;
      let last = performance.now();

      const tick = (now: number) => {
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;

        if (visibleRef.current) {
          liquidTimeRef.current += dt;
          const t = liquidTimeRef.current;
          const fx = 0.015 + Math.sin(t * 0.85) * 0.0016;
          const fy = 0.021 + Math.cos(t * 0.7) * 0.0016;
          turbRef.current?.setAttribute('baseFrequency', `${fx.toFixed(4)} ${fy.toFixed(4)}`);
          warpRef.current?.setAttribute('scale', (4 + Math.sin(t * 1.05) * 1.1).toFixed(2));
        }

        raf = requestAnimationFrame(tick);
      };

      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }, [mapUrl]);

    useImperativeHandle(ref, () => ({
      show(clientX: number, clientY: number) {
        const lens = lensRef.current;
        const shift = shiftRef.current;
        const source = contentRef.current;
        if (!lens || !shift || !source) return;

        const piece = findPieceAt(source, clientX, clientY);
        if (!piece) {
          visibleRef.current = false;
          lens.style.opacity = '0';
          lens.style.visibility = 'hidden';
          return;
        }

        const target = resolveLensTarget(piece, clientX, clientY);

        if (target.key !== activeTargetKeyRef.current) {
          syncClone(target);
        }

        const rect = target.el.getBoundingClientRect();
        const cx = clientX - rect.left;
        const cy = clientY - rect.top;

        visibleRef.current = true;
        lens.style.opacity = '1';
        lens.style.visibility = 'visible';
        lens.style.transform = `translate3d(${clientX - LENS_RADIUS}px, ${clientY - LENS_RADIUS}px, 0)`;
        shift.style.transform = `translate3d(${LENS_RADIUS - cx * ZOOM}px, ${LENS_RADIUS - cy * ZOOM}px, 0) scale(${ZOOM})`;
      },
      hide() {
        const lens = lensRef.current;
        visibleRef.current = false;
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
              x='-60%'
              y='-60%'
              width='220%'
              height='220%'
              colorInterpolationFilters='sRGB'
            >
              <feImage href={mapUrl} result='dispMap' />
              <feDisplacementMap
                in='SourceGraphic'
                in2='dispMap'
                scale='36'
                xChannelSelector='R'
                yChannelSelector='G'
                result='fish'
              />
              <feTurbulence
                ref={turbRef}
                type='fractalNoise'
                baseFrequency='0.015 0.021'
                numOctaves='2'
                seed='4'
                result='warp'
              />
              <feDisplacementMap
                ref={warpRef}
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

export const FISHEYE_MEDIA_QUERY = '(hover: hover) and (pointer: fine) and (min-width: 769px)';

export const canUseGalleryFisheye = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia(FISHEYE_MEDIA_QUERY).matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
