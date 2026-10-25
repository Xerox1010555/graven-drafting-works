/**
 * GRAVEN - HeroBeat Component
 * The initial caption beat that lives on the sticky stage at progress 0.00
 */

import { forwardRef, HTMLAttributes } from 'react';
import { Ruler, PencilRuler, Sparkles, ChevronsDown } from 'lucide-react';
import { clsx } from 'clsx';

interface HeroBeatProps extends HTMLAttributes<HTMLDivElement> {}

export const HeroBeat = forwardRef<HTMLDivElement, HeroBeatProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx(
        'pointer-events-none absolute inset-0 z-10 flex items-end px-4 pb-20 text-left sm:px-6 md:px-12 md:pb-28',
        className
      )}
      style={{ opacity: 1 }}
      {...props}
    >
      <div className="max-w-3xl">
        <div className="animate-blur-fade-up mb-6 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.24em] text-white/50" style={{ animationDelay: '300ms' }}>
          <span className="inline-flex items-center gap-2">
            <Ruler size={14} strokeWidth={1.5} />
            Scale 1:1
          </span>
          <span className="inline-flex items-center gap-2">
            <PencilRuler size={14} strokeWidth={1.5} />
            Sheet 01 of 06
          </span>
          <span className="inline-flex items-center gap-2">
            <Sparkles size={14} strokeWidth={1.5} />
            Rev. A
          </span>
        </div>

        <div className="rule animate-blur-fade-up w-[120px]" style={{ animationDelay: '360ms' }} />

        <p className="animate-blur-fade-up mt-6 mb-4 font-mono text-[11px] uppercase tracking-[0.32em] text-[var(--color-fg-muted)]" style={{ animationDelay: '380ms' }}>
          GRAVEN / DRAFTING WORKS
        </p>

        <h1 className="animate-blur-fade-up text-5xl font-light leading-[0.95] tracking-[-0.03em] text-white sm:text-6xl md:text-7xl lg:text-8xl" style={{ animationDelay: '450ms' }}>
          <span style={{ color: 'var(--color-fg-muted)' }}>Drawn</span> before it's built.
        </h1>

        <p className="animate-blur-fade-up mt-5 max-w-lg text-base text-white/60 sm:text-lg" style={{ animationDelay: '560ms' }}>
          Every object begins as a line. Scroll to watch the draft take shape.
        </p>

        <div className="animate-blur-fade-up mt-8 inline-flex items-center gap-3 font-mono text-[11px] tracking-[0.3em] text-white/40" style={{ animationDelay: '680ms' }}>
          <span>SCROLL TO TRACE</span>
          <ChevronsDown size={16} strokeWidth={1.5} className="animate-bounce" />
        </div>
      </div>
    </div>
  )
);

HeroBeat.displayName = 'HeroBeat';