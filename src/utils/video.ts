/**
 * GRAVEN - Video Utilities
 * Helper functions for video handling, HLS, and frame extraction
 */

import type { VideoConfig, VideoState } from '../types/index.ts';

/**
 * Check if HLS is supported natively
 */
export function isHlsSupported(): boolean {
  const video = document.createElement('video');
  return video.canPlayType('application/vnd.apple.mpegurl') !== '';
}

/**
 * Check if MP4 is supported
 */
export function isMp4Supported(): boolean {
  const video = document.createElement('video');
  return video.canPlayType('video/mp4') !== '';
}

/**
 * Get the best video source for the current browser
 */
export function getBestVideoSource(config: VideoConfig): string {
  // Prefer HLS if supported and available
  if (config.mimeType === 'application/vnd.apple.mpegurl' && isHlsSupported()) {
    return config.src;
  }
  // Fallback to MP4
  return config.fallbackSrc || config.src;
}

/**
 * Get the best MIME type for the current browser
 */
export function getBestMimeType(config: VideoConfig): string {
  if (config.mimeType === 'application/vnd.apple.mpegurl' && isHlsSupported()) {
    return 'application/vnd.apple.mpegurl';
  }
  return 'video/mp4';
}

/**
 * Initialize HLS.js if needed
 */
export async function initHlsIfNeeded(
  video: HTMLVideoElement,
  src: string
): Promise<{ hls: unknown; destroy: () => void } | null> {
  // Dynamic import to avoid bundling HLS.js if not needed
  if (src.endsWith('.m3u8') || src.includes('m3u8')) {
    try {
      const Hls = (await import('hls.js')).default;
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          maxBufferLength: 30,
          maxMaxBufferLength: 60,
        });
        hls.loadSource(src);
        hls.attachMedia(video);
        return {
          hls,
          destroy: () => {
            hls.destroy();
          },
        };
      }
    } catch (error) {
      console.warn('[Video] HLS.js failed to load:', error);
    }
  }
  return null;
}

/**
 * Extract first frame as poster (for build-time script)
 */
export function extractPosterFrame(
  video: HTMLVideoElement,
  outputFormat: 'webp' | 'avif' = 'webp',
  quality = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    const seekTime = 0.1; // Seek slightly in to avoid black first frame
    const onSeeked = () => {
      video.removeEventListener('seeked', onSeeked);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const mimeType = outputFormat === 'avif' ? 'image/avif' : 'image/webp';
      const dataUrl = canvas.toDataURL(mimeType, quality);
      resolve(dataUrl);
    };

    video.addEventListener('seeked', onSeeked);
    video.currentTime = seekTime;
  });
}

/**
 * Capture current frame as blob
 */
export function captureFrame(
  video: HTMLVideoElement,
  format: 'png' | 'jpeg' | 'webp' = 'png',
  quality = 0.9
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to create blob'));
      },
      `image/${format}`,
      quality
    );
  });
}

/**
 * Download current frame as file
 */
export async function downloadFrame(
  video: HTMLVideoElement,
  filename = `graven-frame-${Date.now()}.png`
): Promise<void> {
  const blob = await captureFrame(video, 'png');
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Create video element with optimal settings
 */
export function createVideoElement(config: VideoConfig): HTMLVideoElement {
  const video = document.createElement('video');
  video.src = getBestVideoSource(config);
  video.muted = true;
  video.playsInline = true;
  video.preload = 'metadata';
  video.crossOrigin = 'anonymous';
  video.style.width = '100%';
  video.style.height = '100%';
  video.style.objectFit = 'cover';
  return video;
}

/**
 * Wait for video to be ready for seeking
 */
export function waitForVideoReady(
  video: HTMLVideoElement,
  timeout = 10000
): Promise<number> {
  return new Promise((resolve, reject) => {
    if (video.readyState >= 2 && isFinite(video.duration) && video.duration > 0) {
      resolve(video.duration);
      return;
    }

    const timer = setTimeout(() => {
      cleanup();
      reject(new Error('Video load timeout'));
    }, timeout);

    const onLoadedData = () => {
      if (video.readyState >= 2 && isFinite(video.duration) && video.duration > 0) {
        cleanup();
        resolve(video.duration);
      }
    };

    const onError = () => {
      cleanup();
      reject(new Error('Video load error'));
    };

    const cleanup = () => {
      clearTimeout(timer);
      video.removeEventListener('loadeddata', onLoadedData);
      video.removeEventListener('error', onError);
    };

    video.addEventListener('loadeddata', onLoadedData);
    video.addEventListener('error', onError);
  });
}

/**
 * Safely seek video with error handling
 */
export function safeSeek(video: HTMLVideoElement, time: number): boolean {
  try {
    if (video.readyState >= 2 && isFinite(time) && time >= 0 && time <= video.duration) {
      video.currentTime = time;
      return true;
    }
  } catch (error) {
    console.warn('[Video] Seek failed:', error);
  }
  return false;
}

/**
 * Get video playback quality info
 */
export function getVideoQualityInfo(video: HTMLVideoElement): {
  width: number;
  height: number;
  duration: number;
  bitrate?: number;
} {
  return {
    width: video.videoWidth,
    height: video.videoHeight,
    duration: video.duration,
    bitrate: (video as HTMLVideoElement & { videoBitrate?: number }).videoBitrate,
  };
}

/**
 * Preload video metadata and first segment
 */
export function preloadVideo(video: HTMLVideoElement): Promise<void> {
  return new Promise((resolve, reject) => {
    const onLoad = () => {
      video.removeEventListener('loadedmetadata', onLoad);
      video.removeEventListener('error', onError);
      resolve();
    };
    const onError = () => {
      video.removeEventListener('loadedmetadata', onLoad);
      video.removeEventListener('error', onError);
      reject(new Error('Video preload failed'));
    };
    video.addEventListener('loadedmetadata', onLoad);
    video.addEventListener('error', onError);
    video.load();
  });
}