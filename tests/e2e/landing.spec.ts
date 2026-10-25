import { test, expect } from '@playwright/test';

test.describe('GRAVEN Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for video to be ready
    await page.waitForFunction(() => {
      const v = document.querySelector('video');
      return v && v.readyState >= 2 && isFinite(v.duration);
    }, null, { timeout: 30000 });
    // Let animations settle
    await page.waitForTimeout(2200);
  });

  test('loads without console errors', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', err => errors.push(err.message));

    await page.waitForTimeout(1000);
    expect(errors).toHaveLength(0);
  });

  test('hero is visible at top', async ({ page }) => {
    const hero = page.locator('h1');
    await expect(hero).toBeVisible();
    await expect(hero).toContainText('Drawn before it\'s built');
  });

  test('scroll progresses video', async ({ page }) => {
    const video = page.locator('video');
    const initialTime = await video.evaluate(v => v.currentTime);

    // Scroll to middle of track
    await page.evaluate(() => window.scrollTo(0, 2000));
    await page.waitForTimeout(2600);

    const finalTime = await video.evaluate(v => v.currentTime);
    expect(finalTime).toBeGreaterThan(initialTime);
  });

  test('beats appear at correct scroll positions', async ({ page }) => {
    const beats = page.locator('.beat-overlay');

    // Beat 1: THE SHEET (progress ~0.17)
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(2600);
    await expect(beats.nth(0)).toHaveCSS('opacity', /0\.\d+/);

    // Beat 2: THE FRAME (progress ~0.41)
    await page.evaluate(() => window.scrollTo(0, 2000));
    await page.waitForTimeout(2600);
    await expect(beats.nth(1)).toHaveCSS('opacity', /0\.\d+/);

    // Beat 3: THE SECTION (progress ~0.65)
    await page.evaluate(() => window.scrollTo(0, 3000));
    await page.waitForTimeout(2600);
    await expect(beats.nth(2)).toHaveCSS('opacity', /0\.\d+/);

    // Beat 4: THE BUILD (progress ~0.89)
    await page.evaluate(() => window.scrollTo(0, 4000));
    await page.waitForTimeout(2600);
    await expect(beats.nth(3)).toHaveCSS('opacity', /1/);
  });

  test('progress rail updates', async ({ page }) => {
    const railFill = page.locator('.fixed.right-6 .absolute.bottom-0');

    // At top
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
    const initialHeight = await railFill.evaluate(el => el.style.height);

    // At bottom
    await page.evaluate(() => window.scrollTo(0, 5000));
    await page.waitForTimeout(2600);
    const finalHeight = await railFill.evaluate(el => el.style.height);

    expect(parseFloat(finalHeight)).toBeGreaterThan(parseFloat(initialHeight));
  });

  test('navbar navigation works', async ({ page }) => {
    // Click Work link
    await page.click('nav a:has-text("Work")');
    await expect(page).toHaveURL(/\/work/);

    // Go back
    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
  });

  test('mobile menu opens and closes', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    const menuButton = page.locator('button[aria-label="Open menu"]');
    await expect(menuButton).toBeVisible();

    // Open menu
    await menuButton.click();
    await expect(page.locator('#mobile-menu')).toBeVisible();

    // Close menu
    await menuButton.click();
    await expect(page.locator('#mobile-menu')).toBeHidden();
  });

  test('contact form validation', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');

    // Try submit empty form
    await page.click('button[type="submit"]');

    // Check for validation errors
    await expect(page.locator('text=Name must be at least 2 characters')).toBeVisible();
    await expect(page.locator('text=Please enter a valid email address')).toBeVisible();
    await expect(page.locator('text=Message must be at least 50 characters')).toBeVisible();
  });

  test('footer links work', async ({ page }) => {
    await page.goto('/work');
    await page.waitForLoadState('networkidle');

    // Click footer contact link
    await page.click('footer a:has-text("Contact")');
    await expect(page).toHaveURL(/\/contact/);
  });
});

test.describe('Reduced Motion', () => {
  test('respects prefers-reduced-motion', async ({ page }) => {
    // Emulate reduced motion
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    await page.waitForFunction(() => {
      const v = document.querySelector('video');
      return v && v.readyState >= 2 && isFinite(v.duration);
    }, null, { timeout: 30000 });

    // Scroll should seek directly without damping
    await page.evaluate(() => window.scrollTo(0, 2000));
    await page.waitForTimeout(1000);

    const video = page.locator('video');
    const currentTime = await video.evaluate(v => v.currentTime);
    const duration = await video.evaluate(v => v.duration);
    const expectedProgress = 2000 / (5000 - 900); // approximate

    // Should be close to target (direct seek)
    expect(Math.abs(currentTime - duration * expectedProgress)).toBeLessThan(0.5);
  });
});

test.describe('Accessibility', () => {
  test('keyboard navigation works', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2200);

    // Tab to first focusable element (navbar link)
    await page.keyboard.press('Tab');
    const focused = page.locator(':focus');
    await expect(focused).toBeVisible();
  });

  test('video has proper attributes', async ({ page }) => {
    const video = page.locator('video');
    await expect(video).toHaveAttribute('muted');
    await expect(video).toHaveAttribute('playsinline');
  });

  test('images have alt text', async ({ page }) => {
    const images = page.locator('img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });
});