import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export function Header() {
  const { isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold tracking-tight text-gray-900">
          StyleHaus
        </Link>

        {/* Nav */}
        <nav className="hidden gap-6 md:flex">
          <NavLink to="/products" className={({ isActive }) =>
            `text-sm font-medium transition-colors ${isActive ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`
          }>
            Shop
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/orders" className={({ isActive }) =>
              `text-sm font-medium transition-colors ${isActive ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`
            }>
              Orders
            </NavLink>
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link to="/cart" className="relative p-2 text-gray-600 hover:text-gray-900" aria-label="Cart">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gray-900 text-[10px] font-bold text-white">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link to="/profile" className="p-2 text-gray-600 hover:text-gray-900" aria-label="Profile">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
              <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-gray-900">
                Sign out
              </button>
            </div>
          ) : (
            <Link to="/login" className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
