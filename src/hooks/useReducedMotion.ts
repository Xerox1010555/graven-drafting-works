/**
 * GRAVEN - Reduced Motion Hook
 * Detects and responds to prefers-reduced-motion media query
 */

import { useEffect, useState, useCallback } from 'react';
import { STORAGE_KEYS } from '../data/index.ts';

interface ReducedMotionState {
  enabled: boolean;
  mediaQuery: MediaQueryList | null;
}

interface UseReducedMotionReturn extends ReducedMotionState {
  setReducedMotion: (enabled: boolean) => void;
}

export function useReducedMotion(): UseReducedMotionReturn {
  const [state, setState] = useState<ReducedMotionState>({
    enabled: false,
    mediaQuery: null,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const initialEnabled = mediaQuery.matches;

    const stored = localStorage.getItem(STORAGE_KEYS.reducedMotion);
    const userPreference = stored ? JSON.parse(stored) : null;
    const enabled = userPreference !== null ? userPreference : initialEnabled;

    setState({ enabled, mediaQuery });

    const handleChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem(STORAGE_KEYS.reducedMotion) === null) {
        setState(prev => ({ ...prev, enabled: e.matches }));
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const setReducedMotion = useCallback((enabled: boolean) => {
    localStorage.setItem(STORAGE_KEYS.reducedMotion, JSON.stringify(enabled));
    setState(prev => ({ ...prev, enabled }));
  }, []);

  return {
    ...state,
    setReducedMotion,
  };
}

/**
 * Hook for forcing reduced motion (for testing or user preference)
 */
export function useForcedReducedMotion(): {
  forced: boolean;
  enable: () => void;
  disable: () => void;
  toggle: () => void;
} {
  const { enabled, setReducedMotion } = useReducedMotion();
  const [forced, setForced] = useState(false);

  const enable = useCallback(() => {
    setForced(true);
    setReducedMotion(true);
  }, [setReducedMotion]);

  const disable = useCallback(() => {
    setForced(false);
    setReducedMotion(false);
  }, [setReducedMotion]);

  const toggle = useCallback(() => {
    if (forced) disable();
    else enable();
  }, [forced, enable, disable]);

  return { forced, enable, disable, toggle };
}