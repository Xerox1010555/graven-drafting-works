/**
 * GRAVEN - Beat Visibility Hook
 * Calculates beat opacity, transform, and reveal state based on scroll progress
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { smoothstep, clamp01 } from '../utils/index.ts';
import { BEATS, ANIMATION } from '../data/index.ts';
import type { Beat } from '../types/index.ts';

interface BeatVisibilityState {
  opacities: number[];
  transforms: number[];      // Y translation in pixels
  visibilities: ('visible' | 'hidden')[];
  pointerEvents: ('auto' | 'none')[];
  revealed: boolean[];
  activeBeat: number;
}

interface UseBeatVisibilityOptions {
  progress: number;
  reducedMotion: boolean;
  heroRef: React.RefObject<HTMLElement | null>;
}

export function useBeatVisibility({
  progress,
  reducedMotion,
  heroRef,
}: UseBeatVisibilityOptions): BeatVisibilityState {
  const [state, setState] = useState<BeatVisibilityState>({
    opacities: BEATS.map(() => 0),
    transforms: BEATS.map(() => 0),
    visibilities: BEATS.map(() => 'hidden'),
    pointerEvents: BEATS.map(() => 'none'),
    revealed: BEATS.map(() => reducedMotion),
    activeBeat: -1,
  });

  const revealedRef = useRef(BEATS.map(() => reducedMotion));
  const activeRef = useRef(-1);

  useEffect(() => {
    // Hero fade out
    if (heroRef.current) {
      const heroOpacity = 1 - smoothstep(clamp01(progress / ANIMATION.heroFade));
      heroRef.current.style.opacity = heroOpacity.toFixed(3);
      heroRef.current.style.visibility = heroOpacity <= 0.001 ? 'hidden' : 'visible';
    }

    // Calculate beat states
    const newOpacities: number[] = [];
    const newTransforms: number[] = [];
    const newVisibilities: ('visible' | 'hidden')[] = [];
    const newPointerEvents: ('auto' | 'none')[] = [];
    let revealedChanged = false;

    BEATS.forEach((beat, i) => {
      const [start, end] = beat.window;
      const isLast = i === BEATS.length - 1;
      let opacity = 0;
      let transformY = 0;

      if (progress >= start && progress <= end) {
        const len = end - start;
        const inEnd = start + len * ANIMATION.edgeIn;
        const outStart = end - len * ANIMATION.edgeOut;

        if (progress < inEnd) {
          // Fade in
          const t = reducedMotion ? 1 : smoothstep((progress - start) / Math.max(inEnd - start, 1e-4));
          opacity = t;
          transformY = (1 - t) * 40;
        } else if (!isLast && progress > outStart) {
          // Fade out (except last beat)
          const t = reducedMotion ? 0 : 1 - smoothstep((progress - outStart) / Math.max(end - outStart, 1e-4));
          opacity = t;
        } else {
          // Fully visible
          opacity = 1;
        }
      }

      newOpacities.push(opacity);
      newTransforms.push(transformY);
      newVisibilities.push(opacity <= 0.001 ? 'hidden' : 'visible');
      newPointerEvents.push(opacity > 0.5 ? 'auto' : 'none');

      // Reveal entrance once, slightly ahead of fade-in
      if (!revealedRef.current[i] && progress >= start - ANIMATION.revealThreshold) {
        revealedRef.current[i] = true;
        revealedChanged = true;
      }
    });

    // Determine active beat for progress rail
    let active = -1;
    BEATS.forEach((beat, i) => {
      if (progress >= beat.window[0] - 1e-6) active = i;
    });
    if (progress < ANIMATION.heroFade) active = -1;

    if (active !== activeRef.current) {
      activeRef.current = active;
    }

    setState(prev => ({
      opacities: newOpacities,
      transforms: newTransforms,
      visibilities: newVisibilities,
      pointerEvents: newPointerEvents,
      revealed: revealedChanged ? [...revealedRef.current] : prev.revealed,
      activeBeat: active,
    }));
  }, [progress, reducedMotion, heroRef]);

  return state;
}

/**
 * Hook for individual beat visibility (for components that need fine-grained control)
 */
export function useBeatProgress(beatIndex: number, progress: number): {
  opacity: number;
  transformY: number;
  isVisible: boolean;
  isActive: boolean;
  isRevealed: boolean;
  revealProgress: number; // 0-1 within the beat's window
} {
  const beat = BEATS[beatIndex];
  if (!beat) {
    return { opacity: 0, transformY: 0, isVisible: false, isActive: false, isRevealed: false, revealProgress: 0 };
  }

  const [start, end] = beat.window;
  const isLast = beatIndex === BEATS.length - 1;
  let opacity = 0;
  let transformY = 0;
  let revealProgress = 0;

  if (progress >= start && progress <= end) {
    const len = end - start;
    revealProgress = (progress - start) / len;
    const inEnd = start + len * ANIMATION.edgeIn;
    const outStart = end - len * ANIMATION.edgeOut;

    if (progress < inEnd) {
      const t = smoothstep((progress - start) / Math.max(inEnd - start, 1e-4));
      opacity = t;
      transformY = (1 - t) * 40;
    } else if (!isLast && progress > outStart) {
      opacity = 1 - smoothstep((progress - outStart) / Math.max(end - outStart, 1e-4));
    } else {
      opacity = 1;
    }
  }

  return {
    opacity,
    transformY,
    isVisible: opacity > 0.001,
    isActive: progress >= start - 1e-6 && progress <= end + 1e-6,
    isRevealed: progress >= start - ANIMATION.revealThreshold,
    revealProgress,
  };
}