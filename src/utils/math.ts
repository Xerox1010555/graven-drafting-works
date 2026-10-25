/**
 * GRAVEN - Math Utilities
 * Pure mathematical functions for animations and calculations
 */

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Clamp between 0 and 1
 */
export function clamp01(value: number): number {
  return clamp(value, 0, 1);
}

/**
 * Linear interpolation
 */
export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

/**
 * Smoothstep interpolation (cubic Hermite)
 * Provides smooth easing at edges: t * t * (3 - 2 * t)
 */
export function smoothstep(t: number): number {
  const clamped = clamp01(t);
  return clamped * clamped * (3 - 2 * clamped);
}

/**
 * Smootherstep interpolation (quintic)
 * Even smoother: t * t * t * (t * (t * 6 - 15) + 10)
 */
export function smootherstep(t: number): number {
  const clamped = clamp01(t);
  return clamped * clamped * clamped * (clamped * (clamped * 6 - 15) + 10);
}

/**
 * Ease out cubic
 */
export function easeOutCubic(t: number): number {
  const clamped = clamp01(t);
  return 1 - Math.pow(1 - clamped, 3);
}

/**
 * Ease in out cubic
 */
export function easeInOutCubic(t: number): number {
  const clamped = clamp01(t);
  return clamped < 0.5
    ? 4 * clamped * clamped * clamped
    : 1 - Math.pow(-2 * clamped + 2, 3) / 2;
}

/**
 * Map value from one range to another
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return outMin + ((value - inMin) * (outMax - outMin)) / (inMax - inMin);
}

/**
 * Calculate scroll progress (0-1) based on scroll position
 */
export function calculateScrollProgress(
  scrollY: number,
  trackHeight: number,
  viewportHeight: number
): number {
  const denominator = Math.max(trackHeight - viewportHeight, 1);
  return clamp01(scrollY / denominator);
}

/**
 * Damped spring calculation for smooth scrubbing
 * current += (target - current) * damping
 */
export function dampedSpring(
  current: number,
  target: number,
  damping: number
): number {
  return current + (target - current) * damping;
}

/**
 * Check if two ranges overlap
 */
export function rangesOverlap(
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number
): boolean {
  return aStart < bEnd && bStart < aEnd;
}

/**
 * Get the intersection of two ranges, or null if no overlap
 */
export function getRangeIntersection(
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number
): [number, number] | null {
  const start = Math.max(aStart, bStart);
  const end = Math.min(aEnd, bEnd);
  return start < end ? [start, end] : null;
}

/**
 * Round to specified decimal places
 */
export function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Format number with fixed decimal places as string
 */
export function toFixedString(value: number, decimals: number): string {
  return value.toFixed(decimals);
}

/**
 * Convert degrees to radians
 */
export function degToRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Convert radians to degrees
 */
export function radToDeg(radians: number): number {
  return radians * (180 / Math.PI);
}

/**
 * Generate a unique ID (simple, not cryptographically secure)
 */
export function generateId(prefix = ''): string {
  return `${prefix}${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}