import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Order, OrderStatus } from '../api/api-spec';
import { listOrders } from '../api/orders';
import { useAuth } from '../context/AuthContext';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { Badge } from '../components/ui/Badge';
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

export default function OrdersPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    async function load() {
      try {
        const page = await listOrders({ pageSize: 20 });
        setOrders(page.items);
      } catch (err) {
        setError(getApiError(err));
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [isAuthenticated, navigate]);

  if (loading) return <div className="flex justify-center py-24"><Spinner /></div>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>

      {error && <div className="mt-4"><ErrorMessage message={error} /></div>}

      {!error && orders.length === 0 && (
        <EmptyState
          title="No orders yet"
          description="Your order history will appear here."
          action={{ label: 'Start Shopping', onClick: () => navigate('/products') }}
        />
      )}

      {!error && orders.length > 0 && (
        <div className="mt-6 space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="block rounded-lg border border-gray-200 bg-white p-5 transition-shadow hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <Badge label={order.status} variant={statusVariant[order.status]} />
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-gray-500">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                <span className="font-semibold text-gray-900">{order.currency} {order.total.toFixed(2)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
