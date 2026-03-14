import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { protect, adminOnly, partnerOnly } from '../middleware/authMiddleware.js';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

// Ensure uploads folder exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage — save to backend/uploads/
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
        cb(null, `${unique}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/;
    if (allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files allowed (jpg, png, webp, gif)'));
    }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// Multer memory storage for Cloudinary uploads (no disk write needed)
const memoryUpload = multer({
    storage: multer.memoryStorage(),
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }
});

// POST /api/upload — admin protected (Migrated to Cloudinary)
router.post('/', protect, adminOnly, memoryUpload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Upload buffer to Cloudinary using upload_stream
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: 'jobpilot_services', // Using a different folder for admin uploads
                    transformation: [{ width: 1200, crop: 'limit' }] // good default width for services/banners
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            stream.end(req.file.buffer);
        });

        res.json({ url: result.secure_url });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading to Cloudinary', error: error.message });
    }
});

// POST /api/upload/cloudinary — partner or admin
router.post('/cloudinary', protect, memoryUpload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Upload buffer to Cloudinary using upload_stream
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: 'jobpilot_evidence',
                    transformation: [{ width: 1000, crop: 'limit' }]
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            stream.end(req.file.buffer);
        });

        res.json({ url: result.secure_url });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading to Cloudinary', error: error.message });
    }
});

export default router;
