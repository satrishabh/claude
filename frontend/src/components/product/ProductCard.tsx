import { Link } from 'react-router-dom';
import type { Product } from '../../api/api-spec';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  async function handleAddToCart() {
    if (!isAuthenticated) { navigate('/login'); return; }
    await addItem(product.id, 1);
  }

  const image = product.images[0];
  const hasDiscount = product.compareAtPrice != null && product.compareAtPrice > product.price;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md">
      {/* Image */}
      <Link to={`/products/${product.id}`} className="aspect-[3/4] overflow-hidden bg-gray-100">
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg className="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </Link>

      {/* Out of stock badge */}
      {product.stockQuantity === 0 && (
        <span className="absolute left-3 top-3 rounded bg-gray-900 px-2 py-0.5 text-xs text-white">Sold Out</span>
      )}

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 hover:underline">{product.name}</h3>
        </Link>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-base font-semibold text-gray-900">
            {product.currency} {product.price.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              {product.currency} {product.compareAtPrice!.toFixed(2)}
            </span>
          )}
        </div>
        <div className="mt-auto pt-3">
          <button
            onClick={handleAddToCart}
            disabled={product.stockQuantity === 0 || loading}
            className="w-full rounded-md bg-gray-900 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </article>
  );
}
