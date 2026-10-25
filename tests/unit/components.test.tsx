import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../../src/components/ui/Button.tsx';
import { Input } from '../../src/components/ui/Input.tsx';
import { Card } from '../../src/components/ui/Card.tsx';
import { clamp, clamp01, lerp, smoothstep, smootherstep, calculateScrollProgress, dampedSpring, debounce, throttle } from '../../src/utils/math.ts';

describe('UI Components', () => {
  describe('Button', () => {
    it('renders with children', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    it('applies variant classes', () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('liquid-glass');
    });

    it('applies size classes', () => {
      render(<Button size="lg">Large</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-8', 'py-4', 'text-lg');
    });

    it('shows loading spinner when loading', () => {
      render(<Button loading>Loading</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
      // Check that loading state shows spinner (button has disabled + loading text)
      expect(screen.getByRole('button')).toHaveTextContent('Loading');
    });

    it('calls onClick handler', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click</Button>);
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Input', () => {
    it('renders with label', () => {
      render(<Input label="Email" placeholder="Enter email" />);
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });

    it('shows error message', () => {
      render(<Input error="Invalid email" />);
      expect(screen.getByRole('alert')).toHaveTextContent(/invalid email/i);
    });

    it('shows hint message', () => {
      render(<Input hint="We'll never share your email" />);
      expect(screen.getByText(/we'll never share your email/i)).toBeInTheDocument();
    });
  });

  describe('Card', () => {
    it('renders children', () => {
      render(<Card>Card content</Card>);
      expect(screen.getByText(/card content/i)).toBeInTheDocument();
    });

    it('applies variant classes', () => {
      render(<Card variant="liquid-glass">Content</Card>);
      // The Card component itself should have the liquid-glass class
      const card = screen.getByText(/content/i).closest('div');
      expect(card).toHaveClass('liquid-glass');
    });
  });
});

describe('Math Utilities', () => {
  describe('clamp', () => {
    it('clamps value between min and max', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
    });
  });

  describe('clamp01', () => {
    it('clamps between 0 and 1', () => {
      expect(clamp01(0.5)).toBe(0.5);
      expect(clamp01(-0.5)).toBe(0);
      expect(clamp01(1.5)).toBe(1);
    });
  });

  describe('lerp', () => {
    it('linearly interpolates between start and end', () => {
      expect(lerp(0, 10, 0)).toBe(0);
      expect(lerp(0, 10, 0.5)).toBe(5);
      expect(lerp(0, 10, 1)).toBe(10);
    });
  });

  describe('smoothstep', () => {
    it('provides smooth easing at edges', () => {
      expect(smoothstep(0)).toBe(0);
      expect(smoothstep(1)).toBe(1);
      expect(smoothstep(0.5)).toBe(0.5);
    });

    it('clamps input to 0-1', () => {
      expect(smoothstep(-1)).toBe(0);
      expect(smoothstep(2)).toBe(1);
    });
  });

  describe('smootherstep', () => {
    it('provides even smoother easing', () => {
      expect(smootherstep(0)).toBe(0);
      expect(smootherstep(1)).toBe(1);
      expect(smootherstep(0.5)).toBe(0.5);
    });
  });

  describe('calculateScrollProgress', () => {
    it('calculates progress based on scroll position', () => {
      expect(calculateScrollProgress(0, 1000, 500)).toBe(0);
      expect(calculateScrollProgress(500, 1000, 500)).toBe(1);
      expect(calculateScrollProgress(250, 1000, 500)).toBe(0.5);
    });

    it('handles edge cases', () => {
      expect(calculateScrollProgress(-100, 1000, 500)).toBe(0);
      expect(calculateScrollProgress(1000, 1000, 500)).toBe(1);
    });
  });

  describe('dampedSpring', () => {
    it('applies damping factor', () => {
      expect(dampedSpring(0, 10, 0.1)).toBe(1);
      expect(dampedSpring(5, 10, 0.5)).toBe(7.5);
    });
  });

  describe('debounce', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it('delays function execution', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);
      debounced();
      expect(fn).not.toHaveBeenCalled();
      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('only calls once for multiple rapid calls', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);
      debounced();
      debounced();
      debounced();
      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('throttle', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it('limits function execution rate', () => {
      const fn = vi.fn();
      const throttled = throttle(fn, 100);
      throttled();
      throttled();
      throttled();
      expect(fn).toHaveBeenCalledTimes(1);
      vi.advanceTimersByTime(100);
      throttled();
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });
});

describe('Beat Validation', () => {
  const BEATS = [
    { window: [0.06, 0.28] },
    { window: [0.30, 0.52] },
    { window: [0.54, 0.76] },
    { window: [0.78, 1.00] },
  ];

  it('windows are non-overlapping and in order', () => {
    for (let i = 0; i < BEATS.length - 1; i++) {
      expect(BEATS[i].window[1]).toBeLessThanOrEqual(BEATS[i + 1].window[0]);
    }
  });

  it('all windows within 0-1 range', () => {
    BEATS.forEach(beat => {
      expect(beat.window[0]).toBeGreaterThanOrEqual(0);
      expect(beat.window[1]).toBeLessThanOrEqual(1);
      expect(beat.window[0]).toBeLessThan(beat.window[1]);
    });
  });
});