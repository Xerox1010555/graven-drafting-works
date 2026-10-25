/**
 * GRAVEN - Video Scrub Hook
 * Handles video currentTime manipulation based on scroll progress
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { dampedSpring, clamp01 } from '../utils/index.ts';
import type { VideoState } from '../types/index.ts';

interface UseVideoScrubOptions {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  progress: number;
  reducedMotion: boolean;
  duration?: number;
  onReady?: (duration: number) => void;
  onError?: (error: Error) => void;
  onTimeUpdate?: (currentTime: number) => void;
}

export function useVideoScrub({
  videoRef,
  progress,
  reducedMotion,
  duration: initialDuration,
  onReady,
  onError,
  onTimeUpdate: onTimeUpdateCallback,
}: UseVideoScrubOptions): VideoState {
  const [videoState, setVideoState] = useState<VideoState>({
    ready: false,
    playing: false,
    currentTime: 0,
    duration: initialDuration ?? NaN,
    progress: 0,
    error: null,
  });

  const currentTimeRef = useRef(0);
  const durationRef = useRef(initialDuration ?? NaN);
  const metaReadyRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  const updateVideoState = useCallback((partial: Partial<VideoState>) => {
    setVideoState(prev => ({ ...prev, ...partial }));
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoadedMetadata = () => {
      if (isFinite(video.duration) && video.duration > 0) {
        durationRef.current = video.duration;
        metaReadyRef.current = true;
        updateVideoState({ duration: video.duration, ready: true });
        onReady?.(video.duration);
      }
    };

    const onLoadedData = () => {
      if (video.readyState >= 2) {
        updateVideoState({ ready: true });
      }
    };

    const onErrorHandler = (e: Event) => {
      const error = new Error('Video failed to load');
      updateVideoState({ error });
      onError?.(error);
    };

    const handleTimeUpdate = () => {
      currentTimeRef.current = video.currentTime;
      updateVideoState({ currentTime: video.currentTime });
      onTimeUpdateCallback?.(video.currentTime);
    };

    const onPlay = () => updateVideoState({ playing: true });
    const onPause = () => updateVideoState({ playing: false });

    if (video.readyState >= 1) onLoadedMetadata();
    if (video.readyState >= 2) onLoadedData();

    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('loadeddata', onLoadedData);
    video.addEventListener('error', onErrorHandler);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);

    return () => {
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('loadeddata', onLoadedData);
      video.removeEventListener('error', onErrorHandler);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
    };
  }, [videoRef, onReady, onError, onTimeUpdateCallback, updateVideoState]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !metaReadyRef.current || !isFinite(durationRef.current)) return;

    const tick = () => {
      rafRef.current = requestAnimationFrame(tick);

      const targetTime = progress * durationRef.current;
      const clampedTarget = clamp01(targetTime / durationRef.current) * durationRef.current;

      if (reducedMotion) {
        if (Math.abs(clampedTarget - video.currentTime) > 0.05) {
          try {
            if (video.readyState >= 2) {
              video.currentTime = clampedTarget;
            }
          } catch {
            // iOS can throw on premature seeks
          }
        }
      } else {
        currentTimeRef.current = dampedSpring(currentTimeRef.current, clampedTarget, 0.1);
        if (Math.abs(clampedTarget - currentTimeRef.current) > 0.01) {
          try {
            if (video.readyState >= 2 && isFinite(currentTimeRef.current)) {
              video.currentTime = currentTimeRef.current;
            }
          } catch {
            // iOS can throw on premature seeks
          }
        }
      }

      updateVideoState({ progress });
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [progress, reducedMotion, videoRef, updateVideoState]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return videoState;
}