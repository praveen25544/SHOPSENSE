"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = require("../controllers/productController");
const auth_1 = require("../middleware/auth");
const validate_1 = __importDefault(require("../middleware/validate"));
const productValidator_1 = require("../validators/productValidator");
const router = (0, express_1.Router)();
// Public routes
router.get('/', productController_1.getProducts);
router.get('/categories', productController_1.getCategories);
router.get('/:id', productController_1.getProduct);
// Admin only routes
router.post('/', auth_1.protect, (0, auth_1.restrictTo)('admin'), (0, validate_1.default)(productValidator_1.createProductSchema), productController_1.createProduct);
router.put('/:id', auth_1.protect, (0, auth_1.restrictTo)('admin'), (0, validate_1.default)(productValidator_1.updateProductSchema), productController_1.updateProduct);
router.delete('/:id', auth_1.protect, (0, auth_1.restrictTo)('admin'), productController_1.deleteProduct);
exports.default = router;
