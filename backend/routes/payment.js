import express from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import Order from '../models/Order.js';

const router = express.Router();

const getRazorpay = () => {
    if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID.includes('REPLACE')) {
        return null;
    }
    return new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
};

router.get('/key', (_req, res) => {
    const id = process.env.RAZORPAY_KEY_ID;
    if (!id || id.includes('REPLACE')) {
        return res.json({ key: null, configured: false });
    }
    res.json({ key: id, configured: true });
});

router.post('/create-order', async (req, res) => {
    try {
        const { amount } = req.body;
        if (!amount || amount < 1) {
            return res.status(400).json({ message: 'Invalid amount' });
        }
        const rzp = getRazorpay();
        if (!rzp) {
            return res.status(503).json({
                message: 'Payment gateway not configured. Add RAZORPAY_KEY_ID to backend/.env',
            });
        }
        const order = await rzp.orders.create({
            amount: Math.round(amount * 100),
            currency: 'INR',
            receipt: `rcpt_${Date.now()}`,
        });
        res.json({ orderId: order.id, amount: order.amount, currency: order.currency });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/verify', async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
        const text = `${razorpay_order_id}|${razorpay_payment_id}`;
        const expected = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(text)
            .digest('hex');
        if (expected !== razorpay_signature) {
            return res.status(400).json({ message: 'Payment verification failed', verified: false });
        }
        if (orderId) {
            await Order.findByIdAndUpdate(orderId, {
                paymentStatus: 'paid',
                paymentMethod: 'card',
            });
        }
        res.json({ verified: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
