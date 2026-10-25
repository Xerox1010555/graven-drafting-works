/**
 * GRAVEN - Scroll Progress Hook
 * Calculates scroll progress (0-1) for the reel track
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { calculateScrollProgress } from '../utils/index.ts';

interface ScrollProgressOptions {
  trackRef: React.RefObject<HTMLElement | null>;
  trackHeightMobile?: number;  // vh
  trackHeightDesktop?: number; // vh
  enabled?: boolean;
}

export function useScrollProgress({
  trackRef,
  trackHeightMobile = 360,
  trackHeightDesktop = 500,
  enabled = true,
}: ScrollProgressOptions): number {
  const [progress, setProgress] = useState(0);

  const updateProgress = useCallback(() => {
    if (!enabled || !trackRef.current) return;

    const track = trackRef.current;
    const trackH = track.offsetHeight || 1;
    const viewportH = window.innerHeight;

    // Determine track height based on breakpoint
    const isMobile = window.innerWidth < 768; // md breakpoint
    const trackHeightVh = isMobile ? trackHeightMobile : trackHeightDesktop;
    const expectedTrackHeight = (trackHeightVh / 100) * viewportH;

    // Use actual track height if it matches expected, otherwise calculate
    const effectiveTrackHeight = Math.abs(trackH - expectedTrackHeight) < viewportH * 0.5
      ? trackH
      : expectedTrackHeight;

    const newProgress = calculateScrollProgress(window.scrollY, effectiveTrackHeight, viewportH);

    setProgress(prev => {
      // Only update if change is significant (avoid micro-updates)
      if (Math.abs(prev - newProgress) > 0.0001) {
        return newProgress;
      }
      return prev;
    });
  }, [trackRef, trackHeightMobile, trackHeightDesktop, enabled]);

  useEffect(() => {
    if (!enabled) return;

    // Initial calculation
    updateProgress();

    // Listen for scroll
    const handleScroll = () => {
      requestAnimationFrame(updateProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateProgress);
    };
  }, [updateProgress, enabled]);

  return progress;
}

/**
 * Hook for scroll direction and velocity
 */
export function useScrollDirection(): { direction: 'up' | 'down' | 'none'; velocity: number } {
  const [state, setState] = useState({ direction: 'none' as 'up' | 'down' | 'none', velocity: 0 });
  const lastY = useRef(window.scrollY);
  const lastTime = useRef(performance.now());

  useEffect(() => {
    const handleScroll = () => {
      const now = performance.now();
      const currentY = window.scrollY;
      const deltaY = currentY - lastY.current;
      const deltaTime = now - lastTime.current;

      const velocity = deltaTime > 0 ? deltaY / deltaTime : 0;
      const direction = deltaY > 1 ? 'down' : deltaY < -1 ? 'up' : 'none';

      setState({ direction, velocity: Math.abs(velocity) });

      lastY.current = currentY;
      lastTime.current = now;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return state;
}