import api from './api';
import type { ApiResponse, PaginatedResponse, Product } from '../types';

interface ProductFilters {
  page?: number;
  limit?: number;
  category?: string;
  featured?: boolean;
  search?: string;
}

export const productService = {
  getAll: (filters: ProductFilters = {}, signal?: AbortSignal) =>
    api.get<never, ApiResponse<PaginatedResponse<Product>>>('/products', {
      params: filters,
      signal,
    }),

  getById: (id: number, signal?: AbortSignal) =>
    api.get<never, ApiResponse<Product>>(`/products/${id}`, { signal }),

  getFeatured: () =>
    api.get<never, ApiResponse<PaginatedResponse<Product>>>('/products', {
      params: { featured: true, limit: 8 },
    }),
};
