import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { authenticate } from '../middleware/auth.js';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '';
    cb(null, `thumbnail-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image uploads are allowed'));
    }
    cb(null, true);
  },
});

router.post('/thumbnail', authenticate, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const file = req.file;

    const uploadResult = await cloudinary.uploader.upload(file.path, {
      folder: 'bscs3b-thumbnails',
      resource_type: 'image',
    });

    // Optionally clean up local file (best-effort)
    try {
      fs.unlink(file.path, () => {});
    } catch (cleanupErr) {
      console.warn('Failed to remove temporary upload file:', cleanupErr);
    }

    // Always return the Cloudinary secure URL so the frontend can store it permanently.
    return res.status(201).json({ url: uploadResult.secure_url, provider: 'cloudinary' });
  } catch (error) {
    console.error('Cloudinary upload failed:', error);
    return res.status(500).json({ message: 'Failed to upload image' });
  }
});

export default router;
