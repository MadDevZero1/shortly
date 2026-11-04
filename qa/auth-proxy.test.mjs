import { test } from 'node:test';
import assert from 'node:assert/strict';
import { proxyAuth } from '../frontend/api/auth.js';
process.env.NEON_AUTH_BASE_URL='https://identity.example.com/database/auth';
test('auth proxy restricts target and preserves first-party sessions without caching',async()=>{
  let called;
  const response=await proxyAuth(new Request('https://app.example.com/api/auth?path=token',{headers:{cookie:'session=test'}}),async(url,options)=>{
    called={url:url.href,cookie:options.headers.get('cookie')};
    return new Response('{"token":"test"}',{headers:{'content-type':'application/json','set-cookie':'session=test; Domain=identity.example.com; Path=/database/auth; HttpOnly; Secure'}});
  });
  assert.equal(called.url,'https://identity.example.com/database/auth/token');
  assert.equal(called.cookie,'session=test');
  assert.equal(response.headers.get('cache-control'),'no-store');
  assert.ok(!response.headers.get('set-cookie').includes('Domain='));
  assert.ok(response.headers.get('set-cookie').includes('Path=/;'));
  assert.equal((await proxyAuth(new Request('https://app.example.com/api/auth?path=../escape'))).status,400);
  assert.equal((await proxyAuth(new Request('https://app.example.com/api/auth?path=token',{method:'DELETE'}))).status,405);
});
