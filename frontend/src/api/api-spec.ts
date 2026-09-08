export const API_BASE = 'https://api.example.com/v1';

// ── Enums ──────────────────────────────────────────────────────────────────
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'authorised' | 'captured' | 'failed' | 'refunded' | 'partially_refunded';
export type PaymentMethod = 'payment_token' | 'paypal' | 'bank_transfer' | 'wallet';

// ── Shared ─────────────────────────────────────────────────────────────────
export type Pagination = { page: number; pageSize: number; totalItems: number; totalPages: number };
export type ApiError = { code: string; message: string };
export type ValidationError = ApiError & { errors: { field: string; message: string }[] };

// ── Domain Types ───────────────────────────────────────────────────────────
export type Customer = { id: string; username: string; createdAt: string; updatedAt: string };
export type Address  = { id: string; label?: string; countryCode: string; isDefault: boolean; createdAt: string };

export type Category = { id: string; name: string; slug: string; imageUrl?: string; parentId?: string | null; createdAt: string; updatedAt: string };

export type Product = {
  id: string; sku: string; name: string; slug: string; price: number; compareAtPrice?: number | null;
  currency: string; stockQuantity: number; images: string[]; categoryId: string;
  tags: string[]; isActive: boolean; createdAt: string; updatedAt: string;
};

export type CartItem = { id: string; product: Product; quantity: number; unitPrice: number; lineTotal: number };
export type Cart     = { id: string; customerId: string; items: CartItem[]; subtotal: number; currency: string; updatedAt: string };

export type OrderItem = { id: string; productId: string; productName: string; sku: string; quantity: number; unitPrice: number; lineTotal: number };
export type Payment   = { id: string; orderId: string; status: PaymentStatus; method: PaymentMethod; amount: number; currency: string; createdAt: string; updatedAt: string };
export type Order     = {
  id: string; customerId: string; status: OrderStatus; items: OrderItem[];
  shippingAddress: Address; billingAddress: Address;
  subtotal: number; shippingCost: number; taxAmount: number; total: number; currency: string;
  payment?: Payment; notes?: string | null; createdAt: string; updatedAt: string;
};

// ── Page wrappers ──────────────────────────────────────────────────────────
export type Page<T> = { items: T[]; pagination: Pagination };

// ── Auth responses ─────────────────────────────────────────────────────────
export type AuthResponse = { accessToken: string; refreshToken: string; expiresIn: number; customer: Customer };

// ── Request bodies ─────────────────────────────────────────────────────────
export type RegisterBody          = { username: string; password: string };
export type LoginBody             = { username: string; password: string };
export type RefreshTokenBody      = { refreshToken: string };
export type CategoryBody          = { name: string; description?: string; imageUrl?: string; parentId?: string | null };
export type ProductBody           = { sku: string; name: string; description?: string; price: number; compareAtPrice?: number | null; currency: string; stockQuantity: number; images?: string[]; categoryId: string; tags?: string[]; isActive?: boolean };
export type ProductPatch          = Partial<Pick<ProductBody, 'name' | 'description' | 'price' | 'stockQuantity' | 'isActive'>>;
export type CartItemBody          = { productId: string; quantity: number };
export type CartItemUpdateBody    = { quantity: number };
export type CreateOrderBody       = { shippingAddressId: string; billingAddressId: string; notes?: string };
export type PaymentBody           = { orderId: string; method: PaymentMethod; paymentToken: string; returnUrl?: string };
export type RefundBody            = { amount?: number; reason?: string };
export type CustomerUpdateBody    = { username?: string };
export type AddressBody           = { addressToken: string; countryCode: string; label?: string; isDefault?: boolean };

// ── Product query params ───────────────────────────────────────────────────
export type ProductQuery = { categoryId?: string; search?: string; minPrice?: number; maxPrice?: number; inStock?: boolean; page?: number; pageSize?: number; sortBy?: string; sortOrder?: 'asc' | 'desc' };

// ── Endpoints map ──────────────────────────────────────────────────────────
// format: { method, path, [params?], [query?], [body?], response }

