/**
 * GRAVEN - Input Component
 * Styled input with label and error support
 */

import { forwardRef, InputHTMLAttributes, LabelHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, iconLeft, iconRight, fullWidth = true, className, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).slice(2, 9)}`;
    const errorId = error ? `${inputId}-error` : undefined;
    const hintId = hint ? `${inputId}-hint` : undefined;

    return (
      <div className={clsx(fullWidth && 'w-full')}>
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-white mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {iconLeft && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
              {iconLeft}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={twMerge(
              'w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-white placeholder:text-white/30',
              'focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] focus:border-transparent',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'transition-all duration-200',
              iconLeft && 'pl-10',
              iconRight && 'pr-10',
              error && 'border-[var(--color-accent)] focus:ring-[var(--color-accent)]',
              className
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={clsx(errorId, hintId)}
            {...props}
          />
          {iconRight && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
              {iconRight}
            </div>
          )}
        </div>
        {error && (
          <p id={errorId} className="mt-1.5 text-sm text-[var(--color-accent)]" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className="mt-1.5 text-sm text-white/40">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ required, children, className, ...props }, ref) => (
    <label
      ref={ref}
      className={clsx('block text-sm font-medium text-white mb-2', className)}
      {...props}
    >
      {children}
      {required && <span className="text-[var(--color-accent)] ml-1" aria-hidden="true">*</span>}
    </label>
  )
);

Label.displayName = 'Label';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, fullWidth = true, className, id, ...props }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).slice(2, 9)}`;
    const errorId = error ? `${textareaId}-error` : undefined;
    const hintId = hint ? `${textareaId}-hint` : undefined;

    return (
      <div className={clsx(fullWidth && 'w-full')}>
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-white mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={twMerge(
            'w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-white placeholder:text-white/30',
            'focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-all duration-200 resize-y min-h-[120px]',
            error && 'border-[var(--color-accent)] focus:ring-[var(--color-accent)]',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={clsx(errorId, hintId)}
          {...props}
        />
        {error && (
          <p id={errorId} className="mt-1.5 text-sm text-[var(--color-accent)]" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className="mt-1.5 text-sm text-white/40">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';