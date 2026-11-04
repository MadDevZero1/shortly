import 'dotenv/config';
import {randomBytes} from 'node:crypto';
import assert from 'node:assert/strict';
const auth=process.env.NEON_AUTH_BASE_URL;
const api=process.env.PUBLIC_BASE_URL||'http://localhost:5000';
if(!auth)throw Error('NEON_AUTH_BASE_URL required');
const password=`Aa1!${randomBytes(24).toString('hex')}`;
async function identity(label){
  const response=await fetch(`${auth}/sign-up/email`,{method:'POST',headers:{'content-type':'application/json',origin:process.env.FRONTEND_URL},body:JSON.stringify({email:`shortly-${label}-${Date.now()}-${randomBytes(4).toString('hex')}@example.com`,password,name:'Shortly verification'}),signal:AbortSignal.timeout(20000)});
  if(!response.ok)throw Error(`Auth sign-up returned ${response.status}`);
  const cookies=response.headers.getSetCookie().map(value=>value.split(';')[0]).join('; ');
  const tokenResponse=await fetch(`${auth}/token`,{headers:{cookie:cookies,origin:process.env.FRONTEND_URL},signal:AbortSignal.timeout(20000)});
  if(!tokenResponse.ok)throw Error(`Auth token returned ${tokenResponse.status}`);
  const token=(await tokenResponse.json()).token;
  assert.equal(typeof token,'string');
  return{token,cookies};
}
async function call(path,token,options={}){
  const response=await fetch(`${api}${path}`,{...options,headers:{...(token?{Authorization:`Bearer ${token}`} : {}),'content-type':'application/json',...options.headers},redirect:'manual',signal:AbortSignal.timeout(15000)});
  return {status:response.status,headers:response.headers,data:response.headers.get('content-type')?.includes('application/json')?await response.json():null};
}
const a=await identity('a'),b=await identity('b');
const created=await call('/api/shorten',a.token,{method:'POST',body:JSON.stringify({longUrl:'https://example.com/provider-verification'})});assert.equal(created.status,201);
const code=created.data.data.shortCode;
let stats=await call(`/api/stats/${code}`,a.token);assert.equal(stats.status,200);assert.equal(stats.data.data.totalClicks,'0');
assert.equal((await call(`/api/stats/${code}`,b.token)).status,404);
assert.equal((await call(`/api/stats/${code}`)).status,401);
assert.equal((await call(`/${code}`,null)).status,302);
stats=await call(`/api/stats/${code}`,a.token);assert.equal(stats.data.data.totalClicks,'1');
assert.equal((await call('/api/urls',b.token)).data.data.items.length,0);
for(const user of [a,b]){
  const response=await fetch(`${auth}/sign-out`,{method:'POST',headers:{cookie:user.cookies,origin:process.env.FRONTEND_URL,'content-type':'application/json'},body:'{}',signal:AbortSignal.timeout(20000)});
  assert.ok(response.ok);
}
console.log('PASS: real provider registration/token/JWKS verification, creation, zero-click stats, two-user isolation, anonymous denial, public redirect, updated count and sign-out. Synthetic dev accounts/link retained for audit.');
