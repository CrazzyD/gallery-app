import express from 'express';
import pool from '../config/database.js';
import { verifyToken } from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// GET comments
router.get('/:imageId', async (req, res) => {
  const result = await pool.query(
    `SELECT c.*, u.username 
     FROM comments c
     JOIN users u ON u.id = c.user_id
     WHERE image_id = $1
     ORDER BY created_at ASC`,
    [req.params.imageId]
  );

  res.json(result.rows);
});

// POST comment
router.post('/:imageId', verifyToken, async (req, res) => {
  const { text } = req.body;

  const id = uuidv4();

  const result = await pool.query(
    `INSERT INTO comments (id, image_id, user_id, text)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [id, req.params.imageId, req.user.userId, text]
  );

  res.json(result.rows[0]);
});

export default router;