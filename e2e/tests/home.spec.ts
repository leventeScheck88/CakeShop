/**
 * TC-02 · Home Page (/)
 */
import { test, expect } from '@playwright/test';
import { mockPublicApi } from '../fixtures/mocks';

test.describe('TC-02 · Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await mockPublicApi(page);
    await page.goto('/');
  });

  // 2.1 · Hero section renders
  test('2.1 – hero section: heading, subtitle and CTA buttons are visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Dulciuri Artizanale/i })).toBeVisible();
    await expect(page.getByText('Create cu Pasiune', { exact: true })).toBeVisible();
    await expect(page.getByText(/ingrediente premium/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /Vezi Produsele/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Plasează o Comandă/i })).toBeVisible();
  });

  // 2.2 · Featured products grid loads
  test('2.2 – featured products section renders product cards', async ({ page }) => {
    await expect(page.getByText('Produse Populare')).toBeVisible();
    // Wait for product cards
    await expect(page.getByText('Tort Ciocolată')).toBeVisible();
    await expect(page.getByText('Tort Vanilie')).toBeVisible();
  });

  // 2.3 · Category preview renders
  test('2.3 – categories section renders category cards with labels', async ({ page }) => {
    await expect(page.getByText('Categorii')).toBeVisible();
    // Category cards link to /produse?category=slug
    await expect(page.locator('a[href="/produse?category=torturi"]')).toBeVisible();
    await expect(page.locator('a[href="/produse?category=fursecuri"]')).toBeVisible();
  });

  // 2.4 · About teaser visible with CTA link
  test('2.4 – about teaser section is visible with CTA', async ({ page }) => {
    await expect(page.getByText('Povestea Noastră')).toBeVisible();
    await expect(page.getByRole('link', { name: /Citește Mai Mult/i })).toBeVisible();
  });

  // 2.5 · CTA "VEZI PRODUSELE" button navigates to /produse
  test('2.5 – hero "Vezi Produsele" CTA navigates to /produse', async ({ page }) => {
    await page.getByRole('link', { name: 'Vezi Produsele' }).first().click();
    await expect(page).toHaveURL('/produse');
  });

  // 2.5b · Hero "Plasează o Comandă" navigates to /comanda
  test('2.5b – hero "Plasează o Comandă" CTA navigates to /comanda', async ({ page }) => {
    await page.getByRole('link', { name: /Plasează o Comandă/i }).click();
    await expect(page).toHaveURL('/comanda');
  });

  // 2.5c · About teaser CTA navigates to /despre
  test('2.5c – about teaser "Citește Mai Mult" navigates to /despre', async ({ page }) => {
    await page.getByRole('link', { name: /Citește Mai Mult/i }).click();
    await expect(page).toHaveURL('/despre');
  });

  // 2.5d · Bottom CTA section "Trimite o Comandă" navigates to /comanda
  test('2.5d – bottom CTA "Trimite o Comandă" navigates to /comanda', async ({ page }) => {
    await page.getByText('Ai un eveniment special?').scrollIntoViewIfNeeded();
    await page.getByRole('link', { name: /Trimite o Comandă/i }).click();
    await expect(page).toHaveURL('/comanda');
  });

  // 2.6 · Product card click navigates to /produse/:id
  test('2.6 – clicking a product card navigates to the product detail page', async ({ page }) => {
    const card = page.getByRole('link', { name: /Tort Ciocolată/i }).first();
    await card.click();
    await expect(page).toHaveURL(/\/produse\/\d+/);
  });
});
