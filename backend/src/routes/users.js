import express from 'express';
import pool from '../config/database.js';
import { verifyToken, optionalToken } from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/:userId', optionalToken, async (req, res) => {
  try {
    const userResult = await pool.query(
      'SELECT id, username, avatar, created_at FROM users WHERE id = $1',
      [req.params.userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    // Get images count
    const imagesResult = await pool.query(
      'SELECT COUNT(*) as count FROM images WHERE user_id = $1',
      [user.id]
    );

    // Get user images
    const userImagesResult = await pool.query(
      `SELECT 
        i.id, i.title, i.image_url, i.likes_count, i.created_at,
        CASE WHEN $2::uuid IS NOT NULL AND EXISTS(
          SELECT 1 FROM likes WHERE user_id = $2 AND image_id = i.id
        ) THEN true ELSE false END as liked
      FROM images i
      WHERE i.user_id = $1
      ORDER BY i.created_at DESC
      LIMIT 12`,
      [user.id, req.user?.userId || null]
    );

    res.json({
      user: {
        ...user,
        images_count: parseInt(imagesResult.rows[0].count)
      },
      images: userImagesResult.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Get user images (paginated)
router.get('/:userId/images', optionalToken, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT 
        i.id, i.title, i.description, i.image_url, i.likes_count, i.created_at,
        CASE WHEN $3::uuid IS NOT NULL AND EXISTS(
          SELECT 1 FROM likes WHERE user_id = $3 AND image_id = i.id
        ) THEN true ELSE false END as liked
      FROM images i
      WHERE i.user_id = $1
      ORDER BY i.created_at DESC
      LIMIT $2 OFFSET $4`,
      [req.params.userId, limit, req.user?.userId || null, offset]
    );

    const countResult = await pool.query(
      'SELECT COUNT(*) FROM images WHERE user_id = $1',
      [req.params.userId]
    );

    res.json({
      images: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].count)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user images' });
  }
});

export default router;
