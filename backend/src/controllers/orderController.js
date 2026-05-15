"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getAllOrders = exports.cancelOrder = exports.getOrderById = exports.getMyOrders = exports.createOrder = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const createOrder = async (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod = 'COD' } = req.body;
        if (!items?.length) {
            res.status(400).json({ success: false, message: 'No items in order' });
            return;
        }
        const totalAmount = items.reduce((s, i) => s + i.price * i.quantity, 0);
        const gstAmount = Math.round(totalAmount * 0.18);
        const grandTotal = totalAmount + gstAmount;
        const order = await Order_1.default.create({
            user: req.user._id, items, totalAmount, gstAmount, grandTotal,
            shippingAddress, paymentMethod, status: 'confirmed', paymentStatus: paymentMethod === 'COD' ? 'pending' : 'paid'
        });
        res.status(201).json({ success: true, data: order, message: 'Order placed successfully! 🎉' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to place order' });
    }
};
exports.createOrder = createOrder;
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order_1.default.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json({ success: true, data: orders });
    }
    catch {
        res.status(500).json({ success: false, message: 'Failed to fetch orders' });
    }
};
exports.getMyOrders = getMyOrders;
const getOrderById = async (req, res) => {
    try {
        const order = await Order_1.default.findOne({ _id: req.params.id, user: req.user._id });
        if (!order) {
            res.status(404).json({ success: false, message: 'Order not found' });
            return;
        }
        res.json({ success: true, data: order });
    }
    catch {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getOrderById = getOrderById;
const cancelOrder = async (req, res) => {
    try {
        const order = await Order_1.default.findOne({ _id: req.params.id, user: req.user._id });
        if (!order) {
            res.status(404).json({ success: false, message: 'Order not found' });
            return;
        }
        if (order.status === 'delivered') {
            res.status(400).json({ success: false, message: 'Cannot cancel delivered order' });
            return;
        }
        order.status = 'cancelled';
        await order.save();
        res.json({ success: true, message: 'Order cancelled', data: order });
    }
    catch {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.cancelOrder = cancelOrder;
// Admin
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order_1.default.find().populate('user', 'name email').sort({ createdAt: -1 });
        res.json({ success: true, data: orders });
    }
    catch {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getAllOrders = getAllOrders;
const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order_1.default.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        if (!order) {
            res.status(404).json({ success: false, message: 'Order not found' });
            return;
        }
        res.json({ success: true, data: order });
    }
    catch {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.updateOrderStatus = updateOrderStatus;
