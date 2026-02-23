import { useState, useEffect } from 'react';
import { productService } from '../services/products.service';
import type { Product, PaginatedResponse } from '../types';

interface UseProductsOptions {
  page?: number;
  limit?: number;
  category?: string;
  featured?: boolean;
  search?: string;
  enabled?: boolean;
}

export function useProducts(options: UseProductsOptions = {}) {
  const { page, limit, category, featured, search, enabled = true } = options;
  const [data, setData] = useState<PaginatedResponse<Product> | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);
    productService
      .getAll({ page, limit, category, featured, search }, controller.signal)
      .then((res) => setData(res.data))
      .catch((err: Error) => {
        if (!controller.signal.aborted) setError(err.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [page, limit, category, featured, search, enabled]);

  return { data, loading, error };
}
