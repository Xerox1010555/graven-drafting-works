import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SITE_URL = process.env.SITE_URL || 'https://graven-drafting-works.com';

const pages = [
  { url: `${SITE_URL}/`, lastmod: new Date().toISOString().split('T')[0], changefreq: 'weekly', priority: 1.0 },
  { url: `${SITE_URL}/work`, lastmod: new Date().toISOString().split('T')[0], changefreq: 'weekly', priority: 0.9 },
  { url: `${SITE_URL}/method`, lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: 0.8 },
  { url: `${SITE_URL}/studio`, lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: 0.8 },
  { url: `${SITE_URL}/contact`, lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: 0.7 },
];

function generateSitemap(pages) {
  const urls = pages.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

const sitemap = generateSitemap(pages);
const outPath = join(__dirname, '../dist/sitemap.xml');
writeFileSync(outPath, sitemap);
console.log(`Sitemap generated at ${outPath}`);