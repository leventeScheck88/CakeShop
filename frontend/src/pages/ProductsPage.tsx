import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import ProductCard from '../components/ui/ProductCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function ProductsPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || undefined;
  const page = parseInt(searchParams.get('page') || '1', 10);

  const { data, loading, error } = useProducts({ category, page, limit: 12 });
  const { categories } = useCategories();

  const setCategory = (slug: string | undefined) => {
    const params = new URLSearchParams();
    if (slug) params.set('category', slug);
    setSearchParams(params);
  };

  const setPage = (p: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(p));
    setSearchParams(params);
  };

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-blush to-cream py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl text-charcoal">
            {t('products.pageTitle')}
          </h1>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            <button
              onClick={() => setCategory(undefined)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !category
                  ? 'bg-gold text-white'
                  : 'bg-blush text-warm-gray hover:bg-blush-dark hover:text-charcoal'
              }`}
            >
              {t('products.filterAll')}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.slug)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === cat.slug
                    ? 'bg-gold text-white'
                    : 'bg-blush text-warm-gray hover:bg-blush-dark hover:text-charcoal'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <p className="text-center text-red-500 py-10">{error}</p>
          ) : data && data.items.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {data.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page <= 1}
                    className="px-4 py-2 rounded text-sm border border-blush-dark disabled:opacity-30 hover:bg-blush transition-colors"
                  >
                    {t('products.pagination.prev')}
                  </button>
                  {Array.from({ length: data.totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-10 h-10 rounded text-sm font-medium transition-colors ${
                          p === page
                            ? 'bg-gold text-white'
                            : 'hover:bg-blush text-warm-gray'
                        }`}
                      >
                        {p}
                      </button>
                    ),
                  )}
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page >= data.totalPages}
                    className="px-4 py-2 rounded text-sm border border-blush-dark disabled:opacity-30 hover:bg-blush transition-colors"
                  >
                    {t('products.pagination.next')}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-warm-gray text-lg">
                {t('products.noResults')}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
