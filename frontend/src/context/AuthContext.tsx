import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { Customer } from '../api/api-spec';
import * as authApi from '../api/auth';
import { getApiError } from '../api/client';

interface AuthState {
  customer: Customer | null;
  isAuthenticated: boolean;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    customer: null,
    isAuthenticated: !!localStorage.getItem('accessToken'),
    loading: false,
  });

  useEffect(() => {
    const stored = localStorage.getItem('customer');
    if (stored) {
      try {
        setState((s) => ({ ...s, customer: JSON.parse(stored) as Customer, isAuthenticated: true }));
      } catch {
        localStorage.removeItem('customer');
      }
    }
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    setState((s) => ({ ...s, loading: true }));
    try {
      const res = await authApi.login({ username, password });
      localStorage.setItem('accessToken', res.accessToken);
      localStorage.setItem('refreshToken', res.refreshToken);
      localStorage.setItem('customer', JSON.stringify(res.customer));
      setState({ customer: res.customer, isAuthenticated: true, loading: false });
    } catch (err) {
      setState((s) => ({ ...s, loading: false }));
      throw new Error(getApiError(err));
    }
  }, []);

  const register = useCallback(async (username: string, password: string) => {
    setState((s) => ({ ...s, loading: true }));
    try {
      const res = await authApi.register({ username, password });
      localStorage.setItem('accessToken', res.accessToken);
      localStorage.setItem('refreshToken', res.refreshToken);
      localStorage.setItem('customer', JSON.stringify(res.customer));
      setState({ customer: res.customer, isAuthenticated: true, loading: false });
    } catch (err) {
      setState((s) => ({ ...s, loading: false }));
      throw new Error(getApiError(err));
    }
  }, []);

  const logout = useCallback(async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('customer');
    setState({ customer: null, isAuthenticated: false, loading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
