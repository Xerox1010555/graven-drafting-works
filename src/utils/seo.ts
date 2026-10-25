/**
 * GRAVEN - SEO Utilities
 * JSON-LD structured data, meta tags, sitemap generation
 */

import type { SiteConfig, Beat } from '../types/index.ts';
import { SITE_CONFIG, BEATS } from '../data/index.ts';

/**
 * Generate Organization JSON-LD
 */
export function generateOrganizationJsonLd(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'GRAVEN Drafting Works',
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/logo.svg`,
    sameAs: [
      'https://linkedin.com/company/graven-drafting-works',
      'https://twitter.com/graven_drafting',
      'https://instagram.com/graven_drafting',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-000-000-0000',
      contactType: 'customer service',
      email: SITE_CONFIG.contactEmail,
      availableLanguage: ['English'],
    },
  };
}

/**
 * Generate WebSite JSON-LD with SearchAction
 */
export function generateWebSiteJsonLd(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_CONFIG.url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generate VideoObject JSON-LD for the blueprint video
 */
export function generateVideoObjectJsonLd(videoUrl: string, posterUrl: string): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: 'GRAVEN Drafting Works — Blueprint Reel',
    description: 'Watch the drafting process unfold from blank sheet to finished technical drawing.',
    thumbnailUrl: `${SITE_CONFIG.url}${posterUrl}`,
    uploadDate: new Date().toISOString().split('T')[0],
    duration: 'PT30S',
    contentUrl: videoUrl,
    embedUrl: `${SITE_CONFIG.url}/`,
    interactionStatistic: {
      '@type': 'InteractionCounter',
      interactionType: { '@type': 'WatchAction' },
      userInteractionCount: 0,
    },
  };
}

/**
 * Generate BreadcrumbList JSON-LD
 */
export function generateBreadcrumbJsonLd(items: { name: string; url: string }[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate FAQ JSON-LD (for contact/method pages)
 */
export function generateFaqJsonLd(faqs: { question: string; answer: string }[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate all JSON-LD for the landing page
 */
export function generateLandingPageJsonLd(videoUrl: string, posterUrl: string): object[] {
  return [
    generateOrganizationJsonLd(),
    generateWebSiteJsonLd(),
    generateVideoObjectJsonLd(videoUrl, posterUrl),
    generateBreadcrumbJsonLd([
      { name: 'Home', url: SITE_CONFIG.url },
    ]),
  ];
}

/**
 * Generate meta tags for a page
 */
export interface MetaTags {
  title: string;
  description: string;
  canonical: string;
  ogType: 'website' | 'article';
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
  twitterCard: 'summary_large_image';
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  twitterSite: string;
  themeColor: string;
}

export function generateMetaTags(overrides: Partial<MetaTags> = {}): MetaTags {
  const base: MetaTags = {
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    canonical: SITE_CONFIG.url,
    ogType: 'website',
    ogTitle: SITE_CONFIG.name,
    ogDescription: SITE_CONFIG.description,
    ogImage: SITE_CONFIG.ogImage,
    ogUrl: SITE_CONFIG.url,
    twitterCard: 'summary_large_image',
    twitterTitle: SITE_CONFIG.name,
    twitterDescription: SITE_CONFIG.description,
    twitterImage: SITE_CONFIG.ogImage,
    twitterSite: SITE_CONFIG.twitterHandle,
    themeColor: '#0c0f13',
  };
  return { ...base, ...overrides };
}

/**
 * Generate beat-specific meta tags (for deep linking)
 */
export function generateBeatMetaTags(beatIndex: number): MetaTags {
  const beat = BEATS[beatIndex];
  if (!beat) return generateMetaTags();

  return generateMetaTags({
    title: `${beat.kicker} — ${SITE_CONFIG.name}`,
    description: beat.sub,
    canonical: `${SITE_CONFIG.url}/?beat=${beatIndex + 1}`,
    ogTitle: `${beat.kicker} — ${SITE_CONFIG.name}`,
    ogDescription: beat.sub,
    ogUrl: `${SITE_CONFIG.url}/?beat=${beatIndex + 1}`,
    twitterTitle: `${beat.kicker} — ${SITE_CONFIG.name}`,
    twitterDescription: beat.sub,
  });
}

/**
 * Inject JSON-LD into document head
 */
export function injectJsonLd(data: object | object[], id?: string): HTMLScriptElement | HTMLScriptElement[] {
  const scripts = Array.isArray(data) ? data : [data];
  return scripts.map((item, index) => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id ? `${id}-${index}` : `jsonld-${index}`;
    script.textContent = JSON.stringify(item, null, 2);
    document.head.appendChild(script);
    return script;
  }) as HTMLScriptElement | HTMLScriptElement[];
}

/**
 * Remove JSON-LD scripts by ID prefix
 */
export function removeJsonLd(idPrefix: string): void {
  document.querySelectorAll(`script[id^="${idPrefix}"]`).forEach(s => s.remove());
}

/**
 * Update meta tags in document head
 */
export function updateMetaTags(tags: Partial<MetaTags>): void {
  const updates: Record<string, string> = {};

  if (tags.title) updates['title'] = tags.title;
  if (tags.description) updates['meta[name="description"]'] = tags.description;
  if (tags.canonical) updates['link[rel="canonical"]'] = tags.canonical;
  if (tags.ogTitle) updates['meta[property="og:title"]'] = tags.ogTitle;
  if (tags.ogDescription) updates['meta[property="og:description"]'] = tags.ogDescription;
  if (tags.ogImage) updates['meta[property="og:image"]'] = tags.ogImage;
  if (tags.ogUrl) updates['meta[property="og:url"]'] = tags.ogUrl;
  if (tags.ogType) updates['meta[property="og:type"]'] = tags.ogType;
  if (tags.twitterTitle) updates['meta[name="twitter:title"]'] = tags.twitterTitle;
  if (tags.twitterDescription) updates['meta[name="twitter:description"]'] = tags.twitterDescription;
  if (tags.twitterImage) updates['meta[name="twitter:image"]'] = tags.twitterImage;
  if (tags.twitterCard) updates['meta[name="twitter:card"]'] = tags.twitterCard;
  if (tags.twitterSite) updates['meta[name="twitter:site"]'] = tags.twitterSite;
  if (tags.themeColor) updates['meta[name="theme-color"]'] = tags.themeColor;

  Object.entries(updates).forEach(([selector, content]) => {
    let element: HTMLMetaElement | HTMLLinkElement | HTMLTitleElement | null = null;

    if (selector === 'title') {
      element = document.title !== content ? document.querySelector('title') : null;
      if (element) element.textContent = content;
    } else if (selector.startsWith('meta[')) {
      element = document.querySelector(selector) as HTMLMetaElement;
      if (element) element.setAttribute('content', content);
      else {
        element = document.createElement('meta');
        const [, attr, value] = selector.match(/meta\[(property|name)="([^"]+)"\]/) || [];
        if (attr && value) {
          element.setAttribute(attr, value);
          element.setAttribute('content', content);
          document.head.appendChild(element);
        }
      }
    } else if (selector.startsWith('link[')) {
      element = document.querySelector(selector) as HTMLLinkElement;
      if (element) element.setAttribute('href', content);
      else {
        element = document.createElement('link');
        const [, attr, value] = selector.match(/link\[rel="([^"]+)"\]/) || [];
        if (attr && value) {
          element.setAttribute('rel', attr);
          element.setAttribute('href', content);
          document.head.appendChild(element);
        }
      }
    }
  });
}

/**
 * Generate sitemap.xml content
 */
export function generateSitemap(pages: { url: string; lastmod?: string; changefreq?: string; priority?: number }[]): string {
  const today = new Date().toISOString().split('T')[0];
  const urls = pages.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod || today}</lastmod>
    <changefreq>${page.changefreq || 'weekly'}</changefreq>
    <priority>${page.priority ?? 0.8}</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

/**
 * Generate robots.txt content
 */
export function generateRobotsTxt(sitemapUrl: string): string {
  return `# GRAVEN Drafting Works
User-agent: *
Allow: /

Sitemap: ${sitemapUrl}

# Crawl-delay for respectful crawling
Crawl-delay: 10
`;
}