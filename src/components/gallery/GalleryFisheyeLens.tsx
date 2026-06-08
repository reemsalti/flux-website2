import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type RefObject,
} from 'react';
import { createPortal } from 'react-dom';
import { FISHEYE_FILTER_ID } from '../../utils/fisheyeMap';

const ZOOM = 2.15;
const DISPLACEMENT_PAD = 1.22;
const LENS_SHRINK_DISTANCE = 110;
const LENS_MIN_SCALE = 0.24;
const POSITION_SMOOTH = 5.8;
const SCALE_SMOOTH = 3.6;
const ARTWORK_SCALE_THRESHOLD = 0.88;

const smooth = (current: number, target: number, dt: number, speed: number): number =>
  current + (target - current) * (1 - Math.exp(-speed * dt));

type LensMotionTarget = {
  visible: boolean;
  overImg: boolean;
  cursorX: number;
  cursorY: number;
  scale: number;
  radius: number;
  imgLeft: number;
  imgTop: number;
  zoomX: number;
  zoomY: number;
};

type LensMotionCurrent = {
  cursorX: number;
  cursorY: number;
  scale: number;
};

const distanceToRect = (x: number, y: number, rect: DOMRect): number => {
  const dx = x < rect.left ? rect.left - x : x > rect.right ? x - rect.right : 0;
  const dy = y < rect.top ? rect.top - y : y > rect.bottom ? y - rect.bottom : 0;
  return Math.hypot(dx, dy);
};

const lensScaleForDistance = (distance: number): number => {
  if (distance <= 0) return 1;
  const t = Math.min(distance / LENS_SHRINK_DISTANCE, 1);
  return 1 - t * (1 - LENS_MIN_SCALE);
};

const readGalleryToneColor = (): string => {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue('--gallery-tone-rgb')
    .trim();
  return raw ? `rgb(${raw})` : 'rgb(14, 13, 12)';
};

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

const magnifierDimensions = (
  img: HTMLImageElement,
  rect: DOMRect,
): { width: number; height: number } => {
  let width = rect.width * ZOOM * DISPLACEMENT_PAD;
  let height = rect.height * ZOOM * DISPLACEMENT_PAD;

  if (img.naturalWidth > 0 && img.naturalHeight > 0) {
    width = Math.min(width, img.naturalWidth);
    height = Math.min(height, img.naturalHeight);
    const aspect = rect.width / rect.height;
    if (width / height > aspect) width = height * aspect;
    else height = width / aspect;
  }

  return {
    width: Math.round(width),
    height: Math.round(height),
  };
};

