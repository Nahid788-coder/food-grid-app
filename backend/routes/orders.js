import express from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import { protect, adminOnly, optionalAuth } from '../middleware/auth.js';
import { priceCart } from '../lib/pricing.js';

const router = express.Router();

const STATUSES = ['placed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'];
const clean = (v, max = 300) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const maskPhone = (p = '') => (p.length > 4 ? `${'•'.repeat(p.length - 4)}${p.slice(-4)}` : p);

router.post('/', optionalAuth, async (req, res) => {
    try {
        const customerName = clean(req.body.customerName, 80);
        const customerPhone = clean(req.body.customerPhone, 20);
        const address = clean(req.body.address, 400);
        if (!customerName || !customerPhone || !address) {
            return res.status(400).json({ message: 'Name, phone and address are required' });
        }

        // Prices are recalculated here; whatever the browser sent is ignored.
        const priced = await priceCart(req.body.items);
        const online = req.body.paymentMethod && req.body.paymentMethod !== 'cod';

        const order = await Order.create({
            user: req.user?._id,
            customerName,
            customerPhone,
            customerEmail: clean(req.body.customerEmail, 120) || req.user?.email,
            address,
            notes: clean(req.body.notes, 400),
            paymentMethod: online ? 'card' : 'cod',
            ...priced,
        });

        req.app.get('io')?.to('admin').emit('new-order', order);
        res.status(201).json(order);
    } catch (err) {
        res.status(err.status || 400).json({ message: err.message });
    }
});

router.get('/my', protect, async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt').limit(100);
    res.json(orders);
});

// Public tracking link: hide contact details from anyone who only has the order id.
router.get('/track/:id', async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Order not found' });
    const order = await Order.findById(req.params.id).select('-customerEmail -razorpayOrderId -razorpayPaymentId -user').lean();
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.customerPhone = maskPhone(order.customerPhone);
    order.address = order.address?.split(',').slice(-2).join(',').trim() || '';
    res.json(order);
});

router.get('/', protect, adminOnly, async (req, res) => {
    const { status } = req.query;
    const filter = STATUSES.includes(status) ? { status } : {};
    const orders = await Order.find(filter).populate('user', 'name email').sort('-createdAt').limit(500);
    res.json(orders);
});

router.put('/:id/status', protect, adminOnly, async (req, res) => {
    try {
        if (!STATUSES.includes(req.body.status)) return res.status(400).json({ message: 'Invalid status' });
        const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        if (!order) return res.status(404).json({ message: 'Not found' });

        const io = req.app.get('io');
        io?.to(`order:${order._id}`).emit('order-status-update', { orderId: order._id, status: order.status });
        io?.to('admin').emit('order-updated', order);
        res.json(order);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;
