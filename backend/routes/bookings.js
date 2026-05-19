import express from 'express';
import Booking from '../models/Booking.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { name, phone, email, date, time, guests, note } = req.body;
        if (!name || !phone || !date || !time || !guests) {
            return res.status(400).json({ message: 'Missing required fields' });
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

router.get('/', protect, adminOnly, async (req, res) => {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const bookings = await Booking.find(filter).sort('-createdAt');
    res.json(bookings);
});

router.put('/:id/status', protect, adminOnly, async (req, res) => {
    try {
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
