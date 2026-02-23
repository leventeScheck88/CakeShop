/**
 * TC-01 · Navigation & Layout
 */
import { test, expect } from '@playwright/test';
import { mockPublicApi } from '../fixtures/mocks';

test.describe('TC-01 · Navigation & Layout', () => {
  test.beforeEach(async ({ page }) => {
    await mockPublicApi(page);
  });

  // 1.1 · Load homepage – page renders, hero visible, no console errors
  test('1.1 – homepage loads without console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    expect(consoleErrors).toHaveLength(0);
  });

  // 1.2 · Header links navigate correctly
  test('1.2 – header links navigate to correct routes', async ({ page }) => {
    await page.goto('/');

    // Logo → /
    await page.locator('header a', { hasText: 'CakeStore' }).click();
    await expect(page).toHaveURL('/');

    // Acasă
    await page.getByRole('navigation').getByRole('link', { name: 'Acasă' }).first().click();
    await expect(page).toHaveURL('/');

    // Despre Noi
    await page.getByRole('navigation').getByRole('link', { name: 'Despre Noi' }).first().click();
    await expect(page).toHaveURL('/despre');

    // Produse
    await page.getByRole('navigation').getByRole('link', { name: 'Produse' }).first().click();
    await expect(page).toHaveURL('/produse');

    // Contact
    await page.getByRole('navigation').getByRole('link', { name: 'Contact' }).first().click();
    await expect(page).toHaveURL('/contact');

    // Comandă
    await page.getByRole('navigation').getByRole('link', { name: 'Comandă' }).first().click();
    await expect(page).toHaveURL('/comanda');
  });

  // 1.3 · Mobile menu – hamburger appears on small screens, opens/closes
  test('1.3 – mobile hamburger menu opens and closes', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    const hamburger = page.getByRole('button', { name: 'Toggle menu' });
    await expect(hamburger).toBeVisible();

    // Desktop nav links should be hidden
    await expect(page.locator('nav.hidden.md\\:flex')).not.toBeVisible();

    // Open the mobile drawer
    await hamburger.click();
    await expect(page.locator('nav', { hasText: 'Acasă' }).last()).toBeVisible();

    // Close the mobile drawer
    await hamburger.click();
    await expect(page.locator('nav', { hasText: 'Acasă' }).last()).not.toBeVisible();
  });

  // 1.3b · Mobile menu link closes the drawer when clicked
  test('1.3b – clicking a mobile nav link closes the drawer', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    await page.getByRole('button', { name: 'Toggle menu' }).click();
    // Click the Produse link inside the mobile drawer
    const mobileDrawer = page.locator('.md\\:hidden.bg-cream');
    await mobileDrawer.getByRole('link', { name: 'Produse' }).click();

    await expect(page).toHaveURL('/produse');
    await expect(mobileDrawer).not.toBeVisible();
  });

  // 1.4 · Footer – contact info rendered
  test('1.4 – footer renders with contact info and nav links', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');

    await expect(footer).toBeVisible();
    await expect(footer.getByRole('heading', { name: 'CakeStore' })).toBeVisible();
    await expect(footer.getByText('0748 123 456')).toBeVisible();
    await expect(footer.getByText('contact@cakestore.ro')).toBeVisible();
    await expect(footer.getByText('București, România')).toBeVisible();

    // Social links
    await expect(footer.getByRole('link', { name: 'Instagram' })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'Facebook' })).toBeVisible();

    // Nav links
    await expect(footer.getByRole('link', { name: 'Acasă' })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'Produse' })).toBeVisible();
  });

  // 1.5 · Navigating between pages scrolls to top
  test('1.5 – page scroll resets to top on navigation', async ({ page }) => {
    await page.goto('/');
    // Scroll down on homepage
    await page.evaluate(() => window.scrollTo(0, 1000));
    const scrollBefore = await page.evaluate(() => window.scrollY);
    expect(scrollBefore).toBeGreaterThan(0);

    // Navigate to another page
    await page.getByRole('navigation').getByRole('link', { name: 'Produse' }).first().click();
    await expect(page).toHaveURL('/produse');

    const scrollAfter = await page.evaluate(() => window.scrollY);
    expect(scrollAfter).toBe(0);
  });

  // 1.6 · 404 page – invalid route shows NotFoundPage
  test('1.6 – unknown route renders 404 page', async ({ page }) => {
    await page.goto('/ruta-inexistenta-abc123');
    await expect(page.getByText('Pagina nu a fost găsită')).toBeVisible();
    await expect(page.getByRole('link', { name: /înapoi la pagina principală/i })).toBeVisible();
  });

  // 1.6b · 404 back button navigates home
  test('1.6b – 404 back button navigates to homepage', async ({ page }) => {
    await page.goto('/ruta-inexistenta-abc123');
    await page.getByRole('link', { name: /înapoi la pagina principală/i }).click();
    await expect(page).toHaveURL('/');
  });
});
