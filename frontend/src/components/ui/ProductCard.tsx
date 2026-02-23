import { Link } from 'react-router-dom';
import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
}

const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || '';

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.images[0]
    ? `${API_URL}${product.images[0]}`
    : '/placeholder-cake.jpg';

  return (
    <Link
      to={`/produse/${product.id}`}
      className="group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="aspect-[4/3] overflow-hidden bg-blush">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect fill="%23F8E8E0" width="400" height="300"/><text x="200" y="150" text-anchor="middle" fill="%23C9A96E" font-size="48">🎂</text></svg>';
          }}
        />
      </div>
      <div className="p-5">
        {product.category && (
          <span className="text-xs font-medium tracking-wider uppercase text-gold">
            {product.category.name}
          </span>
        )}
        <h3 className="font-serif text-lg text-charcoal mt-1 group-hover:text-gold transition-colors">
          {product.name}
        </h3>
        {product.shortDescription && (
          <p className="text-sm text-warm-gray mt-1 line-clamp-2">
            {product.shortDescription}
          </p>
        )}
        <p className="mt-3 font-medium text-charcoal">
          {product.priceLabel && (
            <span className="text-sm text-warm-gray mr-1">{product.priceLabel}</span>
          )}
          {product.price} RON
        </p>
      </div>
    </Link>
  );
}
