import { useState } from 'react';
import { Menu, X, PenLine } from 'lucide-react';
import { NAV_LINKS } from '../data.js';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 backdrop-blur-md">
      <nav className="flex items-center justify-between px-4 py-4 sm:px-6 md:px-12 md:py-6">
        <a
          href="#top"
          className="animate-blur-fade-up flex items-baseline gap-3"
          style={{ animationDelay: '0ms' }}
        >
          <span className="text-lg font-light tracking-[0.12em] text-white md:text-xl">GRAVEN</span>
          <span className="hidden font-mono text-[10px] tracking-[0.3em] text-[#9aa4ae] sm:inline">
            / DRAFTING WORKS
          </span>
        </a>

        <div className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              className="animate-blur-fade-up text-sm text-white/70 transition-colors hover:text-white"
              style={{ animationDelay: `${100 + i * 50}ms` }}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="liquid-glass animate-blur-fade-up inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm text-white transition-colors hover:text-[#9aa4ae]"
            style={{ animationDelay: '300ms' }}
          >
            Start a drawing
            <PenLine size={16} strokeWidth={1.5} />
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="liquid-glass flex h-10 w-10 items-center justify-center rounded-full lg:hidden"
          >
            <span className="relative block h-[18px] w-[18px]">
              <Menu
                size={18}
                strokeWidth={1.5}
                className={`absolute inset-0 transition-all duration-500 ${
                  open ? 'rotate-180 scale-50 opacity-0' : 'rotate-0 scale-100 opacity-100'
                }`}
              />
              <X
                size={18}
                strokeWidth={1.5}
                className={`absolute inset-0 transition-all duration-500 ${
                  open ? 'rotate-0 scale-100 opacity-100' : '-rotate-180 scale-50 opacity-0'
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      <div
        className={`absolute left-4 right-4 top-[calc(100%-4px)] rounded-2xl border border-white/10 bg-[#0c0f13]/95 backdrop-blur-md transition-all duration-300 lg:hidden ${
          open ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'
        }`}
      >
        <div className="flex flex-col p-2">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3.5 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
