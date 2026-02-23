/**
 * TC-04 · Product Detail Page (/produse/:id)
 */
import { test, expect } from '@playwright/test';
import { mockProduct, mockProducts, mockCategories, apiOk } from '../fixtures/mocks';

const API = 'http://localhost:3000/api';
const availableProduct = mockProducts[0]; // isAvailable: true
const unavailableProduct = { ...mockProducts[2] }; // isAvailable: false

test.describe('TC-04 · Product Detail Page', () => {
  // 4.1 · Page loads for valid ID – name, description, price visible
  test('4.1 – product name, price and description render for a valid product ID', async ({
    page,
  }) => {
    await mockProduct(page, availableProduct);
    await page.goto(`/produse/${availableProduct.id}`);

    await expect(
      page.getByRole('heading', { name: availableProduct.name }),
    ).toBeVisible();
    // ProductCard renders price as "{price} RON" (integer display)
    await expect(page.getByText(/150 RON/)).toBeVisible();
    await expect(page.getByText(availableProduct.description)).toBeVisible();
  });

  // 4.2 · Image gallery renders (placeholder shown when no images)
  test('4.2 – image area renders (fallback placeholder when no images)', async ({ page }) => {
    await mockProduct(page, availableProduct);
    await page.goto(`/produse/${availableProduct.id}`);

    // No broken <img src=""> elements
    const brokenImages = await page.locator('img[src=""]').count();
    expect(brokenImages).toBe(0);
    // The image container should be visible
    await expect(page.locator('section img').first()).toBeVisible();
  });

  // 4.3 · Breadcrumb – shows Home › Produse › Category › Product Name, links work
  test('4.3 – breadcrumb shows correct path with working links', async ({ page }) => {
    await mockProduct(page, availableProduct);
    await page.goto(`/produse/${availableProduct.id}`);

    // Breadcrumb nav is the first nav element (header has nav.hidden.md:flex)
    // Use the nav that contains an ol with the breadcrumb items
    const breadcrumb = page.locator('nav').filter({ has: page.locator('ol') });

    await expect(breadcrumb.getByRole('link', { name: 'Acasă' })).toBeVisible();
    await expect(breadcrumb.getByRole('link', { name: 'Produse' })).toBeVisible();
    await expect(
      breadcrumb.getByRole('link', { name: availableProduct.category.name }),
    ).toBeVisible();
    // Last breadcrumb item is a span (not a link)
    await expect(breadcrumb.getByText(availableProduct.name, { exact: true })).toBeVisible();

    // "Produse" link navigates to /produse
    await breadcrumb.getByRole('link', { name: 'Produse' }).click();
    await expect(page).toHaveURL('/produse');
  });

  // 4.4 · Availability status shown correctly
  test('4.4a – "Disponibil" status shown for available product', async ({ page }) => {
    await mockProduct(page, availableProduct);
    await page.goto(`/produse/${availableProduct.id}`);
    // Scope to main to avoid any footer "Disponibil" text
    await expect(page.locator('section').getByText('Disponibil').first()).toBeVisible();
  });

  test('4.4b – "Indisponibil momentan" shown for unavailable product', async ({ page }) => {
    await mockProduct(page, unavailableProduct);
    await page.goto(`/produse/${unavailableProduct.id}`);
    await expect(page.getByText('Indisponibil momentan')).toBeVisible();
  });

  // 4.5 · Order button – navigates to /comanda?productType=...
  test('4.5 – "Comandă" button in product detail links to order page with productType', async ({
    page,
  }) => {
    await mockProduct(page, availableProduct);
    await page.goto(`/produse/${availableProduct.id}`);

    // Scope to the product info area (has gold primary button style)
    const orderLink = page.locator('a[href*="/comanda?productType="]');
    await expect(orderLink).toBeVisible();

    const href = await orderLink.getAttribute('href');
    expect(href).toContain('/comanda');
    expect(href).toContain('productType=');

    await orderLink.click();
    await expect(page).toHaveURL(/\/comanda\?productType=/);
  });

  // 4.5b · "Contactează-ne" button navigates to /contact
  test('4.5b – "Contactează-ne" button navigates to contact page', async ({ page }) => {
    await mockProduct(page, availableProduct);
    await page.goto(`/produse/${availableProduct.id}`);

    await page.getByRole('link', { name: 'Contactează-ne' }).click();
    await expect(page).toHaveURL('/contact');
  });

  // 4.6 · Related products section renders
  test('4.6 – related products section renders when similar products exist', async ({ page }) => {
    await mockProduct(page, availableProduct);
    await page.goto(`/produse/${availableProduct.id}`);

    // "Produse Similare" heading should appear
    await expect(page.getByText('Produse Similare')).toBeVisible();
    // Related cards link to other products (not the current one)
    const relatedLinks = page.locator(`a[href^="/produse/"]:not([href="/produse/${availableProduct.id}"])`);
    await expect(relatedLinks.first()).toBeVisible();
  });

  // 4.7 · Invalid product ID – error state shown
  test('4.7 – invalid product ID shows error state with back button', async ({ page }) => {
    await page.route(`${API}/products/99999`, (route) =>
      route.fulfill({
        status: 404,
        json: { message: 'Produs negăsit', statusCode: 404 },
      }),
    );
    await page.route(`${API}/products*`, (route) =>
      route.fulfill({
        json: apiOk({ items: [], total: 0, page: 1, limit: 4, totalPages: 0 }),
      }),
    );
    await page.route(`${API}/categories`, (route) =>
      route.fulfill({ json: apiOk(mockCategories) }),
    );

    await page.goto('/produse/99999');
    await expect(page.getByText('Înapoi la Produse')).toBeVisible();
  });
});
