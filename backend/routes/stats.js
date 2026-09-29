import express from 'express';
import Order from '../models/Order.js';
import Booking from '../models/Booking.js';
import MenuItem from '../models/MenuItem.js';
import { protect, staffRead } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, staffRead, async (_req, res) => {
    try {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const sevenDaysAgo = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const [orders, bookings, menuCount] = await Promise.all([
            Order.find({}).sort('-createdAt').lean(),
            Booking.countDocuments(),
            MenuItem.countDocuments(),
        ]);

        const delivered = orders.filter((o) => o.status === 'delivered');
        const totalRevenue = delivered.reduce((s, o) => s + (o.total || 0), 0);
        const todayOrders = orders.filter((o) => new Date(o.createdAt) >= todayStart);
        const todayRevenue = todayOrders
            .filter((o) => o.status !== 'cancelled')
            .reduce((s, o) => s + (o.total || 0), 0);

        const days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            d.setHours(0, 0, 0, 0);
            const next = new Date(d);
            next.setDate(next.getDate() + 1);
            const dayOrders = orders.filter(
                (o) => new Date(o.createdAt) >= d && new Date(o.createdAt) < next
            );
            const revenue = dayOrders
                .filter((o) => o.status !== 'cancelled')
                .reduce((s, o) => s + (o.total || 0), 0);
            days.push({
                day: d.toLocaleDateString('en-US', { weekday: 'short' }),
                revenue: Math.round(revenue),
                orders: dayOrders.length,
            });
        }

        const itemSales = {};
        orders.forEach((o) => {
            o.items?.forEach((it) => {
                if (!itemSales[it.name]) itemSales[it.name] = { name: it.name, sold: 0, revenue: 0 };
                itemSales[it.name].sold += it.quantity || 1;
                itemSales[it.name].revenue += (it.price || 0) * (it.quantity || 1);
            });
        });
        const topItems = Object.values(itemSales).sort((a, b) => b.sold - a.sold).slice(0, 5);

        const categoryCount = {};
        orders.forEach((o) => {
            o.items?.forEach((it) => {
                const cat = it.category || 'other';
                categoryCount[cat] = (categoryCount[cat] || 0) + (it.quantity || 1);
            });
        });

        const statusCounts = orders.reduce((acc, o) => {
            acc[o.status] = (acc[o.status] || 0) + 1;
            return acc;
        }, {});

        res.json({
            totals: {
                revenue: Math.round(totalRevenue),
                orders: orders.length,
                bookings,
                menuItems: menuCount,
                todayRevenue: Math.round(todayRevenue),
                todayOrders: todayOrders.length,
            },
            weekly: days,
            topItems,
            statusCounts,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
