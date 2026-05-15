"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductSchema = exports.createProductSchema = void 0;
const zod_1 = require("zod");
exports.createProductSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
        description: zod_1.z.string().min(10, 'Description must be at least 10 characters'),
        price: zod_1.z.number().positive('Price must be positive'),
        category: zod_1.z.string().min(1, 'Category is required'),
        brand: zod_1.z.string().min(1, 'Brand is required'),
        images: zod_1.z.array(zod_1.z.string()).optional(),
        stock: zod_1.z.number().min(0, 'Stock cannot be negative'),
        tags: zod_1.z.array(zod_1.z.string()).optional(),
    })
});
exports.updateProductSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2).optional(),
        description: zod_1.z.string().min(10).optional(),
        price: zod_1.z.number().positive().optional(),
        category: zod_1.z.string().optional(),
        brand: zod_1.z.string().optional(),
        images: zod_1.z.array(zod_1.z.string()).optional(),
        stock: zod_1.z.number().min(0).optional(),
        tags: zod_1.z.array(zod_1.z.string()).optional(),
        isActive: zod_1.z.boolean().optional(),
    })
});
