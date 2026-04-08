import { Router } from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories
} from '../controllers/productController';
import { protect, restrictTo } from '../middleware/auth';
import validate from '../middleware/validate';
import { createProductSchema, updateProductSchema } from '../validators/productValidator';

const router = Router();

// Public routes
router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:id', getProduct);

// Admin only routes
router.post('/', protect, restrictTo('admin'), validate(createProductSchema), createProduct);
router.put('/:id', protect, restrictTo('admin'), validate(updateProductSchema), updateProduct);
router.delete('/:id', protect, restrictTo('admin'), deleteProduct);

export default router;