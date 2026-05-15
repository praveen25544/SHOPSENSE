"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.protect); // All order routes require login
router.post('/', orderController_1.createOrder);
router.get('/my', orderController_1.getMyOrders);
router.get('/:id', orderController_1.getOrderById);
router.patch('/:id/cancel', orderController_1.cancelOrder);
// Admin only
router.get('/', (0, auth_1.restrictTo)('admin'), orderController_1.getAllOrders);
router.patch('/:id/status', (0, auth_1.restrictTo)('admin'), orderController_1.updateOrderStatus);
exports.default = router;
