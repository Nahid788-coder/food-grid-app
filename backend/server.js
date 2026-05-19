import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);

import express from 'express';
import http from 'http';
import { Server as SocketServer } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import menuRoutes from './routes/menu.js';
import orderRoutes from './routes/orders.js';
import bookingRoutes from './routes/bookings.js';
import paymentRoutes from './routes/payment.js';
import uploadRoutes from './routes/upload.js';
import statsRoutes from './routes/stats.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
    cors: { origin: process.env.CLIENT_URL || true, credentials: true },
});

app.set('io', io);

const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || true, credentials: true }));
app.use(express.json({ limit: '10mb' }));

app.get('/', (_req, res) => {
    res.json({
        name: 'Slice & Crust API',
        version: '1.0.0',
        status: 'running',
        endpoints: ['/api/auth', '/api/menu', '/api/orders', '/api/bookings', '/api/payment', '/api/upload', '/api/stats'],
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/stats', statsRoutes);

app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

io.on('connection', (socket) => {
    socket.on('subscribe-order', (orderId) => {
        if (orderId) socket.join(`order:${orderId}`);
    });
    socket.on('admin-join', () => socket.join('admin'));
});

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✓ MongoDB connected');
        server.listen(PORT, () => console.log(`✓ Server running on http://localhost:${PORT}`));
    })
    .catch((err) => {
        console.error('✗ MongoDB connection failed:', err.message);
        process.exit(1);
    });
