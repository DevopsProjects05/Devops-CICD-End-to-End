const request = require('supertest');
const app = require('../server');

describe('E-Commerce Website Tests', () => {
  it('GET / should return the homepage', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });

  it('GET /health should return server health status', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('UP');
  });
});
