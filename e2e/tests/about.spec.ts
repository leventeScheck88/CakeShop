/**
 * TC-05 · About Page (/despre)
 */
import { test, expect } from '@playwright/test';
import { mockPublicApi } from '../fixtures/mocks';

test.describe('TC-05 · About Page', () => {
  test.beforeEach(async ({ page }) => {
    await mockPublicApi(page);
    await page.goto('/despre');
  });

  // 5.1 · Page renders – story text and photo placeholders visible
  test('5.1 – page heading, story text and photo grid render', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Despre Noi' })).toBeVisible();
    // Story section text
    await expect(page.getByText(/Totul a început într-o bucătărie mică/)).toBeVisible();
    // Photo grid (3 emoji placeholders)
    await expect(page.getByText('🎂')).toBeVisible();
    await expect(page.getByText('🧁')).toBeVisible();
    await expect(page.getByText('🍪')).toBeVisible();
  });

  // 5.2 · Core values section renders
  test('5.2 – values section shows all three values', async ({ page }) => {
    await expect(page.getByText('Valorile Noastre')).toBeVisible();
    await expect(page.getByText('Ingrediente Naturale')).toBeVisible();
    await expect(page.getByText('Făcute Manual')).toBeVisible();
    await expect(page.getByText('Cu Dragoste')).toBeVisible();
  });

  // 5.3 · CTA button navigates to /comanda
  test('5.3 – CTA "Plasează o Comandă" navigates to order page', async ({ page }) => {
    await page.getByRole('link', { name: /Plasează o Comandă/i }).click();
    await expect(page).toHaveURL('/comanda');
  });
});
