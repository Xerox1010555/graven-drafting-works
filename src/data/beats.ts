/**
 * GRAVEN - Beat Definitions
 * The four caption windows over the pinned blueprint video
 * Windows are non-overlapping so only one beat reads at a time
 */

import type { Beat, BeatSpec } from '../types/index.ts';

export const BEATS: Beat[] = [
  {
    rail: '01 · THE SHEET',
    kicker: '01 · THE SHEET',
    window: [0.06, 0.28],
    align: 'left',
    heading: 'A blank field.',
    sub: 'It starts with nothing but a border and a title block — the whole object still only an intention.',
    specs: [
      ['SIZE', 'A1'],
      ['MEDIUM', 'vellum'],
      ['MARKS', '0'],
    ] as BeatSpec[],
  },
  {
    rail: '02 · THE FRAME',
    kicker: '02 · THE FRAME',
    window: [0.30, 0.52],
    align: 'right',
    heading: 'Lines find their order.',
    sub: 'Construction lines lay down the geometry — axes, centres, and the bones the drawing will hang on.',
    specs: [
      ['AXES', '3'],
      ['TOLERANCE', '±0.1mm'],
      ['PROJECTION', 'first-angle'],
    ] as BeatSpec[],
  },
  {
    rail: '03 · THE SECTION',
    kicker: '03 · THE SECTION',
    window: [0.54, 0.76],
    align: 'left',
    heading: 'Cut it open.',
    sub: 'A section reveals the inside — hatching, wall thickness, and how every part meets the next.',
    specs: [
      ['CUT', 'A–A'],
      ['HATCH', '45°'],
      ['WALL', '2.4mm'],
    ] as BeatSpec[],
  },
  {
    rail: '04 · THE BUILD',
    kicker: '04 · THE BUILD',
    window: [0.78, 1.00],
    align: 'center',
    heading: 'Ready to make.',
    highlight: 'make',
    sub: 'Fully dimensioned, checked, and signed. The line becomes a thing you can hold.',
    specs: [
      ['STATUS', 'released'],
      ['CHECKED', 'yes'],
      ['SHEETS', '6'],
    ] as BeatSpec[],
    cta: true,
  },
];

// Beat window validation (run at build time in development)
export function validateBeats(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check windows are non-overlapping and in order
  for (let i = 0; i < BEATS.length - 1; i++) {
    const current = BEATS[i]!;
    const next = BEATS[i + 1]!;

    if (current.window[1] > next.window[0]) {
      errors.push(`Beat ${i} (${current.kicker}) overlaps with Beat ${i + 1} (${next.kicker})`);
    }

    if (current.window[0] >= current.window[1]) {
      errors.push(`Beat ${i} (${current.kicker}) has invalid window: start >= end`);
    }

    if (current.window[0] < 0 || current.window[1] > 1) {
      errors.push(`Beat ${i} (${current.kicker}) window out of bounds [0, 1]`);
    }
  }

  // Check last beat
  const last = BEATS[BEATS.length - 1]!;
  if (last.window[0] >= last.window[1]) {
    errors.push(`Last beat (${last.kicker}) has invalid window`);
  }

  // Check required fields
  BEATS.forEach((beat, i) => {
    if (!beat.kicker) errors.push(`Beat ${i} missing kicker`);
    if (!beat.heading) errors.push(`Beat ${i} missing heading`);
    if (!beat.sub) errors.push(`Beat ${i} missing sub`);
    if (!beat.specs || beat.specs.length === 0) errors.push(`Beat ${i} missing specs`);
    if (!['left', 'right', 'center'].includes(beat.align)) {
      errors.push(`Beat ${i} invalid align: ${beat.align}`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Get active beat index for a given progress
export function getActiveBeatIndex(progress: number): number {
  for (let i = BEATS.length - 1; i >= 0; i--) {
    const beat = BEATS[i]!;
    if (progress >= beat.window[0] - 1e-6) {
      return i;
    }
  }
  return -1;
}

// Get beat by index with bounds checking
export function getBeat(index: number): Beat | null {
  if (index >= 0 && index < BEATS.length) {
    return BEATS[index]!;
  }
  return null;
}

// Get progress range for a beat
export function getBeatProgressRange(index: number): [number, number] | null {
  const beat = getBeat(index);
  return beat ? beat.window : null;
}

export const BEAT_COUNT = BEATS.length;
export const TOTAL_BEAT_WINDOW_START = BEATS[0]!.window[0];
export const TOTAL_BEAT_WINDOW_END = BEATS[BEATS.length - 1]!.window[1];