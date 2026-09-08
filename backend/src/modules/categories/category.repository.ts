import Database from 'better-sqlite3';
import { getDatabase } from '../../config/database';

export interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
}

export class CategoryRepository {
  private db: Database.Database;

  constructor() {
    this.db = getDatabase();
  }

  findAll(): CategoryRow[] {
    return this.db.prepare('SELECT * FROM categories ORDER BY name ASC').all() as CategoryRow[];
  }

  findById(id: string): CategoryRow | undefined {
    return this.db
      .prepare('SELECT * FROM categories WHERE id = ?')
      .get(id) as CategoryRow | undefined;
  }

  findBySlug(slug: string): CategoryRow | undefined {
    return this.db
      .prepare('SELECT * FROM categories WHERE slug = ?')
      .get(slug) as CategoryRow | undefined;
  }

  create(row: CategoryRow): void {
    this.db
      .prepare(
        'INSERT INTO categories (id, name, slug, description, image_url, parent_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
      )
      .run(
        row.id,
        row.name,
        row.slug,
        row.description,
        row.image_url,
        row.parent_id,
        row.created_at,
        row.updated_at
      );
  }

  update(id: string, fields: Partial<CategoryRow>): void {
    const sets: string[] = [];
    const values: unknown[] = [];

    if (fields.name !== undefined) { sets.push('name = ?'); values.push(fields.name); }
    if (fields.slug !== undefined) { sets.push('slug = ?'); values.push(fields.slug); }
    if (fields.description !== undefined) { sets.push('description = ?'); values.push(fields.description); }
    if (fields.image_url !== undefined) { sets.push('image_url = ?'); values.push(fields.image_url); }
    if (fields.parent_id !== undefined) { sets.push('parent_id = ?'); values.push(fields.parent_id); }
    if (fields.updated_at !== undefined) { sets.push('updated_at = ?'); values.push(fields.updated_at); }

    values.push(id);
    this.db.prepare(`UPDATE categories SET ${sets.join(', ')} WHERE id = ?`).run(...values);
  }

  delete(id: string): void {
    this.db.prepare('DELETE FROM categories WHERE id = ?').run(id);
  }
}
