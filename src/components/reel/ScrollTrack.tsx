/**
 * GRAVEN - ScrollTrack Component
 * The tall container that drives the entire reel
 */

import { forwardRef, HTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface ScrollTrackProps extends HTMLAttributes<HTMLDivElement> {
  heightMobile?: number;  // vh
  heightDesktop?: number; // vh
  children: React.ReactNode;
}

export const ScrollTrack = forwardRef<HTMLDivElement, ScrollTrackProps>(
  ({ heightMobile = 360, heightDesktop = 500, className, children, ...props }, ref) => (
    <div
      ref={ref}
      role="section"
      aria-label="Drafting reel"
      className={clsx(
        'relative',
        `h-[${heightMobile}vh]`,
        `md:h-[${heightDesktop}vh]`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

ScrollTrack.displayName = 'ScrollTrack';