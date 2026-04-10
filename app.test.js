const request = require('supertest');
const app = require('./app');

describe('GET /health', () => {
  it('should return status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });
});

describe('GET /api/info', () => {
  it('should return date and hostname', async () => {
    const res = await request(app).get('/api/info');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('date');
    expect(res.body).toHaveProperty('hostname');
    expect(new Date(res.body.date)).toBeInstanceOf(Date);
  });
});
