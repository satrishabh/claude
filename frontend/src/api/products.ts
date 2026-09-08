import { client } from './client';
import type { Product, Category, Page, ProductQuery, ProductBody, ProductPatch } from './api-spec';

export async function listCategories(): Promise<Category[]> {
  const { data } = await client.get<Category[]>('/categories');
  return data;
}

export async function listProducts(query?: ProductQuery): Promise<Page<Product>> {
  const { data } = await client.get<Page<Product>>('/products', { params: query });
  return data;
}

export async function getProduct(productId: string): Promise<Product> {
  const { data } = await client.get<Product>(`/products/${productId}`);
  return data;
}

export async function createProduct(body: ProductBody): Promise<Product> {
  const { data } = await client.post<Product>('/products', body);
  return data;
}

export async function updateProduct(productId: string, body: ProductBody): Promise<Product> {
  const { data } = await client.put<Product>(`/products/${productId}`, body);
  return data;
}

export async function patchProduct(productId: string, body: ProductPatch): Promise<Product> {
  const { data } = await client.patch<Product>(`/products/${productId}`, body);
  return data;
}

export async function deleteProduct(productId: string): Promise<void> {
  await client.delete(`/products/${productId}`);
}
