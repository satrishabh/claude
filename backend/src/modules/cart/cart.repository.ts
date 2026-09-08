import Database from 'better-sqlite3';
import { getDatabase } from '../../config/database';

export interface CartRow {
  id: string;
  customer_id: string;
  updated_at: string;
}

export interface CartItemRow {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
}

export interface CartItemWithProduct extends CartItemRow {
  product_name: string;
  sku: string;
}

export class CartRepository {
  private db: Database.Database;

  constructor() {
    this.db = getDatabase();
  }

  findCartByCustomerId(customerId: string): CartRow | undefined {
    return this.db
      .prepare('SELECT * FROM carts WHERE customer_id = ?')
      .get(customerId) as CartRow | undefined;
  }

  createCart(cart: CartRow): void {
    this.db
      .prepare('INSERT INTO carts (id, customer_id, updated_at) VALUES (?, ?, ?)')
      .run(cart.id, cart.customer_id, cart.updated_at);
  }

  updateCartTimestamp(cartId: string, updatedAt: string): void {
    this.db.prepare('UPDATE carts SET updated_at = ? WHERE id = ?').run(updatedAt, cartId);
  }

  findItemsByCartId(cartId: string): CartItemWithProduct[] {
    return this.db
      .prepare(
        `SELECT ci.*, p.name as product_name, p.sku
         FROM cart_items ci
         JOIN products p ON ci.product_id = p.id
         WHERE ci.cart_id = ?`
      )
      .all(cartId) as CartItemWithProduct[];
  }

  findItemById(itemId: string): CartItemRow | undefined {
    return this.db
      .prepare('SELECT * FROM cart_items WHERE id = ?')
      .get(itemId) as CartItemRow | undefined;
  }

  findItemByProductId(cartId: string, productId: string): CartItemRow | undefined {
    return this.db
      .prepare('SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?')
      .get(cartId, productId) as CartItemRow | undefined;
  }

  addItem(item: CartItemRow): void {
    this.db
      .prepare(
        'INSERT INTO cart_items (id, cart_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?, ?)'
      )
      .run(item.id, item.cart_id, item.product_id, item.quantity, item.unit_price);
  }

  updateItem(itemId: string, quantity: number): void {
    this.db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(quantity, itemId);
  }

  deleteItem(itemId: string): void {
    this.db.prepare('DELETE FROM cart_items WHERE id = ?').run(itemId);
  }

  clearCart(cartId: string): void {
    this.db.prepare('DELETE FROM cart_items WHERE cart_id = ?').run(cartId);
  }

  deleteCart(cartId: string): void {
    this.db.prepare('DELETE FROM carts WHERE id = ?').run(cartId);
  }
}
