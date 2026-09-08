import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Address } from '../api/api-spec';
import { listAddresses } from '../api/customers';
import { createOrder } from '../api/orders';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Spinner } from '../components/ui/Spinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { Button } from '../components/ui/Button';
import { getApiError } from '../api/client';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cart, clear } = useCart();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [shippingId, setShippingId] = useState('');
  const [billingId, setBillingId] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (!cart?.items.length) { navigate('/cart'); return; }
    async function load() {
      try {
        const addrs = await listAddresses();
        setAddresses(addrs);
        const def = addrs.find((a) => a.isDefault);
        if (def) { setShippingId(def.id); setBillingId(def.id); }
      } catch (err) {
        setError(getApiError(err));
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [isAuthenticated, cart, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!shippingId || !billingId) { setError('Please select shipping and billing addresses.'); return; }
    setSubmitting(true);
    setError(null);
    try {
      const order = await createOrder({ shippingAddressId: shippingId, billingAddressId: billingId, notes: notes || undefined });
      await clear();
      navigate(`/orders/${order.id}`);
    } catch (err) {
      setError(getApiError(err));
      setSubmitting(false);
    }
  }

  if (loading) return <div className="flex justify-center py-24"><Spinner /></div>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>

      {error && <div className="mt-4"><ErrorMessage message={error} /></div>}

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        {/* Shipping address */}
        <section>
          <h2 className="text-base font-semibold text-gray-900">Shipping Address</h2>
          {addresses.length === 0 ? (
            <p className="mt-2 text-sm text-gray-500">No saved addresses. <button type="button" onClick={() => navigate('/profile')} className="underline">Add one in your profile.</button></p>
          ) : (
            <div className="mt-3 space-y-2">
              {addresses.map((a) => (
                <label key={a.id} className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${shippingId === a.id ? 'border-gray-900 bg-gray-50' : 'border-gray-200'}`}>
                  <input type="radio" name="shipping" value={a.id} checked={shippingId === a.id} onChange={() => setShippingId(a.id)} className="h-4 w-4" />
                  <span className="text-sm text-gray-700">{a.label ?? 'Address'} — {a.countryCode}{a.isDefault ? ' (default)' : ''}</span>
                </label>
              ))}
            </div>
          )}
        </section>

        {/* Billing address */}
        <section>
          <h2 className="text-base font-semibold text-gray-900">Billing Address</h2>
          <div className="mt-3 space-y-2">
            {addresses.map((a) => (
              <label key={a.id} className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${billingId === a.id ? 'border-gray-900 bg-gray-50' : 'border-gray-200'}`}>
                <input type="radio" name="billing" value={a.id} checked={billingId === a.id} onChange={() => setBillingId(a.id)} className="h-4 w-4" />
                <span className="text-sm text-gray-700">{a.label ?? 'Address'} — {a.countryCode}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Notes */}
        <section>
          <label className="block text-base font-semibold text-gray-900">Order Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            placeholder="Special instructions…"
          />
        </section>

        {/* Summary */}
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-gray-900">Order Summary</h2>
          <div className="mt-3 space-y-1 text-sm text-gray-600">
            {cart?.items.map((i) => (
              <div key={i.id} className="flex justify-between">
                <span>{i.product.name} × {i.quantity}</span>
                <span>{i.product.currency} {i.lineTotal.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="my-3 border-t border-gray-200" />
          <div className="flex justify-between text-sm font-semibold text-gray-900">
            <span>Subtotal</span>
            <span>{cart?.currency} {cart?.subtotal.toFixed(2)}</span>
          </div>
        </div>

        <Button type="submit" size="lg" loading={submitting} className="w-full">
          Place Order
        </Button>
      </form>
    </div>
  );
}
