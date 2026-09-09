import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../index';

const app = createApp();

describe('backend API (single source of truth)', () => {
  it('GET /health → 200', async () => {
    const r = await request(app).get('/health');
    expect(r.status).toBe(200);
    expect(r.body.status).toBe('ok');
  });

  it('GET /ready → 200 (db reachable)', async () => {
    const r = await request(app).get('/ready');
    expect(r.status).toBe(200);
    expect(r.body.checks.db).toBe('ok');
  });

  it('POST /api/v1/leads valid → 201 new', async () => {
    const r = await request(app)
      .post('/api/v1/leads')
      .send({ name: '测试客户', contact: 'wx_test_' + Date.now(), project: 'AI电商', message: '请报价', source: 'test' });
    expect(r.status).toBe(201);
    expect(r.body.status).toBe('new');
  });

  it('POST /api/v1/leads missing contact → 422', async () => {
    const r = await request(app).post('/api/v1/leads').send({ name: 'x' });
    expect(r.status).toBe(422);
  });

  it('POST /api/v1/leads overlong message → 422', async () => {
    const r = await request(app).post('/api/v1/leads').send({ contact: 'c1', message: 'x'.repeat(2001) });
    expect(r.status).toBe(422);
  });

  it('GET /api/v1/leads → 200 list', async () => {
    const r = await request(app).get('/api/v1/leads');
    expect(r.status).toBe(200);
    expect(Array.isArray(r.body.data)).toBe(true);
  });

  it('POST then GET /api/config reflects saved config', async () => {
    const r1 = await request(app).post('/api/config').send({ config: { brand: { nameZh: '探测' } } });
    expect(r1.status).toBe(200);
    const r2 = await request(app).get('/api/config');
    expect(r2.status).toBe(200);
  });

  it('POST /api/upload rejects non-image (html) → 400', async () => {
    const r = await request(app)
      .post('/api/upload')
      .send({ filename: 'x.html', data: 'data:text/html;base64,PHRtbD4=' });
    expect(r.status).toBe(400);
  });

  it('PATCH /api/v1/leads/:id updates status', async () => {
    const created = await request(app).post('/api/v1/leads').send({ contact: 'patch_' + Date.now() });
    const id = created.body.id;
    const r = await request(app).patch(`/api/v1/leads/${id}`).send({ status: 'contacted' });
    expect(r.status).toBe(200);
    expect(r.body.status).toBe('contacted');
  });

  it('rate limit: many rapid leads → at least one 429', async () => {
    let saw429 = false;
    for (let i = 0; i < 12; i++) {
      const r = await request(app).post('/api/v1/leads').send({ contact: `rate_${i}_${Date.now()}` });
      if (r.status === 429) saw429 = true;
    }
    expect(saw429).toBe(true);
  });
});
