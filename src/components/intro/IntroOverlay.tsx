import { useEffect, type FC } from 'react';
import logoimg from '../images/logo1.png';
import './IntroOverlay.css';

type IntroOverlayProps = {
  onComplete: () => void;
};

/** Beat 1 hold → beat 2 door zoom → beat 3 hero text */
export const INTRO_MS = 3800;
const TEXT_IN_MS = 2500;

export const IntroOverlay: FC<IntroOverlayProps> = ({ onComplete }) => {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      onComplete();
      return;
    }

    document.body.classList.add('intro-active');

    const textTimer = window.setTimeout(() => {
      document.body.classList.add('intro-text-in');
    }, TEXT_IN_MS);

    const doneTimer = window.setTimeout(onComplete, INTRO_MS);

    return () => {
      window.clearTimeout(textTimer);
      window.clearTimeout(doneTimer);
      document.body.classList.remove('intro-active', 'intro-text-in');
    };
  }, [onComplete]);

  return (
    <div className='intro' aria-hidden='true'>
      <div className='intro__hole' />
      <div
        className='intro__logo'
        style={{
          WebkitMaskImage: `url(${logoimg})`,
          maskImage: `url(${logoimg})`,
        }}
      />
    </div>
  );
};
