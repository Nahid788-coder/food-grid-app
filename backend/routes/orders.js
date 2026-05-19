import express from 'express';
import Order from '../models/Order.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const {
            customerName, customerPhone, customerEmail, address,
            items, subtotal, deliveryFee, total, paymentMethod, notes,
        } = req.body;

        if (!customerName || !customerPhone || !address || !items?.length) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const tax = +(subtotal * 0.05).toFixed(2);

        const order = await Order.create({
            user: req.user?._id,
            customerName, customerPhone, customerEmail, address,
            items, subtotal,
            deliveryFee: deliveryFee ?? 40,
            tax,
            total: total ?? subtotal + (deliveryFee ?? 40) + tax,
            paymentMethod: paymentMethod || 'cod',
            notes,
        });

        const io = req.app.get('io');
        io?.to('admin').emit('new-order', order);

        res.status(201).json(order);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.get('/my', protect, async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.json(orders);
});

router.get('/track/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).select('-customerEmail');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/', protect, adminOnly, async (req, res) => {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const orders = await Order.find(filter).populate('user', 'name email').sort('-createdAt');
    res.json(orders);
});

router.put('/:id/status', protect, adminOnly, async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        if (!order) return res.status(404).json({ message: 'Not found' });

        const io = req.app.get('io');
        io?.to(`order:${order._id}`).emit('order-status-update', {
            orderId: order._id,
            status: order.status,
        });
        io?.to('admin').emit('order-updated', order);

        res.json(order);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;
