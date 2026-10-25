/**
 * GRAVEN - Contact Page
 * Contact form with validation and submission
 */

import { MapPin, Mail, Phone, Calendar, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { Card, CardContent, Button } from '../components/ui/index.ts';
import { Navbar, Footer } from '../components/layout/index.ts';
import { ContactForm } from '../components/forms/index.ts';
import { SITE_CONFIG, SOCIAL_LINKS } from '../data/index.ts';

export default function Contact() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Navbar />

      <main className="pt-32 pb-20 px-4 sm:px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-16 animate-blur-fade-up">
            <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-[var(--color-fg-muted)] mb-4">
              CONTACT
            </p>
            <h1 className="text-5xl font-light leading-[0.95] tracking-[-0.03em] text-white sm:text-6xl md:text-7xl">
              Start a<br />drawing.
            </h1>
            <p className="mt-6 max-w-2xl text-base text-white/60 sm:text-lg">
              Tell us about your project. We'll review and respond within 24 hours with a preliminary
              assessment and next steps.
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-3">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-8 animate-blur-fade-up" style={{ animationDelay: '100ms' }}>
              <Card variant="outlined" padding="lg">
                <h3 className="text-lg font-light tracking-tight text-white mb-6">Get in touch</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Mail size={20} strokeWidth={1.5} className="text-[var(--color-accent)] flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-fg-muted)]">Email</p>
                      <a href={SOCIAL_LINKS.email} className="text-white hover:text-[var(--color-accent)] transition-colors mt-1 block">{SITE_CONFIG.contactEmail}</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <MapPin size={20} strokeWidth={1.5} className="text-[var(--color-accent)] flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-fg-muted)]">Studios</p>
                      <address className="not-italic text-white/70 mt-1">
                        Rotterdam, Netherlands<br />
                        Boston, Massachusetts, USA
                      </address>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Calendar size={20} strokeWidth={1.5} className="text-[var(--color-accent)] flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-fg-muted)]">Hours</p>
                      <p className="text-white/70 mt-1">Mon–Fri, 09:00–18:00 CET / EST</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone size={20} strokeWidth={1.5} className="text-[var(--color-accent)] flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-fg-muted)]">Response</p>
                      <p className="text-white/70 mt-1">Within 24 hours</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card variant="outlined" padding="lg">
                <h3 className="text-lg font-light tracking-tight text-white mb-6">What happens next?</h3>
                <ol className="space-y-4">
                  {[
                    'You submit the project brief below',
                    'We review requirements and feasibility',
                    'We respond with scope, timeline, and budget range',
                    'Discovery call to align on deliverables',
                    'Proposal agreement and project kickoff',
                  ].map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full border border-[var(--color-accent)]/50 flex items-center justify-center font-mono text-[11px] text-[var(--color-accent)]">
                        {i + 1}
                      </span>
                      <span className="text-white/70 text-sm">{step}</span>
                    </li>
                  ))}
                </ol>
              </Card>
            </div>

            {/* Form */}
            <div className="lg:col-span-2 animate-blur-fade-up" style={{ animationDelay: '200ms' }}>
              <Card variant="outlined" padding="lg">
                <ContactForm />
              </Card>

              <div className="mt-8 grid gap-6 sm:grid-cols-3">
                <Card variant="outlined" padding="lg" className="text-center">
                  <CheckCircle size={28} strokeWidth={1.5} className="text-green-400 mx-auto mb-3" />
                  <h3 className="text-lg font-light tracking-tight text-white mb-1">Free Consultation</h3>
                  <p className="text-white/60 text-sm">30-min discovery call, no obligation</p>
                </Card>

                <Card variant="outlined" padding="lg" className="text-center">
                  <CheckCircle size={28} strokeWidth={1.5} className="text-green-400 mx-auto mb-3" />
                  <h3 className="text-lg font-light tracking-tight text-white mb-1">NDA Ready</h3>
                  <p className="text-white/60 text-sm">Mutual NDA available on request</p>
                </Card>

                <Card variant="outlined" padding="lg" className="text-center">
                  <CheckCircle size={28} strokeWidth={1.5} className="text-green-400 mx-auto mb-3" />
                  <h3 className="text-lg font-light tracking-tight text-white mb-1">Global Delivery</h3>
                  <p className="text-white/60 text-sm">We work with clients worldwide</p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}