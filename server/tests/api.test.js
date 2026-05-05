const request = require('supertest');
const app = require('../server');

describe('Health check', () => {
  it('GET /health returns 200', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('Report submission', () => {
  it('rejects missing required fields', async () => {
    const res = await request(app).post('/api/report').send({});
    expect(res.statusCode).toBe(422);
    expect(res.body.errors).toBeDefined();
  });

  it('rejects invalid violence_type', async () => {
    const res = await request(app).post('/api/report').send({
      violence_type: 'unknown',
      description: 'A test description that is long enough',
      incident_date: '2024-01-01',
    });
    expect(res.statusCode).toBe(422);
  });
});

describe('Auth', () => {
  it('rejects missing credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.statusCode).toBe(422);
  });

  it('rejects wrong credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      username: 'nonexistent',
      password: 'wrongpassword',
    });
    expect(res.statusCode).toBe(401);
  });
});

describe('Case tracking', () => {
  it('returns 404 for invalid token', async () => {
    const res = await request(app).get('/api/cases/track/INVALID-TOKEN-HERE');
    expect(res.statusCode).toBe(404);
  });
});

describe('Protected routes', () => {
  it('returns 401 without token', async () => {
    const res = await request(app).get('/api/cases');
    expect(res.statusCode).toBe(401);
  });

  it('returns 401 for admin without token', async () => {
    const res = await request(app).get('/api/admin/users');
    expect(res.statusCode).toBe(401);
  });
});
