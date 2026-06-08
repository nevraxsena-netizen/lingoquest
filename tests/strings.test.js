const request = require('supertest');
const app = require('../backend/server');
const pool = require('../backend/db');

let adminToken = '';

beforeAll(async () => {
  const bcrypt = require('bcryptjs');
  const hash = await bcrypt.hash('Admin123', 10);
  
  await pool.query('DELETE FROM users WHERE username = $1', ['admintest']);
  await pool.query(
    'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3)',
    ['admintest', hash, 'admin']
  );

  const res = await request(app)
    .post('/api/auth/login')
    .send({ username: 'admintest', password: 'Admin123' });
  adminToken = res.body.token;
});

afterAll(async () => {
  await pool.query('DELETE FROM users WHERE username = $1', ['admintest']);
  await pool.end();
});

describe('Strings Routes', () => {
  let createdId;

  test('GET /api/strings — returns array', async () => {
    const res = await request(app).get('/api/strings');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/strings — admin can add string', async () => {
    const res = await request(app)
      .post('/api/strings')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ key: 'test.key', source_text: 'Test string', context: 'Test context' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('key', 'test.key');
    createdId = res.body.id;
  });

  test('PUT /api/strings/:id — admin can update string', async () => {
    const res = await request(app)
      .put(`/api/strings/${createdId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ key: 'test.key', source_text: 'Updated string', context: 'Updated context' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('source_text', 'Updated string');
  });

  test('DELETE /api/strings/:id — admin can delete string', async () => {
    const res = await request(app)
      .delete(`/api/strings/${createdId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
  });

  test('POST /api/strings — no token returns 401', async () => {
    const res = await request(app)
      .post('/api/strings')
      .send({ key: 'noauth.key', source_text: 'No auth' });

    expect(res.statusCode).toBe(401);
  });
});