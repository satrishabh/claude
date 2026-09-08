import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Product } from '../api/api-spec';
import { getProduct } from '../api/products';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Spinner } from '../components/ui/Spinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { getApiError } from '../api/client';

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addItem, loading: cartLoading } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!productId) return;
    async function load() {
      try {
        const p = await getProduct(productId!);
        setProduct(p);
      } catch (err) {
        setError(getApiError(err));
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [productId]);

  async function handleAddToCart() {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (!product) return;
    await addItem(product.id, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (loading) return <div className="flex justify-center py-24"><Spinner /></div>;
  if (error) return <div className="mx-auto max-w-lg py-16 px-4"><ErrorMessage message={error} /></div>;
  if (!product) return null;

  const hasDiscount = product.compareAtPrice != null && product.compareAtPrice > product.price;
  const discountPct = hasDiscount ? Math.round((1 - product.price / product.compareAtPrice!) * 100) : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900">
        ← Back
      </button>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Images */}
        <div className="flex flex-col gap-3">
          <div className="aspect-square overflow-hidden rounded-xl bg-gray-100">
            {product.images[selectedImage] ? (
              <img src={product.images[selectedImage]} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center">
                <svg className="h-20 w-20 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border-2 transition-colors ${i === selectedImage ? 'border-gray-900' : 'border-transparent'}`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">SKU: {product.sku}</p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">{product.name}</h1>

          <div className="mt-3 flex items-center gap-3">
            <span className="text-2xl font-semibold text-gray-900">{product.currency} {product.price.toFixed(2)}</span>
            {hasDiscount && (
              <>
                <span className="text-lg text-gray-400 line-through">{product.currency} {product.compareAtPrice!.toFixed(2)}</span>
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600">-{discountPct}%</span>
              </>
            )}
          </div>

          {product.description && (
            <p className="mt-4 text-sm leading-relaxed text-gray-600">{product.description}</p>
          )}

          <div className="mt-6 flex items-center gap-2">
            <span className={`text-sm font-medium ${product.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stockQuantity > 0 ? `In Stock (${product.stockQuantity})` : 'Out of Stock'}
            </span>
          </div>

          {product.stockQuantity > 0 && (
            <div className="mt-6 flex items-center gap-3">
              {/* Quantity */}
              <div className="flex items-center rounded-md border border-gray-300">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2 text-gray-600 hover:bg-gray-50">−</button>
                <span className="w-10 text-center text-sm">{qty}</span>
                <button onClick={() => setQty((q) => Math.min(product.stockQuantity, q + 1))} className="px-3 py-2 text-gray-600 hover:bg-gray-50">+</button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={cartLoading}
                className="flex-1 rounded-md bg-gray-900 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-700 disabled:opacity-50"
              >
                {added ? '✓ Added to Cart' : cartLoading ? 'Adding…' : 'Add to Cart'}
              </button>
            </div>
          )}

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
