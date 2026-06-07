const request = require('supertest');
const app = require('../backend/server');

describe('Auth Routes', () => {

  test('POST /api/auth/register — creates a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', password: 'test123', role: 'translator' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('username', 'testuser');
    expect(res.body).toHaveProperty('role', 'translator');
  });

  test('POST /api/auth/login — returns token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'test123' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('POST /api/auth/login — wrong password returns 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'wrongpass' });

    expect(res.statusCode).toBe(401);
  });

});