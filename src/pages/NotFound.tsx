/**
 * GRAVEN - NotFound Page
 * 404 page with brand-consistent styling
 */

import { Link } from 'react-router-dom';
import { ArrowLeft, Home, Search } from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from '../components/ui/index.ts';
import { Navbar, Footer } from '../components/layout/index.ts';
import { SITE_CONFIG } from '../data/index.ts';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center px-4">
      <Navbar />

      <main className="pt-20 pb-20 text-center animate-blur-fade-up">
        <div className="max-w-md mx-auto">
          <p className="font-mono text-8xl font-light text-white/10 mb-4">404</p>
          <h1 className="text-4xl font-light tracking-tight text-white mb-4">Page not found</h1>
          <p className="text-white/60 mb-8">
            The page you're looking for doesn't exist or has been moved.
            Let's get you back on track.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="primary" size="lg" asChild>
              <Link to="/">
                <Home size={18} strokeWidth={1.5} className="mr-2" />
                Back to Home
              </Link>
            </Button>
            <Button variant="ghost" size="lg" asChild>
              <Link to="/work">
                <Search size={18} strokeWidth={1.5} className="mr-2" />
                Browse Work
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}