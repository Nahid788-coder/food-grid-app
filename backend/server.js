import dns from 'dns';
import express from 'express';
import http from 'http';
import { Server as SocketServer } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import authRoutes from './routes/auth.js';
import menuRoutes from './routes/menu.js';
import orderRoutes from './routes/orders.js';
import bookingRoutes from './routes/bookings.js';
import paymentRoutes from './routes/payment.js';
import uploadRoutes from './routes/upload.js';
import statsRoutes from './routes/stats.js';
import { ensureSeed } from './lib/seedData.js';

dotenv.config();

// Some local networks can't resolve MongoDB Atlas SRV records. Opt-in only.
if (process.env.DNS_SERVERS) dns.setServers(process.env.DNS_SERVERS.split(','));

for (const key of ['MONGO_URI', 'JWT_SECRET']) {
    if (!process.env[key]) {
        console.error(`✗ Missing ${key} in environment`);
        process.exit(1);
    }
}

// CLIENT_URL can be a comma-separated list, e.g. "https://app.vercel.app,http://localhost:5173"
const allowed = (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map((s) => s.trim()).filter(Boolean);
const corsOrigin = (origin, cb) => {
    if (!origin || allowed.includes(origin) || /^http:\/\/localhost:\d+$/.test(origin)) return cb(null, true);
    cb(new Error(`Origin ${origin} not allowed by CORS`));
};

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, { cors: { origin: corsOrigin, credentials: true } });

app.set('io', io);
app.set('trust proxy', 1); // Render sits behind a proxy; needed for rate limiting by IP

const PORT = process.env.PORT || 5000;

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json({ limit: '1mb' }));

const limiter = (max, windowMin) =>
    rateLimit({ windowMs: windowMin * 60 * 1000, max, standardHeaders: 'draft-8', legacyHeaders: false, message: { message: 'Too many requests, please try again in a few minutes.' } });

app.get('/', (_req, res) => {
    res.json({ name: 'Slice & Crust API', status: 'running', docs: 'https://github.com/Nahid788-coder/food-grid-app' });
});
app.get('/api/health', (_req, res) => {
    res.json({ ok: true, db: mongoose.connection.readyState === 1 ? 'connected' : 'connecting', uptime: Math.round(process.uptime()) });
});

app.use('/api/auth', limiter(30, 15), authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', limiter(60, 15), orderRoutes);
app.use('/api/bookings', limiter(30, 15), bookingRoutes);
app.use('/api/payment', limiter(40, 15), paymentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/stats', statsRoutes);

app.use((_req, res) => res.status(404).json({ message: 'Not found' }));

app.use((err, _req, res, _next) => {
    console.error(err.message);
    res.status(err.status || 500).json({ message: err.status ? err.message : 'Server error' });
});

io.on('connection', (socket) => {
    socket.on('subscribe-order', (orderId) => {
        if (typeof orderId === 'string' && mongoose.isValidObjectId(orderId)) socket.join(`order:${orderId}`);
    });
    // Only verified admins may join the admin room (it receives customer details).
    socket.on('admin-join', (token) => {
        try {
            const { role } = jwt.verify(String(token || ''), process.env.JWT_SECRET);
            if (role === 'admin') socket.join('admin');
        } catch {
            /* ignore */
        }
    });
});

mongoose
    .connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('✓ MongoDB connected');
        await ensureSeed();
        server.listen(PORT, () => console.log(`✓ Server running on port ${PORT}`));
    })
    .catch((err) => {
        console.error('✗ MongoDB connection failed:', err.message);
        process.exit(1);
    });
