import { useEffect } from 'react';

/** Section scrolling is handled by CSS scroll-snap (see index.css). */
export function useScrollSections(enabled = true): void {
  useEffect(() => {
    if (!enabled) return;
  }, [enabled]);
}
