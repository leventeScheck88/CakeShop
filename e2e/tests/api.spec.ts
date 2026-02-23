/**
 * TC-08 · API Integration
 *
 * These tests hit the real backend at http://localhost:3000/api.
 * The backend and database must be running before executing this suite.
 * Run with: npx playwright test api.spec.ts
 */
import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:3000/api';

test.describe('TC-08 · API Integration', () => {
  // 8.1 · GET /api/products returns paginated product list, 200
  test('8.1 – GET /products returns status 200 with paginated items', async ({ request }) => {
    const res = await request.get(`${BASE}/products`);
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body).toHaveProperty('data');
    expect(body.data).toHaveProperty('items');
    expect(body.data).toHaveProperty('total');
    expect(body.data).toHaveProperty('page');
    expect(body.data).toHaveProperty('limit');
    expect(body.data).toHaveProperty('totalPages');
    expect(Array.isArray(body.data.items)).toBe(true);
  });

  // 8.2 · GET /api/products?category=slug returns filtered products
  test('8.2 – GET /products?category=torturi returns only products from that category', async ({
    request,
  }) => {
    const res = await request.get(`${BASE}/products?category=torturi`);
    expect(res.status()).toBe(200);

    const body = await res.json();
    const products: Array<{ category: { slug: string } }> = body.data.items;
    for (const product of products) {
      expect(product.category.slug).toBe('torturi');
    }
  });

  // 8.3 · GET /api/products?featured=true returns featured products only
  test('8.3 – GET /products?featured=true returns only featured products', async ({
    request,
  }) => {
    const res = await request.get(`${BASE}/products?featured=true`);
    expect(res.status()).toBe(200);

    const body = await res.json();
    const products: Array<{ isFeatured: boolean }> = body.data.items;
    for (const product of products) {
      expect(product.isFeatured).toBe(true);
    }
  });

  // 8.4 · GET /api/products/:id returns single product with full data
  test('8.4 – GET /products/:id returns a single product with all expected fields', async ({
    request,
  }) => {
    // First get the list to find a valid ID
    const listRes = await request.get(`${BASE}/products`);
    const list = await listRes.json();
    const firstProduct = list.data.items[0];
    test.skip(!firstProduct, 'No products in database');

    const res = await request.get(`${BASE}/products/${firstProduct.id}`);
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.data).toHaveProperty('id');
    expect(body.data).toHaveProperty('name');
    expect(body.data).toHaveProperty('description');
    expect(body.data).toHaveProperty('price');
    expect(body.data).toHaveProperty('isAvailable');
    expect(body.data).toHaveProperty('category');
    expect(body.data).toHaveProperty('images');
  });

  // 8.5 · GET /api/products/invalid-id returns 404
  test('8.5 – GET /products/99999999 returns 404', async ({ request }) => {
    const res = await request.get(`${BASE}/products/99999999`);
    expect(res.status()).toBe(404);
  });

  // 8.6 · GET /api/categories returns all categories, 200
  test('8.6 – GET /categories returns status 200 with an array of categories', async ({
    request,
  }) => {
    const res = await request.get(`${BASE}/categories`);
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body).toHaveProperty('data');
    expect(Array.isArray(body.data)).toBe(true);

    if (body.data.length > 0) {
      expect(body.data[0]).toHaveProperty('id');
      expect(body.data[0]).toHaveProperty('name');
      expect(body.data[0]).toHaveProperty('slug');
    }
  });

  // 8.7 · POST /api/contact (valid payload) returns 201
  test('8.7 – POST /contact with valid payload returns 201', async ({ request }) => {
    const res = await request.post(`${BASE}/contact`, {
      data: {
        name: 'Test Playwright',
        email: 'playwright@test.ro',
        phone: '0700000000',
        message: 'Mesaj de test generat automat de Playwright.',
        eventType: 'Altele',
        eventDate: '',
      },
    });
    expect(res.status()).toBe(201);
  });

  // 8.8 · POST /api/contact (missing required fields) returns 400
  test('8.8 – POST /contact with missing required fields returns 400', async ({ request }) => {
    const res = await request.post(`${BASE}/contact`, {
      data: {
        // name and message are required but omitted
        email: 'playwright@test.ro',
      },
    });
    expect(res.status()).toBe(400);

    const body = await res.json();
    expect(body).toHaveProperty('message');
  });

  // 8.9 · POST /api/orders (valid multipart form) returns 201
  test('8.9 – POST /orders with valid data returns 201', async ({ request }) => {
    const formData = new FormData();
    formData.append('customerName', 'Test Playwright');
    formData.append('customerEmail', 'playwright@test.ro');
    formData.append('customerPhone', '0700000000');
    formData.append('productType', 'Torturi');
    formData.append('requirements', 'Tort de test pentru Playwright E2E.');
    formData.append('eventType', 'Altele');
    formData.append('eventDate', '');

    const res = await request.post(`${BASE}/orders`, {
      multipart: {
        customerName: 'Test Playwright',
        customerEmail: 'playwright@test.ro',
        customerPhone: '0700000000',
        productType: 'Torturi',
        requirements: 'Tort de test pentru Playwright E2E.',
        eventType: 'Altele',
        eventDate: '',
      },
    });
    expect(res.status()).toBe(201);
  });

  // 8.10 · POST /api/orders (invalid / missing required fields) returns 400
  test('8.10 – POST /orders with missing required fields returns 400', async ({ request }) => {
    const res = await request.post(`${BASE}/orders`, {
      multipart: {
        // customerName, email, phone and requirements are required but omitted
        eventType: 'Altele',
      },
    });
    expect(res.status()).toBe(400);

    const body = await res.json();
    expect(body).toHaveProperty('message');
  });
});
