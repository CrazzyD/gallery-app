import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

import pool from '../config/database.js';
import { verifyToken, optionalToken } from '../middleware/auth.js';
import { validateImageFile, validateImageTitle } from '../utils/validators.js';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/* =========================
   MULTER CONFIG
========================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({ storage });

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
   UPLOAD IMAGE
========================= */
router.post('/upload', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    if (!validateImageTitle(title)) {
      return res.status(400).json({ error: 'Invalid title' });
    }

    const check = validateImageFile(req.file);
    if (!check.valid) {
      return res.status(400).json({ error: check.error });
    }

    const imageId = uuidv4();
    const imageUrl = `/uploads/${req.file.filename}`;

    const result = await pool.query(
      `
      INSERT INTO images (id, user_id, title, description, image_url)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [imageId, req.user.userId, title, description || '', imageUrl]
    );

    res.status(201).json({
      message: 'Uploaded',
      image: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

/* =========================
   DELETE IMAGE (FIXED)
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

    // ownership check
    if (image.user_id !== req.user.userId) {
      return res.status(403).json({ error: 'Not allowed' });
    }

    // delete file
    const filePath = path.join(
      process.cwd(),
      'uploads',
      path.basename(image.image_url)
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // delete db
    await pool.query('DELETE FROM images WHERE id = $1', [imageId]);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Delete failed' });
  }
});

export default router;