import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    price: z.number().positive('Price must be positive'),
    category: z.string().min(1, 'Category is required'),
    brand: z.string().min(1, 'Brand is required'),
    images: z.array(z.string()).optional(),
    stock: z.number().min(0, 'Stock cannot be negative'),
    tags: z.array(z.string()).optional(),
  })
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    description: z.string().min(10).optional(),
    price: z.number().positive().optional(),
    category: z.string().optional(),
    brand: z.string().optional(),
    images: z.array(z.string()).optional(),
    stock: z.number().min(0).optional(),
    tags: z.array(z.string()).optional(),
    isActive: z.boolean().optional(),
  })
});