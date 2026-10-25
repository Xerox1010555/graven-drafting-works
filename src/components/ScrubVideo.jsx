import { VIDEO_URL } from '../data.js';

/*
 * The single <video> for the whole page. No autoPlay, no loop, no controls —
 * frame 0 is the landing state; the App-level rAF loop is the only thing
 * that ever moves currentTime.
 */
export default function ScrubVideo({ videoRef, ready }) {
  return (
    <video
      ref={videoRef}
      className={`absolute inset-0 z-0 h-full w-full object-cover transition-opacity duration-1000 ease-out ${
        ready ? 'opacity-100' : 'opacity-0'
      }`}
      src={VIDEO_URL}
      muted
      playsInline
      preload="auto"
      crossOrigin="anonymous"
    />
  );
}
