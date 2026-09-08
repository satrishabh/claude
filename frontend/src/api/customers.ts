import { client } from './client';
import type { Customer, Address, CustomerUpdateBody, AddressBody } from './api-spec';

export async function getMyProfile(): Promise<Customer> {
  const { data } = await client.get<Customer>('/customers/me');
  return data;
}

export async function updateMyProfile(body: CustomerUpdateBody): Promise<Customer> {
  const { data } = await client.patch<Customer>('/customers/me', body);
  return data;
}

export async function listAddresses(): Promise<Address[]> {
  const { data } = await client.get<Address[]>('/customers/me/addresses');
  return data;
}

export async function addAddress(body: AddressBody): Promise<Address> {
  const { data } = await client.post<Address>('/customers/me/addresses', body);
  return data;
}

export async function updateAddress(addressId: string, body: AddressBody): Promise<Address> {
  const { data } = await client.put<Address>(`/customers/me/addresses/${addressId}`, body);
  return data;
}

export async function deleteAddress(addressId: string): Promise<void> {
  await client.delete(`/customers/me/addresses/${addressId}`);
}
