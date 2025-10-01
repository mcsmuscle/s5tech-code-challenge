import { Request, Response, NextFunction } from 'express';
import prisma from '../../../config/database';
import { ProductQueryParams } from '../types/product.types';
import { ProductService } from '../services/product.service';

export class ProductController {
  private productService: ProductService;

  constructor(productService: ProductService) {
    this.productService = productService;
  }

  // Create a new product
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await this.productService.createProduct(req.body);

      res.status(201).json({
        message: 'Product created successfully',
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  // List all products with filters and pagination
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { products, total, pageNum, limitNum } =
        await this.productService.getProducts(req.query);

      res.json({
        message: 'Products retrieved successfully',
        data: products,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Get a single product by ID
  async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      const product = await this.productService.getProductById(id);

      if (!product) {
        res.status(404).json({
          error: 'Product not found',
        });
        return;
      }

      res.json({
        message: 'Product retrieved successfully',
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update a product
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const data = req.body;

      // Check if product exists
      const existingProduct = await this.productService.getProductById(id);

      if (!existingProduct) {
        res.status(404).json({
          error: 'Product not found',
        });
        return;
      }

      const product = await this.productService.updateProduct(id, data);

      res.json({
        message: 'Product updated successfully',
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete a product
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      // Check if product exists
      const existingProduct = await this.productService.getProductById(id);

      if (!existingProduct) {
        res.status(404).json({
          error: 'Product not found',
        });
        return;
      }

      await this.productService.deleteProduct(id);

      res.json({
        message: 'Product deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
