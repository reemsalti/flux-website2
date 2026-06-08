import { useEffect, useRef, useState, type CSSProperties, type FC, type MouseEvent } from 'react';
import type { PortfolioPiece } from '../../data/portfolio';
import { lerpRgb, rgbString } from '../../utils/color';
import { buildFisheyeMap } from '../../utils/fisheyeMap';
import {
  canUseGalleryFisheye,
  GalleryFisheyeLens,
  type FisheyePoint,
} from './GalleryFisheyeLens';
import './GalleryExperience.css';

type GalleryExperienceProps = {
  pieces: PortfolioPiece[];
};

const loadImageSize = (src: string): Promise<[number, number]> =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve([img.naturalWidth, img.naturalHeight]);
    img.onerror = () => resolve([460, 613]);
    img.src = src;
  });

const computeStageHeight = (
  pieces: PortfolioPiece[],
  dims: [number, number][],
): number => {
  const root = parseFloat(
    getComputedStyle(document.documentElement).fontSize || '16',
  );
  const maxH = window.innerHeight * 0.95;
  const maxW = window.innerWidth - 1.25 * root;

  let unified = maxH;
  pieces.forEach((piece, i) => {
    const [nw, nh] = dims[i];
    const crop = piece.crop / 100;
    const visibleW = nw * (1 - crop * 2);
    const visibleH = nh * (1 - crop * 2);
    unified = Math.min(unified, maxW * (visibleH / visibleW));
  });

  return Math.round(unified);
};

const fitToStage = (
  naturalW: number,
  naturalH: number,
  stageHeight: number,
): { width: number; height: number } => ({
  width: Math.round(naturalW * (stageHeight / naturalH)),
  height: stageHeight,
});

const defaultDims = (count: number): [number, number][] =>
  Array.from({ length: count }, () => [460, 613]);

