# CakeStore

## Project Overview

A presentation and shop web application for a home-based cake and cookie business. The app serves as both a portfolio/showcase and an online ordering platform where customers can browse products, view details, and place orders.

**Reference design:** https://gracecc.ro/cake-shop-7/ — elegant, clean aesthetic with product photography focus.

## Tech Stack

### Frontend
- **Framework:** React (with TypeScript)
- **Routing:** React Router
- **Styling:** Tailwind CSS
- **State Management:** React Context / Zustand (keep it simple)
- **HTTP Client:** Axios
- **Build Tool:** Vite

### Backend
- **Framework:** NestJS (with TypeScript)
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Authentication:** JWT (for admin panel)
- **File Upload:** Multer (for product images)
- **Validation:** class-validator / class-transformer

## Project Structure

```
CakeStore/
├── frontend/          # React app (Vite)
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page-level components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API client / service layer
│   │   ├── context/       # React context providers
│   │   ├── types/         # TypeScript interfaces/types
│   │   └── assets/        # Static assets (images, fonts)
│   └── public/
├── backend/           # NestJS REST API
│   ├── src/
│   │   ├── modules/
│   │   │   ├── products/      # Products CRUD
│   │   │   ├── categories/    # Product categories
│   │   │   ├── orders/        # Order management
│   │   │   ├── auth/          # Admin authentication
│   │   │   └── contact/       # Contact form / inquiries
│   │   ├── common/            # Shared guards, pipes, filters
│   │   └── config/            # App configuration
│   └── uploads/               # Uploaded product images
└── CLAUDE.md
```

## Product Categories

The shop features the following types of products:

- **Cakes** — custom cakes for birthdays, anniversaries, and special events
- **Wedding Cakes** — multi-tier decorated cakes for weddings
- **Kids Cakes** — themed and character cakes for children
- **Signature Cakes** — house specialties, always available
- **Cookies** — decorated cookies, cookie boxes, cookie platters
- **Macarons** — assorted flavors
- **Mini Tarts** — individual-sized tarts
- **Candy Bars** — curated dessert table packages for events

## Pages / Features

### Public (Customer-Facing)

1. **Home** — hero section with featured products, short about section, call-to-action
2. **About** — story of the business, photos, philosophy
3. **Products / Shop** — browse all products, filter by category
4. **Product Detail** — large photos (gallery), description, price, order button
5. **Contact** — contact form (name, email, phone, message, event type, date), embedded map, phone/email/social links
6. **Order / Inquiry Form** — select product type, describe requirements, pick a date, attach reference photos

### Admin Panel (Protected)

1. **Dashboard** — overview of recent orders/inquiries
2. **Product Management** — CRUD for products (name, description, price, category, images, availability)
3. **Category Management** — CRUD for product categories
4. **Order Management** — view and update status of orders/inquiries
5. **Contact Messages** — view messages submitted via the contact form

## REST API Endpoints

### Public
- `GET    /api/products` — list products (with filtering, pagination)
- `GET    /api/products/:id` — single product detail
- `GET    /api/categories` — list categories
- `POST   /api/contact` — submit contact form
- `POST   /api/orders` — submit an order/inquiry

### Admin (JWT protected)
- `POST   /api/auth/login` — admin login
- `POST   /api/products` — create product
- `PATCH  /api/products/:id` — update product
- `DELETE /api/products/:id` — delete product
- `POST   /api/categories` — create category
- `PATCH  /api/categories/:id` — update category
- `DELETE /api/categories/:id` — delete category
- `GET    /api/orders` — list all orders
- `PATCH  /api/orders/:id` — update order status
- `GET    /api/contact` — list contact messages
- `DELETE /api/contact/:id` — delete contact message

## Design Guidelines

- **Style:** Elegant, minimal, feminine — soft color palette (pastels, cream, blush pink, gold accents)
- **Typography:** Clean serif or script font for headings, sans-serif for body text
- **Photography:** Product images are the centerpiece — large, high-quality photos
- **Layout:** Generous whitespace, grid-based product display
- **Responsive:** Mobile-first, works well on all screen sizes
- **Language:** Romanian (primary), with possibility to add English later

## Development Conventions

- Use TypeScript strict mode in both frontend and backend
- Follow NestJS module-based architecture on the backend
- Use functional components and hooks in React (no class components)
- API responses follow a consistent format: `{ data, message, statusCode }`
- Environment variables for all configuration (DB, JWT secret, API URL)
- Keep components small and focused — extract when a component exceeds ~150 lines
