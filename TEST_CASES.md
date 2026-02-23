# CakeStore — Test Cases

## TC-01 · Navigation & Layout

| # | Test | Expected |
|---|------|----------|
| 1.1 | Load homepage | Page renders, hero section visible, no console errors |
| 1.2 | Header links | Logo, Acasă, Produse, Despre, Contact all navigate correctly |
| 1.3 | Mobile menu | Hamburger icon appears on small screens, menu opens/closes |
| 1.4 | Footer links | Social, contact info rendered; links don't 404 |
| 1.5 | Scroll to top | Navigating between pages scrolls to top |
| 1.6 | 404 page | Visiting `/invalid-route` shows NotFoundPage |

---

## TC-02 · Home Page (`/`)

| # | Test | Expected |
|---|------|----------|
| 2.1 | Hero section renders | Heading, subtitle, CTA button visible |
| 2.2 | Featured products | Products grid loads (fetched from API) |
| 2.3 | Category preview | Category cards render with images and labels |
| 2.4 | About teaser | Short about section visible with CTA link |
| 2.5 | CTA button → Products | Navigates to `/produse` |
| 2.6 | Product card click | Navigates to `/produse/:id` |

---

## TC-03 · Products Page (`/produse`)

| # | Test | Expected |
|---|------|----------|
| 3.1 | All products load | Grid of product cards renders |
| 3.2 | Filter by category | Selecting a category filters products correctly |
| 3.3 | Clear filter | "Toate" / no filter shows all products |
| 3.4 | Pagination | More than 12 products shows pagination controls |
| 3.5 | Pagination navigation | Next/prev page loads correct products |
| 3.6 | Loading state | Spinner shown while fetching |
| 3.7 | Empty state | If no products in category, message shown |
| 3.8 | Product card data | Image, name, price, category all displayed |
| 3.9 | Unavailable product | "Indisponibil" badge/indicator shown |

---

## TC-04 · Product Detail Page (`/produse/:id`)

| # | Test | Expected |
|---|------|----------|
| 4.1 | Page loads for valid ID | Product name, description, price visible |
| 4.2 | Image gallery | Main image + thumbnails render, click switches main image |
| 4.3 | Breadcrumb | Shows Home › Produse › Product Name, links work |
| 4.4 | Availability status | Shows "Disponibil" or "Indisponibil" correctly |
| 4.5 | Order button | Clicking navigates to `/comanda?produs=...` or similar |
| 4.6 | Related products | Related products section renders |
| 4.7 | Invalid product ID | 404 or error state shown gracefully |

---

## TC-05 · About Page (`/despre`)

| # | Test | Expected |
|---|------|----------|
| 5.1 | Page renders | Story text, photo gallery visible |
| 5.2 | Core values | Values/philosophy section renders |
| 5.3 | CTA buttons | Navigate correctly (e.g., to `/produse`, `/contact`) |

---

## TC-06 · Contact Page (`/contact`)

| # | Test | Expected |
|---|------|----------|
| 6.1 | Form renders | All fields: Nume, Email, Telefon, Mesaj, Tip eveniment, Dată |
| 6.2 | Submit empty form | Validation errors shown on all required fields |
| 6.3 | Invalid email | Validation error on email field |
| 6.4 | Valid submission | `POST /api/contact` called, success message shown |
| 6.5 | API error | User-friendly error message shown on failure |
| 6.6 | Contact info | Phone, email, address, hours displayed |
| 6.7 | Social links | Links rendered in footer/contact section |
| 6.8 | Map placeholder | Map section renders without errors |

---

## TC-07 · Order / Inquiry Form (`/comanda`)

| # | Test | Expected |
|---|------|----------|
| 7.1 | Form renders | Customer info + product type + requirements fields visible |
| 7.2 | Pre-filled product type | If navigated from product detail, product type pre-filled |
| 7.3 | Submit empty form | Validation errors on required fields |
| 7.4 | File upload | Can attach reference images (max 5 files) |
| 7.5 | File type validation | Only images accepted |
| 7.6 | Valid submission | `POST /api/orders` called with multipart form, success shown |
| 7.7 | Event date picker | Can select a future date |
| 7.8 | API error | User-friendly error message on failure |

---

## TC-08 · API Integration

| # | Test | Expected |
|---|------|----------|
| 8.1 | `GET /api/products` | Returns paginated product list, 200 |
| 8.2 | `GET /api/products?categoryId=X` | Returns filtered products |
| 8.3 | `GET /api/products?featured=true` | Returns featured products only |
| 8.4 | `GET /api/products/:id` | Returns single product with full data |
| 8.5 | `GET /api/products/invalid-id` | Returns 404 |
| 8.6 | `GET /api/categories` | Returns all categories, 200 |
| 8.7 | `POST /api/contact` (valid) | Returns 201, message saved |
| 8.8 | `POST /api/contact` (missing fields) | Returns 400 with validation errors |
| 8.9 | `POST /api/orders` (valid) | Returns 201, order saved |
| 8.10 | `POST /api/orders` (invalid) | Returns 400 with validation errors |

---

## TC-09 · Responsiveness

| # | Test | Expected |
|---|------|----------|
| 9.1 | Mobile (375px) | All pages usable, no overflow, tap targets adequate |
| 9.2 | Tablet (768px) | Layout adapts correctly |
| 9.3 | Desktop (1280px+) | Full layout, max-width constraint applied |
| 9.4 | Product grid | Columns collapse properly at each breakpoint |
| 9.5 | Image gallery | Touch/swipe works on mobile |

---

## TC-10 · Edge Cases & Error Handling

| # | Test | Expected |
|---|------|----------|
| 10.1 | Backend offline | Frontend shows error state, not blank page |
| 10.2 | Slow connection | Loading spinners shown while fetching |
| 10.3 | Product with no image | Placeholder shown, no broken `<img>` |
| 10.4 | Long product name/description | Layout doesn't break |
| 10.5 | Special characters in form fields | Submitted and displayed correctly |

---

**Priority order for manual testing:** TC-03 → TC-04 → TC-07 → TC-06 → TC-02 → TC-08 (API via curl/Postman) → TC-09 (DevTools device emulation)