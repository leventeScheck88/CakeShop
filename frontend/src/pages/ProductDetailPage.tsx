import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { productService } from '../services/products.service';
import type { Product } from '../types';
import { useProducts } from '../hooks/useProducts';
import Breadcrumb from '../components/ui/Breadcrumb';
import ImageGallery from '../components/ui/ImageGallery';
import Button from '../components/ui/Button';
import ProductCard from '../components/ui/ProductCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import SectionHeading from '../components/ui/SectionHeading';

export default function ProductDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    setLoading(true);
    productService
      .getById(parseInt(id, 10), controller.signal)
      .then((res) => setProduct(res.data))
      .catch((err: Error) => {
        if (!controller.signal.aborted) setError(err.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [id]);

  const { data: relatedData } = useProducts({
    category: product?.category?.slug,
    limit: 4,
    enabled: !!product,
  });

  const relatedProducts =
    relatedData?.items.filter((p) => p.id !== product?.id).slice(0, 3) || [];

  if (loading) return <LoadingSpinner />;
  if (error || !product) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 text-lg">
          {error || t('productDetail.notFound')}
        </p>
        <div className="mt-6">
          <Button to="/produse" variant="secondary">
            {t('productDetail.backToProducts')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: t('productDetail.breadcrumb.home'), to: '/' },
            { label: t('productDetail.breadcrumb.products'), to: '/produse' },
            ...(product.category
              ? [
                  {
                    label: product.category.name,
                    to: `/produse?category=${product.category.slug}`,
                  },
                ]
              : []),
            { label: product.name },
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <ImageGallery images={product.images} alt={product.name} />

          {/* Product Info */}
          <div>
            {product.category && (
              <span className="text-xs font-medium tracking-wider uppercase text-gold">
                {product.category.name}
              </span>
            )}
            <h1 className="font-serif text-3xl md:text-4xl text-charcoal mt-2">
              {product.name}
            </h1>
            <p className="mt-4 text-2xl font-medium text-charcoal">
              {product.priceLabel && (
                <span className="text-base text-warm-gray mr-1">
                  {product.priceLabel}
                </span>
              )}
              {product.price} RON
            </p>

            <div className="mt-2">
              {product.isAvailable ? (
                <span className="inline-flex items-center gap-1 text-sm text-green-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  {t('productDetail.available')}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-sm text-red-500">
                  <span className="w-2 h-2 bg-red-500 rounded-full" />
                  {t('productDetail.unavailable')}
                </span>
              )}
            </div>

            <div className="mt-6 border-t border-blush pt-6">
              <p className="text-warm-gray leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button
                to={`/comanda?productType=${encodeURIComponent(product.category?.name || product.name)}`}
              >
                {t('productDetail.orderButton')}
              </Button>
              <Button to="/contact" variant="secondary">
                {t('productDetail.contactButton')}
              </Button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <SectionHeading title={t('productDetail.relatedTitle')} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
