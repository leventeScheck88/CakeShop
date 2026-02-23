import type { Page } from '@playwright/test';

// ─── Shared mock data ──────────────────────────────────────────────────────────

export const mockCategories = [
  {
    id: 1,
    name: 'Torturi',
    slug: 'torturi',
    description: 'Torturi personalizate pentru orice ocazie',
    image: null,
    sortOrder: 1,
    productCount: 5,
  },
  {
    id: 2,
    name: 'Fursecuri',
    slug: 'fursecuri',
    description: 'Fursecuri decorate manual cu glazură regală',
    image: null,
    sortOrder: 2,
    productCount: 3,
  },
];

export const mockProducts = [
  {
    id: 1,
    name: 'Tort Ciocolată',
    slug: 'tort-ciocolata',
    description: 'Un tort delicios cu trei straturi de cremă de ciocolată belgiană.',
    shortDescription: 'Tort cu ciocolată belgiană',
    price: 150,
    priceLabel: 'de la',
    images: [],
    isAvailable: true,
    isFeatured: true,
    category: mockCategories[0],
    categoryId: 1,
  },
  {
    id: 2,
    name: 'Tort Vanilie',
    slug: 'tort-vanilie',
    description: 'Tort clasic cu cremă de vanilie și fructe de sezon.',
    shortDescription: null,
    price: 120,
    priceLabel: null,
    images: [],
    isAvailable: true,
    isFeatured: true,
    category: mockCategories[0],
    categoryId: 1,
  },
  {
    id: 3,
    name: 'Cutie Fursecuri Decorate',
    slug: 'cutie-fursecuri-decorate',
    description: 'Cutie cadou cu 12 fursecuri decorate manual cu glazură regală.',
    shortDescription: 'Cutie cu 12 fursecuri',
    price: 80,
    priceLabel: 'de la',
    images: [],
    isAvailable: false,
    isFeatured: false,
    category: mockCategories[1],
    categoryId: 2,
  },
];

export const mockPaginatedProducts = {
  items: mockProducts,
  total: 3,
  page: 1,
  limit: 12,
  totalPages: 1,
};

export const mockSingleProduct = mockProducts[0];

// ─── API response wrappers ─────────────────────────────────────────────────────

export function apiOk<T>(data: T) {
  return { data, message: 'OK', statusCode: 200 };
}

export function apiCreated<T>(data: T) {
  return { data, message: 'Created', statusCode: 201 };
}

// ─── Route helpers ─────────────────────────────────────────────────────────────

const API = 'http://localhost:3000/api';

/** Intercept all standard public API calls with happy-path mocks */
export async function mockPublicApi(page: Page) {
  await page.route(`${API}/categories`, (route) =>
    route.fulfill({ json: apiOk(mockCategories) }),
  );
  await page.route(`${API}/products*`, (route) =>
    route.fulfill({ json: apiOk(mockPaginatedProducts) }),
  );
}

/** Intercept categories only */
export async function mockCategories_(page: Page) {
  await page.route(`${API}/categories`, (route) =>
    route.fulfill({ json: apiOk(mockCategories) }),
  );
}

/** Intercept a single product by ID */
export async function mockProduct(page: Page, product = mockSingleProduct) {
  await page.route(`${API}/products/${product.id}`, (route) =>
    route.fulfill({ json: apiOk(product) }),
  );
  // Also mock related products list
  await page.route(`${API}/products*`, (route) =>
    route.fulfill({
      json: apiOk({ items: mockProducts.filter((p) => p.id !== product.id).slice(0, 3), total: 2, page: 1, limit: 4, totalPages: 1 }),
    }),
  );
  await page.route(`${API}/categories`, (route) =>
    route.fulfill({ json: apiOk(mockCategories) }),
  );
}

/** Make the products list endpoint return an empty page */
export async function mockEmptyProducts(page: Page) {
  await page.route(`${API}/products*`, (route) =>
    route.fulfill({
      json: apiOk({ items: [], total: 0, page: 1, limit: 12, totalPages: 0 }),
    }),
  );
  await page.route(`${API}/categories`, (route) =>
    route.fulfill({ json: apiOk(mockCategories) }),
  );
}

/** Make the products list have two pages of results */
export async function mockPaginatedProductsApi(page: Page) {
  let callCount = 0;
  await page.route(`${API}/products*`, (route) => {
    const url = new URL(route.request().url());
    const pg = parseInt(url.searchParams.get('page') || '1', 10);
    const items = pg === 1 ? [mockProducts[0], mockProducts[1]] : [mockProducts[2]];
    route.fulfill({
      json: apiOk({ items, total: 3, page: pg, limit: 2, totalPages: 2 }),
    });
    callCount++;
  });
  await page.route(`${API}/categories`, (route) =>
    route.fulfill({ json: apiOk(mockCategories) }),
  );
}

/** Make the contact API succeed */
export async function mockContactSuccess(page: Page) {
  await page.route(`${API}/contact`, (route) =>
    route.fulfill({ json: apiCreated(null) }),
  );
}

/** Make the contact API fail with a server error */
export async function mockContactError(page: Page, message = 'Eroare server intern') {
  await page.route(`${API}/contact`, (route) =>
    route.fulfill({
      status: 500,
      json: { message, statusCode: 500 },
    }),
  );
}

/** Make the orders API succeed */
export async function mockOrderSuccess(page: Page) {
  await page.route(`${API}/orders`, (route) =>
    route.fulfill({ json: apiCreated(null) }),
  );
}

/** Make the orders API fail */
export async function mockOrderError(page: Page, message = 'Eroare la plasarea comenzii') {
  await page.route(`${API}/orders`, (route) =>
    route.fulfill({
      status: 500,
      json: { message, statusCode: 500 },
    }),
  );
}
