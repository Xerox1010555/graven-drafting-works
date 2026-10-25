# GRAVEN / DRAFTING WORKS

A cinematic long-scroll landing page for an industrial-design drafting studio.  
One blueprint video is pinned full-bleed on a sticky stage; **scroll is the only thing that moves the playhead** — the sheet draws itself from a blank ground to a finished, dimensioned drawing as you trace down the page.

## ✨ Features

- **Scroll-scrub video** — Single video, no autoplay, controlled entirely by scroll position with damped spring physics
- **4 Caption beats** — Non-overlapping progress windows with blur-fade-up entrance animations and drawn dimension lines
- **Responsive** — 360vh mobile / 500vh desktop track heights
- **Reduced motion support** — Direct seeks, instant reveals, no animation when `prefers-reduced-motion: reduce`
- **TypeScript + Tailwind CSS v4** — Strict typing, CSS-first theming with custom properties
- **Multi-page** — Work portfolio, Methodology, Studio, Contact pages with React Router
- **Contact form** — React Hook Form + Zod validation, Turnstile protection, Resend email
- **Analytics** — Privacy-first Plausible with custom events (beat views, scroll depth, CTA clicks)
- **SEO ready** — JSON-LD structured data, Open Graph, Twitter Cards, sitemap.xml, robots.txt
- **Visual regression** — Playwright screenshot testing at 6 desktop + 6 mobile checkpoints
- **CI/CD** — GitHub Actions: lint, typecheck, test, build, visual regression, Lighthouse CI, deploy to Vercel

## 🛠 Tech Stack

| Category  | Technology                                                     |
| --------- | -------------------------------------------------------------- |
| Framework | React 18 + TypeScript                                          |
| Build     | Vite 5                                                         |
| Styling   | Tailwind CSS v4 (CSS-first, `@theme`)                          |
| Routing   | React Router v6                                                |
| Forms     | React Hook Form + Zod + @hookform/resolvers                    |
| Icons     | Lucide React                                                   |
| Video     | HLS.js (adaptive) + MP4 fallback                               |
| Analytics | Plausible (privacy-first)                                      |
| Testing   | Vitest + React Testing Library (unit), Playwright (E2E/visual) |
| CI/CD     | GitHub Actions → Vercel                                        |
| Fonts     | Inter Tight (Display) + IBM Plex Mono (Annotations)            |

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
graven-drafting-works/
├── .github/workflows/       # CI/CD pipelines
├── public/                  # Static assets (favicon, manifest, robots.txt)
├── scripts/                 # Build-time scripts (shoot, sitemap, poster extraction)
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable primitives (Button, Input, Card, Modal, Toast)
│   │   ├── layout/          # Navbar, Footer
│   │   ├── reel/            # Scroll-track, StickyStage, ScrubVideo, Beats, Overlays, ProgressRail
│   │   └── forms/           # ContactForm, NewsletterForm
│   ├── hooks/               # Custom hooks (scroll, video, beats, analytics)
│   ├── utils/               # Math, video, analytics, SEO helpers
│   ├── data/                # Site config, beats, constants
│   ├── types/               # TypeScript type definitions
│   ├── styles/              # Global CSS, animations, print styles
│   ├── pages/               # Page components (Index, Work, Method, Studio, Contact, NotFound)
│   ├── App.tsx              # App root with routing + providers
│   └── main.tsx             # Entry point
├── tests/
│   ├── unit/                # Unit tests
│   ├── e2e/                 # Playwright E2E tests
│   └── visual/              # Visual regression baselines
├── index.html               # HTML template with full meta tags
├── package.json
├── tsconfig.json
├── vite.config.ts
├── playwright.config.ts
├── vitest.config.ts
├── eslint.config.js
└── .prettierrc
```

## 🎬 The Scroll-Scrub Mechanic

The core experience is a single `<video>` element pinned in a sticky stage. A tall scroll track (360–500vh) drives a requestAnimationFrame loop:

```typescript
// Progress calculation
const progress = clamp01(scrollY / (trackHeight - viewportHeight));

// Damped spring for smooth scrubbing (disabled for reduced motion)
currentTime += (targetTime - currentTime) * 0.1;

