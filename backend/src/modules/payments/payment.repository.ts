import Database from 'better-sqlite3';
import { getDatabase } from '../../config/database';

export interface PaymentRow {
  id: string;
  order_id: string;
  status: string;
  method: string;
  amount: number;
  currency: string;
  payment_token: string | null;
  created_at: string;
  updated_at: string;
}

export class PaymentRepository {
  private db: Database.Database;

  constructor() {
    this.db = getDatabase();
  }

  findById(id: string): PaymentRow | undefined {
    return this.db
      .prepare('SELECT * FROM payments WHERE id = ?')
      .get(id) as PaymentRow | undefined;
  }

  findByOrderId(orderId: string): PaymentRow | undefined {
    return this.db
      .prepare('SELECT * FROM payments WHERE order_id = ?')
      .get(orderId) as PaymentRow | undefined;
  }

  create(payment: PaymentRow): void {
    this.db
      .prepare(
        `INSERT INTO payments (id, order_id, status, method, amount, currency, payment_token, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        payment.id,
        payment.order_id,
        payment.status,
        payment.method,
        payment.amount,
        payment.currency,
        payment.payment_token,
        payment.created_at,
        payment.updated_at
      );
  }

  updateStatus(id: string, status: string, updatedAt: string): void {
    this.db
      .prepare('UPDATE payments SET status = ?, updated_at = ? WHERE id = ?')
      .run(status, updatedAt, id);
  }
}
