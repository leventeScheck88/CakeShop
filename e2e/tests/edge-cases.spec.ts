/**
 * TC-10 · Edge Cases & Error Handling
 */
import { test, expect } from '@playwright/test';
import { mockCategories, apiOk } from '../fixtures/mocks';

const API = 'http://localhost:3000/api';

test.describe('TC-10 · Edge Cases & Error Handling', () => {
  // 10.1 · Backend offline – frontend shows error state, not blank page
  test('10.1 – frontend shows error state when the backend is unreachable', async ({ page }) => {
    // Abort all API requests to simulate offline backend
    await page.route(`${API}/**`, (route) => route.abort());

    await page.goto('/produse');

    // Should not show a blank page – some error text or empty state visible
    await expect(page.getByText(/eroare|Nu am găsit/i)).toBeVisible({
      timeout: 10_000,
    });
  });

  // 10.2 · Slow connection – loading spinners shown while fetching
  test('10.2 – loading spinner shows while products are being fetched', async ({ page }) => {
    await page.route(`${API}/products*`, async (route) => {
      await new Promise((r) => setTimeout(r, 600));
      route.fulfill({
        json: apiOk({ items: [], total: 0, page: 1, limit: 12, totalPages: 0 }),
      });
    });
    await page.route(`${API}/categories`, (route) =>
      route.fulfill({ json: apiOk(mockCategories) }),
    );

    await page.goto('/produse');
    await expect(page.locator('.animate-spin').first()).toBeVisible();
  });

  // 10.3 · Product with no image – placeholder shown, no broken <img>
  test('10.3 – product card with no images shows placeholder without broken img tags', async ({
    page,
  }) => {
    const productNoImage = {
      id: 99,
      name: 'Tort Fără Imagine',
      slug: 'tort-fara-imagine',
      description: 'Un produs fără imagine de produs.',
      shortDescription: null,
      price: 100,
      priceLabel: null,
      images: [],
      isAvailable: true,
      isFeatured: false,
      category: mockCategories[0],
      categoryId: 1,
    };

    await page.route(`${API}/categories`, (route) =>
      route.fulfill({ json: apiOk(mockCategories) }),
    );
    await page.route(`${API}/products*`, (route) =>
      route.fulfill({
        json: apiOk({ items: [productNoImage], total: 1, page: 1, limit: 12, totalPages: 1 }),
      }),
    );

    await page.goto('/produse');
    await expect(page.getByText('Tort Fără Imagine')).toBeVisible();

    // No broken images (src="undefined" or src="null")
    const brokenImgs = await page.locator('img[src="undefined"], img[src="null"], img[src=""]').count();
    expect(brokenImgs).toBe(0);
  });

  // 10.3b · Product detail with no images – fallback placeholder renders
  test('10.3b – product detail with no images shows fallback instead of broken img', async ({
    page,
  }) => {
    const productNoImage = {
      id: 98,
      name: 'Tort Fără Imagini',
      slug: 'tort-fara-imagini',
      description: 'Produs cu galerie goală.',
      shortDescription: null,
      price: 90,
      priceLabel: null,
      images: [],
      isAvailable: true,
      isFeatured: false,
      category: mockCategories[0],
      categoryId: 1,
    };

    await page.route(`${API}/categories`, (route) =>
      route.fulfill({ json: apiOk(mockCategories) }),
    );
    await page.route(`${API}/products/98`, (route) =>
      route.fulfill({ json: apiOk(productNoImage) }),
    );
    await page.route(`${API}/products*`, (route) =>
      route.fulfill({
        json: apiOk({ items: [], total: 0, page: 1, limit: 4, totalPages: 0 }),
      }),
    );

    await page.goto('/produse/98');
    await expect(page.getByRole('heading', { name: 'Tort Fără Imagini' })).toBeVisible();

    const brokenImgs = await page.locator('img[src="undefined"], img[src="null"], img[src=""]').count();
    expect(brokenImgs).toBe(0);
  });

  // 10.4 · Long product name/description – layout doesn't break
  test('10.4 – very long product name and description do not break the layout', async ({ page }) => {
    const longNameProduct = {
      id: 97,
      name: 'Tort cu Cremă de Ciocolată Belgiană Premium și Fragi de Câmp Proaspeți cu Glazură din Aur',
      slug: 'tort-very-long-name',
      description: 'A'.repeat(500),
      shortDescription: null,
      price: 999,
      priceLabel: 'de la',
      images: [],
      isAvailable: true,
      isFeatured: false,
      category: mockCategories[0],
      categoryId: 1,
    };

    await page.route(`${API}/categories`, (route) =>
      route.fulfill({ json: apiOk(mockCategories) }),
    );
    await page.route(`${API}/products*`, (route) =>
      route.fulfill({
        json: apiOk({ items: [longNameProduct], total: 1, page: 1, limit: 12, totalPages: 1 }),
      }),
    );

    await page.goto('/produse');
    await expect(page.getByText(/Tort cu Cremă/)).toBeVisible();

    // No horizontal overflow
    const docWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const viewportWidth = page.viewportSize()!.width;
    expect(docWidth).toBeLessThanOrEqual(viewportWidth + 1); // 1px tolerance
  });

  // 10.5 · Special characters in form fields – accepted without issues
  test('10.5 – special characters in contact form are accepted without errors', async ({ page }) => {
    await page.route(`${API}/categories`, (route) =>
      route.fulfill({ json: apiOk(mockCategories) }),
    );
    await page.route(`${API}/products*`, (route) =>
      route.fulfill({ json: apiOk({ items: [], total: 0, page: 1, limit: 12, totalPages: 0 }) }),
    );
    await page.route(`${API}/contact`, (route) =>
      route.fulfill({ json: { data: null, message: 'OK', statusCode: 201 } }),
    );

    await page.goto('/contact');

    const specialName = 'Iónescu-Pópescu & "Fiu" <Jr>';
    const specialMessage = 'Doresc tort cu ă, î, â, ș, ț și 🎂. Preț: 100€';

    await page.locator('input[name="name"]').fill(specialName);
    await page.locator('input[name="email"]').fill('test@test.ro');
    await page.locator('textarea[name="message"]').fill(specialMessage);
    await page.getByRole('button', { name: 'Trimite Mesajul' }).click();

    await expect(page.getByText('Mesajul tău a fost trimis cu succes!')).toBeVisible();
  });
});