export const GalleryExperience: FC<GalleryExperienceProps> = ({ pieces }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const cloneSourceRef = useRef<HTMLDivElement>(null);
  const [fisheyePoint, setFisheyePoint] = useState<FisheyePoint | null>(null);
  const [fisheyeMapUrl, setFisheyeMapUrl] = useState('');
  const [fisheyeEnabled] = useState(canUseGalleryFisheye);
  const [layout, setLayout] = useState(() => {
    const dims = defaultDims(pieces.length);
    return {
      dims,
      stageHeight: computeStageHeight(pieces, dims),
    };
  });

  const layoutKey = `${layout.stageHeight}-${layout.dims.map((d) => d.join('x')).join('|')}`;

  useEffect(() => {
    setFisheyeMapUrl(buildFisheyeMap(160, 0.58));
  }, []);

  useEffect(() => {
    if (!fisheyePoint) return;

    const hide = () => setFisheyePoint(null);
    window.addEventListener('wheel', hide, { passive: true, capture: true });

    return () => window.removeEventListener('wheel', hide, { capture: true });
  }, [fisheyePoint]);

  useEffect(() => {
    let cancelled = false;

    const measureLayout = async () => {
      const dims = await Promise.all(pieces.map((piece) => loadImageSize(piece.src)));
      if (cancelled) return;

      setLayout({
        dims,
        stageHeight: computeStageHeight(pieces, dims),
      });
    };

    measureLayout();
    window.addEventListener('resize', measureLayout);
    return () => {
      cancelled = true;
      window.removeEventListener('resize', measureLayout);
    };
  }, [pieces]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let toneRaf = 0;

    const clearTone = () => {
      document.documentElement.style.removeProperty('--gallery-tone-rgb');
    };

    const setTone = (from: string, to: string, blend: number) => {
      const rgb = lerpRgb(from, to, blend);
      document.documentElement.style.setProperty('--gallery-tone-rgb', rgbString(rgb));
    };

    const updateTone = () => {
      if (!document.body.classList.contains('gallery-focus')) {
        clearTone();
        return;
      }

      const pieceEls = Array.from(
        section.querySelectorAll<HTMLElement>('.gallery__piece'),
      );
      if (pieceEls.length === 0) return;

      const focusLine = window.innerHeight * 0.44;
      let index = 0;
      let blend = 0;

      for (let i = 0; i < pieceEls.length - 1; i += 1) {
        const curr = pieceEls[i].getBoundingClientRect();
        const next = pieceEls[i + 1].getBoundingClientRect();
        const currY = curr.top + curr.height * 0.38;
        const nextY = next.top + next.height * 0.38;

        if (focusLine <= currY) {
          index = i;
          blend = 0;
          break;
        }

        if (focusLine >= nextY) {
          index = i + 1;
          blend = 0;
          continue;
        }

        index = i;
        blend = (focusLine - currY) / (nextY - currY);
        break;
      }

      const fromTone = pieces[index]?.tone ?? pieces[0].tone;
      const toTone = pieces[Math.min(index + 1, pieces.length - 1)]?.tone ?? fromTone;
      setTone(fromTone, toTone, blend);
    };

    const scheduleTone = () => {
      cancelAnimationFrame(toneRaf);
      toneRaf = requestAnimationFrame(updateTone);
    };

    const focusObserver = new IntersectionObserver(
      ([entry]) => {
        document.body.classList.toggle('gallery-focus', entry.isIntersecting);
        scheduleTone();
      },
      { threshold: 0.05 },
    );

    focusObserver.observe(section);

    const pieceEls = section.querySelectorAll<HTMLElement>('.gallery__piece');
    if (reduced) {
      pieceEls.forEach((el) => el.classList.add('is-inview'));
      scheduleTone();
      window.addEventListener('scroll', scheduleTone, { passive: true });
      window.addEventListener('resize', scheduleTone);
      return () => {
        cancelAnimationFrame(toneRaf);
        focusObserver.disconnect();
        window.removeEventListener('scroll', scheduleTone);
        window.removeEventListener('resize', scheduleTone);
        document.body.classList.remove('gallery-focus');
        clearTone();
      };
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('is-inview', entry.isIntersecting);
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
    );

    pieceEls.forEach((el) => revealObserver.observe(el));
    window.addEventListener('scroll', scheduleTone, { passive: true });
    window.addEventListener('resize', scheduleTone);
    scheduleTone();

    return () => {
      cancelAnimationFrame(toneRaf);
      focusObserver.disconnect();
      revealObserver.disconnect();
      window.removeEventListener('scroll', scheduleTone);
      window.removeEventListener('resize', scheduleTone);
      document.body.classList.remove('gallery-focus');
      clearTone();
    };
  }, [pieces, layout]);

  const onGalleryMouseMove = (event: MouseEvent<HTMLElement>) => {
    if (!fisheyeEnabled) return;

    const section = sectionRef.current;
    const source = cloneSourceRef.current;
    if (!section || !source) return;

    const sourceRect = source.getBoundingClientRect();

    setFisheyePoint({
      x: event.clientX,
      y: event.clientY,
      cx: event.clientX - sourceRect.left,
      cy: event.clientY - sourceRect.top,
    });
  };

  return (
    <section
      ref={sectionRef}
      className={`gallery${fisheyePoint ? ' gallery--fisheye-active' : ''}`}
      aria-label='Portfolio'
      onMouseMove={onGalleryMouseMove}
      onMouseLeave={() => setFisheyePoint(null)}
    >
      {fisheyeEnabled && (
        <GalleryFisheyeLens
          point={fisheyePoint}
          contentRef={cloneSourceRef}
          layoutKey={layoutKey}
          mapUrl={fisheyeMapUrl}
        />
      )}

      <div ref={cloneSourceRef} className='gallery__clone-source'>
        <div className='gallery__works'>
        {pieces.map((piece, i) => {
          const [naturalW, naturalH] = layout.dims[i];
          const imgSize = fitToStage(naturalW, naturalH, layout.stageHeight);

          const imgStyle: CSSProperties = {
            clipPath: `inset(${piece.crop}%)`,
            width: imgSize.width,
            height: imgSize.height,
          };

          return (
            <article key={piece.title} className='gallery__piece' data-scroll-section>
              {i === 0 && (
                <header className='gallery__header'>
                  <h2 className='gallery__heading'>Portfolio</h2>
                </header>
              )}
              <figure className='gallery__figure'>
                <img
                  className='gallery__img'
                  src={piece.src}
                  alt={piece.title}
                  decoding='async'
                  loading={i === 0 ? 'eager' : 'lazy'}
                  style={imgStyle}
                  draggable={false}
                />
              </figure>
              <div className='gallery__caption'>
                <span className='gallery__index'>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className='gallery__title'>{piece.title}</h3>
              </div>
            </article>
          );
        })}
        </div>
      </div>
    </section>
  );
};
