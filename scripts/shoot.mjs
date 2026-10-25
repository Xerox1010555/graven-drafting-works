import { chromium, devices } from 'playwright';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const URL = process.env.SHOOT_URL || 'http://localhost:4173/';
const OUT = join(__dirname, '../shots');
mkdirSync(OUT, { recursive: true });

// Scroll stop positions (in pixels from top) for different viewports
const STOPS = {
  desktop: [
    ['01-top', 0],
    ['02-sheet', 612],
    ['03-frame', 1476],
    ['04-section', 2340],
    ['05-build', 3492],
    ['06-footer', 4200],
  ],
  mobile: [
    ['m1-top', 0],
    ['m2-sheet', 420],
    ['m3-frame', 1020],
    ['m4-section', 1620],
    ['m5-build', 2380],
    ['m6-footer', 2880],
  ],
} as const;

const browser = await chromium.launch();

async function run(name, ctxOpts, stops, label) {
  const ctx = await browser.newContext(ctxOpts);
  const page = await ctx.newPage();
  const errors = [];

  page.on('console', (m) => m.type() === 'error' && errors.push(`${label}: ${m.text()}`));
  page.on('pageerror', (e) => errors.push(`${label}: PAGEERROR ${e.message}`));

  await page.goto(URL, { waitUntil: 'domcontentloaded' });

  // Wait for video to be ready (first frame loaded, duration known)
  await page.waitForFunction(() => {
    const v = document.querySelector('video');
    return v && v.readyState >= 2 && isFinite(v.duration);
  }, null, { timeout: 30000 });

  // Let intro animations settle
  await page.waitForTimeout(2200);

  const report = [];
  for (const [nm, y] of stops) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);

    // Let damping settle: 0.1^n reaches <1% in ~44 frames at 60fps = ~730ms
    // Use longer wait for mobile
    const isFirst = y === 0;
    await page.waitForTimeout(isFirst ? 400 : 2600);

    const st = await page.evaluate(() => ({
      y: Math.round(window.scrollY),
      t: +document.querySelector('video')?.currentTime.toFixed(3),
      paused: document.querySelector('video')?.paused,
      beats: [...document.querySelectorAll('.beat-overlay')].map((b) => +(+b.style.opacity || 0).toFixed(2)),
      hero: +(+document.querySelector('h1')?.parentElement?.parentElement?.style.opacity || 0).toFixed(2),
    }));

    await page.screenshot({ path: `${OUT}/${nm}.png`, fullPage: false });
    report.push({ nm, ...st });
  }

  await ctx.close();
  return { report, errors };
}

// Desktop run
const desktop = await run('desktop', { viewport: { width: 1440, height: 900 } }, STOPS.desktop, 'desktop');

// Mobile run
const iPhone = devices['iPhone 13'];
const mobile = await run('mobile', { ...iPhone }, STOPS.mobile, 'mobile');

await browser.close();

const allErrors = [...desktop.errors, ...mobile.errors];
if (allErrors.length > 0) {
  console.error('ERRORS:', allErrors);
  process.exitCode = 1;
}

console.log(JSON.stringify({ desktop: desktop.report, mobile: mobile.report, errors: allErrors }, null, 1));