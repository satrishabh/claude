import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Order, OrderStatus } from '../api/api-spec';
import { getOrder, cancelOrder } from '../api/orders';
import { Spinner } from '../components/ui/Spinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { getApiError } from '../api/client';

const statusVariant: Record<OrderStatus, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  pending:    'warning',
  confirmed:  'info',
  processing: 'info',
  shipped:    'info',
  delivered:  'success',
  cancelled:  'danger',
  refunded:   'default',
};

export default function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;
    async function load() {
      try {
        setOrder(await getOrder(orderId!));
      } catch (err) {
        setError(getApiError(err));
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [orderId]);

  async function handleCancel() {
    if (!orderId || !confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(true);
    try {
      setOrder(await cancelOrder(orderId));
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setCancelling(false);
    }
  }

  if (loading) return <div className="flex justify-center py-24"><Spinner /></div>;
  if (error) return <div className="mx-auto max-w-lg py-16 px-4"><ErrorMessage message={error} /></div>;
  if (!order) return null;

  const canCancel = order.status === 'pending' || order.status === 'confirmed';

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <button onClick={() => navigate('/orders')} className="mb-6 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900">
        ← Orders
      </button>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order #{order.id.slice(0, 8).toUpperCase()}</h1>
          <p className="text-sm text-gray-500 mt-1">Placed {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        <Badge label={order.status} variant={statusVariant[order.status]} />
      </div>

      {/* Items */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-white divide-y divide-gray-100">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-medium text-gray-900">{item.productName}</p>
              <p className="text-xs text-gray-500">SKU: {item.sku} · Qty: {item.quantity}</p>
            </div>
            <p className="text-sm font-semibold text-gray-900">{order.currency} {item.lineTotal.toFixed(2)}</p>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-5 space-y-2 text-sm">
        <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{order.currency} {order.subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between text-gray-600"><span>Shipping</span><span>{order.currency} {order.shippingCost.toFixed(2)}</span></div>
        <div className="flex justify-between text-gray-600"><span>Tax</span><span>{order.currency} {order.taxAmount.toFixed(2)}</span></div>
        <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t border-gray-200">
          <span>Total</span><span>{order.currency} {order.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Addresses */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Shipping</p>
          <p className="mt-1 text-sm text-gray-700">{order.shippingAddress.label ?? 'Address'} — {order.shippingAddress.countryCode}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Billing</p>
          <p className="mt-1 text-sm text-gray-700">{order.billingAddress.label ?? 'Address'} — {order.billingAddress.countryCode}</p>
        </div>
      </div>

      {canCancel && (
        <div className="mt-8">
          <Button variant="danger" loading={cancelling} onClick={handleCancel}>
            Cancel Order
          </Button>
        </div>
      )}
    </div>
  );
}
