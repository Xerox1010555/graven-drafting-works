/**
 * GRAVEN - Overlay Components
 * Visual overlays for the blueprint aesthetic
 */

import { forwardRef, HTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface OverlayProps extends HTMLAttributes<HTMLDivElement> {}

export const BlueprintGrid = forwardRef<HTMLDivElement, OverlayProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx('blueprint-grid pointer-events-none absolute inset-0 z-[1]', className)}
      aria-hidden="true"
      {...props}
    />
  )
);

BlueprintGrid.displayName = 'BlueprintGrid';

export const ColdScrim = forwardRef<HTMLDivElement, OverlayProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx('cold-scrim pointer-events-none absolute inset-0 z-[2]', className)}
      aria-hidden="true"
      {...props}
    />
  )
);

ColdScrim.displayName = 'ColdScrim';

export const FilmGrain = forwardRef<HTMLDivElement, OverlayProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx('grain pointer-events-none absolute inset-0 z-[3]', className)}
      aria-hidden="true"
      {...props}
    />
  )
);

FilmGrain.displayName = 'FilmGrain';