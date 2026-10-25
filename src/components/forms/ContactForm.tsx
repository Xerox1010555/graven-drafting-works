/**
 * GRAVEN - ContactForm Component
 * React Hook Form + Zod validation with Turnstile
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { Button, Input, Textarea, Label } from '../ui/index.ts';
import { FORM_CONSTANTS } from '../../data/index.ts';
import { useFormAnalytics } from '../../hooks/index.ts';
import type { ContactFormData } from '../../types/index.ts';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().optional(),
  projectType: z.enum(['industrial', 'product', 'architectural', 'other']),
  budgetRange: z.enum(['under-10k', '10k-50k', '50k-100k', '100k+']),
  timeline: z.enum(['asap', '1-month', '3-months', 'flexible']),
  message: z.string().min(50, 'Message must be at least 50 characters').max(2000, 'Message too long'),
  'cf-turnstile-response': z.string().optional(),
});

export function ContactForm() {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const { trackSubmit } = useFormAnalytics();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      projectType: 'industrial',
      budgetRange: '10k-50k',
      timeline: '1-month',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setSubmitStatus('submitting');
    setSubmitMessage('');

    const submitData = {
      ...data,
      utm_source: new URLSearchParams(window.location.search).get('utm_source') || undefined,
      utm_medium: new URLSearchParams(window.location.search).get('utm_medium') || undefined,
      utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign') || undefined,
      referrer: document.referrer || undefined,
      pageUrl: window.location.href,
      userAgent: navigator.userAgent,
    };

    try {
      const response = await fetch(import.meta.env.VITE_CONTACT_API_URL || '/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Submission failed');
      }

      setSubmitStatus('success');
      setSubmitMessage('Thank you! We\'ll be in touch within 24 hours.');
      trackSubmit('contact', 'success', Object.keys(data));
      reset();
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
      trackSubmit('contact', 'error', Object.keys(data));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="grid gap-6 md:grid-cols-2">
        <Input
          label="Full Name"
          placeholder="John Doe"
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="john@company.com"
          error={errors.email?.message}
          {...register('email')}
        />
      </div>

      <Input
        label="Company (Optional)"
        placeholder="Acme Corp"
        {...register('company')}
      />

      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <Label htmlFor="projectType">Project Type</Label>
          <select
            id="projectType"
            className={twMerge(
              'w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-white',
              'focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] focus:border-transparent',
              errors.projectType && 'border-[var(--color-accent)]'
            )}
            {...register('projectType')}
          >
            {FORM_CONSTANTS.projectTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
          {errors.projectType && <p className="mt-1.5 text-sm text-[var(--color-accent)]">{errors.projectType.message}</p>}
        </div>

        <div>
          <Label htmlFor="budgetRange">Budget Range</Label>
          <select
            id="budgetRange"
            className={twMerge(
              'w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-white',
              'focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] focus:border-transparent',
              errors.budgetRange && 'border-[var(--color-accent)]'
            )}
            {...register('budgetRange')}
          >
            {FORM_CONSTANTS.budgetRanges.map(range => (
              <option key={range.value} value={range.value}>{range.label}</option>
            ))}
          </select>
          {errors.budgetRange && <p className="mt-1.5 text-sm text-[var(--color-accent)]">{errors.budgetRange.message}</p>}
        </div>

        <div>
          <Label htmlFor="timeline">Timeline</Label>
          <select
            id="timeline"
            className={twMerge(
              'w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-white',
              'focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] focus:border-transparent',
              errors.timeline && 'border-[var(--color-accent)]'
            )}
            {...register('timeline')}
          >
            {FORM_CONSTANTS.timelines.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          {errors.timeline && <p className="mt-1.5 text-sm text-[var(--color-accent)]">{errors.timeline.message}</p>}
        </div>
      </div>

      <Textarea
        label="Project Details"
        placeholder="Describe your project, requirements, and any specific constraints..."
        rows={6}
        error={errors.message?.message}
        {...register('message')}
      />

      <input type="hidden" {...register('cf-turnstile-response')} />

      {submitStatus === 'success' && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/30 animate-blur-fade-up">
          <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
          <p className="text-green-300">{submitMessage}</p>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 animate-blur-fade-up" role="alert">
          <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
          <p className="text-red-300">{submitMessage}</p>
        </div>
      )}

      <Button type="submit" size="lg" fullWidth loading={isSubmitting || submitStatus === 'submitting'}>
        {isSubmitting || submitStatus === 'submitting' ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Sending...
          </>
        ) : (
          'Start a drawing'
        )}
      </Button>

      <p className="text-center text-xs text-white/30">
        By submitting, you agree to our <a href="/privacy" className="underline hover:text-white">Privacy Policy</a>.
        We'll never share your information.
      </p>
    </form>
  );
}