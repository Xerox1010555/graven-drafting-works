/**
 * GRAVEN - ProgressRail Component
 * Fixed progress indicator on the right edge (desktop only)
 */

import { forwardRef, HTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { BEATS } from '../../data/index.ts';

interface ProgressRailProps extends HTMLAttributes<HTMLDivElement> {
  progress: number;
  label: string;
  beats?: typeof BEATS;
  onBeatClick?: (index: number) => void;
  showChapterMarkers?: boolean;
}

export const ProgressRail = forwardRef<HTMLDivElement, ProgressRailProps>(
  (
    {
      progress,
      label,
      beats = BEATS,
      onBeatClick,
      showChapterMarkers = true,
      className,
      ...props
    },
    ref
  ) => {
    const beatMarkers = showChapterMarkers && beats.map((beat, i) => (
      <button
        key={beat.kicker}
        onClick={() => onBeatClick?.(i)}
        className={clsx(
          'relative flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200',
          'hover:bg-white/10',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]',
          'text-white/40 hover:text-white',
          'font-mono text-[9px] uppercase tracking-[0.2em]',
          i === beats.length - 1 ? 'mb-0' : 'mb-2'
        )}
        aria-label={`Go to ${beat.rail}`}
      >
        <span className="absolute -right-10 w-8 text-right pr-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          {beat.rail}
        </span>
        {beat.kicker.charAt(0)}
      </button>
    ));

    return (
      <div
        ref={ref}
        className={clsx(
          'pointer-events-none fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-4 lg:flex',
          className
        )}
        aria-hidden="true"
        {...props}
      >
        {/* Progress fill */}
        <div className="relative h-40 w-[2px] bg-white/10">
          <div
            className="absolute bottom-0 left-0 w-full bg-[var(--color-accent)] transition-all duration-100 ease-out"
            style={{ height: `${(progress * 100).toFixed(2)}%` }}
          />
          {showChapterMarkers && beats.map((beat, i) => (
            <div
              key={beat.kicker}
              className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white/30"
              style={{ bottom: `${beat.window[0] * 100}%` }}
              aria-hidden="true"
            />
          ))}
        </div>

        {/* Label */}
        <div className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.25em] text-white/45 [writing-mode:vertical-rl]">
          {label}
        </div>

        {/* Chapter markers (clickable) */}
        {beatMarkers && (
          <div className="flex flex-col items-center gap-2" role="navigation" aria-label="Beat navigation">
            {beatMarkers}
          </div>
        )}
      </div>
    );
  }
);

ProgressRail.displayName = 'ProgressRail';