const prepareClone = (el: HTMLElement): HTMLElement => {
  const clone = el.cloneNode(true) as HTMLElement;
  const rect = el.getBoundingClientRect();
  const isImg = el instanceof HTMLImageElement;

  clone.classList.add('gallery-fisheye__clone');
  clone.removeAttribute('data-scroll-section');

  const size = isImg
    ? magnifierDimensions(el, rect)
    : { width: Math.round(rect.width), height: Math.round(rect.height) };

  clone.style.width = `${size.width}px`;
  clone.style.height = `${size.height}px`;
  clone.style.minWidth = `${size.width}px`;
  clone.style.minHeight = `${size.height}px`;
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

  if (isImg) {
    const clip = el.style.clipPath || getComputedStyle(el).clipPath;
    clone.style.opacity = '1';
    clone.style.transform = 'none';
    clone.style.maxWidth = 'none';
    clone.style.filter = `url(#${FISHEYE_FILTER_ID})`;
    if (clip && clip !== 'none') clone.style.clipPath = clip;
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
    if (el.closest('.gallery-fisheye, .gallery-fisheye-track')) continue;
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
): (LensTarget & { overImg: boolean; scale: number }) | null => {
  const figure = piece.querySelector<HTMLElement>('.gallery__figure');
  const title = piece.querySelector('.gallery__title')?.textContent ?? piece.dataset.title ?? '';
  const img = figure?.querySelector<HTMLImageElement>('.gallery__img');
  if (!img) return null;

  const imgRect = img.getBoundingClientRect();
  const overImg =
    clientX >= imgRect.left - 1 &&
    clientX <= imgRect.right + 1 &&
    clientY >= imgRect.top - 1 &&
    clientY <= imgRect.bottom + 1;
  const scale = lensScaleForDistance(distanceToRect(clientX, clientY, imgRect));

  return { key: `${title}-img`, el: img, cloneEl: img, overImg, scale };
};

export const GalleryFisheyeLens = forwardRef<FisheyeController, GalleryFisheyeLensProps>(
  function GalleryFisheyeLens({ contentRef, layoutKey, mapUrl }, ref) {
    const trackRef = useRef<HTMLDivElement>(null);
    const occluderRef = useRef<HTMLDivElement>(null);
    const lensRef = useRef<HTMLDivElement>(null);
    const shiftRef = useRef<HTMLDivElement>(null);
    const cloneHostRef = useRef<HTMLDivElement>(null);
    const offsetRef = useRef<SVGFEOffsetElement>(null);
    const warpRef = useRef<SVGFEDisplacementMapElement>(null);
    const floodRef = useRef<SVGFEFloodElement>(null);
    const activeTargetKeyRef = useRef('');
    const visibleRef = useRef(false);
    const liquidTimeRef = useRef(0);
    const motionTargetRef = useRef<LensMotionTarget>({
      visible: false,
      overImg: false,
      cursorX: 0,
      cursorY: 0,
      scale: 0,
      radius: 0,
      imgLeft: 0,
      imgTop: 0,
      zoomX: ZOOM,
      zoomY: ZOOM,
    });
    const motionCurrentRef = useRef<LensMotionCurrent>({
      cursorX: 0,
      cursorY: 0,
      scale: 0,
    });
    const motionActiveRef = useRef(false);

    const syncClone = (target: LensTarget) => {
      const host = cloneHostRef.current;
      if (!host) return;

      const clone = prepareClone(target.cloneEl);
      host.style.width = clone.style.width;
      host.style.height = clone.style.height;
      host.replaceChildren(clone);
      activeTargetKeyRef.current = target.key;
    };

    useEffect(() => {
      activeTargetKeyRef.current = '';
    }, [layoutKey]);

    useEffect(() => {
      if (!mapUrl) return;

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      let raf = 0;
      let last = performance.now();

      const applyMotion = (dt: number) => {
        const track = trackRef.current;
        const occluder = occluderRef.current;
        const lens = lensRef.current;
        const shift = shiftRef.current;
        const target = motionTargetRef.current;
        const current = motionCurrentRef.current;

        if (!track || !lens) return;

        if (!target.visible && current.scale < 0.02) {
          if (motionActiveRef.current) {
            motionActiveRef.current = false;
            track.classList.remove('is-visible');
            occluder?.classList.remove('is-visible');
            if (occluder) {
              occluder.style.opacity = '0';
              occluder.style.visibility = 'hidden';
            }
            lens.classList.remove('is-on-artwork');
            lens.style.setProperty('--lens-scale', '0');
          }
          return;
        }

        const posSpeed = reducedMotion ? 24 : POSITION_SMOOTH;
        const scaleSpeed = reducedMotion ? 24 : SCALE_SMOOTH;

        current.cursorX = smooth(current.cursorX, target.cursorX, dt, posSpeed);
        current.cursorY = smooth(current.cursorY, target.cursorY, dt, posSpeed);
        current.scale = smooth(current.scale, target.scale, dt, scaleSpeed);

        const artworkMode = target.overImg && current.scale >= ARTWORK_SCALE_THRESHOLD;
        lens.classList.toggle('is-on-artwork', artworkMode);
        visibleRef.current = artworkMode;

        if (occluder) {
          if (artworkMode) {
            occluder.classList.add('is-visible');
            occluder.style.opacity = '1';
            occluder.style.visibility = 'visible';
          } else {
            occluder.classList.remove('is-visible');
            occluder.style.opacity = '0';
            occluder.style.visibility = 'hidden';
          }
        }

        const radius = target.radius || lens.offsetWidth / 2;
        const tx = current.cursorX - radius;
        const ty = current.cursorY - radius;
        const lensTransform = `translate3d(${tx}px, ${ty}px, 0)`;

        track.style.transform = lensTransform;
        if (occluder) occluder.style.transform = lensTransform;
        lens.style.setProperty('--lens-scale', current.scale.toFixed(3));

        if (artworkMode && shift) {
          const cx = current.cursorX - target.imgLeft;
          const cy = current.cursorY - target.imgTop;
          shift.style.transform = `translate3d(${radius - cx * target.zoomX}px, ${radius - cy * target.zoomY}px, 0)`;
        }
      };

      const tick = (now: number) => {
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        liquidTimeRef.current += dt;

        if (visibleRef.current) {
          const t = liquidTimeRef.current;
          const panX =
            Math.sin(t * 0.52) * 110 + Math.sin(t * 0.31 + 1.2) * 55;
          const panY =
            Math.cos(t * 0.46) * 110 + Math.cos(t * 0.27 + 0.8) * 55;
          offsetRef.current?.setAttribute('dx', panX.toFixed(2));
          offsetRef.current?.setAttribute('dy', panY.toFixed(2));
          const warp =
            9 + Math.sin(t * 0.55) * 1.8 + Math.sin(t * 0.371) * 0.95;
          warpRef.current?.setAttribute('scale', warp.toFixed(2));
        }

        if (motionActiveRef.current || motionTargetRef.current.visible) {
          applyMotion(dt);
        }

        raf = requestAnimationFrame(tick);
      };

      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }, [mapUrl]);

    useImperativeHandle(ref, () => ({
      show(clientX: number, clientY: number) {
        const track = trackRef.current;
        const occluder = occluderRef.current;
        const lens = lensRef.current;
        const source = contentRef.current;
        if (!track || !occluder || !lens || !source) return;

        const piece = findPieceAt(source, clientX, clientY);
        if (!piece) {
          visibleRef.current = false;
          motionTargetRef.current.visible = false;
          motionTargetRef.current.scale = 0;
          return;
        }

        const target = resolveLensTarget(piece, clientX, clientY);
        if (!target) {
          visibleRef.current = false;
          motionTargetRef.current.visible = false;
          motionTargetRef.current.scale = 0;
          return;
        }

        const { overImg, scale } = target;

        if (overImg) {
          if (target.key !== activeTargetKeyRef.current) {
            syncClone(target);
          }
        } else {
          activeTargetKeyRef.current = '';
          cloneHostRef.current?.replaceChildren();
        }

        const radius = lens.offsetWidth / 2;
        const rect = target.el.getBoundingClientRect();
        const host = cloneHostRef.current;
        const zoomX =
          host && rect.width > 0 ? parseFloat(host.style.width) / rect.width : ZOOM;
        const zoomY =
          host && rect.height > 0 ? parseFloat(host.style.height) / rect.height : ZOOM;

        floodRef.current?.setAttribute('flood-color', readGalleryToneColor());

        motionTargetRef.current = {
          visible: true,
          overImg,
          cursorX: clientX,
          cursorY: clientY,
          scale,
          radius,
          imgLeft: rect.left,
          imgTop: rect.top,
          zoomX,
          zoomY,
        };

        if (motionCurrentRef.current.scale < 0.03) {
          motionCurrentRef.current.cursorX = clientX;
          motionCurrentRef.current.cursorY = clientY;
        }

        motionActiveRef.current = true;
        track.classList.add('is-visible');
      },
      hide() {
        const lens = lensRef.current;
        visibleRef.current = false;
        motionTargetRef.current.visible = false;
        motionTargetRef.current.scale = 0;
        motionTargetRef.current.overImg = false;
        lens?.classList.remove('is-on-artwork');
        cloneHostRef.current?.replaceChildren();
        activeTargetKeyRef.current = '';
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
                scale='28'
                xChannelSelector='R'
                yChannelSelector='G'
                result='fish'
              />
              <feTurbulence
                type='turbulence'
                baseFrequency='0.007 0.009'
                numOctaves='1'
                seed='4'
                stitchTiles='stitch'
                result='warpNoise'
              />
              <feOffset ref={offsetRef} in='warpNoise' dx='0' dy='0' result='warpShifted' />
              <feGaussianBlur in='warpShifted' stdDeviation='2.8' result='warp' />
              <feDisplacementMap
                ref={warpRef}
                in='fish'
                in2='warp'
                scale='9'
                xChannelSelector='R'
                yChannelSelector='G'
                result='warped'
              />
              <feColorMatrix
                in='warped'
                type='matrix'
                values='1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 9 0'
                result='opaque'
              />
              <feFlood ref={floodRef} floodColor='rgb(14, 13, 12)' floodOpacity='1' result='lensFill' />
              <feComposite in='opaque' in2='lensFill' operator='over' />
            </filter>
          </defs>
        </svg>

        <div ref={occluderRef} className='gallery-fisheye-occluder' aria-hidden='true' />

        <div ref={trackRef} className='gallery-fisheye-track' aria-hidden='true'>
          <div ref={lensRef} className='gallery-fisheye'>
            <div className='gallery-fisheye__shadow' aria-hidden='true' />
            <div className='gallery-fisheye__viewport'>
              <div className='gallery-fisheye__backing' aria-hidden='true' />
              <div ref={shiftRef} className='gallery-fisheye__shift'>
                <div ref={cloneHostRef} className='gallery-fisheye__clone-host' />
              </div>
            </div>
            <div className='gallery-fisheye__glass' aria-hidden='true' />
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
