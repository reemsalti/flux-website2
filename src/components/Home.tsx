import { useEffect, useRef } from 'react';
import './Home.css';
import { portfolio } from '../data/portfolio';
import { publicPath } from '../utils/file';
import { useScrollSections } from '../utils/useScrollSections';
import { GalleryExperience } from './gallery/GalleryExperience';

export const Home = () => {
  const statementRef = useRef<HTMLElement>(null);

  useScrollSections();

  useEffect(() => {
    const el = statementRef.current;
    if (!el) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observer = new IntersectionObserver(
      ([entry]) => {
        el.classList.toggle('is-inview', entry.isIntersecting);
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' },
    );

    observer.observe(el);

    if (reduced) {
      el.classList.add('is-inview');
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className='home'>
      <section className='hero' data-scroll-section aria-label='Hero'>
        <h1 className='hero__title'>Through &amp; Through</h1>
        <p className='hero__slogan'>A Transcending Vision</p>
        <p className='hero__by'>by Veronica Hermez</p>
      </section>

      <section
        ref={statementRef}
        className='statement'
        data-scroll-section
        aria-label='Artist statement'
      >
        <div className='statement__layout'>
          <figure className='statement__portrait'>
            <img
              src={publicPath('/assets/images/artist.png')}
              alt='Veronica Hermez'
              decoding='async'
            />
          </figure>
          <div className='statement__content'>
            <p className='statement__label'>Artist statement</p>
            <p className='statement__body'>
              My fluid and bold work is created by showing up and allowing my first
              brush stroke to inspire the next. I create organic shapes and utilize a
              wide array of colors as a means of translation between my psyche and the
              viewer of my work. The shapes that I create are a result of my subconscious
              imagination and later inspire the subject matter; I aim to leave the
              interpretation of my work to each viewer.
            </p>
          </div>
        </div>
      </section>

      <GalleryExperience pieces={portfolio} />
    </div>
  );
};
