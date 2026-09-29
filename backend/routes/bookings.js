import express from 'express';
import Booking from '../models/Booking.js';
import { protect, adminOnly, optionalAuth, staffRead } from '../middleware/auth.js';
import { maskBooking } from '../lib/privacy.js';

const router = express.Router();

router.post('/', optionalAuth, async (req, res) => {
    try {
        const { name, phone, email, date, time, guests, note } = req.body;
        if (!name || !phone || !date || !time || !guests) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const day = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (Number.isNaN(day.getTime()) || day < today) {
            return res.status(400).json({ message: 'Please pick today or a future date' });
        }
        const booking = await Booking.create({
            user: req.user?._id,
            name, phone, email, date, time, guests, note,
        });
        res.status(201).json(booking);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.get('/', protect, staffRead, async (req, res) => {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const bookings = await Booking.find(filter).sort('-createdAt').limit(500).lean();
    res.json(req.user.role === 'demo' ? bookings.map(maskBooking) : bookings);
});

router.put('/:id/status', protect, adminOnly, async (req, res) => {
    try {
        if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(req.body.status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        const b = await Booking.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        if (!b) return res.status(404).json({ message: 'Not found' });
        res.json(b);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;
