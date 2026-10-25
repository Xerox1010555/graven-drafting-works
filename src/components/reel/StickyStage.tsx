/**
 * GRAVEN - StickyStage Component
 * The pinned stage that holds the video and overlays
 */

import { forwardRef, HTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface StickyStageProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const StickyStage = forwardRef<HTMLDivElement, StickyStageProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx(
        'sticky top-0 h-screen w-full overflow-hidden bg-[var(--color-bg)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

StickyStage.displayName = 'StickyStage';