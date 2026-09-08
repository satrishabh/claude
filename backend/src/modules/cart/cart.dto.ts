export interface CartItemRequest {
  productId: string;
  quantity: number;
}

export interface CartItemUpdateRequest {
  quantity: number;
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Cart {
  id: string;
  customerId: string;
  items: CartItem[];
  subtotal: number;
  updatedAt: string;
}
