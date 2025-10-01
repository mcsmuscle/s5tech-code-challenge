export interface CreateProductDTO {
  name: string;
  description?: string;
  price: number;
  category: string;
  stock?: number;
  isActive?: boolean;
}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  stock?: number;
  isActive?: boolean;
}

export interface ProductQueryParams {
  category?: string;
  isActive?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
