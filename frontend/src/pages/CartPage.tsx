import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorMessage } from '../components/ui/ErrorMessage';

export default function CartPage() {
  const { cart, loading, error, fetchCart, updateItem, removeItem } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) void fetchCart();
  }, [isAuthenticated, fetchCart]);

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-lg py-24 px-4 text-center">
        <p className="text-gray-600">Sign in to view your cart.</p>
        <Link to="/login" className="mt-4 inline-block rounded-md bg-gray-900 px-6 py-2 text-sm font-semibold text-white hover:bg-gray-700">Sign in</Link>
      </div>
    );
  }

  if (loading && !cart) return <div className="flex justify-center py-24"><Spinner /></div>;
  if (error) return <div className="mx-auto max-w-lg py-16 px-4"><ErrorMessage message={error} onRetry={fetchCart} /></div>;

  const items = cart?.items ?? [];

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
        <EmptyState
          title="Your cart is empty"
          description="Add some items to get started."
          action={{ label: 'Shop Now', onClick: () => navigate('/products') }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 rounded-lg border border-gray-200 bg-white p-4">
              {/* Image */}
              <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                {item.product.images[0] ? (
                  <img src={item.product.images[0]} alt={item.product.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <svg className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <Link to={`/products/${item.product.id}`} className="text-sm font-medium text-gray-900 hover:underline">
                    {item.product.name}
                  </Link>
                  <p className="text-sm text-gray-500">{item.product.currency} {item.unitPrice.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center rounded-md border border-gray-300">
                    <button onClick={() => updateItem(item.id, item.quantity - 1)} disabled={item.quantity <= 1 || loading}
                      className="px-2.5 py-1 text-gray-600 hover:bg-gray-50 disabled:opacity-40">−</button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button onClick={() => updateItem(item.id, item.quantity + 1)} disabled={loading}
                      className="px-2.5 py-1 text-gray-600 hover:bg-gray-50 disabled:opacity-40">+</button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-xs text-red-500 hover:text-red-700">Remove</button>
                </div>
              </div>

              {/* Line total */}
              <p className="text-sm font-semibold text-gray-900">{item.product.currency} {item.lineTotal.toFixed(2)}</p>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 h-fit">
          <h2 className="text-base font-semibold text-gray-900">Order Summary</h2>
          <div className="mt-4 space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{cart?.currency} {cart?.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-gray-400">Calculated at checkout</span>
            </div>
          </div>
          <div className="my-4 border-t border-gray-200" />
          <div className="flex justify-between text-base font-semibold text-gray-900">
            <span>Total</span>
            <span>{cart?.currency} {cart?.subtotal.toFixed(2)}</span>
          </div>
          <Link
            to="/checkout"
            className="mt-5 block w-full rounded-md bg-gray-900 py-3 text-center text-sm font-semibold text-white hover:bg-gray-700"
          >
            Proceed to Checkout
          </Link>
          <Link to="/products" className="mt-3 block text-center text-sm text-gray-500 hover:text-gray-900">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
