/**
 * GRAVEN - Footer Component
 * Minimal footer with brand mark and navigation
 */

import { FOOTER_LINKS, SOCIAL_LINKS, SITE_CONFIG } from '../../data/index.ts';
import { clsx } from 'clsx';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-[var(--z-sticky)] bg-[var(--color-bg)]">
      <div className="rule w-full" />
      <div className="flex flex-col justify-between gap-6 px-6 py-10 text-xs text-white/40 sm:flex-row md:px-12">
        <div>
          <div className="flex items-baseline gap-3">
            <span className="text-sm font-light tracking-[0.12em] text-white/80">GRAVEN</span>
            <span className="font-mono text-[10px] tracking-[0.3em] text-[var(--color-fg-muted)]">/ DRAFTING WORKS</span>
          </div>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em]">
            GRAVEN — DRAFTING WORKS · SHEET SET 0001
          </p>
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] sm:text-right">
          <p>
            {FOOTER_LINKS.map((link, i) => (
              <span key={link.label}>
                <a href={link.href} className="hover:text-white transition-colors">
                  {link.label}
                </a>
                {i < FOOTER_LINKS.length - 1 && ' · '}
              </span>
            ))}
          </p>
          <p className="mt-3 text-white/25">
            Drawn before it's built — © {currentYear}
          </p>
        </div>
      </div>
    </footer>
  );
}