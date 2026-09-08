import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <p className="text-sm font-semibold text-gray-900">StyleHaus</p>
            <p className="mt-2 text-xs text-gray-500">Modern clothing for every occasion.</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Shop</p>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li><Link to="/products" className="hover:text-gray-900">All Products</Link></li>
              <li><Link to="/products?inStock=true" className="hover:text-gray-900">In Stock</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Account</p>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li><Link to="/profile" className="hover:text-gray-900">Profile</Link></li>
              <li><Link to="/orders" className="hover:text-gray-900">Orders</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Help</p>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li><span className="cursor-default">support@stylehaus.com</span></li>
            </ul>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} StyleHaus. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
