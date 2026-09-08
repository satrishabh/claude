import { client } from './client';
import type { AuthResponse, RegisterBody, LoginBody } from './api-spec';

export async function register(body: RegisterBody): Promise<AuthResponse> {
  const { data } = await client.post<AuthResponse>('/auth/register', body);
  return data;
}

export async function login(body: LoginBody): Promise<AuthResponse> {
  const { data } = await client.post<AuthResponse>('/auth/login', body);
  return data;
}

export async function logout(): Promise<void> {
  await client.post('/auth/logout');
}
