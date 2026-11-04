import {test} from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import {createApp} from '../src/app.js';
import {validateUrl,generateCode,referrerHost} from '../src/utils/validation.js';
import {HttpError} from '../src/utils/errors.js';
function fixture(overrides={}) {
  const rows=[],clicks=[],events=[];
  const repo={health:async()=>{},insert:async(owner,code,url)=>{const row={id:String(rows.length+1),owner_id:owner,short_code:code,long_url:url,created_at:new Date().toISOString()};rows.push(row);return row;},find:async(code,owner)=>rows.find(r=>r.short_code===code&&r.owner_id===owner),remove:async(code,owner)=>{const index=rows.findIndex(r=>r.short_code===code&&r.owner_id===owner);if(index<0)return undefined;const [row]=rows.splice(index,1);for(let i=clicks.length-1;i>=0;i--)if(clicks[i].id===row.id)clicks.splice(i,1);return row;},destination:async(code)=>rows.find(r=>r.short_code===code),click:async(id,referrer)=>clicks.push({id,referrer}),list:async(owner)=>({rows:rows.filter(r=>r.owner_id===owner).map(r=>({...r,total_clicks:String(clicks.filter(c=>c.id===r.id).length)})),total:String(rows.filter(r=>r.owner_id===owner).length)}),summary:async(owner)=>({totalUrls:String(rows.filter(r=>r.owner_id===owner).length),totalClicks:String(clicks.filter(c=>rows.some(r=>r.id===c.id&&r.owner_id===owner)).length)}),stats:async(id)=>({totalClicks:String(clicks.filter(c=>c.id===id).length),clicksPerDay:[],topReferrers:[],recentClicks:[]}),...overrides};
  const app=createApp({repo,config:{frontendUrl:'http://localhost:5173',publicBaseUrl:'http://localhost:5000'},verifyToken:async token=>{if(!['alice','bob'].includes(token))throw new HttpError(401,'UNAUTHORIZED','Sign in to continue.');return token;},logger:{error:event=>events.push(event)}});
  return {app,rows,clicks,events};
}
test('validator rejects invalid values and canonicalizes supported URLs',()=>{
  for(const body of [null,[],{}, {longUrl:2},{longUrl:'javascript:alert(1)'},{longUrl:'https://u:p@example.com'},{longUrl:'https://example.com\n'},{longUrl:'x'.repeat(8193)},{longUrl:'https://example.com',ownerId:'bob'}])assert.throws(()=>validateUrl(body));
  assert.equal(validateUrl({longUrl:' https://EXAMPLE.com '}),'https://example.com/');
  for(let i=0;i<100;i++)assert.match(generateCode(),/^[a-zA-Z0-9]{8}$/);
  assert.equal(referrerHost('https://EXAMPLE.com/private?secret=1'),'example.com');
  assert.equal(referrerHost('invalid'),null);
});
test('create, public redirect, private analytics and owner isolation journey',async()=>{
  const {app,clicks}=fixture();
  const created=await request(app).post('/api/shorten').set('Authorization','Bearer alice').send({longUrl:'https://example.com/path'}).expect(201);
  const code=created.body.data.shortCode;
  await request(app).get(`/${code}`).set('Referer','https://source.example/private?q=secret').expect(302).expect('Location','https://example.com/path');
  assert.equal(clicks.length,1);assert.equal(clicks[0].referrer,'source.example');
  await request(app).head(`/${code}`).expect(302);assert.equal(clicks.length,1);
  const stats=await request(app).get(`/api/stats/${code}`).set('Authorization','Bearer alice').expect(200);assert.equal(stats.body.data.totalClicks,'1');
  await request(app).get(`/api/stats/${code}`).set('Authorization','Bearer bob').expect(404);
  const list=await request(app).get('/api/urls').set('Authorization','Bearer bob').expect(200);assert.deepEqual(list.body.data.items,[]);
  const summary=await request(app).get('/api/summary').set('Authorization','Bearer bob').expect(200);assert.equal(summary.body.data.totalClicks,'0');
});
test('all private endpoints require authentication and token verification',async()=>{
  const {app}=fixture();
  for(const path of ['/api/urls','/api/summary','/api/stats/12345678']){
    await request(app).get(path).expect(401);
    await request(app).get(path).set('Authorization','Bearer forged').expect(401);
  }
  await request(app).post('/api/shorten').send({longUrl:'https://example.com'}).expect(401);
});
test('owner can delete a link and its click history; other users cannot',async()=>{
  const {app}=fixture();
  const created=await request(app).post('/api/shorten').set('Authorization','Bearer alice').send({longUrl:'https://example.com'}).expect(201);
  const code=created.body.data.shortCode;
  await request(app).get(`/${code}`).expect(302);
  await request(app).delete(`/api/urls/${code}`).expect(401);
  await request(app).delete(`/api/urls/${code}`).set('Authorization','Bearer bob').expect(404);
  await request(app).get(`/${code}`).expect(302);
  await request(app).delete(`/api/urls/${code}`).set('Authorization','Bearer alice').expect(204);
  await request(app).get(`/${code}`).expect(404);
  const summary=await request(app).get('/api/summary').set('Authorization','Bearer alice').expect(200);
  assert.equal(summary.body.data.totalUrls,'0');assert.equal(summary.body.data.totalClicks,'0');
});
test('validation, body limits, route and method policies',async()=>{
  const {app}=fixture();
  await request(app).post('/api/shorten').set('Authorization','Bearer alice').send({longUrl:null}).expect(400);
  await request(app).post('/api/shorten').set('Authorization','Bearer alice').set('Content-Type','application/json').send('{bad').expect(400);
  await request(app).post('/api/shorten').set('Authorization','Bearer alice').send({longUrl:'x'.repeat(20000)}).expect(413);
  await request(app).get('/api/urls?page=0').set('Authorization','Bearer alice').expect(400);
  await request(app).get('/api/unknown').expect(404);
  await request(app).get('/bad').expect(400);
  await request(app).get('/12345678').expect(404);
  await request(app).put('/12345678').expect(405);
});
test('click-write failure preserves redirect and logs sanitized event',async()=>{
  const {app,events}=fixture({destination:async()=>({id:'1',long_url:'https://example.com/'}),click:async()=>{throw Error('database password secret');}});
  await request(app).get('/12345678').expect(302);
  assert.deepEqual(events,[{event:'click_write_failed'}]);
});
test('lookup failure returns safe 503 without redirect',async()=>{
  const {app}=fixture({destination:async()=>{throw Error('database secret');}});
  const result=await request(app).get('/12345678').expect(503);assert.equal(result.headers.location,undefined);assert.ok(!JSON.stringify(result.body).includes('secret'));
});
test('collision retry is bounded and restricted to code constraint',async()=>{
  let attempts=0;
  const {app}=fixture({insert:async(owner,code,url)=>{attempts++;if(attempts===1)throw Object.assign(Error(),{code:'23505',constraint:'urls_short_code_key'});return{id:'1',short_code:code,long_url:url};}});
  await request(app).post('/api/shorten').set('Authorization','Bearer alice').send({longUrl:'https://example.com'}).expect(201);assert.equal(attempts,2);
  attempts=0;
  const exhausted=fixture({insert:async()=>{attempts++;throw Object.assign(Error(),{code:'23505',constraint:'urls_short_code_key'});}});
  await request(exhausted.app).post('/api/shorten').set('Authorization','Bearer alice').send({longUrl:'https://example.com'}).expect(500);assert.equal(attempts,5);
});
test('health and CORS do not expose configuration',async()=>{
  const {app}=fixture();await request(app).get('/api/health').expect(200);
  const allowed=await request(app).options('/api/urls').set('Origin','http://localhost:5173').set('Access-Control-Request-Method','GET').expect(204);assert.equal(allowed.headers['access-control-allow-origin'],'http://localhost:5173');
  const denied=await request(app).get('/api/health').set('Origin','https://evil.example');assert.equal(denied.headers['access-control-allow-origin'],undefined);
});
test('creation rate limit is enforced',async()=>{
  const {app}=fixture();for(let i=0;i<20;i++)await request(app).post('/api/shorten').set('Authorization','Bearer alice').send({longUrl:'https://example.com'}).expect(201);
  await request(app).post('/api/shorten').set('Authorization','Bearer alice').send({longUrl:'https://example.com'}).expect(429).expect('Retry-After','60');
});
