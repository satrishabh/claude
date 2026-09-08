import Database from 'better-sqlite3';
import { getDatabase } from '../../config/database';
import { ProductQuery } from './product.dto';

export interface ProductRow {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  currency: string;
  stock_quantity: number;
  images: string;
  category_id: string;
  tags: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}

const ALLOWED_SORT_COLUMNS: Record<string, string> = {
  name: 'name',
  price: 'price',
  createdAt: 'created_at',
  stockQuantity: 'stock_quantity',
};

export class ProductRepository {
  private db: Database.Database;

  constructor() {
    this.db = getDatabase();
  }

  findAll(query: ProductQuery): { rows: ProductRow[]; total: number } {
    const conditions: string[] = ['1=1'];
    const params: unknown[] = [];

    if (query.categoryId) {
      conditions.push('category_id = ?');
      params.push(query.categoryId);
    }
    if (query.search) {
      conditions.push('(name LIKE ? OR description LIKE ?)');
      params.push(`%${query.search}%`, `%${query.search}%`);
    }
    if (query.minPrice !== undefined) {
      conditions.push('price >= ?');
      params.push(query.minPrice);
    }
    if (query.maxPrice !== undefined) {
      conditions.push('price <= ?');
      params.push(query.maxPrice);
    }
    if (query.inStock) {
      conditions.push('stock_quantity > 0');
    }

    const where = conditions.join(' AND ');
    const sortCol = ALLOWED_SORT_COLUMNS[query.sortBy ?? 'createdAt'] ?? 'created_at';
    const sortDir = query.sortOrder === 'asc' ? 'ASC' : 'DESC';
    const page = Math.max(1, query.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, query.pageSize ?? 20));
    const offset = (page - 1) * pageSize;

    const total = (
      this.db.prepare(`SELECT COUNT(*) as count FROM products WHERE ${where}`).get(...params) as {
        count: number;
      }
    ).count;

    const rows = this.db
      .prepare(
        `SELECT * FROM products WHERE ${where} ORDER BY ${sortCol} ${sortDir} LIMIT ? OFFSET ?`
      )
      .all(...params, pageSize, offset) as ProductRow[];

    return { rows, total };
  }

  findById(id: string): ProductRow | undefined {
    return this.db
      .prepare('SELECT * FROM products WHERE id = ?')
      .get(id) as ProductRow | undefined;
  }

  findBySku(sku: string): ProductRow | undefined {
    return this.db
      .prepare('SELECT * FROM products WHERE sku = ?')
      .get(sku) as ProductRow | undefined;
  }

  findBySlug(slug: string): ProductRow | undefined {
    return this.db
      .prepare('SELECT * FROM products WHERE slug = ?')
      .get(slug) as ProductRow | undefined;
  }

  create(row: ProductRow): void {
    this.db
      .prepare(
        `INSERT INTO products (id, sku, name, slug, description, price, compare_at_price, currency, stock_quantity, images, category_id, tags, is_active, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        row.id, row.sku, row.name, row.slug, row.description,
        row.price, row.compare_at_price, row.currency, row.stock_quantity,
        row.images, row.category_id, row.tags, row.is_active,
        row.created_at, row.updated_at
      );
  }

  update(id: string, fields: Partial<ProductRow>): void {
    const sets: string[] = [];
    const values: unknown[] = [];

    const mappings: Array<[keyof ProductRow, string]> = [
      ['name', 'name'], ['slug', 'slug'], ['description', 'description'],
      ['price', 'price'], ['compare_at_price', 'compare_at_price'],
      ['currency', 'currency'], ['stock_quantity', 'stock_quantity'],
      ['images', 'images'], ['category_id', 'category_id'],
      ['tags', 'tags'], ['is_active', 'is_active'], ['updated_at', 'updated_at'],
    ];

    for (const [field, col] of mappings) {
      if (fields[field] !== undefined) {
        sets.push(`${col} = ?`);
        values.push(fields[field]);
      }
    }

    values.push(id);
    this.db.prepare(`UPDATE products SET ${sets.join(', ')} WHERE id = ?`).run(...values);
  }

  delete(id: string): void {
    this.db.prepare('DELETE FROM products WHERE id = ?').run(id);
  }
}
