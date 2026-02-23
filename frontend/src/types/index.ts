export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  sortOrder: number;
  productCount?: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  shortDescription: string | null;
  price: number;
  priceLabel: string | null;
  images: string[];
  isAvailable: boolean;
  isFeatured: boolean;
  category: Category;
  categoryId: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  eventType: string;
  eventDate: string;
}

export interface OrderFormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productType: string;
  requirements: string;
  eventDate: string;
  eventType: string;
  referenceImages: File[];
}
