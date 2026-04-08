import { Router } from 'express';
import { createOrder, getMyOrders, getOrderById, cancelOrder, getAllOrders, updateOrderStatus } from '../controllers/orderController';
import { protect, restrictTo } from '../middleware/auth';

const router = Router();

router.use(protect); // All order routes require login

router.post('/', createOrder);
router.get('/my', getMyOrders);
router.get('/:id', getOrderById);
router.patch('/:id/cancel', cancelOrder);

// Admin only
router.get('/', restrictTo('admin'), getAllOrders);
router.patch('/:id/status', restrictTo('admin'), updateOrderStatus);

export default router;
