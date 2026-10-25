/**
 * GRAVEN - Analytics Utilities
 * Privacy-first analytics with Plausible/Umami integration
 */

import type { AnalyticsEvent, BeatViewedEvent, CtaClickEvent, ScrollDepthEvent, VideoScrubEvent, FormSubmitEvent } from '../types/index.ts';
import { ANALYTICS_EVENTS } from '../data/index.ts';

// Extend Window interface for Plausible
declare global {
  interface Window {
    plausible?: (name: string, options?: { props?: Record<string, unknown> }) => void;
  }
}

/**
 * Analytics configuration
 */
interface AnalyticsConfig {
  domain: string;
  apiHost: string;
  enabled: boolean;
  debug: boolean;
}

let config: AnalyticsConfig = {
  domain: '',
  apiHost: '',
  enabled: false,
  debug: false,
};

let sessionId: string;
let maxScrollDepth = 0;
let beatDwellStart: Record<number, number> = {};
let lastBeatIndex = -1;

/**
 * Initialize analytics
 */
export function initAnalytics(options: Partial<AnalyticsConfig> = {}): void {
  config = { ...config, ...options };
  sessionId = generateSessionId();

  if (config.domain && config.enabled) {
    loadPlausibleScript();
  }

  if (config.debug) {
    console.log('[Analytics] Initialized:', config);
  }
}

/**
 * Generate a simple session ID
 */
function generateSessionId(): string {
  return `ses_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
}

/**
 * Load Plausible script dynamically
 */
function loadPlausibleScript(): void {
  if (document.getElementById('plausible-script')) return;

  const script = document.createElement('script');
  script.id = 'plausible-script';
  script.defer = true;
  script.dataset.domain = config.domain;
  script.dataset.apiHost = config.apiHost;
  script.src = `${config.apiHost}/js/script.js`;
  document.head.appendChild(script);
}

/**
 * Core track function - sends to Plausible and logs in debug
 */
export function track(eventName: string, properties?: Record<string, unknown>): void {
  const event: AnalyticsEvent = {
    name: eventName,
    properties: {
      ...properties,
      session_id: sessionId,
      timestamp: Date.now(),
      url: window.location.href,
      referrer: document.referrer,
      user_agent: navigator.userAgent,
    },
  };

  // Send to Plausible
  if (config.enabled && typeof window !== 'undefined' && window.plausible) {
    try {
      window.plausible(eventName, { props: event.properties });
    } catch (error) {
      if (config.debug) console.warn('[Analytics] Plausible error:', error);
    }
  }

  // Debug logging
  if (config.debug) {
    console.log('[Analytics] Event:', event);
  }

  // Also send to custom endpoint if configured (for self-hosted)
  if (config.enabled && config.apiHost && config.apiHost !== 'https://plausible.io') {
    sendToCustomEndpoint(event);
  }
}

/**
 * Send to custom analytics endpoint
 */
async function sendToCustomEndpoint(event: AnalyticsEvent): Promise<void> {
  try {
    await fetch(`${config.apiHost}/api/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
      keepalive: true,
    });
  } catch {
    // Silently fail - analytics should never block UX
  }
}

/**
 * Track beat viewed with dwell time
 */
export function trackBeatViewed(beatIndex: number, beatKicker: string, progress: number): void {
  const now = Date.now();

  // Track dwell time for previous beat
  if (lastBeatIndex >= 0) {
    const lastDwellStart = beatDwellStart[lastBeatIndex];
    if (lastDwellStart !== undefined) {
      const dwellTime = now - lastDwellStart;
      track(ANALYTICS_EVENTS.beatViewed, {
        beatIndex: lastBeatIndex,
        beatKicker: BEAT_KICKERS[lastBeatIndex] || `beat-${lastBeatIndex}`,
        dwellTime,
        entryProgress: lastDwellStart ? progress : 0,
        exitProgress: progress,
      } as BeatViewedEvent);
    }
  }

  // Start dwell timer for new beat
  beatDwellStart[beatIndex] = now;
  lastBeatIndex = beatIndex;
}

/**
 * Track CTA click
 */
