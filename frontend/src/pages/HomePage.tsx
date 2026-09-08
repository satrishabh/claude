import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product, Category } from '../api/api-spec';
import { listProducts, listCategories } from '../api/products';
import { ProductCard } from '../components/product/ProductCard';
import { Spinner } from '../components/ui/Spinner';
import { getApiError } from '../api/client';

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [page, cats] = await Promise.all([
          listProducts({ pageSize: 8, sortBy: 'createdAt', sortOrder: 'desc' }),
          listCategories(),
        ]);
        setFeatured(page.items);
        setCategories(cats);
      } catch (err) {
        setError(getApiError(err));
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-xl">
            <p className="text-sm font-medium uppercase tracking-widest text-gray-400">New collection</p>
            <h1 className="mt-3 text-5xl font-bold leading-tight">
              Dress for the<br />moment.
            </h1>
            <p className="mt-4 text-gray-300">
              Curated pieces that move with you — from morning commutes to evening occasions.
            </p>
            <Link
              to="/products"
              className="mt-8 inline-block rounded-md bg-white px-6 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-100"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-lg font-semibold text-gray-900">Shop by Category</h2>
          <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?categoryId=${cat.id}`}
                className="flex-shrink-0 rounded-full border border-gray-200 px-5 py-2 text-sm font-medium text-gray-700 hover:border-gray-900 hover:text-gray-900"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">New Arrivals</h2>
          <Link to="/products" className="text-sm font-medium text-gray-500 hover:text-gray-900">
            View all →
          </Link>
        </div>

        {loading && <Spinner className="mt-12" />}
        {error && <p className="mt-8 text-sm text-red-600">{error}</p>}

        {!loading && !error && (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* Banner */}
      <section className="bg-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Free shipping on orders over $75</h2>
          <p className="mt-2 text-gray-500">Use code <strong>STYLEHAUS</strong> at checkout.</p>
          <Link to="/products" className="mt-6 inline-block rounded-md bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-700">
            Shop the Collection
          </Link>
        </div>
      </section>
    </div>
  );
}
