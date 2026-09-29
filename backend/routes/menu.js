import express from 'express';
import MenuItem from '../models/MenuItem.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

const CATEGORY_ORDER = ['signature', 'classic', 'veggie', 'spicy', 'sides', 'desserts', 'beverages'];
const byMenuOrder = (a, b) =>
    CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category) ||
    Number(b.isFeatured) - Number(a.isFeatured) ||
    b.rating - a.rating;

const FIELDS = ['name', 'description', 'price', 'image', 'category', 'isVeg', 'isSpicy', 'isFeatured', 'rating', 'ingredients', 'available'];
const pick = (body) => Object.fromEntries(FIELDS.filter((k) => k in body).map((k) => [k, body[k]]));

router.get('/', async (req, res) => {
    try {
        const { category, featured } = req.query;
        const filter = { available: true };
        if (category && category !== 'all') filter.category = category;
        if (featured === 'true') filter.isFeatured = true;
        const items = (await MenuItem.find(filter).lean()).sort(byMenuOrder);
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const item = await MenuItem.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Not found' });
        res.json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', protect, adminOnly, async (req, res) => {
    try {
        const item = await MenuItem.create(pick(req.body));
        res.status(201).json(item);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
    try {
        const item = await MenuItem.findByIdAndUpdate(req.params.id, pick(req.body), {
            new: true,
            runValidators: true,
        });
        if (!item) return res.status(404).json({ message: 'Not found' });
        res.json(item);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        const item = await MenuItem.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ message: 'Not found' });
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
