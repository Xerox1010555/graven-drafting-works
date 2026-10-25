/**
 * GRAVEN - NewsletterForm Component
 * Simple email capture with double opt-in
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, CheckCircle, Mail } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { Button, Input } from '../ui/index.ts';
import { useFormAnalytics } from '../../hooks/index.ts';

const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

interface NewsletterFormData {
  email: string;
}

interface NewsletterFormProps {
  source: 'footer' | 'beat-cta' | 'hero' | 'contact-page';
  className?: string;
  variant?: 'inline' | 'stacked';
  showLabel?: boolean;
}

export function NewsletterForm({ source, className, variant = 'inline', showLabel = true }: NewsletterFormProps) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const { trackSubmit } = useFormAnalytics();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = async (data: NewsletterFormData) => {
    setStatus('submitting');
    setMessage('');

    try {
      const response = await fetch(import.meta.env.VITE_NEWSLETTER_API_URL || '/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          source,
          utm_source: new URLSearchParams(window.location.search).get('utm_source') || undefined,
          utm_medium: new URLSearchParams(window.location.search).get('utm_medium') || undefined,
          utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign') || undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Subscription failed');
      }

      setStatus('success');
      setMessage(result.verified ? 'Welcome! Check your inbox to confirm.' : 'Thanks! Please check your email to confirm.');
      trackSubmit('newsletter', 'success');
      reset();
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
      trackSubmit('newsletter', 'error');
    }
  };

  const isInline = variant === 'inline';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={twMerge('space-y-3', className)} noValidate>
      {status === 'success' && (
        <div className={twMerge(
          'flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/30 animate-blur-fade-up',
          isInline ? 'flex-row' : 'flex-col items-start'
        )}>
          <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
          <p className="text-green-300">{message}</p>
        </div>
      )}

      {status !== 'success' && (
        <>
          <div className={twMerge('flex items-center gap-3', isInline ? 'flex-row' : 'flex-col items-stretch')}>
            {showLabel && (
              <label htmlFor={`newsletter-${source}`} className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50 whitespace-nowrap">
                Newsletter
              </label>
            )}
            <div className={twMerge('relative flex-1', !isInline && 'w-full')}>
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" aria-hidden="true" />
              <input
                id={`newsletter-${source}`}
                type="email"
                placeholder="Your email"
                className={twMerge(
                  'w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-xl px-4 py-3 pl-10 text-white placeholder:text-white/30',
                  'focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] focus:border-transparent',
                  'transition-all duration-200',
                  errors.email && 'border-[var(--color-accent)]'
                )}
                {...register('email')}
                aria-describedby={errors.email ? `${source}-email-error` : undefined}
              />
            </div>
            <Button type="submit" size="md" loading={isSubmitting || status === 'submitting'} className={twMerge(!isInline && 'w-full')}>
              {isSubmitting || status === 'submitting' ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                'Subscribe'
              )}
            </Button>
          </div>
          {errors.email && (
            <p id={`${source}-email-error`} className="text-sm text-[var(--color-accent)]" role="alert">
              {errors.email.message}
            </p>
          )}
          {status === 'error' && (
            <p className="text-sm text-red-400" role="alert">{message}</p>
          )}
        </>
      )}
    </form>
  );
}