export const endpoints = {
  // Auth
  register:        { method: 'POST',   path: '/auth/register',                      body: 'RegisterBody',       response: 'AuthResponse' },
  login:           { method: 'POST',   path: '/auth/login',                         body: 'LoginBody',          response: 'AuthResponse' },
  refreshToken:    { method: 'POST',   path: '/auth/refresh',                       body: 'RefreshTokenBody',   response: 'AuthResponse' },
  logout:          { method: 'POST',   path: '/auth/logout',                                                    response: 'void' },

  // Categories
  listCategories:  { method: 'GET',    path: '/categories',                                                     response: 'Category[]' },
  createCategory:  { method: 'POST',   path: '/categories',                         body: 'CategoryBody',       response: 'Category' },
  getCategory:     { method: 'GET',    path: '/categories/{categoryId}',   params: '{categoryId:string}',       response: 'Category' },
  updateCategory:  { method: 'PUT',    path: '/categories/{categoryId}',   params: '{categoryId:string}', body: 'CategoryBody', response: 'Category' },
  deleteCategory:  { method: 'DELETE', path: '/categories/{categoryId}',   params: '{categoryId:string}',       response: 'void' },

  // Products
  listProducts:    { method: 'GET',    path: '/products',                  query: 'ProductQuery',               response: 'Page<Product>' },
  createProduct:   { method: 'POST',   path: '/products',                           body: 'ProductBody',        response: 'Product' },
  getProduct:      { method: 'GET',    path: '/products/{productId}',      params: '{productId:string}',        response: 'Product' },
  updateProduct:   { method: 'PUT',    path: '/products/{productId}',      params: '{productId:string}', body: 'ProductBody', response: 'Product' },
  patchProduct:    { method: 'PATCH',  path: '/products/{productId}',      params: '{productId:string}', body: 'ProductPatch', response: 'Product' },
  deleteProduct:   { method: 'DELETE', path: '/products/{productId}',      params: '{productId:string}',        response: 'void' },

  // Cart
  getCart:         { method: 'GET',    path: '/cart',                                                           response: 'Cart' },
  clearCart:       { method: 'DELETE', path: '/cart',                                                           response: 'void' },
  addCartItem:     { method: 'POST',   path: '/cart/items',                          body: 'CartItemBody',      response: 'Cart' },
  updateCartItem:  { method: 'PATCH',  path: '/cart/items/{itemId}',        params: '{itemId:string}', body: 'CartItemUpdateBody', response: 'Cart' },
  removeCartItem:  { method: 'DELETE', path: '/cart/items/{itemId}',        params: '{itemId:string}',          response: 'Cart' },

  // Orders
  listOrders:      { method: 'GET',    path: '/orders',                     query: '{status?:OrderStatus,page?:number,pageSize?:number}', response: 'Page<Order>' },
  createOrder:     { method: 'POST',   path: '/orders',                              body: 'CreateOrderBody',   response: 'Order' },
  getOrder:        { method: 'GET',    path: '/orders/{orderId}',           params: '{orderId:string}',         response: 'Order' },
  cancelOrder:     { method: 'POST',   path: '/orders/{orderId}/cancel',    params: '{orderId:string}',         response: 'Order' },

  // Payments
  initiatePayment: { method: 'POST',   path: '/payments',                            body: 'PaymentBody',       response: 'Payment' },
  getPayment:      { method: 'GET',    path: '/payments/{paymentId}',       params: '{paymentId:string}',       response: 'Payment' },
  refundPayment:   { method: 'POST',   path: '/payments/{paymentId}/refund',params: '{paymentId:string}', body: 'RefundBody', response: 'Payment' },

  // Customers
  getMyProfile:    { method: 'GET',    path: '/customers/me',                                                   response: 'Customer' },
  updateMyProfile: { method: 'PATCH',  path: '/customers/me',                        body: 'CustomerUpdateBody', response: 'Customer' },
  listAddresses:   { method: 'GET',    path: '/customers/me/addresses',                                         response: 'Address[]' },
  addAddress:      { method: 'POST',   path: '/customers/me/addresses',               body: 'AddressBody',      response: 'Address' },
  updateAddress:   { method: 'PUT',    path: '/customers/me/addresses/{addressId}', params: '{addressId:string}', body: 'AddressBody', response: 'Address' },
  deleteAddress:   { method: 'DELETE', path: '/customers/me/addresses/{addressId}', params: '{addressId:string}', response: 'void' },
} as const;
