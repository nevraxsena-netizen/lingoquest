const request = require('supertest');
const app = require('../backend/server');
const pool = require('../backend/db');

let adminToken = '';
let translatorToken = '';
let translationId;

beforeAll(async () => {
  const bcrypt = require('bcryptjs');
  const adminHash = await bcrypt.hash('Admin123', 10);
  const transHash = await bcrypt.hash('Trans123', 10);

  await pool.query('DELETE FROM users WHERE username IN ($1, $2)', ['admintest2', 'transtest']);
  await pool.query(
    'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3)',
    ['admintest2', adminHash, 'admin']
  );
  await pool.query(
    'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3)',
    ['transtest', transHash, 'translator']
  );

  const admin = await request(app)
    .post('/api/auth/login')
    .send({ username: 'admintest2', password: 'Admin123' });
  adminToken = admin.body.token;

  const translator = await request(app)
    .post('/api/auth/login')
    .send({ username: 'transtest', password: 'Trans123' });
  translatorToken = translator.body.token;
});

afterAll(async () => {
  await pool.query('DELETE FROM translations WHERE user_id IN (SELECT id FROM users WHERE username IN ($1, $2))', ['admintest2', 'transtest']);
  await pool.query('DELETE FROM users WHERE username IN ($1, $2)', ['admintest2', 'transtest']);
  await pool.end();
});

describe('Translations Routes', () => {

  test('POST /api/translations — translator can submit', async () => {
    const res = await request(app)
      .post('/api/translations')
      .set('Authorization', `Bearer ${translatorToken}`)
      .send({ string_id: 1, language_code: 'fr', translated_text: 'Démarrer le jeu' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('status', 'pending');
    translationId = res.body.id;
  });

  test('PATCH /api/translations/:id/approve — admin can approve', async () => {
    const res = await request(app)
      .patch(`/api/translations/${translationId}/approve`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'approved');
  });

  test('PATCH /api/translations/:id/reject — admin can reject', async () => {
    const res = await request(app)
      .patch(`/api/translations/${translationId}/reject`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'rejected');
  });

  test('PATCH /api/translations/:id/approve — translator cannot approve', async () => {
    const res = await request(app)
      .patch(`/api/translations/${translationId}/approve`)
      .set('Authorization', `Bearer ${translatorToken}`);

    expect(res.statusCode).toBe(403);
  });
});