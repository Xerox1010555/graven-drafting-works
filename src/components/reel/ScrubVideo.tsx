/**
 * GRAVEN - ScrubVideo Component
 * The single video element controlled by scroll
 */

import { forwardRef, VideoHTMLAttributes, useEffect, useRef, useCallback } from 'react';
import { clsx } from 'clsx';
import { VIDEO_CONFIG } from '../../data/index.ts';
import { getBestVideoSource, getBestMimeType, initHlsIfNeeded, waitForVideoReady } from '../../utils/video.ts';

interface ScrubVideoProps extends Omit<VideoHTMLAttributes<HTMLVideoElement>, 'src'> {
  videoRef: React.RefObject<HTMLVideoElement | null> | ((el: HTMLVideoElement | null) => void);
  ready: boolean;
  src?: string;
  poster?: string;
  fallbackSrc?: string;
}

export const ScrubVideo = forwardRef<HTMLVideoElement, ScrubVideoProps>(
  (
    {
      videoRef,
      ready,
      src = VIDEO_CONFIG.src,
      poster = VIDEO_CONFIG.poster,
      fallbackSrc = VIDEO_CONFIG.fallbackSrc,
      className,
      ...props
    },
    ref
  ) => {
    const hlsRef = useRef<{ destroy: () => void } | null>(null);
    const mountedRef = useRef(true);
    const videoElementRef = useRef<HTMLVideoElement | null>(null);

    // Initialize HLS if needed
    useEffect(() => {
      const video = videoElementRef.current;
      if (!video || !mountedRef.current) return;

      const cleanup = async () => {
        if (hlsRef.current) {
          hlsRef.current.destroy();
          hlsRef.current = null;
        }
      };

      const init = async () => {
        await cleanup();
        const bestSrc = getBestVideoSource({ ...VIDEO_CONFIG, src, fallbackSrc });
        const mimeType = getBestMimeType({ ...VIDEO_CONFIG, src, fallbackSrc });

        video.src = bestSrc;
        video.poster = poster;

        if (mimeType === 'application/vnd.apple.mpegurl') {
          const hls = await initHlsIfNeeded(video, bestSrc);
          if (hls) hlsRef.current = hls;
        }

        try {
          const duration = await waitForVideoReady(video);
          video.dispatchEvent(new CustomEvent('videoready', { detail: { duration } }));
        } catch (error) {
          console.warn('[ScrubVideo] Video not ready:', error);
        }
      };

      init();

      return () => {
        mountedRef.current = false;
        cleanup();
      };
    }, [src, poster, fallbackSrc]);

    const setVideoRef = useCallback((el: HTMLVideoElement | null) => {
      videoElementRef.current = el;
      if (typeof videoRef === 'function') {
        videoRef(el);
      } else if (videoRef && 'current' in videoRef) {
        (videoRef as React.MutableRefObject<HTMLVideoElement | null>).current = el;
      }
      if (ref) {
        if (typeof ref === 'function') ref(el);
        else ref.current = el;
      }
    }, [videoRef, ref]);

    return (
      <video
        ref={setVideoRef}
        className={clsx(
          'absolute inset-0 z-0 h-full w-full object-cover transition-opacity duration-1000 ease-out',
          ready ? 'opacity-100' : 'opacity-0',
          className
        )}
        muted
        playsInline
        preload="metadata"
        crossOrigin="anonymous"
        {...props}
      />
    );
  }
);

ScrubVideo.displayName = 'ScrubVideo';