import Database from 'better-sqlite3';
import { getDatabase } from '../../config/database';

export interface OrderRow {
  id: string;
  customer_id: string;
  status: string;
  shipping_address_id: string;
  billing_address_id: string;
  subtotal: number;
  shipping_cost: number;
  tax_amount: number;
  total: number;
  currency: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItemRow {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  sku: string;
  quantity: number;
  unit_price: number;
  line_total: number;
}

export class OrderRepository {
  private db: Database.Database;

  constructor() {
    this.db = getDatabase();
  }

  findByCustomerId(
    customerId: string,
    status: string | undefined,
    page: number,
    pageSize: number
  ): { rows: OrderRow[]; total: number } {
    const conditions = ['customer_id = ?'];
    const params: unknown[] = [customerId];

    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }

    const where = conditions.join(' AND ');
    const offset = (page - 1) * pageSize;

    const total = (
      this.db.prepare(`SELECT COUNT(*) as count FROM orders WHERE ${where}`).get(...params) as {
        count: number;
      }
    ).count;

    const rows = this.db
      .prepare(`SELECT * FROM orders WHERE ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`)
      .all(...params, pageSize, offset) as OrderRow[];

    return { rows, total };
  }

  findById(id: string): OrderRow | undefined {
    return this.db
      .prepare('SELECT * FROM orders WHERE id = ?')
      .get(id) as OrderRow | undefined;
  }

  create(order: OrderRow): void {
    this.db
      .prepare(
        `INSERT INTO orders (id, customer_id, status, shipping_address_id, billing_address_id, subtotal, shipping_cost, tax_amount, total, currency, notes, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        order.id, order.customer_id, order.status,
        order.shipping_address_id, order.billing_address_id,
        order.subtotal, order.shipping_cost, order.tax_amount,
        order.total, order.currency, order.notes,
        order.created_at, order.updated_at
      );
  }

  updateStatus(id: string, status: string, updatedAt: string): void {
    this.db
      .prepare('UPDATE orders SET status = ?, updated_at = ? WHERE id = ?')
      .run(status, updatedAt, id);
  }

  createItems(items: OrderItemRow[]): void {
    const stmt = this.db.prepare(
      `INSERT INTO order_items (id, order_id, product_id, product_name, sku, quantity, unit_price, line_total)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    );
    for (const item of items) {
      stmt.run(
        item.id, item.order_id, item.product_id,
        item.product_name, item.sku, item.quantity,
        item.unit_price, item.line_total
      );
    }
  }

  findItemsByOrderId(orderId: string): OrderItemRow[] {
    return this.db
      .prepare('SELECT * FROM order_items WHERE order_id = ?')
      .all(orderId) as OrderItemRow[];
  }
}
