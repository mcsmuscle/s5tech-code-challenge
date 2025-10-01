import { Product } from '@prisma/client';
import { ProductRepository } from '../repositories/product.repository';
import {
  CreateProductDTO,
  ProductQueryParams,
  UpdateProductDTO,
} from '../types/product.types';

export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async createProduct(product: CreateProductDTO) {
    const newProduct = await this.productRepository.create(product);

    return newProduct;
  }

  async getProducts(query: ProductQueryParams) {
    const {
      category,
      isActive,
      minPrice,
      maxPrice,
      page = '1',
      limit = '10',
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build filter object
    const where: any = {};

    if (category) {
      const categoryArray = category.split(',').map((cat) => cat.trim());
      where.category = { in: categoryArray };
    }

    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    // Get total count for pagination
    const total = await this.productRepository.count(where);

    // Get products
    const products = await this.productRepository.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    return {
      total,
      products,
      pageNum,
      limitNum,
    };
  }

  async getProductById(id: string) {
    const product = await this.productRepository.findUnique(id);

    return product;
  }

  async updateProduct(id: string, data: UpdateProductDTO) {
    const updatedProduct = await this.productRepository.update(id, data);

    return updatedProduct;
  }

  async deleteProduct(id: string) {
    const deletedProduct = await this.productRepository.delete(id);

    return deletedProduct;
  }
}
