import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

import pool from '../config/database.js';
import { verifyToken, optionalToken } from '../middleware/auth.js';
import { validateImageTitle } from '../utils/validators.js';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

/* =========================
   MEMORY STORAGE (NO DISK)
========================= */
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

/* =========================
   GET ALL IMAGES
========================= */
router.get('/', optionalToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, sort = 'recent' } = req.query;
    const offset = (page - 1) * limit;

    let orderBy = 'i.created_at DESC';
    if (sort === 'popular') orderBy = 'i.likes_count DESC';
    if (sort === 'oldest') orderBy = 'i.created_at ASC';

    const result = await pool.query(
      `
      SELECT 
        i.*,
        u.username,
        u.avatar,
        CASE 
          WHEN $1::uuid IS NOT NULL AND EXISTS(
            SELECT 1 FROM likes 
            WHERE user_id = $1 AND image_id = i.id
          ) THEN true 
          ELSE false 
        END as liked
      FROM images i
      JOIN users u ON i.user_id = u.id
      ORDER BY ${orderBy}
      LIMIT $2 OFFSET $3
      `,
      [req.user?.userId || null, limit, offset]
    );

    const count = await pool.query('SELECT COUNT(*) FROM images');

    res.json({
      images: result.rows,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: Number(count.rows[0].count),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

/* =========================
   UPLOAD IMAGE (CLOUDINARY FIXED)
========================= */
router.post(
  '/upload',
  verifyToken,
  upload.single('image'),
  async (req, res) => {
    try {
      const { title, description } = req.body;

      if (!req.file) {
        return res.status(400).json({ error: 'No image provided' });
      }

      if (!validateImageTitle(title)) {
        return res.status(400).json({ error: 'Invalid title' });
      }

      /* =========================
         UPLOAD TO CLOUDINARY
      ========================= */
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'gallery',
            resource_type: 'image',
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );

        stream.end(req.file.buffer);
      });

      const imageId = uuidv4();

      const result = await pool.query(
        `
        INSERT INTO images (id, user_id, title, description, image_url)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        `,
        [
          imageId,
          req.user.userId,
          title,
          description || '',
          uploadResult.secure_url,
        ]
      );

      res.status(201).json({
        message: 'Uploaded successfully',
        image: result.rows[0],
      });
    } catch (err) {
      console.error('UPLOAD ERROR:', err);
      res.status(500).json({ error: 'Upload failed' });
    }
  }
);

/* =========================
   DELETE IMAGE (CLOUDINARY FIXED)
========================= */
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const imageId = req.params.id;

    const result = await pool.query(
      'SELECT * FROM images WHERE id = $1',
      [imageId]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const image = result.rows[0];

    if (image.user_id !== req.user.userId) {
      return res.status(403).json({ error: 'Not allowed' });
    }

    /* =========================
       DELETE FROM CLOUDINARY (SAFE)
    ========================= */
    try {
      const parts = image.image_url.split('/');
      const fileWithExt = parts[parts.length - 1];
      const publicId = fileWithExt.split('.')[0];

      await cloudinary.uploader.destroy(`gallery/${publicId}`);
    } catch (e) {
      console.log('Cloudinary delete failed (non-critical):', e.message);
    }

    await pool.query('DELETE FROM images WHERE id = $1', [imageId]);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Delete failed' });
  }
});

export default router;