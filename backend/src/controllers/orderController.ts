import { Response } from 'express';
import Order from '../models/Order';
import { AuthRequest } from '../middleware/auth';

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { items, shippingAddress, paymentMethod = 'COD' } = req.body;
    if (!items?.length) { res.status(400).json({ success: false, message: 'No items in order' }); return; }

    const totalAmount = items.reduce((s: number, i: { price: number; quantity: number }) => s + i.price * i.quantity, 0);
    const gstAmount = Math.round(totalAmount * 0.18);
    const grandTotal = totalAmount + gstAmount;

    const order = await Order.create({
      user: req.user!._id, items, totalAmount, gstAmount, grandTotal,
      shippingAddress, paymentMethod, status: 'confirmed', paymentStatus: paymentMethod === 'COD' ? 'pending' : 'paid'
    });

    res.status(201).json({ success: true, data: order, message: 'Order placed successfully! 🎉' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to place order' });
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await Order.find({ user: req.user!._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};

export const getOrderById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user!._id });
    if (!order) { res.status(404).json({ success: false, message: 'Order not found' }); return; }
    res.json({ success: true, data: order });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const cancelOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user!._id });
    if (!order) { res.status(404).json({ success: false, message: 'Order not found' }); return; }
    if (order.status === 'delivered') { res.status(400).json({ success: false, message: 'Cannot cancel delivered order' }); return; }
    order.status = 'cancelled';
    await order.save();
    res.json({ success: true, message: 'Order cancelled', data: order });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin
export const getAllOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!order) { res.status(404).json({ success: false, message: 'Order not found' }); return; }
    res.json({ success: true, data: order });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
