import api from './api';
import type { ApiResponse, Category } from '../types';

export const categoryService = {
  getAll: (signal?: AbortSignal) =>
    api.get<never, ApiResponse<Category[]>>('/categories', { signal }),
};
