import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

const isCloudinaryConfigured = () =>
    process.env.CLOUDINARY_CLOUD_NAME &&
    !process.env.CLOUDINARY_CLOUD_NAME.includes('REPLACE');

if (isCloudinaryConfigured()) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
}

const storage = isCloudinaryConfigured()
    ? new CloudinaryStorage({
        cloudinary,
        params: {
            folder: 'slice-and-crust',
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
            transformation: [{ width: 800, height: 600, crop: 'fill', quality: 'auto' }],
        },
    })
    : multer.memoryStorage();

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/image', protect, adminOnly, upload.single('image'), (req, res) => {
    if (!isCloudinaryConfigured()) {
        return res.status(503).json({
            message: 'Image upload not configured. Add CLOUDINARY_* keys to backend/.env',
        });
    }
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    res.json({ url: req.file.path, publicId: req.file.filename });
});

export default router;
