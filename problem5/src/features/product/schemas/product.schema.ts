import { z } from 'zod';

// Schema for creating a product
export const createProductSchema = z.object({
  body: z.object({
    name: z
      .string({
        message: 'Name must be a string',
      })
      .min(1, { message: 'Name is required and cannot be empty' })
      .max(255, { message: 'Name is too long' }),

    description: z
      .string({
        message: 'Description must be a string',
      })
      .max(1000, { message: 'Description is too long' })
      .optional(),

    price: z
      .number({
        message: 'Price is required and must be a number',
      })
      .positive({ message: 'Price must be a positive number' }),

    category: z
      .string({
        message: 'Category must be a string',
      })
      .min(1, { message: 'Category is required and cannot be empty' })
      .max(100, { message: 'Category is too long' }),

    stock: z
      .number({
        message: 'Stock must be a number',
      })
      .int({ message: 'Stock must be an integer' })
      .nonnegative({ message: 'Stock cannot be negative' })
      .optional(),

    isActive: z
      .boolean({
        message: 'isActive must be a boolean',
      })
      .optional(),
  }),
});

// Schema for updating a product
export const updateProductSchema = z.object({
  params: z.object({
    id: z
      .string({
        message: 'Product ID is required',
      })
      .uuid({ message: 'Invalid product ID format' }),
  }),
  body: z.object({
    name: z
      .string()
      .min(1, { message: 'Name cannot be empty' })
      .max(255, { message: 'Name is too long' })
      .optional(),

    description: z
      .string()
      .max(1000, { message: 'Description is too long' })
      .optional()
      .nullable(),

    price: z
      .number()
      .positive({ message: 'Price must be a positive number' })
      .optional(),

    category: z
      .string()
      .min(1, { message: 'Category cannot be empty' })
      .max(100, { message: 'Category is too long' })
      .optional(),

    stock: z
      .number()
      .int({ message: 'Stock must be an integer' })
      .nonnegative({ message: 'Stock cannot be negative' })
      .optional(),

    isActive: z.boolean().optional(),
  }),
});

// Schema for getting a product by ID
export const getProductByIdSchema = z.object({
  params: z.object({
    id: z
      .string({
        message: 'Product ID is required',
      })
      .uuid({ message: 'Invalid product ID format' }),
  }),
});

// Schema for deleting a product
export const deleteProductSchema = z.object({
  params: z.object({
    id: z
      .string({
        message: 'Product ID is required',
      })
      .uuid({ message: 'Invalid product ID format' }),
  }),
});

// Schema for listing products with query parameters
export const listProductsSchema = z.object({
  query: z.object({
    category: z.string().optional(),

    isActive: z
      .enum(['true', 'false'], {
        message: 'isActive must be either "true" or "false"',
      })
      .optional(),

    minPrice: z
      .string()
      .regex(/^\d+(\.\d+)?$/, { message: 'minPrice must be a valid number' })
      .optional(),

    maxPrice: z
      .string()
      .regex(/^\d+(\.\d+)?$/, { message: 'maxPrice must be a valid number' })
      .optional(),

    page: z
      .string()
      .regex(/^\d+$/, { message: 'page must be a valid positive integer' })
      .optional(),

    limit: z
      .string()
      .regex(/^\d+$/, { message: 'limit must be a valid positive integer' })
      .optional(),

    sortBy: z
      .enum(['name', 'price', 'category', 'stock', 'createdAt', 'updatedAt'], {
        message:
          'sortBy must be one of: name, price, category, stock, createdAt, updatedAt',
      })
      .optional(),

    sortOrder: z
      .enum(['asc', 'desc'], {
        message: 'sortOrder must be either "asc" or "desc"',
      })
      .optional(),
  }),
});

// Export types inferred from schemas
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type GetProductByIdInput = z.infer<typeof getProductByIdSchema>;
export type DeleteProductInput = z.infer<typeof deleteProductSchema>;
export type ListProductsInput = z.infer<typeof listProductsSchema>;
