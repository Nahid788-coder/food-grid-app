import express from 'express';
import crypto from 'crypto';
import mongoose from 'mongoose';
import Razorpay from 'razorpay';
import Order from '../models/Order.js';
import { notifyStaff } from '../lib/privacy.js';

const router = express.Router();

const configured = () => {
    const id = process.env.RAZORPAY_KEY_ID;
    return Boolean(id && process.env.RAZORPAY_KEY_SECRET && !/REPLACE|x{6,}/i.test(id));
};

const getRazorpay = () =>
    configured()
        ? new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET })
        : null;

router.get('/key', (_req, res) => {
    res.json(configured() ? { key: process.env.RAZORPAY_KEY_ID, configured: true } : { key: null, configured: false });
});

/** Creates a Razorpay order for an existing order. The amount always comes from the database. */
router.post('/create-order', async (req, res) => {
    try {
        const { orderId } = req.body;
        if (!mongoose.isValidObjectId(orderId)) return res.status(400).json({ message: 'Invalid order' });

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        if (order.paymentStatus === 'paid') return res.status(400).json({ message: 'Order is already paid' });

        const rzp = getRazorpay();
        if (!rzp) return res.status(503).json({ message: 'Online payment is not configured yet. Please choose Cash on Delivery.' });

        const rzpOrder = await rzp.orders.create({
            amount: Math.round(order.total * 100),
            currency: 'INR',
            receipt: `order_${order._id}`,
        });
        order.razorpayOrderId = rzpOrder.id;
        await order.save();

        res.json({ orderId: rzpOrder.id, amount: rzpOrder.amount, currency: rzpOrder.currency });
    } catch (err) {
        res.status(500).json({ message: err.error?.description || err.message });
    }
});

router.post('/verify', async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        if (!configured() || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ message: 'Payment verification failed', verified: false });
        }

        const expected = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');
        const a = Buffer.from(expected);
        const b = Buffer.from(String(razorpay_signature));
        if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
            return res.status(400).json({ message: 'Payment verification failed', verified: false });
        }

        // The Razorpay order must be the one we created for this order.
        const order = await Order.findOneAndUpdate(
            { razorpayOrderId: razorpay_order_id },
            { paymentStatus: 'paid', razorpayPaymentId: razorpay_payment_id },
            { new: true },
        );
        if (!order) return res.status(404).json({ message: 'Order not found', verified: false });

        notifyStaff(req.app.get('io'), 'order-updated', order);
        res.json({ verified: true, orderId: order._id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