// Beat windows (non-overlapping)
BEATS = [
  { window: [0.06, 0.28] }, // THE SHEET
  { window: [0.3, 0.52] }, // THE FRAME
  { window: [0.54, 0.76] }, // THE SECTION
  { window: [0.78, 1.0] }, // THE BUILD
];
```

Each beat has:

- **Reveal animation** — blur-fade-up (1.1s) + rule draw (1.1s), triggered once
- **Fade in/out** — Smoothstep easing at window edges (12% in, 18% out)
- **Alignment** — left, right, or center with responsive layout

## 📝 Available Scripts

| Script                     | Description                                             |
| -------------------------- | ------------------------------------------------------- |
| `npm run dev`              | Start dev server with HMR                               |
| `npm run build`            | Type-check + production build to `dist/`                |
| `npm run preview`          | Serve production build locally                          |
| `npm run lint`             | Run ESLint                                              |
| `npm run lint:fix`         | Auto-fix ESLint issues                                  |
| `npm run format`           | Format with Prettier                                    |
| `npm run typecheck`        | TypeScript type checking                                |
| `npm run test`             | Run unit tests (watch mode)                             |
| `npm run test:run`         | Run unit tests once with coverage                       |
| `npm run e2e`              | Run Playwright E2E tests                                |
| `npm run shoot`            | Visual regression screenshots (requires preview server) |
| `npm run generate:sitemap` | Generate sitemap.xml in dist/                           |
| `npm run extract:poster`   | Extract first video frame as poster.webp/avif           |
| `npm run analyze`          | Bundle analysis with vite-bundle-analyzer               |

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
VITE_SITE_URL=https://your-domain.com
VITE_ANALYTICS_DOMAIN=your-domain.com
VITE_CONTACT_API_URL=/api/contact
VITE_NEWSLETTER_API_URL=/api/newsletter
VITE_TURNSTILE_SITE_KEY=your-turnstile-key
```

### Video Setup

1. Upload your blueprint video to a streaming provider (Mux, Cloudflare Stream)
2. Update `VIDEO_CONFIG` in `src/data/site.ts`:
   ```typescript
   export const VIDEO_CONFIG: VideoConfig = {
     src: 'https://your-stream.mux.com/xxx.m3u8', // HLS manifest
     poster: '/poster.webp', // Generated via `npm run extract:poster`
     fallbackSrc: 'https://your-cdn.com/video.mp4', // MP4 fallback
     mimeType: 'application/vnd.apple.mpegurl',
     duration: 30,
     dimensions: { width: 1920, height: 1080 },
   };
   ```
3. Run `npm run extract:poster` after deploying to generate poster images

### Beats Customization

Edit `src/data/beats.ts` to modify the four caption beats. Each beat requires:

- `window: [start, end]` — Progress range (0–1), non-overlapping
- `align: 'left' | 'right' | 'center'`
- `heading`, `sub`, `specs: [['LABEL', 'value']]`
- Optional: `highlight`, `cta`

Run `npm run typecheck` to validate beat windows don't overlap.

## ♿ Accessibility

- **WCAG 2.1 AA** compliant
- Semantic HTML (`<main>`, `<section>`, `<article>`, `<nav>`)
- Keyboard navigation: Arrow keys → next/prev beat, Home/End → first/last
- Live region for beat announcements
- `prefers-reduced-motion` fully supported
- Focus indicators on all interactive elements
- Color contrast ratios ≥ 4.5:1
- ARIA labels on icon-only buttons

## 🧪 Testing

### Unit Tests (Vitest)

```bash
npm run test:run
```

Tests for hooks, utils, and pure components in `tests/unit/`.

### E2E Tests (Playwright)

```bash
npm run e2e
```

Full scroll journey, form submission, navigation in `tests/e2e/`.

### Visual Regression

```bash
npm run build && npm run preview &
npm run shoot
```

Captures 12 screenshots (6 desktop + 6 mobile) in `shots/`. Compare with baseline in CI.

## 📦 Deployment

### Vercel (Recommended)

1. Connect repository to Vercel
2. Add environment variables from `.env.example`
3. Deploy — automatic preview on PRs, production on main branch

### Netlify

1. Connect repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variables
5. Add Netlify Functions for `/api/contact` and `/api/newsletter`

### Manual

```bash
npm run build
npm run generate:sitemap
# Upload dist/ to any static host
```

## 📊 Performance Targets

| Metric                | Target  |
| --------------------- | ------- |
| LCP                   | < 2.5s  |
| CLS                   | < 0.1   |
| INP                   | < 200ms |
| JS Bundle (gzipped)   | < 100KB |
| Video initial segment | < 2MB   |
| Lighthouse Score      | ≥ 90    |

## 🔒 Security

- CSP headers via meta tag / server config
- Turnstile/hCaptcha on forms
- Rate limiting on API endpoints
- Input sanitization (Zod server-side validation)
- No sensitive data in client bundle
- HTTPS only, HSTS enabled

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `npm run lint && npm run typecheck && npm run test:run`
5. Submit a PR

## 📞 Support

- Email: hello@graven-drafting-works.com
- Issues: GitHub Issues

---

**GRAVEN / DRAFTING WORKS** — _Drawn before it's built._
