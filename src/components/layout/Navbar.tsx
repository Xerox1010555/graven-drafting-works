/**
 * GRAVEN - Navbar Component
 * Fixed navigation with mobile drawer and liquid-glass CTA
 */

import { useState, useEffect } from 'react';
import { Menu, X, PenLine } from 'lucide-react';
import { clsx } from 'clsx';
import { NAV_LINKS } from '../../data/index.ts';
import { Button } from '../ui/index.ts';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={clsx('fixed inset-x-0 top-0 z-[var(--z-fixed)] transition-all duration-300', scrolled && 'backdrop-blur-md bg-[var(--color-bg)]/80')}>
      <nav className="flex items-center justify-between px-4 py-4 sm:px-6 md:px-12 md:py-6">
        <a href="#top" className="animate-blur-fade-up flex items-baseline gap-3" style={{ animationDelay: '0ms' }}>
          <span className="text-lg font-light tracking-[0.12em] text-white md:text-xl">GRAVEN</span>
          <span className="hidden font-mono text-[10px] tracking-[0.3em] text-[var(--color-fg-muted)] sm:inline">
            / DRAFTING WORKS
          </span>
        </a>

        <div className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              className={clsx('animate-blur-fade-up text-sm text-white/70 transition-colors hover:text-white', i === NAV_LINKS.length - 1 && 'lg:hidden')}
              style={{ animationDelay: `${100 + i * 50}ms` }}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="liquid-glass"
            size="md"
            asChild
            className="animate-blur-fade-up"
            style={{ animationDelay: '300ms' }}
          >
            <a href="#contact">
              Start a drawing
              <PenLine size={16} strokeWidth={1.5} />
            </a>
          </Button>

          <button
            type="button"
            onClick={() => setOpen(v => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="liquid-glass flex h-10 w-10 items-center justify-center rounded-full lg:hidden"
          >
            <span className="relative block h-[18px] w-[18px]">
              <Menu
                size={18}
                strokeWidth={1.5}
                className={clsx('absolute inset-0 transition-all duration-500', open ? 'rotate-180 scale-50 opacity-0' : 'rotate-0 scale-100 opacity-100')}
              />
              <X
                size={18}
                strokeWidth={1.5}
                className={clsx('absolute inset-0 transition-all duration-500', open ? 'rotate-0 scale-100 opacity-100' : '-rotate-180 scale-50 opacity-0')}
              />
            </span>
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        role="navigation"
        aria-label="Mobile menu"
        className={clsx(
          'absolute left-4 right-4 top-[calc(100%-4px)] rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)]/95 backdrop-blur-md transition-all duration-300 lg:hidden',
          open ? 'pointer-events-auto translate-y-0 opacity-100 animate-slide-down' : 'pointer-events-none -translate-y-2 opacity-0 animate-slide-up'
        )}
      >
        <div className="flex flex-col p-2">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className={clsx('animate-blur-fade-up rounded-xl px-4 py-3.5 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white', i === NAV_LINKS.length - 1 && 'mt-2')}
              style={{ animationDelay: `${100 + i * 50}ms` }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}