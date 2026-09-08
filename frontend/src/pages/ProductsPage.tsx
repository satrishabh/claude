import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Product, Category, ProductQuery } from '../api/api-spec';
import { listProducts, listCategories } from '../api/products';
import { ProductCard } from '../components/product/ProductCard';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { getApiError } from '../api/client';

export default function ProductsPage() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const page = Number(params.get('page') ?? '1');
  const categoryId = params.get('categoryId') ?? undefined;
  const search = params.get('search') ?? undefined;
  const inStock = params.get('inStock') === 'true' ? true : undefined;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const query: ProductQuery = { page, pageSize: 12, categoryId, search, inStock };
    try {
      const [pageData, cats] = await Promise.all([listProducts(query), listCategories()]);
      setProducts(pageData.items);
      setTotalPages(pageData.pagination.totalPages);
      setCategories(cats);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }, [page, categoryId, search, inStock]);

  useEffect(() => { void load(); }, [load]);

  function setFilter(key: string, value: string | undefined) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    next.set('page', '1');
    setParams(next);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900">All Products</h1>

      {/* Filters */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {/* Search */}
        <input
          type="search"
          placeholder="Search…"
          defaultValue={search}
          onKeyDown={(e) => { if (e.key === 'Enter') setFilter('search', (e.target as HTMLInputElement).value || undefined); }}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        />

        {/* Category filter */}
        <select
          value={categoryId ?? ''}
          onChange={(e) => setFilter('categoryId', e.target.value || undefined)}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        >
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        {/* In stock toggle */}
        <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={!!inStock}
            onChange={(e) => setFilter('inStock', e.target.checked ? 'true' : undefined)}
            className="h-4 w-4 rounded border-gray-300"
          />
          In stock only
        </label>

        {/* Clear */}
        {(categoryId || search || inStock) && (
          <button onClick={() => setParams({})} className="text-sm text-gray-500 underline hover:text-gray-900">
            Clear filters
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="mt-6">
        {loading && <Spinner className="mt-16" />}
        {error && <ErrorMessage message={error} onRetry={load} />}
        {!loading && !error && products.length === 0 && (
          <EmptyState title="No products found" description="Try adjusting your filters." action={{ label: 'Clear filters', onClick: () => setParams({}) }} />
        )}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          <button
            onClick={() => setFilter('page', String(page - 1))}
            disabled={page === 1}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-40"
          >
            ← Prev
          </button>
          <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
          <button
            onClick={() => setFilter('page', String(page + 1))}
            disabled={page === totalPages}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
