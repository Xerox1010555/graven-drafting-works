/**
 * GRAVEN - Analytics Hook
 * React wrapper for analytics tracking
 */

import { useCallback, useEffect, useRef } from 'react';
import {
  track,
  trackBeatViewed,
  trackCtaClick,
  trackScrollDepth,
  trackVideoScrub,
  trackFormSubmit,
  trackPageView,
  trackVideoPlay,
  trackVideoPause,
  trackVideoError,
  trackThemeToggle,
  trackFrameExport,
  trackDeepLink,
  initAnalytics,
  isAnalyticsEnabled,
  setAnalyticsEnabled,
  getAnalyticsState,
} from '../utils/analytics.ts';
import { ANALYTICS_EVENTS } from '../data/index.ts';
import type { Beat } from '../types/index.ts';

/**
 * Initialize analytics on app mount
 */
export function useAnalyticsInit(): void {
  useEffect(() => {
    const domain = import.meta.env.VITE_ANALYTICS_DOMAIN;
    const apiHost = import.meta.env.VITE_ANALYTICS_API_HOST || 'https://plausible.io';

    if (domain) {
      initAnalytics({
        domain,
        apiHost,
        enabled: true,
        debug: import.meta.env.DEV,
      });
    }
  }, []);
}

/**
 * Hook for tracking beat views
 */
export function useBeatAnalytics(beats: Beat[], progress: number): void {
  const lastBeatRef = useRef(-1);
  const dwellStartRef = useRef<Record<number, number>>({});

  useEffect(() => {
    let activeBeat = -1;
    beats.forEach((beat, i) => {
      if (progress >= beat.window[0] - 1e-6) activeBeat = i;
    });

    if (activeBeat !== lastBeatRef.current) {
      const now = Date.now();

      // Track dwell time for previous beat
      const lastBeat = lastBeatRef.current;
      const lastDwellStart = dwellStartRef.current[lastBeat];
      if (lastBeat >= 0 && lastDwellStart !== undefined) {
        const dwellTime = now - lastDwellStart;
        track(ANALYTICS_EVENTS.beatViewed, {
          beat_index: lastBeat,
          beat_kicker: beats[lastBeat]?.kicker || `beat-${lastBeat}`,
          dwell_time: dwellTime,
          entry_progress: beats[lastBeat]?.window[0] || 0,
          exit_progress: progress,
        });
      }

      // Start dwell timer for new beat
      if (activeBeat >= 0) {
        dwellStartRef.current[activeBeat] = now;
      }

      lastBeatRef.current = activeBeat;
    }
  }, [progress, beats]);
}

/**
 * Hook for tracking scroll depth
 */
export function useScrollDepthAnalytics(progress: number): void {
  const maxDepthRef = useRef(0);
  const throttleRef = useRef(0);

  useEffect(() => {
    const percent = Math.round(progress * 100);
    const now = Date.now();

    // Throttle to once per second
    if (now - throttleRef.current < 1000) return;
    throttleRef.current = now;

    if (percent > maxDepthRef.current) {
      maxDepthRef.current = percent;
      const milestones = [10, 25, 50, 75, 90, 100];
      if (milestones.some(m => percent >= m && maxDepthRef.current - (percent - m) < m)) {
        track(ANALYTICS_EVENTS.scrollDepth, {
          percent,
          max_percent: maxDepthRef.current,
        });
      }
    }
  }, [progress]);
}

/**
 * Hook for tracking video scrub
 */
export function useVideoScrubAnalytics(
  progress: number,
  prevProgress: number,
  reducedMotion: boolean
): void {
  const lastProgressRef = useRef(progress);
  const lastTimeRef = useRef(performance.now());

  useEffect(() => {
    const now = performance.now();
    const deltaProgress = progress - lastProgressRef.current;
    const deltaTime = (now - lastTimeRef.current) / 1000; // seconds

    if (Math.abs(deltaProgress) > 0.001 && deltaTime > 0) {
      const velocity = deltaProgress / deltaTime;
      track(ANALYTICS_EVENTS.videoScrub, {
        direction: deltaProgress > 0 ? 'forward' : 'backward',
        velocity: Math.round(velocity * 1000) / 1000,
        from_progress: Math.round(lastProgressRef.current * 10000) / 10000,
        to_progress: Math.round(progress * 10000) / 10000,
      });
    }

    lastProgressRef.current = progress;
    lastTimeRef.current = now;
  }, [progress, reducedMotion]);
}

/**
 * Hook for tracking CTA clicks
 */
export function useCtaTracking(): {
  trackCta: (type: 'primary' | 'secondary' | 'nav' | 'footer', label: string, href: string, beatIndex?: number) => void;
} {
  const trackCta = useCallback((
    type: 'primary' | 'secondary' | 'nav' | 'footer',
    label: string,
    href: string,
    beatIndex?: number
  ) => {
    trackCtaClick(type, label, href, beatIndex ?? null);
  }, []);

  return { trackCta };
}

/**
 * Hook for tracking form submissions
 */
export function useFormAnalytics(): {
  trackSubmit: (formType: 'contact' | 'newsletter', status: 'success' | 'error', fields?: string[]) => void;
} {
  const trackSubmit = useCallback((
    formType: 'contact' | 'newsletter',
    status: 'success' | 'error',
    fields?: string[]
  ) => {
    trackFormSubmit(formType, status, fields);
  }, []);

  return { trackSubmit };
}

/**
 * Hook for tracking page views (for SPA navigation)
 */
export function usePageViewAnalytics(pathname: string): void {
  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);
}

/**
 * Hook for tracking theme changes
 */
export function useThemeAnalytics(): {
  trackToggle: (theme: 'light' | 'dark' | 'system') => void;
} {
  const trackToggle = useCallback((theme: 'light' | 'dark' | 'system') => {
    trackThemeToggle(theme);
  }, []);

  return { trackToggle };
}

/**
 * Hook for tracking frame exports
 */
export function useFrameExportAnalytics(): {
  trackExport: (beatIndex: number) => void;
} {
  const trackExport = useCallback((beatIndex: number) => {
    trackFrameExport(beatIndex);
  }, []);

  return { trackExport };
}

/**
 * Hook for tracking deep links
 */
export function useDeepLinkAnalytics(): {
  trackDeepLink: (beatIndex: number) => void;
} {
  const trackDeepLink = useCallback((beatIndex: number) => {
    trackDeepLink(beatIndex);
  }, []);

  return { trackDeepLink };
}

/**
 * Hook for getting analytics state (debugging)
 */
export function useAnalyticsState() {
  return getAnalyticsState();
}

/**
 * Hook for enabling/disabling analytics
 */
export function useAnalyticsControl(): {
  enabled: boolean;
  enable: () => void;
  disable: () => void;
} {
  const enabled = isAnalyticsEnabled();
  return {
    enabled,
    enable: () => setAnalyticsEnabled(true),
    disable: () => setAnalyticsEnabled(false),
  };
}