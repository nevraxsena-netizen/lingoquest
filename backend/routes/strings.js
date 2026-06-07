const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

// Tüm stringleri getir (herkese açık)
router.get('/', async (req, res) => {
  try {
    const { sort } = req.query;
    const order = sort === 'asc' ? 'ASC' : 'DESC';
    const result = await pool.query(
  `SELECT * FROM game_strings ORDER BY created_at ${order}`
);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Tek string getir
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM game_strings WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'String bulunamadı' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// String ara (herkese açık)
router.get('/search/:query', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM game_strings 
       WHERE source_text ILIKE $1 OR key ILIKE $1`,
      [`%${req.params.query}%`]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// String ekle (sadece admin)
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin')
      return res.status(403).json({ error: 'Yetkisiz' });

    const { key, source_text, context } = req.body;
    const result = await pool.query(
      'INSERT INTO game_strings (key, source_text, context) VALUES ($1, $2, $3) RETURNING *',
      [key, source_text, context]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// String güncelle (sadece admin)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin')
      return res.status(403).json({ error: 'Yetkisiz' });

    const { key, source_text, context } = req.body;
    const result = await pool.query(
      `UPDATE game_strings SET key=$1, source_text=$2, context=$3 
       WHERE id=$4 RETURNING *`,
      [key, source_text, context, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// String sil (sadece admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin')
      return res.status(403).json({ error: 'Yetkisiz' });

    await pool.query('DELETE FROM game_strings WHERE id = $1', [req.params.id]);
    res.json({ message: 'Silindi' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;