const request = require('supertest');
const app = require('../backend/server');

let adminToken = '';
let translatorToken = '';
let translationId;

beforeAll(async () => {
  // Register users
  await request(app)
    .post('/api/auth/register')
    .send({ username: 'admintest2', password: 'Admin123', role: 'admin' });

  await request(app)
    .post('/api/auth/register')
    .send({ username: 'translatortest', password: 'Trans123' });

  const admin = await request(app)
    .post('/api/auth/login')
    .send({ username: 'admintest2', password: 'Admin123' });
  adminToken = admin.body.token;

  const translator = await request(app)
    .post('/api/auth/login')
    .send({ username: 'translatortest', password: 'Trans123' });
  translatorToken = translator.body.token;
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