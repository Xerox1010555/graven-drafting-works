import { forwardRef } from 'react';

/*
 * Fixed progress rail on the right edge (desktop only). The App loop writes
 * the fill height every frame; the label comes from the active beat.
 */
const ProgressRail = forwardRef(function ProgressRail({ label }, ref) {
  return (
    <div
      className="pointer-events-none fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-4 lg:flex"
      aria-hidden="true"
    >
      <div className="relative h-40 w-[2px] bg-white/10">
        <div
          ref={ref}
          className="absolute bottom-0 left-0 w-full bg-[#9aa4ae]"
          style={{ height: '0%' }}
        />
      </div>
      <div className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.25em] text-white/45 [writing-mode:vertical-rl]">
        {label}
      </div>
    </div>
  );
});

export default ProgressRail;
