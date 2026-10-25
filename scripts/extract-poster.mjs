import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const URL = process.env.POSTER_URL || 'http://localhost:4173/';
const OUT_DIR = join(__dirname, '../public');
mkdirSync(OUT_DIR, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

await page.goto(URL, { waitUntil: 'domcontentloaded' });

// Wait for video to be ready
await page.waitForFunction(() => {
  const v = document.querySelector('video');
  return v && v.readyState >= 2 && isFinite(v.duration);
}, null, { timeout: 30000 });

// Seek to first frame (slightly in to avoid black frame)
await page.evaluate(() => {
  const v = document.querySelector('video');
  v.currentTime = 0.1;
});

// Wait for seek to complete
await page.waitForFunction(() => {
  const v = document.querySelector('video');
  return !v.seeking;
}, null, { timeout: 5000 });

// Extract frame as WebP and AVIF
const webpDataUrl = await page.evaluate(() => {
  const v = document.querySelector('video');
  const canvas = document.createElement('canvas');
  canvas.width = v.videoWidth;
  canvas.height = v.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/webp', 0.85);
});

const avifDataUrl = await page.evaluate(() => {
  const v = document.querySelector('video');
  const canvas = document.createElement('canvas');
  canvas.width = v.videoWidth;
  canvas.height = v.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/avif', 0.6);
});

await browser.close();

// Save files
const webpBase64 = webpDataUrl.split(',')[1];
const avifBase64 = avifDataUrl.split(',')[1];

writeFileSync(join(OUT_DIR, 'poster.webp'), Buffer.from(webpBase64, 'base64'));
writeFileSync(join(OUT_DIR, 'poster.avif'), Buffer.from(avifBase64, 'base64'));

console.log('Poster extracted:');
console.log(`  ${OUT_DIR}/poster.webp (${Math.round(webpBase64.length * 0.75)} bytes)`);
console.log(`  ${OUT_DIR}/poster.avif (${Math.round(avifBase64.length * 0.75)} bytes)`);