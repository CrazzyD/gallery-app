import express from 'express';
import pool from '../config/database.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * TOGGLE LIKE
 */
router.post('/:imageId', verifyToken, async (req, res) => {
  try {
    const { imageId } = req.params;
    const userId = req.user.userId;

    // check if already liked
    const existing = await pool.query(
      'SELECT * FROM likes WHERE user_id = $1 AND image_id = $2',
      [userId, imageId]
    );

    if (existing.rows.length > 0) {
      // unlike
      await pool.query(
        'DELETE FROM likes WHERE user_id = $1 AND image_id = $2',
        [userId, imageId]
      );

      await pool.query(
        'UPDATE images SET likes_count = likes_count - 1 WHERE id = $1',
        [imageId]
      );

      return res.json({ liked: false });
    }

    // like
    await pool.query(
      'INSERT INTO likes (id, user_id, image_id) VALUES (gen_random_uuid(), $1, $2)',
      [userId, imageId]
    );

    await pool.query(
      'UPDATE images SET likes_count = likes_count + 1 WHERE id = $1',
      [imageId]
    );

    res.json({ liked: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Like toggle failed' });
  }
});

export default router;