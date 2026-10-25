import { forwardRef, Fragment } from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';

const ALIGN = {
  left: { outer: 'items-center justify-start text-left', inner: 'items-start' },
  right: { outer: 'items-center justify-end text-right', inner: 'items-end' },
  center: { outer: 'items-center justify-center text-center', inner: 'items-center' },
};

function Highlighted({ text, highlight }) {
  if (!highlight) return text;
  const at = text.indexOf(highlight);
  if (at === -1) return text;
  return (
    <>
      {text.slice(0, at)}
      <span style={{ color: '#9aa4ae' }}>{highlight}</span>
      {text.slice(at + highlight.length)}
    </>
  );
}

/*
 * A caption beat pinned over the sheet. The wrapper's opacity / transform /
 * visibility are written every frame by the App loop from the beat's
 * progress window; the inner elements run their blur-fade + line-draw
 * entrance once, when the window first activates.
 */
const Beat = forwardRef(function Beat({ beat, revealed }, ref) {
  const a = ALIGN[beat.align];
  const reveal = revealed ? 'animate-blur-fade-up' : 'opacity-0';
  const draw = revealed ? 'rule-draw' : 'scale-x-0';
  const drawOrigin = beat.align === 'right' ? 'rule-draw-r' : '';

  return (
    <div
      ref={ref}
      className="beat-overlay absolute inset-0 z-10 flex px-4 py-24 sm:px-6 md:px-12"
      style={{ opacity: 0, visibility: 'hidden', pointerEvents: 'none' }}
    >
      <div className={`flex w-full flex-col ${a.outer}`}>
        <div className={`flex flex-col ${a.inner} ${beat.align === 'center' ? 'max-w-2xl' : 'max-w-xl'}`}>
          <p
            className={`${reveal} font-mono text-[11px] uppercase tracking-[0.28em] text-[#9aa4ae]`}
            style={{ animationDelay: '0ms' }}
          >
            {beat.kicker}
          </p>

          <div className={`rule mt-5 mb-7 w-28 ${draw} ${drawOrigin}`} style={{ animationDelay: '120ms' }} />

          <h2
            className={`${reveal} text-4xl font-light leading-[1.04] tracking-[-0.03em] text-white sm:text-5xl md:text-6xl`}
            style={{ animationDelay: '200ms' }}
          >
            <Highlighted text={beat.heading} highlight={beat.highlight} />
          </h2>

          <p
            className={`${reveal} mt-5 max-w-md text-base text-white/60 sm:text-lg`}
            style={{ animationDelay: '320ms' }}
          >
            {beat.sub}
          </p>

          <div
            className={`${reveal} mt-9 flex flex-col gap-3 md:flex-row md:items-center md:gap-6 ${
              beat.align === 'right' ? 'md:justify-end' : ''
            } ${beat.align === 'center' ? 'md:justify-center' : ''}`}
            style={{ animationDelay: '440ms' }}
          >
            {beat.specs.map(([k, v], idx) => (
              <Fragment key={k}>
                {idx > 0 && (
                  <>
                    <div className="rule w-full md:hidden" />
                    <div className="rule-v hidden h-9 md:block" />
                  </>
                )}
                <div className="whitespace-nowrap font-mono text-[11px] tracking-[0.18em]">
                  <span className="dim-label">{k}</span>
                  <span className="text-white/30"> · </span>
                  <span className="text-white/75">{v}</span>
                </div>
              </Fragment>
            ))}
          </div>

          {beat.cta && (
            <div
              className={`mt-10 flex flex-wrap items-center gap-4 ${
                beat.align === 'center' ? 'justify-center' : ''
              }`}
            >
              <a
                href="#work"
                className={`${reveal} inline-flex items-center gap-2.5 rounded-full bg-[#9aa4ae] px-7 py-3 text-sm font-medium text-[#0c0f13] transition-colors duration-300 hover:bg-white`}
                style={{ animationDelay: '560ms' }}
              >
                See the work
                <ArrowRight size={16} strokeWidth={1.5} />
              </a>
              <a
                href="#method"
                className={`${reveal} liquid-glass inline-flex items-center gap-2.5 rounded-full px-7 py-3 text-sm text-white transition-colors duration-300 hover:text-[#9aa4ae]`}
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
});

export default Beat;
