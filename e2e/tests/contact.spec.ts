/**
 * TC-06 · Contact Page (/contact)
 */
import { test, expect } from '@playwright/test';
import {
  mockPublicApi,
  mockContactSuccess,
  mockContactError,
} from '../fixtures/mocks';

test.describe('TC-06 · Contact Page', () => {
  test.beforeEach(async ({ page }) => {
    await mockPublicApi(page);
    await page.goto('/contact');
  });

  // 6.1 · Form renders with all fields
  test('6.1 – contact form renders all required fields', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Contact', level: 1 })).toBeVisible();
    await expect(page.getByText('Trimite-ne un mesaj')).toBeVisible();

    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="phone"]')).toBeVisible();
    await expect(page.locator('select[name="eventType"]')).toBeVisible();
    await expect(page.locator('input[name="eventDate"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Trimite Mesajul' })).toBeVisible();
  });

  // 6.2 · Submit empty form – browser validation prevents submission
  test('6.2 – submitting empty form does not call the API (native validation)', async ({
    page,
  }) => {
    let contactCalled = false;
    page.on('request', (req) => {
      if (req.url().includes('/api/contact')) contactCalled = true;
    });

    await page.getByRole('button', { name: 'Trimite Mesajul' }).click();

    // Wait a tick – no navigation or API call should happen
    await page.waitForTimeout(300);
    expect(contactCalled).toBe(false);
    // Success message must NOT appear
    await expect(page.getByText('Mesajul tău a fost trimis cu succes!')).not.toBeVisible();
  });

  // 6.3 · Invalid email – browser validation prevents submission
  test('6.3 – invalid email format prevents form submission', async ({ page }) => {
    let contactCalled = false;
    page.on('request', (req) => {
      if (req.url().includes('/api/contact')) contactCalled = true;
    });

    await page.locator('input[name="name"]').fill('Ion Popescu');
    await page.locator('input[name="email"]').fill('not-an-email');
    await page.locator('textarea[name="message"]').fill('Bună ziua');

    await page.getByRole('button', { name: 'Trimite Mesajul' }).click();
    await page.waitForTimeout(300);
    expect(contactCalled).toBe(false);
    await expect(page.getByText('Mesajul tău a fost trimis cu succes!')).not.toBeVisible();
  });

  // 6.4 · Valid submission – API called, success message shown
  test('6.4 – valid form submission shows success message', async ({ page }) => {
    await mockContactSuccess(page);

    await page.locator('input[name="name"]').fill('Ion Popescu');
    await page.locator('input[name="email"]').fill('ion@test.ro');
    await page.locator('input[name="phone"]').fill('0722111222');
    await page.locator('textarea[name="message"]').fill('Doresc să comand un tort de nuntă.');

    const [request] = await Promise.all([
      page.waitForRequest((req) =>
        req.url().includes('/api/contact') && req.method() === 'POST',
      ),
      page.getByRole('button', { name: 'Trimite Mesajul' }).click(),
    ]);

    expect(request).toBeTruthy();
    await expect(page.getByText('Mesajul tău a fost trimis cu succes!')).toBeVisible();
    await expect(page.getByText('Te vom contacta în curând.')).toBeVisible();
  });

  // 6.4b · After success, "Trimite alt mesaj" resets the form
  test('6.4b – "Trimite alt mesaj" button resets the form after successful submission', async ({
    page,
  }) => {
    await mockContactSuccess(page);

    await page.locator('input[name="name"]').fill('Ion Popescu');
    await page.locator('input[name="email"]').fill('ion@test.ro');
    await page.locator('textarea[name="message"]').fill('Mesaj test');
    await page.getByRole('button', { name: 'Trimite Mesajul' }).click();

    await expect(page.getByText('Mesajul tău a fost trimis cu succes!')).toBeVisible();
    await page.getByRole('button', { name: 'Trimite alt mesaj' }).click();
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="name"]')).toHaveValue('');
  });

  // 6.5 · API error – user-friendly error message shown
  test('6.5 – API error displays a user-friendly error message', async ({ page }) => {
    await mockContactError(page, 'Eroare server intern');

    await page.locator('input[name="name"]').fill('Ion Popescu');
    await page.locator('input[name="email"]').fill('ion@test.ro');
    await page.locator('textarea[name="message"]').fill('Mesaj test');
    await page.getByRole('button', { name: 'Trimite Mesajul' }).click();

    await expect(page.locator('p.text-red-500')).toBeVisible();
    await expect(page.getByText('Mesajul tău a fost trimis cu succes!')).not.toBeVisible();
  });

  // 6.6 · Contact info displayed
  test('6.6 – contact info section shows phone, email, address and hours', async ({ page }) => {
    const contactInfo = page.getByRole('heading', { name: 'Informații de Contact' }).locator('../..');
    await expect(page.getByRole('heading', { name: 'Informații de Contact' })).toBeVisible();
    // Scope to main content area to avoid footer duplicates
    await expect(page.getByRole('main').getByText('0748 123 456')).toBeVisible();
    await expect(page.getByRole('main').getByText('contact@cakestore.ro')).toBeVisible();
    await expect(page.getByRole('main').getByText('București, România').first()).toBeVisible();
    await expect(page.getByText('Luni - Sâmbătă: 09:00 - 18:00')).toBeVisible();
    await expect(page.getByText('Duminică: Închis')).toBeVisible();
  });

  // 6.7 · Social links rendered
  test('6.7 – social media links are rendered in the contact section', async ({ page }) => {
    await expect(page.getByText('Urmărește-ne')).toBeVisible();
    // Instagram and Facebook links are in the contact section (main), not the footer
    await expect(page.getByRole('main').locator('a[href="#"]')).toHaveCount(2);
  });

  // 6.8 · Map placeholder renders
  test('6.8 – map placeholder section renders without errors', async ({ page }) => {
    await expect(page.getByText('Google Maps')).toBeVisible();
  });
});
