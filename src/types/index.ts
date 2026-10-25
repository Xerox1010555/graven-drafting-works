/**
 * GRAVEN - Type Definitions
 * Centralized type system for the entire application
 */

// ============================================================================
// BEAT SYSTEM
// ============================================================================

export type BeatSpec = [string, string];

export interface Beat {
  rail: string;              // Progress rail label (e.g., '01 · THE SHEET')
  kicker: string;            // Small category label
  window: [number, number];  // [start, end] progress 0-1, non-overlapping
  align: 'left' | 'right' | 'center';
  heading: string;
  highlight?: string;        // Word to highlight in different color
  sub: string;
  specs: BeatSpec[];
  cta?: boolean;
}

// ============================================================================
// NAVIGATION
// ============================================================================

export interface NavLink {
  label: string;
  href: string;
}

// ============================================================================
// SITE CONFIGURATION
// ============================================================================

export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  url: string;
  ogImage: string;
  twitterHandle: string;
  contactEmail: string;
}

// ============================================================================
// VIDEO CONFIGURATION
// ============================================================================

export interface VideoConfig {
  src: string;                    // Primary HLS/DASH manifest URL
  poster: string;                 // WebP/AVIF first frame
  fallbackSrc?: string;           // MP4 fallback URL
  mimeType: 'application/vnd.apple.mpegurl' | 'video/mp4';
  duration?: number;              // Known duration in seconds
  dimensions: { width: number; height: number };
}

export interface VideoState {
  ready: boolean;
  playing: boolean;
  currentTime: number;
  duration: number;
  progress: number;               // 0-1 scrub progress
  error: Error | null;
}

// ============================================================================
// ANALYTICS
// ============================================================================

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, unknown>;
  timestamp?: number;
}

export interface BeatViewedEvent {
  beatIndex: number;
  beatKicker: string;
  dwellTime: number;              // milliseconds spent in this beat window
  entryProgress: number;
  exitProgress: number;
  [key: string]: unknown;
}

export interface CtaClickEvent {
  ctaType: 'primary' | 'secondary' | 'nav' | 'footer';
  beatIndex: number | null;
  label: string;
  href: string;
  [key: string]: unknown;
}

export interface ScrollDepthEvent {
  percent: number;                // 0-100
  maxPercent: number;             // maximum reached in session
  [key: string]: unknown;
}

export interface VideoScrubEvent {
  direction: 'forward' | 'backward';
  velocity: number;               // progress per second
  fromProgress: number;
  toProgress: number;
  [key: string]: unknown;
}

export interface FormSubmitEvent {
  formType: 'contact' | 'newsletter';
  status: 'success' | 'error';
  fields?: string[];
  [key: string]: unknown;
}

// ============================================================================
// FORMS
// ============================================================================

export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  projectType: 'industrial' | 'product' | 'architectural' | 'other';
  budgetRange: 'under-10k' | '10k-50k' | '50k-100k' | '100k+';
  timeline: 'asap' | '1-month' | '3-months' | 'flexible';
  message: string;
  'cf-turnstile-response'?: string;
  // Hidden tracking fields (populated automatically)
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer?: string;
  beatContext?: number;
  pageUrl?: string;
  userAgent?: string;
}

export interface NewsletterFormData {
  email: string;
  source: 'footer' | 'beat-cta' | 'hero' | 'contact-page';
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

export interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isSubmitted: boolean;
  submitError: string | null;
  submitSuccess: boolean;
}

// ============================================================================
// UI STATE
// ============================================================================

export interface ReducedMotionState {
  enabled: boolean;
  mediaQuery: MediaQueryList | null;
}

export interface ViewportState {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export interface ScrollState {
  y: number;
  progress: number;               // 0-1
  maxProgress: number;
  direction: 'up' | 'down' | 'none';
  velocity: number;
}

// ============================================================================
// COMPONENT PROPS
// ============================================================================

export interface BeatOverlayProps {
  beat: Beat;
  index: number;
  revealed: boolean;
  progress: number;
  isActive: boolean;
}

export interface ProgressRailProps {
  progress: number;
  label: string;
  beats: Beat[];
  onBeatClick?: (index: number) => void;
}

export interface VideoPlayerProps {
  src: string;
  poster: string;
  fallbackSrc?: string;
  onReady: (duration: number) => void;
  onTimeUpdate: (currentTime: number) => void;
  onError: (error: Error) => void;
  className?: string;
}

// ============================================================================
// API RESPONSES
// ============================================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ContactSubmissionResponse {
  id: string;
  submittedAt: string;
}

export interface NewsletterSubscriptionResponse {
  id: string;
  verified: boolean;
  verificationSent: boolean;
}

// ============================================================================
// CMS CONTENT (if using headless CMS)
// ============================================================================

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: 'industrial' | 'product' | 'architectural' | 'transport' | 'medical';
  description: string;
  longDescription?: string;
  images: ProjectImage[];
  specs: BeatSpec[];
  client?: string;
  year: number;
  featured: boolean;
}

export interface ProjectImage {
  url: string;
  alt: string;
  width: number;
  height: number;
  type: 'hero' | 'detail' | 'process' | 'render';
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: ProjectImage;
  social: {
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

// ============================================================================
// ENVIRONMENT
// ============================================================================

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      VITE_SITE_URL: string;
      VITE_ANALYTICS_DOMAIN: string;
      VITE_ANALYTICS_API_HOST: string;
      VITE_CONTACT_API_URL: string;
      VITE_NEWSLETTER_API_URL: string;
      VITE_TURNSTILE_SITE_KEY: string;
      TURNSTILE_SECRET_KEY: string;
      RESEND_API_KEY: string;
      CONTACT_EMAIL: string;
      SANITY_PROJECT_ID: string;
      SANITY_DATASET: string;
      SANITY_API_TOKEN: string;
    }
  }
}

export {};