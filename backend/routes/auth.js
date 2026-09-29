import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const sign = (user) =>
    jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d',
    });

router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ message: 'Name, email, password are required' });
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email)))
            return res.status(400).json({ message: 'Please enter a valid email' });
        if (password.length < 6)
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        const exists = await User.findOne({ email: email.toLowerCase() });
        if (exists) return res.status(400).json({ message: 'Email already registered' });
        const user = await User.create({ name: String(name).slice(0, 80), email, password, phone });
        const token = sign(user);
        res.status(201).json({
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone },
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: 'Email and password are required' });
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });
        const ok = await user.matchPassword(password);
        if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
        const token = sign(user);
        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone },
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/me', protect, async (req, res) => {
    res.json({
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
            phone: req.user.phone,
        },
    });
});

export default router;
