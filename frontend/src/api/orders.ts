import { client } from './client';
import type { Order, Page, CreateOrderBody, OrderStatus } from './api-spec';

export async function listOrders(params?: { status?: OrderStatus; page?: number; pageSize?: number }): Promise<Page<Order>> {
  const { data } = await client.get<Page<Order>>('/orders', { params });
  return data;
}

export async function createOrder(body: CreateOrderBody): Promise<Order> {
  const { data } = await client.post<Order>('/orders', body);
  return data;
}

export async function getOrder(orderId: string): Promise<Order> {
  const { data } = await client.get<Order>(`/orders/${orderId}`);
  return data;
}

export async function cancelOrder(orderId: string): Promise<Order> {
  const { data } = await client.post<Order>(`/orders/${orderId}/cancel`);
  return data;
}
