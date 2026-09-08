import { client } from './client';
import type { Cart, CartItemBody, CartItemUpdateBody } from './api-spec';

export async function getCart(): Promise<Cart> {
  const { data } = await client.get<Cart>('/cart');
  return data;
}

export async function clearCart(): Promise<void> {
  await client.delete('/cart');
}

export async function addCartItem(body: CartItemBody): Promise<Cart> {
  const { data } = await client.post<Cart>('/cart/items', body);
  return data;
}

export async function updateCartItem(itemId: string, body: CartItemUpdateBody): Promise<Cart> {
  const { data } = await client.patch<Cart>(`/cart/items/${itemId}`, body);
  return data;
}

export async function removeCartItem(itemId: string): Promise<Cart> {
  const { data } = await client.delete<Cart>(`/cart/items/${itemId}`);
  return data;
}
