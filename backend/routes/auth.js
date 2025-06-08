const express = require('express');
const db = require('../db');
const { hash, compare } = require('../utils/hash');
const { signToken } = require('../utils/auth');
const router = express.Router();

// Register
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered
 */
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const passwordHash = await hash(password);
    await db.query(`
      INSERT INTO users (username, email, password_hash)
      VALUES ($1, $2, $3)`, [username, email, passwordHash]);
    res.status(201).json({ message: 'User registered' });
  } catch {
    res.status(400).json({ error: 'Registration failed' });
  }
});

// Login
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User Login
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const result = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);
  const user = result.rows[0];
  if (!user) return res.status(401).json({ error: 'Invalid email' });

  const match = await compare(password, user.password_hash);
  if (!match) return res.status(401).json({ error: 'Wrong password' });

  const token = signToken({ id: user.id });
  res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
});

module.exports = router;
