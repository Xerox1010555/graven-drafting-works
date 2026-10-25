/**
 * GRAVEN - Site Configuration
 * Centralized site metadata and constants
 */

import type { SiteConfig, NavLink, VideoConfig } from '../types/index.ts';

export const SITE_CONFIG: SiteConfig = {
  name: 'GRAVEN / DRAFTING WORKS',
  tagline: 'Drawn before it\'s built.',
  description: 'A studio that draws objects before they exist. Industrial design drafting, technical illustration, and manufacturing-ready documentation.',
  url: 'https://graven-drafting-works.com',
  ogImage: '/og-default.jpg',
  twitterHandle: '@graven_drafting',
  contactEmail: 'hello@graven-drafting-works.com',
};

export const NAV_LINKS: NavLink[] = [
  { label: 'Work', href: '/work' },
  { label: 'Method', href: '/method' },
  { label: 'The Studio', href: '/studio' },
  { label: 'Contact', href: '/contact' },
];

export const FOOTER_LINKS: NavLink[] = [
  { label: 'Work', href: '/work' },
  { label: 'Method', href: '/method' },
  { label: 'Studio', href: '/studio' },
  { label: 'Contact', href: '/contact' },
];

// Video configuration - UPDATE THESE URLs when video is hosted
export const VIDEO_CONFIG: VideoConfig = {
  src: 'https://zxdefgavgwfxastwmmjm.supabase.co/storage/v1/object/public/assets/graven.mp4', // Replace with HLS manifest when available
  poster: '/poster.webp',           // Generated at build time
  fallbackSrc: 'https://zxdefgavgwfxastwmmjm.supabase.co/storage/v1/object/public/assets/graven.mp4',
  mimeType: 'video/mp4',            // Will be 'application/vnd.apple.mpegurl' for HLS
  duration: 30,                     // Approximate duration in seconds
  dimensions: { width: 1920, height: 1080 },
};

// Reel track heights (viewport heights)
export const TRACK_HEIGHTS = {
  mobile: 360,   // 360vh
  desktop: 500,  // 500vh
} as const;

// Animation timing constants
export const ANIMATION = {
  heroFade: 0.06,      // Hero fades out over first 6% of scroll
  edgeIn: 0.12,        // Fraction of beat window for fade in
  edgeOut: 0.18,       // Fraction of beat window for fade out (last beat never fades out)
  revealThreshold: 0.015, // Progress ahead of window start to trigger reveal
  damping: 0.1,        // Video scrub damping factor
  reducedMotionDamping: 1, // Direct seek for reduced motion
} as const;

// Progress rail
export const PROGRESS_RAIL = {
  height: 160,         // Height in pixels (desktop)
  mobileHeight: 120,   // Height in pixels (mobile, if shown)
} as const;

// Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// Form constants
export const FORM_CONSTANTS = {
  projectTypes: [
    { value: 'industrial', label: 'Industrial Equipment' },
    { value: 'product', label: 'Consumer Product' },
    { value: 'architectural', label: 'Architectural/Structural' },
    { value: 'other', label: 'Other' },
  ] as const,
  budgetRanges: [
    { value: 'under-10k', label: 'Under $10,000' },
    { value: '10k-50k', label: '$10,000 - $50,000' },
    { value: '50k-100k', label: '$50,000 - $100,000' },
    { value: '100k+', label: '$100,000+' },
  ] as const,
  timelines: [
    { value: 'asap', label: 'ASAP' },
    { value: '1-month', label: 'Within 1 Month' },
    { value: '3-months', label: 'Within 3 Months' },
    { value: 'flexible', label: 'Flexible' },
  ] as const,
} as const;

// Analytics event names
export const ANALYTICS_EVENTS = {
  beatViewed: 'beat_viewed',
  ctaClick: 'cta_click',
  scrollDepth: 'scroll_depth',
  videoScrub: 'video_scrub',
  formSubmit: 'form_submit',
  pageView: 'page_view',
  videoPlay: 'video_play',
  videoPause: 'video_pause',
  videoError: 'video_error',
  themeToggle: 'theme_toggle',
  frameExport: 'frame_export',
  deepLink: 'deep_link',
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  theme: 'graven-theme',
  reducedMotion: 'graven-reduced-motion',
  analyticsConsent: 'graven-analytics-consent',
  scrollPosition: 'graven-scroll-position',
} as const;

// Social links
export const SOCIAL_LINKS = {
  linkedin: 'https://linkedin.com/company/graven-drafting-works',
  twitter: 'https://twitter.com/graven_drafting',
  instagram: 'https://instagram.com/graven_drafting',
  email: 'mailto:hello@graven-drafting-works.com',
} as const;