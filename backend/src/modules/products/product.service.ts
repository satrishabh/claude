import { AppError } from '../../common/AppError';
import { ProductRepository, ProductRow } from './product.repository';
import { Product, ProductPage, ProductPatchRequest, ProductQuery, ProductRequest } from './product.dto';

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    sku: row.sku,
    name: row.name,
    slug: row.slug,
    description: row.description ?? undefined,
    price: row.price,
    compareAtPrice: row.compare_at_price ?? undefined,
    currency: row.currency,
    stockQuantity: row.stock_quantity,
    images: JSON.parse(row.images) as string[],
    categoryId: row.category_id,
    tags: JSON.parse(row.tags) as string[],
    isActive: row.is_active === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class ProductService {
  private repository: ProductRepository;

  constructor() {
    this.repository = new ProductRepository();
  }

  findAll(query: ProductQuery): ProductPage {
    const page = Math.max(1, query.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, query.pageSize ?? 20));
    const { rows, total } = this.repository.findAll({ ...query, page, pageSize });

    return {
      data: rows.map(toProduct),
      pagination: {
        page,
        pageSize,
        totalItems: total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  findById(id: string): Product {
    const row = this.repository.findById(id);
    if (!row) {
      throw new AppError(404, 'NOT_FOUND', `Product ${id} not found`);
    }
    return toProduct(row);
  }

  create(dto: ProductRequest): Product {
    if (this.repository.findBySku(dto.sku)) {
      throw new AppError(409, 'CONFLICT', 'Product with this SKU already exists');
    }

    const slug = toSlug(dto.name);
    const existingSlug = this.repository.findBySlug(slug);
    const finalSlug = existingSlug ? `${slug}-${Date.now()}` : slug;

    const now = new Date().toISOString();
    const row: ProductRow = {
      id: crypto.randomUUID(),
      sku: dto.sku,
      name: dto.name,
      slug: finalSlug,
      description: dto.description ?? null,
      price: dto.price,
      compare_at_price: dto.compareAtPrice ?? null,
      currency: dto.currency,
      stock_quantity: dto.stockQuantity,
      images: JSON.stringify(dto.images ?? []),
      category_id: dto.categoryId,
      tags: JSON.stringify(dto.tags ?? []),
      is_active: dto.isActive !== false ? 1 : 0,
      created_at: now,
      updated_at: now,
    };

    this.repository.create(row);
    return toProduct(row);
  }

  update(id: string, dto: ProductRequest): Product {
    const existing = this.repository.findById(id);
    if (!existing) {
      throw new AppError(404, 'NOT_FOUND', `Product ${id} not found`);
    }

    const skuConflict = this.repository.findBySku(dto.sku);
    if (skuConflict && skuConflict.id !== id) {
      throw new AppError(409, 'CONFLICT', 'Product with this SKU already exists');
    }

    const slug = toSlug(dto.name);
    const slugConflict = this.repository.findBySlug(slug);
    const finalSlug = slugConflict && slugConflict.id !== id ? `${slug}-${Date.now()}` : slug;

    const now = new Date().toISOString();
    this.repository.update(id, {
      sku: dto.sku,
      name: dto.name,
      slug: finalSlug,
      description: dto.description ?? null,
      price: dto.price,
      compare_at_price: dto.compareAtPrice ?? null,
      currency: dto.currency,
      stock_quantity: dto.stockQuantity,
      images: JSON.stringify(dto.images ?? []),
      category_id: dto.categoryId,
      tags: JSON.stringify(dto.tags ?? []),
      is_active: dto.isActive !== false ? 1 : 0,
      updated_at: now,
    });

    return toProduct(this.repository.findById(id)!);
  }

  patch(id: string, dto: ProductPatchRequest): Product {
    const existing = this.repository.findById(id);
    if (!existing) {
      throw new AppError(404, 'NOT_FOUND', `Product ${id} not found`);
    }

    const now = new Date().toISOString();
    const fields: Partial<ProductRow> = { updated_at: now };

    if (dto.name !== undefined) {
      fields.name = dto.name;
      fields.slug = toSlug(dto.name);
    }
    if (dto.description !== undefined) fields.description = dto.description ?? null;
    if (dto.price !== undefined) fields.price = dto.price;
    if (dto.compareAtPrice !== undefined) fields.compare_at_price = dto.compareAtPrice ?? null;
    if (dto.stockQuantity !== undefined) fields.stock_quantity = dto.stockQuantity;
    if (dto.images !== undefined) fields.images = JSON.stringify(dto.images);
    if (dto.categoryId !== undefined) fields.category_id = dto.categoryId;
    if (dto.tags !== undefined) fields.tags = JSON.stringify(dto.tags);
    if (dto.isActive !== undefined) fields.is_active = dto.isActive ? 1 : 0;

    this.repository.update(id, fields);
    return toProduct(this.repository.findById(id)!);
  }

  delete(id: string): void {
    const existing = this.repository.findById(id);
    if (!existing) {
      throw new AppError(404, 'NOT_FOUND', `Product ${id} not found`);
    }
    this.repository.delete(id);
  }
}
