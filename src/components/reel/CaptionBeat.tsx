/**
 * GRAVEN - CaptionBeat Component
 * A caption beat pinned over the sheet with reveal animations
 */

import { forwardRef, Fragment } from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';
import { clsx } from 'clsx';
import type { Beat, BeatSpec } from '../../types/index.ts';

const ALIGN = {
  left: { outer: 'items-center justify-start text-left', inner: 'items-start' },
  right: { outer: 'items-center justify-end text-right', inner: 'items-end' },
  center: { outer: 'items-center justify-center text-center', inner: 'items-center' },
} as const;

function Highlighted({ text, highlight }: { text: string; highlight?: string }) {
  if (!highlight) return text;
  const at = text.indexOf(highlight);
  if (at === -1) return text;
  return (
    <>
      {text.slice(0, at)}
      <span style={{ color: 'var(--color-fg-muted)' }}>{highlight}</span>
      {text.slice(at + highlight.length)}
    </>
  );
}

interface CaptionBeatProps {
  beat: Beat;
  revealed: boolean;
  opacity: number;
  transformY: number;
  visibility: 'visible' | 'hidden';
  pointerEvents: 'auto' | 'none';
}

export const CaptionBeat = forwardRef<HTMLDivElement, CaptionBeatProps>(
  (
    { beat, revealed, opacity, transformY, visibility, pointerEvents },
    ref
  ) => {
    const a = ALIGN[beat.align];
    const revealClass = revealed ? 'animate-blur-fade-up' : 'opacity-0';
    const drawClass = revealed ? 'rule-draw' : 'scale-x-0';
    const drawOriginClass = beat.align === 'right' ? 'rule-draw-r' : '';

    return (
      <div
        ref={ref}
        className="beat-overlay absolute inset-0 z-10 flex px-4 py-24 sm:px-6 md:px-12"
        style={{
          opacity: opacity.toFixed(3),
          visibility,
          pointerEvents,
          transform: transformY ? `translate3d(0, ${transformY.toFixed(1)}px, 0)` : 'translate3d(0, 0, 0)',
        }}
      >
        <div className={clsx('flex w-full flex-col', a.outer)}>
          <div className={clsx('flex flex-col', a.inner, beat.align === 'center' ? 'max-w-2xl' : 'max-w-xl')}>
            <p className={clsx(revealClass, 'font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--color-fg-muted)]')} style={{ animationDelay: '0ms' }}>
              {beat.kicker}
            </p>

            <div className={clsx('rule mt-5 mb-7 w-28', drawClass, drawOriginClass)} style={{ animationDelay: '120ms' }} />

            <h2 className={clsx(revealClass, 'text-4xl font-light leading-[1.04] tracking-[-0.03em] text-white sm:text-5xl md:text-6xl')} style={{ animationDelay: '200ms' }}>
              <Highlighted text={beat.heading} highlight={beat.highlight} />
            </h2>

            <p className={clsx(revealClass, 'mt-5 max-w-md text-base text-white/60 sm:text-lg')} style={{ animationDelay: '320ms' }}>
              {beat.sub}
            </p>

            <div
              className={clsx(
                revealClass,
                'mt-9 flex flex-col gap-3 md:flex-row md:items-center md:gap-6',
                beat.align === 'right' ? 'md:justify-end' : '',
                beat.align === 'center' ? 'md:justify-center' : ''
              )}
              style={{ animationDelay: '440ms' }}
            >
              {beat.specs.map((spec: BeatSpec, idx: number) => (
                <Fragment key={spec[0]}>
                  {idx > 0 && (
                    <>
                      <div className="rule w-full md:hidden" />
                      <div className="rule-v hidden h-9 md:block" />
                    </>
                  )}
                  <div className="whitespace-nowrap font-mono text-[11px] tracking-[0.18em]">
                    <span className="dim-label">{spec[0]}</span>
                    <span className="text-white/30"> · </span>
                    <span className="text-white/75">{spec[1]}</span>
                  </div>
                </Fragment>
              ))}
            </div>

            {beat.cta && (
              <div className={clsx('mt-10 flex flex-wrap items-center gap-4', beat.align === 'center' ? 'justify-center' : '')}>
                <a
                  href="#work"
                  className={clsx(revealClass, 'inline-flex items-center gap-2.5 rounded-full bg-[var(--color-cta-bg)] px-7 py-3 text-sm font-medium text-[var(--color-cta-fg)] transition-colors duration-300 hover:bg-white')}
                  style={{ animationDelay: '560ms' }}
                >
                  See the work
                  <ArrowRight size={16} strokeWidth={1.5} />
                </a>
                <a
                  href="#method"
                  className={clsx(revealClass, 'liquid-glass inline-flex items-center gap-2.5 rounded-full px-7 py-3 text-sm text-white transition-colors duration-300 hover:text-[var(--color-fg-muted)]')}
                  style={{ animationDelay: '680ms' }}
                >
                  Read the method
                  <BookOpen size={16} strokeWidth={1.5} />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

CaptionBeat.displayName = 'CaptionBeat';