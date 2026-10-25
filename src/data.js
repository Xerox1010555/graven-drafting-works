export const VIDEO_URL =
  'https://zxdefgavgwfxastwmmjm.supabase.co/storage/v1/object/public/assets/graven.mp4';

export const NAV_LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'Method', href: '#method' },
  { label: 'The Studio', href: '#studio' },
  { label: 'Contact', href: '#contact' },
];

/*
 * Scroll beats — caption windows over the pinned sheet.
 * Each window is a [start, end] pair of track progress; windows never
 * overlap, so only one beat reads at a time.
 */
export const BEATS = [
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
    ],
  },
  {
    rail: '02 · THE FRAME',
    kicker: '02 · THE FRAME',
    window: [0.3, 0.52],
    align: 'right',
    heading: 'Lines find their order.',
    sub: 'Construction lines lay down the geometry — axes, centres, and the bones the drawing will hang on.',
    specs: [
      ['AXES', '3'],
      ['TOLERANCE', '±0.1mm'],
      ['PROJECTION', 'first-angle'],
    ],
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
    ],
  },
  {
    rail: '04 · THE BUILD',
    kicker: '04 · THE BUILD',
    window: [0.78, 1.0],
    align: 'center',
    heading: 'Ready to make.',
    highlight: 'make',
    sub: 'Fully dimensioned, checked, and signed. The line becomes a thing you can hold.',
    specs: [
      ['STATUS', 'released'],
      ['CHECKED', 'yes'],
      ['SHEETS', '6'],
    ],
    cta: true,
  },
];
