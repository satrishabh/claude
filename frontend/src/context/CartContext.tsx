import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Cart } from '../api/api-spec';
import * as cartApi from '../api/cart';
import { getApiError } from '../api/client';

interface CartContextValue {
  cart: Cart | null;
  itemCount: number;
  loading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity: number) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clear: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const itemCount = cart?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0;

  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setCart(await cartApi.getCart());
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const addItem = useCallback(async (productId: string, quantity: number) => {
    setLoading(true);
    try {
      setCart(await cartApi.addCartItem({ productId, quantity }));
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const updateItem = useCallback(async (itemId: string, quantity: number) => {
    setLoading(true);
    try {
      setCart(await cartApi.updateCartItem(itemId, { quantity }));
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const removeItem = useCallback(async (itemId: string) => {
    setLoading(true);
    try {
      setCart(await cartApi.removeCartItem(itemId));
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(async () => {
    setLoading(true);
    try {
      await cartApi.clearCart();
      setCart(null);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <CartContext.Provider value={{ cart, itemCount, loading, error, fetchCart, addItem, updateItem, removeItem, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
