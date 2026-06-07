const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

// Bir string'in tüm çevirilerini getir (herkese açık)
router.get('/string/:stringId', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.*, u.username FROM translations t
       JOIN users u ON t.user_id = u.id
       WHERE t.string_id = $1
       ORDER BY t.created_at DESC`,
      [req.params.stringId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Çeviri gönder (giriş yapmış herkes)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { string_id, language_code, translated_text } = req.body;
    const result = await pool.query(
      `INSERT INTO translations (string_id, user_id, language_code, translated_text)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [string_id, req.user.id, language_code, translated_text]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Çeviri onayla (sadece admin)
router.patch('/:id/approve', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin')
      return res.status(403).json({ error: 'Yetkisiz' });

    const result = await pool.query(
      `UPDATE translations SET status='approved'
       WHERE id=$1 RETURNING *`,
      [req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Çeviri reddet (sadece admin)
router.patch('/:id/reject', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin')
      return res.status(403).json({ error: 'Yetkisiz' });

    const result = await pool.query(
      `UPDATE translations SET status='rejected'
       WHERE id=$1 RETURNING *`,
      [req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Çeviri sil (sadece admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin')
      return res.status(403).json({ error: 'Yetkisiz' });

    await pool.query('DELETE FROM translations WHERE id = $1', [req.params.id]);
    res.json({ message: 'Silindi' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;