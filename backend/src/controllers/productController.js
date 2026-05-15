"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategories = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProduct = exports.getProducts = void 0;
const Product_1 = __importDefault(require("../models/Product"));
// @route GET /api/products
// Public — get all products with filtering, sorting, pagination
const getProducts = async (req, res) => {
    try {
        const { category, minPrice, maxPrice, search, sort = '-createdAt', page = '1', limit = '12' } = req.query;
        const query = { isActive: true };
        if (category)
            query.category = category;
        if (minPrice || maxPrice) {
            query.price = {
                ...(minPrice && { $gte: Number(minPrice) }),
                ...(maxPrice && { $lte: Number(maxPrice) })
            };
        }
        if (search) {
            query.$text = { $search: search };
        }
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        const [products, total] = await Promise.all([
            Product_1.default.find(query)
                .sort(sort)
                .skip(skip)
                .limit(limitNum),
            Product_1.default.countDocuments(query)
        ]);
        res.json({
            success: true,
            data: products,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum)
            }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getProducts = getProducts;
// @route GET /api/products/:id
// Public
const getProduct = async (req, res) => {
    try {
        const product = await Product_1.default.findById(req.params.id);
        if (!product || !product.isActive) {
            res.status(404).json({ success: false, message: 'Product not found' });
            return;
        }
        res.json({ success: true, data: product });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getProduct = getProduct;
// @route POST /api/products
// Admin only
const createProduct = async (req, res) => {
    try {
        const product = await Product_1.default.create(req.body);
        res.status(201).json({ success: true, data: product });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.createProduct = createProduct;
// @route PUT /api/products/:id
// Admin only
const updateProduct = async (req, res) => {
    try {
        const product = await Product_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!product) {
            res.status(404).json({ success: false, message: 'Product not found' });
            return;
        }
        res.json({ success: true, data: product });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.updateProduct = updateProduct;
// @route DELETE /api/products/:id
// Admin only — soft delete
const deleteProduct = async (req, res) => {
    try {
        const product = await Product_1.default.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
        if (!product) {
            res.status(404).json({ success: false, message: 'Product not found' });
            return;
        }
        res.json({ success: true, message: 'Product deleted' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.deleteProduct = deleteProduct;
// @route GET /api/products/categories
// Public
const getCategories = async (req, res) => {
    try {
        const categories = await Product_1.default.distinct('category', { isActive: true });
        res.json({ success: true, data: categories });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getCategories = getCategories;
