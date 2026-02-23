/// <reference types="node" />
/**
 * TC-07 · Order / Inquiry Form (/comanda)
 */
import { test, expect } from '@playwright/test';
import {
  mockPublicApi,
  mockOrderSuccess,
  mockOrderError,
} from '../fixtures/mocks';

test.describe('TC-07 · Order Form', () => {
  test.beforeEach(async ({ page }) => {
    await mockPublicApi(page);
    await page.goto('/comanda');
  });

  // 7.1 · Form renders with all fields
  test('7.1 – order form renders all required fields', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Plasează o Comandă' })).toBeVisible();
    await expect(
      page.getByText('Completează formularul de mai jos cu detaliile comenzii tale.'),
    ).toBeVisible();

    await expect(page.locator('input[name="customerName"]')).toBeVisible();
    await expect(page.locator('input[name="customerEmail"]')).toBeVisible();
    await expect(page.locator('input[name="customerPhone"]')).toBeVisible();
    await expect(page.locator('select[name="productType"]')).toBeVisible();
    await expect(page.locator('select[name="eventType"]')).toBeVisible();
    await expect(page.locator('input[name="eventDate"]')).toBeVisible();
    await expect(page.locator('textarea[name="requirements"]')).toBeVisible();
    await expect(page.getByText('Click pentru a adăuga imagini de referință')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Trimite Comanda' })).toBeVisible();
  });

  // 7.2 · Pre-filled product type from URL query param
  test('7.2 – product type select is pre-filled when navigated from product detail', async ({
    page,
  }) => {
    await page.goto('/comanda?productType=Fursecuri');

    const productTypeSelect = page.locator('select[name="productType"]');
    await expect(productTypeSelect).toHaveValue('Fursecuri');
  });

  // 7.3 · Submit empty form – native validation prevents submission
  test('7.3 – submitting empty form does not call the orders API', async ({ page }) => {
    let orderCalled = false;
    page.on('request', (req) => {
      if (req.url().includes('/api/orders')) orderCalled = true;
    });

    await page.getByRole('button', { name: 'Trimite Comanda' }).click();
    await page.waitForTimeout(300);

    expect(orderCalled).toBe(false);
    await expect(page.getByText('Comanda ta a fost trimisă!')).not.toBeVisible();
  });

  // 7.4 · File upload – can attach reference images
  test('7.4 – user can upload reference images via the file input', async ({ page }) => {
    // Create a small test PNG buffer
    const pngBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64',
    );

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test-image.png',
      mimeType: 'image/png',
      buffer: pngBuffer,
    });

    // The component shows a thumbnail preview
    await expect(page.locator('img[alt="test-image.png"]')).toBeVisible();
  });

  // 7.5 · File type validation – input only accepts image types
  test('7.5 – file input only accepts image/jpeg, image/png and image/webp', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    const accept = await fileInput.getAttribute('accept');
    expect(accept).toBe('image/jpeg,image/png,image/webp');
  });

  // 7.6 · Valid submission – POST /api/orders called, success shown
  test('7.6 – valid submission posts to the orders API and shows success screen', async ({
    page,
  }) => {
    await mockOrderSuccess(page);

    await page.locator('input[name="customerName"]').fill('Maria Ionescu');
    await page.locator('input[name="customerEmail"]').fill('maria@test.ro');
    await page.locator('input[name="customerPhone"]').fill('0744333444');
    await page.locator('textarea[name="requirements"]').fill('Tort de nuntă, 5 etaje, fondant alb');

    const [request] = await Promise.all([
      page.waitForRequest((req) =>
        req.url().includes('/api/orders') && req.method() === 'POST',
      ),
      page.getByRole('button', { name: 'Trimite Comanda' }).click(),
    ]);

    expect(request).toBeTruthy();
    await expect(page.getByText('Comanda ta a fost trimisă!')).toBeVisible();
    await expect(page.getByText('Te vom contacta în curând pentru confirmare și detalii.')).toBeVisible();
  });

  // 7.6b · Success screen navigation buttons work
  test('7.6b – success screen "Înapoi Acasă" and "Vezi Produsele" links work', async ({ page }) => {
    await mockOrderSuccess(page);

    await page.locator('input[name="customerName"]').fill('Maria Ionescu');
    await page.locator('input[name="customerEmail"]').fill('maria@test.ro');
    await page.locator('input[name="customerPhone"]').fill('0744333444');
    await page.locator('textarea[name="requirements"]').fill('Detalii comandă');
    await page.getByRole('button', { name: 'Trimite Comanda' }).click();

    await expect(page.getByText('Comanda ta a fost trimisă!')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Înapoi Acasă' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Vezi Produsele' })).toBeVisible();

    await page.getByRole('link', { name: 'Înapoi Acasă' }).click();
    await expect(page).toHaveURL('/');
  });

  // 7.7 · Event date picker – can select a future date
  test('7.7 – event date picker accepts a future date', async ({ page }) => {
    const futureDate = '2027-06-15';
    await page.locator('input[name="eventDate"]').fill(futureDate);
    await expect(page.locator('input[name="eventDate"]')).toHaveValue(futureDate);
  });

  // 7.8 · API error – user-friendly error message shown
  test('7.8 – API error displays a user-friendly error message', async ({ page }) => {
    await mockOrderError(page, 'Eroare la plasarea comenzii');

    await page.locator('input[name="customerName"]').fill('Maria Ionescu');
    await page.locator('input[name="customerEmail"]').fill('maria@test.ro');
    await page.locator('input[name="customerPhone"]').fill('0744333444');
    await page.locator('textarea[name="requirements"]').fill('Detalii comandă');
    await page.getByRole('button', { name: 'Trimite Comanda' }).click();

    await expect(page.locator('p.text-red-500')).toBeVisible();
    await expect(page.getByText('Comanda ta a fost trimisă!')).not.toBeVisible();
  });
});
