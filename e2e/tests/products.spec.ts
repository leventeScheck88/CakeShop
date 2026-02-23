/**
 * TC-03 · Products Page (/produse)
 */
import { test, expect } from '@playwright/test';
import {
  mockPublicApi,
  mockEmptyProducts,
  mockPaginatedProductsApi,
  mockCategories,
  mockProducts,
  apiOk,
} from '../fixtures/mocks';

const API = 'http://localhost:3000/api';

test.describe('TC-03 · Products Page', () => {
  // 3.1 · All products load
  test('3.1 – product grid renders cards on page load', async ({ page }) => {
    await mockPublicApi(page);
    await page.goto('/produse');

    await expect(page.getByRole('heading', { name: 'Produsele Noastre' })).toBeVisible();
    await expect(page.getByText('Tort Ciocolată')).toBeVisible();
    await expect(page.getByText('Tort Vanilie')).toBeVisible();
    await expect(page.getByText('Cutie Fursecuri Decorate')).toBeVisible();
  });

  // 3.2 · Filter by category – clicking a filter updates URL and calls the API with ?category=slug
  test('3.2 – clicking a category filter updates the URL and filters products', async ({ page }) => {
    await mockPublicApi(page);
    await page.goto('/produse');

    // Intercept the filtered request
    const filteredRequest = page.waitForRequest((req) =>
      req.url().includes('category=torturi'),
    );

    await page.getByRole('button', { name: 'Torturi' }).click();

    await filteredRequest;
    await expect(page).toHaveURL(/category=torturi/);
    // Active filter pill has gold styling
    await expect(page.getByRole('button', { name: 'Torturi' })).toHaveClass(/bg-gold/);
  });

  // 3.3 · Clear filter – "Toate" shows all products and removes category param
  test('3.3 – "Toate" button clears the active category filter', async ({ page }) => {
    await mockPublicApi(page);
    await page.goto('/produse?category=torturi');

    await page.getByRole('button', { name: 'Torturi' }).click(); // select Torturi first (already active via URL)
    // Then click Toate
    await page.getByRole('button', { name: 'Toate' }).click();
    await expect(page).not.toHaveURL(/category=/);
    await expect(page.getByRole('button', { name: 'Toate' })).toHaveClass(/bg-gold/);
  });

  // 3.4 · Pagination controls shown when totalPages > 1
  test('3.4 – pagination controls render when there are multiple pages', async ({ page }) => {
    await mockPaginatedProductsApi(page);
    await page.goto('/produse');

    await expect(page.getByRole('button', { name: 'Următor' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Anterior' })).toBeVisible();
    // Anterior should be disabled on page 1
    await expect(page.getByRole('button', { name: 'Anterior' })).toBeDisabled();
  });

  // 3.5 · Pagination navigation – next/prev loads correct page
  test('3.5 – clicking "Următor" loads page 2 and "Anterior" returns to page 1', async ({ page }) => {
    await mockPaginatedProductsApi(page);
    await page.goto('/produse');

    await page.getByRole('button', { name: 'Următor' }).click();
    await expect(page).toHaveURL(/page=2/);
    // Anterior should now be enabled
    await expect(page.getByRole('button', { name: 'Anterior' })).not.toBeDisabled();

    await page.getByRole('button', { name: 'Anterior' }).click();
    await expect(page).toHaveURL(/page=1/);
  });

  // 3.6 · Loading state – spinner shown while fetching
  test('3.6 – loading spinner appears while products are fetching', async ({ page }) => {
    // Delay the API response to observe the loading state
    await page.route(`${API}/products*`, async (route) => {
      await new Promise((r) => setTimeout(r, 500));
      await route.fulfill({
        json: apiOk({ items: [], total: 0, page: 1, limit: 12, totalPages: 0 }),
      });
    });
    await page.route(`${API}/categories`, (route) =>
      route.fulfill({ json: apiOk(mockCategories) }),
    );

    await page.goto('/produse');
    // The spinner SVG (animate-spin) should be visible before the response arrives
    await expect(page.locator('.animate-spin').first()).toBeVisible();
  });

  // 3.7 · Empty state – message shown when no products in category
  test('3.7 – empty state message when no products match the filter', async ({ page }) => {
    await mockEmptyProducts(page);
    await page.goto('/produse?category=torturi');

    await expect(
      page.getByText('Nu am găsit produse în această categorie.'),
    ).toBeVisible();
  });

  // 3.8 · Product card data – image placeholder, name, price, category shown
  test('3.8 – product cards display name, price and category label', async ({ page }) => {
    await mockPublicApi(page);
    await page.goto('/produse');

    const firstCard = page.locator('a[href="/produse/1"]');
    await expect(firstCard.getByText('Tort Ciocolată')).toBeVisible();
    await expect(firstCard.getByText(/150 RON/)).toBeVisible();
    await expect(firstCard.getByText(/TORTURI/i)).toBeVisible();
  });

  // 3.9 · Unavailable product – "Indisponibil" status shown on detail page
  test('3.9 – unavailable product shows "Indisponibil momentan" on its detail page', async ({
    page,
  }) => {
    const unavailableProduct = {
      ...mockProducts[2],
      isAvailable: false,
    };
    // Mock the single product endpoint for product 3
    await page.route(`${API}/products/3`, (route) =>
      route.fulfill({ json: apiOk(unavailableProduct) }),
    );
    await page.route(`${API}/products*`, (route) =>
      route.fulfill({
        json: apiOk({ items: [unavailableProduct], total: 1, page: 1, limit: 4, totalPages: 1 }),
      }),
    );
    await page.route(`${API}/categories`, (route) =>
      route.fulfill({ json: apiOk(mockCategories) }),
    );

    await page.goto('/produse/3');
    await expect(page.getByText('Indisponibil momentan')).toBeVisible();
  });
});
