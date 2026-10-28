/**
 * GRAVEN - Button Component
 * Versatile button with liquid-glass variant and asChild support
 */

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Slot } from '@radix-ui/react-slot';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'liquid-glass' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      iconLeft,
      iconRight,
      fullWidth = false,
      asChild = false,
      className,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] disabled:opacity-50 disabled:pointer-events-none';

    const variantStyles = {
      primary:
        'bg-[var(--color-cta-bg)] text-[var(--color-cta-fg)] hover:bg-[var(--color-cta-hover)] hover:text-[var(--color-cta-fg)]',
      secondary: 'liquid-glass text-white hover:text-[var(--color-fg-muted)]',
      ghost: 'text-white/70 hover:text-white',
      outline: 'border border-[var(--color-border-strong)] text-white hover:bg-white/5',
      'liquid-glass': 'liquid-glass text-white hover:text-[var(--color-fg-muted)]',
    };

    const sizeStyles = {
      sm: 'px-4 py-2 text-sm rounded-full gap-2',
      md: 'px-6 py-3 text-base rounded-full gap-2.5',
      lg: 'px-8 py-4 text-lg rounded-full gap-3',
    };

    const widthStyles = fullWidth ? 'w-full' : '';

    const Comp = asChild ? Slot : 'button';

    // Radix Slot requires exactly one React element child — inject extras only for real buttons.
    const compChildren = asChild ? (
      children
    ) : (
      <>
        {loading && (
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && iconLeft && <span className="flex-shrink-0">{iconLeft}</span>}
        {children}
        {!loading && iconRight && <span className="flex-shrink-0">{iconRight}</span>}
      </>
    );

    return (
      <Comp
        ref={ref}
        className={twMerge(
          clsx(baseStyles, variantStyles[variant], sizeStyles[size], widthStyles, className)
        )}
        disabled={asChild ? undefined : disabled || loading}
        {...props}
      >
        {compChildren}
      </Comp>
    );
  }
);

Button.displayName = 'Button';
