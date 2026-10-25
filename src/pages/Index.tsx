/**
 * GRAVEN - Landing Page
 * Main cinematic scroll experience
 */

import { useEffect, useRef, useCallback } from 'react';
import { useScrollProgress, useReducedMotion, useVideoScrub, useBeatVisibility, useAnalyticsInit, useBeatAnalytics, useScrollDepthAnalytics, useVideoScrubAnalytics, useCtaTracking } from '../hooks/index.ts';
import { Navbar, Footer } from '../components/layout/index.ts';
import { ScrollTrack, StickyStage, ScrubVideo, BlueprintGrid, ColdScrim, FilmGrain, HeroBeat, CaptionBeat, ProgressRail } from '../components/reel/index.ts';
import { BEATS, ANIMATION } from '../data/index.ts';
import { trackPageView, trackDeepLink } from '../utils/analytics.ts';

export default function Index() {
  useAnalyticsInit();
  trackPageView('/');

  const trackRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const beatRefs = useRef<(HTMLDivElement | null)[]>([]);
  const railFillRef = useRef<HTMLDivElement>(null);

  const { enabled: reducedMotion } = useReducedMotion();

  const progress = useScrollProgress({
    trackRef,
    trackHeightMobile: 360,
    trackHeightDesktop: 500,
  });

  const videoState = useVideoScrub({
    videoRef,
    progress,
    reducedMotion,
    onReady: (duration) => console.log('[Index] Video ready, duration:', duration),
    onError: (error) => console.error('[Index] Video error:', error),
  });

  const beatVisibility = useBeatVisibility({
    progress,
    reducedMotion,
    heroRef,
  });

  useBeatAnalytics(BEATS, progress);
  useScrollDepthAnalytics(progress);
  useVideoScrubAnalytics(progress, 0, reducedMotion);

  const { trackCta } = useCtaTracking();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const beatParam = params.get('beat');
    if (beatParam) {
      const beatIndex = parseInt(beatParam, 10) - 1;
      if (beatIndex >= 0 && beatIndex < BEATS.length) {
        const targetProgress = BEATS[beatIndex]!.window[0];
        const track = trackRef.current;
        if (track) {
          const scrollY = targetProgress * (track.offsetHeight - window.innerHeight);
          window.scrollTo({ top: scrollY, behavior: 'smooth' });
          trackDeepLink(beatIndex);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (heroRef.current) {
      const opacity = 1 - progress / ANIMATION.heroFade;
      heroRef.current.style.opacity = Math.max(0, opacity).toFixed(3);
      heroRef.current.style.visibility = opacity <= 0.001 ? 'hidden' : 'visible';
    }
  }, [progress]);

  const railLabel = beatVisibility.activeBeat >= 0 ? BEATS[beatVisibility.activeBeat]!.rail : '00 · BRIEF';

  const setBeatRef = useCallback((index: number) => (el: HTMLDivElement | null) => {
    beatRefs.current[index] = el;
  }, []);

  return (
    <div id="top" className="relative min-h-screen">
      <Navbar />

      <ScrollTrack ref={trackRef} heightMobile={360} heightDesktop={500}>
        <StickyStage>
          <ScrubVideo videoRef={videoRef} ready={videoState.ready} />
          <BlueprintGrid />
          <ColdScrim />
          <FilmGrain />
          <HeroBeat ref={heroRef} />
          {BEATS.map((beat, i) => (
            <CaptionBeat
              key={beat.kicker}
              ref={setBeatRef(i)}
              beat={beat}
              revealed={beatVisibility.revealed[i]!}
              opacity={beatVisibility.opacities[i]!}
              transformY={beatVisibility.transforms[i]!}
              visibility={beatVisibility.visibilities[i]!}
              pointerEvents={beatVisibility.pointerEvents[i]!}
            />
          ))}
        </StickyStage>
      </ScrollTrack>

      <Footer />

      <ProgressRail
        ref={railFillRef}
        progress={progress}
        label={railLabel}
        beats={BEATS}
        onBeatClick={(index) => {
          const targetProgress = BEATS[index]!.window[0];
          const track = trackRef.current;
          if (track) {
            const scrollY = targetProgress * (track.offsetHeight - window.innerHeight);
            window.scrollTo({ top: scrollY, behavior: 'smooth' });
          }
        }}
      />
    </div>
  );
}