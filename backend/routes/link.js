const express = require('express');
const db = require('../db');
const { auth } = require('../utils/auth');
const router = express.Router();

// GET links for user
/**
 * @swagger
 * /api/auth/links:
 *   get:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *     responses:
 *       200:
 *         description: User Login
 */
router.get('/', auth, async (req, res) => {
  const links = await db.query(
    'SELECT * FROM links WHERE user_id = $1 ORDER BY sort_order',
    [req.userId]
  );
  res.json(links.rows);
});

// Add new link
/**
 * @swagger
 * /api/links:
 *   post:
 *     summary: Add new link
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.post('/', auth, async (req, res) => {
  const { title, url } = req.body;
  const result = await db.query(`
    INSERT INTO links (user_id, title, url)
    VALUES ($1, $2, $3) RETURNING *`,
    [req.userId, title, url]
  );
  res.status(201).json(result.rows[0]);
});

// Update link
/**
 * @swagger
 * /api/links/:id:
 *   put:
 *     summary: Update Link
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.put('/:id', auth, async (req, res) => {
  const { title, url, is_active } = req.body;
  const result = await db.query(`
    UPDATE links
    SET title = $1, url = $2, is_active = $3
    WHERE id = $4 AND user_id = $5 RETURNING *`,
    [title, url, is_active, req.params.id, req.userId]
  );
  res.json(result.rows[0]);
});

// Delete link
/**
 * @swagger
 * /api/links/:id:
 *   delete:
 *     summary: Delete Link
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Success
 */
router.delete('/:id', auth, async (req, res) => {
  await db.query('DELETE FROM links WHERE id = $1 AND user_id = $2', [req.params.id, req.userId]);
  res.json({ message: 'Link deleted' });
});

module.exports = router;
