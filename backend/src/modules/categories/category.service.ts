import { AppError } from '../../common/AppError';
import { CategoryRepository, CategoryRow } from './category.repository';
import { Category, CategoryRequest } from './category.dto';

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function toCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? undefined,
    imageUrl: row.image_url ?? undefined,
    parentId: row.parent_id ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class CategoryService {
  private repository: CategoryRepository;

  constructor() {
    this.repository = new CategoryRepository();
  }

  findAll(): Category[] {
    return this.repository.findAll().map(toCategory);
  }

  findById(id: string): Category {
    const row = this.repository.findById(id);
    if (!row) {
      throw new AppError(404, 'NOT_FOUND', `Category ${id} not found`);
    }
    return toCategory(row);
  }

  create(dto: CategoryRequest): Category {
    const slug = toSlug(dto.name);
    const existing = this.repository.findBySlug(slug);
    if (existing) {
      throw new AppError(409, 'CONFLICT', 'Category with this name already exists');
    }

    const now = new Date().toISOString();
    const row: CategoryRow = {
      id: crypto.randomUUID(),
      name: dto.name,
      slug,
      description: dto.description ?? null,
      image_url: dto.imageUrl ?? null,
      parent_id: dto.parentId ?? null,
      created_at: now,
      updated_at: now,
    };

    this.repository.create(row);
    return toCategory(row);
  }

  update(id: string, dto: CategoryRequest): Category {
    const existing = this.repository.findById(id);
    if (!existing) {
      throw new AppError(404, 'NOT_FOUND', `Category ${id} not found`);
    }

    const slug = toSlug(dto.name);
    const slugConflict = this.repository.findBySlug(slug);
    if (slugConflict && slugConflict.id !== id) {
      throw new AppError(409, 'CONFLICT', 'Category with this name already exists');
    }

    const now = new Date().toISOString();
    this.repository.update(id, {
      name: dto.name,
      slug,
      description: dto.description ?? null,
      image_url: dto.imageUrl ?? null,
      parent_id: dto.parentId ?? null,
      updated_at: now,
    });

    return toCategory(this.repository.findById(id)!);
  }

  delete(id: string): void {
    const existing = this.repository.findById(id);
    if (!existing) {
      throw new AppError(404, 'NOT_FOUND', `Category ${id} not found`);
    }
    this.repository.delete(id);
  }
}
