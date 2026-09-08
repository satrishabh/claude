import Database from 'better-sqlite3';
import { getDatabase } from '../../config/database';

export interface CustomerRow {
  id: string;
  username: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

export interface AddressRow {
  id: string;
  customer_id: string;
  label: string | null;
  address_token: string;
  country_code: string;
  is_default: number;
  created_at: string;
}

export class CustomerRepository {
  private db: Database.Database;

  constructor() {
    this.db = getDatabase();
  }

  findById(id: string): CustomerRow | undefined {
    return this.db
      .prepare('SELECT * FROM customers WHERE id = ?')
      .get(id) as CustomerRow | undefined;
  }

  findByUsername(username: string): CustomerRow | undefined {
    return this.db
      .prepare('SELECT * FROM customers WHERE username = ?')
      .get(username) as CustomerRow | undefined;
  }

  updateUsername(id: string, username: string, updatedAt: string): void {
    this.db
      .prepare('UPDATE customers SET username = ?, updated_at = ? WHERE id = ?')
      .run(username, updatedAt, id);
  }
}

export class AddressRepository {
  private db: Database.Database;

  constructor() {
    this.db = getDatabase();
  }

  findById(id: string): AddressRow | undefined {
    return this.db
      .prepare('SELECT * FROM addresses WHERE id = ?')
      .get(id) as AddressRow | undefined;
  }

  findByCustomerId(customerId: string): AddressRow[] {
    return this.db
      .prepare('SELECT * FROM addresses WHERE customer_id = ? ORDER BY created_at DESC')
      .all(customerId) as AddressRow[];
  }

  create(address: AddressRow): void {
    this.db
      .prepare(
        'INSERT INTO addresses (id, customer_id, label, address_token, country_code, is_default, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
      )
      .run(
        address.id,
        address.customer_id,
        address.label,
        address.address_token,
        address.country_code,
        address.is_default,
        address.created_at
      );
  }

  clearDefaults(customerId: string): void {
    this.db
      .prepare('UPDATE addresses SET is_default = 0 WHERE customer_id = ?')
      .run(customerId);
  }

  update(id: string, fields: Partial<AddressRow>): void {
    const sets: string[] = [];
    const values: unknown[] = [];

    if (fields.label !== undefined) { sets.push('label = ?'); values.push(fields.label); }
    if (fields.address_token !== undefined) { sets.push('address_token = ?'); values.push(fields.address_token); }
    if (fields.country_code !== undefined) { sets.push('country_code = ?'); values.push(fields.country_code); }
    if (fields.is_default !== undefined) { sets.push('is_default = ?'); values.push(fields.is_default); }

    values.push(id);
    this.db.prepare(`UPDATE addresses SET ${sets.join(', ')} WHERE id = ?`).run(...values);
  }

  delete(id: string): void {
    this.db.prepare('DELETE FROM addresses WHERE id = ?').run(id);
  }
}
