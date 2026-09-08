export interface ProductRequest {
  sku: string;
  name: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  stockQuantity: number;
  images?: string[];
  categoryId: string;
  tags?: string[];
  isActive?: boolean;
}

export interface ProductPatchRequest {
  name?: string;
  description?: string;
  price?: number;
  compareAtPrice?: number;
  stockQuantity?: number;
  images?: string[];
  categoryId?: string;
  tags?: string[];
  isActive?: boolean;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  stockQuantity: number;
  images: string[];
  categoryId: string;
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductPage {
  data: Product[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface ProductQuery {
  categoryId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
