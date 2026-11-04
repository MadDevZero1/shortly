import 'dotenv/config';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createPool } from '../src/db/pool.js';
import { createApp } from '../src/app.js';

// All fixtures stay inside one transaction and are rolled back, including on failure.
const pool = createPool(process.env.DATABASE_URL);
const client = await pool.connect();
try {
  await client.query('BEGIN');
  const config = { frontendUrl: 'http://localhost:5173', publicBaseUrl: 'http://localhost:5000' };
  const app = createApp({ db: client, config, verifyToken: async token => token, logger: { error() {} } });
  const owner = `verification-${Date.now()}`;
  const created = await request(app).post('/api/shorten').auth(owner,{type:'bearer'}).send({longUrl:'https://example.com/verification'});
  assert.equal(created.status,201);
  const code = created.body.data.shortCode;
  assert.equal((await request(app).get(`/api/stats/${code}`).auth('other-user',{type:'bearer'})).status,404);
  assert.equal((await request(app).get('/api/urls')).status,401);
  const list = await request(app).get('/api/urls?q=verification').auth(owner,{type:'bearer'});
  assert.equal(list.status,200); assert.equal(list.body.data.total,'1');
  const redirect = await request(app).get(`/${code}`).set('Referer','https://EXAMPLE.org/private?q=secret');
  assert.equal(redirect.status,302); assert.equal(redirect.headers.location,'https://example.com/verification');
  assert.equal((await request(app).head(`/${code}`)).status,302);
  const stats = await request(app).get(`/api/stats/${code}`).auth(owner,{type:'bearer'});
  assert.equal(stats.status,200); assert.equal(stats.body.data.totalClicks,'1');
  assert.equal(stats.body.data.clicksPerDay.length,30);
  assert.equal(stats.body.data.topReferrers[0].referrer,'example.org');
  assert.equal((await request(app).get('/api/summary').auth(owner,{type:'bearer'})).body.data.totalClicks,'1');
  const row = (await client.query('SELECT id FROM urls WHERE short_code=$1',[code])).rows[0];
  async function rejectsConstraint(sql, values, expectedCode) {
    await client.query('SAVEPOINT constraint_check');
    try { await assert.rejects(client.query(sql,values),error=>error.code===expectedCode); }
    finally { await client.query('ROLLBACK TO SAVEPOINT constraint_check'); }
  }
  await rejectsConstraint('INSERT INTO urls(owner_id,short_code,long_url) VALUES ($1,$2,$3)',[owner,code,'https://example.com/'],'23505');
  await rejectsConstraint('INSERT INTO clicks(url_id) VALUES ($1)',['9223372036854775807'],'23503');
  await rejectsConstraint('INSERT INTO urls(owner_id,short_code,long_url) VALUES ($1,$2,$3)',[owner,'bad!','https://example.com/'],'23514');
  await client.query('SAVEPOINT midnight_check');
  await client.query("INSERT INTO clicks(url_id,clicked_at) VALUES ($1, (CURRENT_DATE::timestamp AT TIME ZONE 'UTC')-interval '1 second'), ($1, CURRENT_DATE::timestamp AT TIME ZONE 'UTC')",[row.id]);
  const boundary = await client.query("SELECT (clicked_at AT TIME ZONE 'UTC')::date::text AS day,COUNT(*)::text AS count FROM clicks WHERE url_id=$1 GROUP BY 1 ORDER BY 1",[row.id]);
  assert.equal(boundary.rows.length,2);
  await client.query('ROLLBACK TO SAVEPOINT midnight_check');
  const plan = await client.query('EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM urls WHERE owner_id=$1 ORDER BY created_at DESC,id DESC LIMIT 20',[owner]);
  console.log('PASS: actual PostgreSQL create, scoped search, foreign-owner denial, anonymous denial, redirect, HEAD, click, UTC series, referrer and summary.');
  console.log(plan.rows.map(row=>row['QUERY PLAN']).join('\n'));
  await client.query('SAVEPOINT cascade_check');
  await client.query('DELETE FROM urls WHERE id=$1',[row.id]);
  assert.equal((await client.query('SELECT COUNT(*)::text AS count FROM clicks WHERE url_id=$1',[row.id])).rows[0].count,'0');
  await client.query('ROLLBACK TO SAVEPOINT cascade_check');
  console.log('PASS: UNIQUE, foreign key, code CHECK, UTC midnight grouping and delete cascade (all fixtures rolled back).');
} finally {
  await client.query('ROLLBACK');
  client.release();
  await pool.end();
}
