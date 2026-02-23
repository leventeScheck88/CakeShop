/**
 * TC-09 · Responsiveness
 *
 * Tests are run against chromium only for desktop sizes, and against
 * mobile-chrome / mobile-safari for the mobile project (see playwright.config.ts).
 * The mobile-chrome and mobile-safari projects only match this file.
 */
import { test, expect } from '@playwright/test';
import { mockPublicApi } from '../fixtures/mocks';

test.describe('TC-09 · Responsiveness', () => {
  // 9.1 · Mobile (375px) – all pages usable, no horizontal overflow
  test('9.1 – mobile 375px: no horizontal overflow on homepage', async ({ page }) => {
    await mockPublicApi(page);
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    const docWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(docWidth).toBeLessThanOrEqual(375);
  });

  test('9.1b – mobile 375px: products page usable', async ({ page }) => {
    await mockPublicApi(page);
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/produse');

    await expect(page.getByRole('heading', { name: 'Produsele Noastre' })).toBeVisible();
    const docWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(docWidth).toBeLessThanOrEqual(375);
  });

  test('9.1c – mobile 375px: contact form usable', async ({ page }) => {
    await mockPublicApi(page);
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/contact');

    await expect(page.locator('input[name="name"]')).toBeVisible();
    const docWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(docWidth).toBeLessThanOrEqual(375);
  });

  test('9.1d – mobile 375px: hamburger menu visible and desktop nav hidden', async ({ page }) => {
    await mockPublicApi(page);
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    await expect(page.getByRole('button', { name: 'Toggle menu' })).toBeVisible();
    // Desktop nav (hidden md:flex) should not be visible
    const desktopNav = page.locator('header nav.hidden');
    await expect(desktopNav).not.toBeVisible();
  });

  // 9.2 · Tablet (768px) – layout adapts
  test('9.2 – tablet 768px: layout adapts with no horizontal overflow', async ({ page }) => {
    await mockPublicApi(page);
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    const docWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(docWidth).toBeLessThanOrEqual(768);
  });

  test('9.2b – tablet 768px: desktop nav visible', async ({ page }) => {
    await mockPublicApi(page);
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    // At md (768px) the desktop nav should become visible
    const desktopNav = page.locator('header nav.hidden.md\\:flex');
    await expect(desktopNav).toBeVisible();
  });

  // 9.3 · Desktop (1280px) – full layout, max-width constraint
  test('9.3 – desktop 1280px: full layout renders without overflow', async ({ page }) => {
    await mockPublicApi(page);
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    await expect(page.getByRole('heading', { name: /Dulciuri Artizanale/i })).toBeVisible();
    const docWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(docWidth).toBeLessThanOrEqual(1280);
  });

  // 9.4 · Product grid – columns collapse properly at each breakpoint
  test('9.4a – product grid: single column on 375px', async ({ page }) => {
    await mockPublicApi(page);
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/produse');

    const cards = page.locator('a[href^="/produse/"]');
    await expect(cards.first()).toBeVisible();

    const count = await cards.count();
    if (count >= 2) {
      const box1 = await cards.nth(0).boundingBox();
      const box2 = await cards.nth(1).boundingBox();
      // On mobile, cards stack vertically (y of card2 > y of card1)
      expect(box2!.y).toBeGreaterThan(box1!.y);
    }
  });

  test('9.4b – product grid: 2 columns on tablet (640px+)', async ({ page }) => {
    await mockPublicApi(page);
    await page.setViewportSize({ width: 640, height: 1000 });
    await page.goto('/produse');

    const cards = page.locator('a[href^="/produse/"]');
    await expect(cards.first()).toBeVisible();

    const count = await cards.count();
    if (count >= 2) {
      const box1 = await cards.nth(0).boundingBox();
      const box2 = await cards.nth(1).boundingBox();
      // On tablet, 2 cards should be side-by-side (same y row)
      expect(Math.abs(box2!.y - box1!.y)).toBeLessThan(10);
    }
  });

  test('9.4c – product grid: 3 columns on desktop (1024px+)', async ({ page }) => {
    await mockPublicApi(page);
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/produse');

    const cards = page.locator('a[href^="/produse/"]');
    await expect(cards.first()).toBeVisible();

    const count = await cards.count();
    if (count >= 3) {
      const box1 = await cards.nth(0).boundingBox();
      const box2 = await cards.nth(1).boundingBox();
      const box3 = await cards.nth(2).boundingBox();
      // All 3 should be in the same row
      expect(Math.abs(box2!.y - box1!.y)).toBeLessThan(10);
      expect(Math.abs(box3!.y - box1!.y)).toBeLessThan(10);
    }
  });
});
