import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {generateKeyPair,exportJWK,SignJWT} from 'jose';
import {createVerifier} from '../src/middleware/auth.js';
test('real EdDSA signature, issuer, audience, expiry and subject verification',async()=>{
  const {privateKey,publicKey}=await generateKeyPair('EdDSA');
  const jwk={...await exportJWK(publicKey),kid:'test',alg:'EdDSA'};
  const server=createServer((_req,res)=>{res.setHeader('content-type','application/json');res.end(JSON.stringify({keys:[jwk]}));});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  try{
    const verify=createVerifier({jwksUrl:`http://127.0.0.1:${server.address().port}/jwks`,issuer:'https://auth.example',audience:'https://auth.example'});
    const sign=(options={})=>new SignJWT({sub:'alice',...options.payload}).setProtectedHeader({alg:'EdDSA',kid:'test'}).setIssuer(options.issuer||'https://auth.example').setAudience(options.audience||'https://auth.example').setIssuedAt().setExpirationTime(options.expiry||'5m').sign(options.key||privateKey);
    const token=await sign();assert.equal(await verify(token),'alice');
    for(const options of [{issuer:'https://evil.example'},{audience:'other'},{expiry:'-1s'},{payload:{sub:''}},{payload:{role:'anonymous'}},{payload:{banned:true}},{key:(await generateKeyPair('EdDSA')).privateKey}])await assert.rejects(()=>sign(options).then(verify),error=>error.status===401);
    await assert.rejects(()=>verify('malformed'),error=>error.status===401);
  }finally{await new Promise(resolve=>server.close(resolve));}
});
