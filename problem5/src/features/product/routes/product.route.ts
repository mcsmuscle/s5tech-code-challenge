import { Router } from 'express';
import {
  createProductSchema,
  updateProductSchema,
  getProductByIdSchema,
  deleteProductSchema,
  listProductsSchema,
} from '../schemas/product.schema';
import { validateRequest } from '../../../middleware/validateRequest';
import { ProductRepository } from '../repositories/product.repository';
import prisma from '../../../config/database';
import { ProductService } from '../services/product.service';
import { ProductController } from '../controllers/product.controller';

const productRepository = new ProductRepository(prisma);
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

const router = Router();

// Create a new product
router.post(
  '/',
  validateRequest(createProductSchema),
  productController.create.bind(productController)
);

// List all products with filters
router.get(
  '/',
  validateRequest(listProductsSchema),
  productController.list.bind(productController)
);

// Get a single product by ID
router.get(
  '/:id',
  validateRequest(getProductByIdSchema),
  productController.getById.bind(productController)
);

// Update a product
router.put(
  '/:id',
  validateRequest(updateProductSchema),
  productController.update.bind(productController)
);

// Delete a product
router.delete(
  '/:id',
  validateRequest(deleteProductSchema),
  productController.delete.bind(productController)
);

export default router;