export function trackCtaClick(
  ctaType: 'primary' | 'secondary' | 'nav' | 'footer',
  label: string,
  href: string,
  beatIndex: number | null = null
): void {
  track(ANALYTICS_EVENTS.ctaClick, {
    ctaType,
    label,
    href,
    beatIndex,
  } as CtaClickEvent);
}

/**
 * Track scroll depth (throttled)
 */
let scrollDepthThrottle = 0;
export function trackScrollDepth(percent: number): void {
  const now = Date.now();
  if (now - scrollDepthThrottle < 1000) return;
  scrollDepthThrottle = now;

  if (percent > maxScrollDepth) {
    maxScrollDepth = percent;
    const milestones = [25, 50, 75, 90, 100];
    if (milestones.some(m => percent >= m && maxScrollDepth - (percent - m) < m)) {
      track(ANALYTICS_EVENTS.scrollDepth, {
        percent: Math.round(percent),
        maxPercent: Math.round(maxScrollDepth),
      } as ScrollDepthEvent);
    }
  }
}

/**
 * Track video scrub
 */
export function trackVideoScrub(
  direction: 'forward' | 'backward',
  velocity: number,
  fromProgress: number,
  toProgress: number
): void {
  track(ANALYTICS_EVENTS.videoScrub, {
    direction,
    velocity: Math.round(velocity * 1000) / 1000,
    fromProgress: Math.round(fromProgress * 10000) / 10000,
    toProgress: Math.round(toProgress * 10000) / 10000,
  } as VideoScrubEvent);
}

/**
 * Track form submission
 */
export function trackFormSubmit(
  formType: 'contact' | 'newsletter',
  status: 'success' | 'error',
  fields?: string[]
): void {
  track(ANALYTICS_EVENTS.formSubmit, {
    formType,
    status,
    fields,
  } as FormSubmitEvent);
}

/**
 * Track page view (for SPA navigation)
 */
export function trackPageView(page: string): void {
  track(ANALYTICS_EVENTS.pageView, { page });
}

/**
 * Track video play
 */
export function trackVideoPlay(): void {
  track(ANALYTICS_EVENTS.videoPlay);
}

/**
 * Track video pause
 */
export function trackVideoPause(currentTime: number): void {
  track(ANALYTICS_EVENTS.videoPause, { currentTime });
}

/**
 * Track video error
 */
export function trackVideoError(error: string): void {
  track(ANALYTICS_EVENTS.videoError, { error });
}

/**
 * Track theme toggle
 */
export function trackThemeToggle(theme: 'light' | 'dark' | 'system'): void {
  track(ANALYTICS_EVENTS.themeToggle, { theme });
}

/**
 * Track frame export
 */
export function trackFrameExport(beatIndex: number): void {
  track(ANALYTICS_EVENTS.frameExport, { beatIndex });
}

/**
 * Track deep link usage
 */
export function trackDeepLink(beatIndex: number): void {
  track(ANALYTICS_EVENTS.deepLink, { beatIndex });
}

// Beat kickers for analytics
const BEAT_KICKERS = [
  '01 · THE SHEET',
  '02 · THE FRAME',
  '03 · THE SECTION',
  '04 · THE BUILD',
];

/**
 * Get current analytics state (for debugging)
 */
export function getAnalyticsState(): {
  sessionId: string;
  maxScrollDepth: number;
  beatDwellTimes: Record<number, number>;
  lastBeatIndex: number;
} {
  const now = Date.now();
  const dwellTimes: Record<number, number> = {};
  Object.entries(beatDwellStart).forEach(([index, start]) => {
    dwellTimes[Number(index)] = now - start;
  });
  return {
    sessionId,
    maxScrollDepth,
    beatDwellTimes: dwellTimes,
    lastBeatIndex,
  };
}

/**
 * Reset analytics state (for testing)
 */
export function resetAnalytics(): void {
  sessionId = generateSessionId();
  maxScrollDepth = 0;
  beatDwellStart = {};
  lastBeatIndex = -1;
}

/**
 * Enable/disable analytics at runtime
 */
export function setAnalyticsEnabled(enabled: boolean): void {
  config.enabled = enabled;
}

/**
 * Check if analytics is enabled
 */
export function isAnalyticsEnabled(): boolean {
  return config.enabled;
}