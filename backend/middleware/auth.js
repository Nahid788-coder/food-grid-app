import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    try {
        const header = req.headers.authorization;
        if (!header || !header.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Not authorized — no token' });
        }
        const token = header.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(401).json({ message: 'User not found' });
        req.user = user;
        next();
    } catch {
        res.status(401).json({ message: 'Not authorized — invalid token' });
    }
};

export const adminOnly = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};

/** Admins, plus the read-only demo account used on the portfolio. Use only on GET routes. */
export const staffRead = (req, res, next) => {
    if (req.user?.role !== 'admin' && req.user?.role !== 'demo') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};

/** Attaches req.user when a valid token is sent, but never blocks guests. */
export const optionalAuth = async (req, _res, next) => {
    const header = req.headers.authorization;
    if (header?.startsWith('Bearer ')) {
        try {
            const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id);
        } catch {
            /* treat as guest */
        }
    }
    next();
};
