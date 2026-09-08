export interface CategoryRequest {
  name: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}
