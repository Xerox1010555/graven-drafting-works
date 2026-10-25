import { useEffect, useMemo, useRef, useState } from 'react';
import Navbar from './components/Navbar.jsx';
import ScrubVideo from './components/ScrubVideo.jsx';
import { BlueprintGrid, ColdScrim, Grain } from './components/Overlays.jsx';
import Hero from './components/Hero.jsx';
import Beat from './components/Beat.jsx';
import ProgressRail from './components/ProgressRail.jsx';
import Footer from './components/Footer.jsx';
import { BEATS } from './data.js';

const clamp01 = (v) => Math.min(Math.max(v, 0), 1);
const smoothstep = (t) => t * t * (3 - 2 * t);

const HERO_FADE = 0.06; // hero reads at progress 0.00, gone by 0.06
const EDGE_IN = 0.12; // fraction of a beat window spent fading in
const EDGE_OUT = 0.18; // fraction spent fading out (last beat never fades)

export default function App() {
  const reducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  const trackRef = useRef(null);
  const videoRef = useRef(null);
  const heroRef = useRef(null);
  const beatRefs = useRef([]);
  const railFillRef = useRef(null);

  const [videoReady, setVideoReady] = useState(false);
  const [activeBeat, setActiveBeat] = useState(-1);
  const [revealed, setRevealed] = useState(() => BEATS.map(() => reducedMotion));

  useEffect(() => {
    const video = videoRef.current;
    const track = trackRef.current;
    if (!video || !track) return undefined;

    // Scrub only after the duration is known and finite.
    let duration = NaN;
    let metaReady = false;
    let current = 0;

    const onMeta = () => {
      if (isFinite(video.duration) && video.duration > 0) {
        duration = video.duration;
        metaReady = true;
      }
    };
    if (video.readyState >= 1) onMeta();
    video.addEventListener('loadedmetadata', onMeta);

    const onData = () => setVideoReady(true);
    if (video.readyState >= 2) setVideoReady(true);
    else video.addEventListener('loadeddata', onData);

    const revealedRef = BEATS.map(() => reducedMotion);
    const activeRef = { i: -1 };

    // The track is the first element on the page, so -rect.top === scrollY;
    // scrollY keeps the math stable on mobile as the URL bar collapses.
    const progress = () => {
      const trackH = track.offsetHeight || 1;
      const denom = Math.max(trackH - window.innerHeight, 1);
      return clamp01((window.scrollY || 0) / denom);
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const p = progress();

      // --- the scrub: scroll position is the only thing that moves the video
      if (metaReady) {
        const target = p * duration;
        if (reducedMotion) {
          try {
            if (video.readyState >= 2 && Math.abs(target - video.currentTime) > 0.05) {
              video.currentTime = target;
            }
          } catch {
            /* iOS can throw on premature seeks */
          }
        } else {
          current += (target - current) * 0.1;
          if (Math.abs(target - current) > 0.01) {
            try {
              if (video.readyState >= 2 && isFinite(current)) video.currentTime = current;
            } catch {
              /* iOS can throw on premature seeks */
            }
          }
        }
      }

      // --- hero caption beat: fades out over the first sliver of scroll
      if (heroRef.current) {
        const o = 1 - smoothstep(clamp01(p / HERO_FADE));
        heroRef.current.style.opacity = o.toFixed(3);
        heroRef.current.style.visibility = o <= 0.001 ? 'hidden' : 'visible';
      }

      // --- beat windows: exactly one reads at a time
      let revealedChanged = false;
      BEATS.forEach((beat, i) => {
        const el = beatRefs.current[i];
        const [start, end] = beat.window;
        const isLast = i === BEATS.length - 1;
        let o = 0;
        let y = 0;

        if (p >= start && p <= end) {
          const len = end - start;
          const inEnd = start + len * EDGE_IN;
          const outStart = end - len * EDGE_OUT;
          if (p < inEnd) {
            const t = smoothstep((p - start) / Math.max(inEnd - start, 1e-4));
            o = t;
            y = (1 - t) * 40;
          } else if (!isLast && p > outStart) {
            o = 1 - smoothstep((p - outStart) / Math.max(end - outStart, 1e-4));
          } else {
            o = 1;
          }
        }

        if (el) {
          el.style.opacity = o.toFixed(3);
          el.style.visibility = o <= 0.001 ? 'hidden' : 'visible';
          el.style.pointerEvents = o > 0.5 ? 'auto' : 'none';
          el.style.transform = y ? `translate3d(0, ${y.toFixed(1)}px, 0)` : 'translate3d(0, 0, 0)';
        }

        // reveal entrance once, slightly ahead of the fade-in
        if (!revealedRef[i] && p >= start - 0.015) {
          revealedRef[i] = true;
          revealedChanged = true;
        }
      });

      // --- progress rail
      if (railFillRef.current) {
        railFillRef.current.style.height = `${(p * 100).toFixed(2)}%`;
      }

      let active = -1;
      BEATS.forEach((beat, i) => {
        if (p >= beat.window[0] - 1e-6) active = i;
      });
      if (p < HERO_FADE) active = -1;
      if (active !== activeRef.i) {
        activeRef.i = active;
        setActiveBeat(active);
      }

      if (revealedChanged) setRevealed(revealedRef.slice());
    };

    let raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      video.removeEventListener('loadedmetadata', onMeta);
      video.removeEventListener('loadeddata', onData);
    };
  }, [reducedMotion]);

  const railLabel = activeBeat >= 0 ? BEATS[activeBeat].rail : '00 · BRIEF';

  return (
    <div id="top" className="relative">
      <Navbar />

      {/* scroll track — the tall container that drives the whole reel */}
      <section ref={trackRef} className="relative h-[360vh] md:h-[500vh]" aria-label="Drafting reel">
        {/* sticky stage — video + overlays + caption beats, pinned for the whole track */}
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#0c0f13]">
          <ScrubVideo videoRef={videoRef} ready={videoReady} />
          <BlueprintGrid />
          <ColdScrim />
          <Grain />
          <Hero ref={heroRef} />
          {BEATS.map((beat, i) => (
            <Beat
              key={beat.kicker}
              ref={(el) => {
                beatRefs.current[i] = el;
              }}
              beat={beat}
              revealed={revealed[i]}
            />
          ))}
        </div>
      </section>

      <Footer />
      <ProgressRail ref={railFillRef} label={railLabel} />
    </div>
  );
}
