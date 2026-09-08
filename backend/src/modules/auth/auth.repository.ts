import Database from 'better-sqlite3';
import { getDatabase } from '../../config/database';

export interface CustomerRow {
  id: string;
  username: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

export interface RefreshTokenRow {
  id: string;
  customer_id: string;
  token: string;
  expires_at: string;
}

export class AuthRepository {
  private db: Database.Database;

  constructor() {
    this.db = getDatabase();
  }

  findCustomerByUsername(username: string): CustomerRow | undefined {
    return this.db
      .prepare('SELECT * FROM customers WHERE username = ?')
      .get(username) as CustomerRow | undefined;
  }

  findCustomerById(id: string): CustomerRow | undefined {
    return this.db
      .prepare('SELECT * FROM customers WHERE id = ?')
      .get(id) as CustomerRow | undefined;
  }

  createCustomer(customer: CustomerRow): void {
    this.db
      .prepare(
        'INSERT INTO customers (id, username, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?)'
      )
      .run(
        customer.id,
        customer.username,
        customer.password_hash,
        customer.created_at,
        customer.updated_at
      );
  }

  saveRefreshToken(token: RefreshTokenRow): void {
    this.db
      .prepare(
        'INSERT INTO refresh_tokens (id, customer_id, token, expires_at) VALUES (?, ?, ?, ?)'
      )
      .run(token.id, token.customer_id, token.token, token.expires_at);
  }

  findRefreshToken(token: string): RefreshTokenRow | undefined {
    return this.db
      .prepare('SELECT * FROM refresh_tokens WHERE token = ?')
      .get(token) as RefreshTokenRow | undefined;
  }

  deleteRefreshToken(token: string): void {
    this.db.prepare('DELETE FROM refresh_tokens WHERE token = ?').run(token);
  }

  deleteRefreshTokensByCustomerId(customerId: string): void {
    this.db.prepare('DELETE FROM refresh_tokens WHERE customer_id = ?').run(customerId);
  }
}
