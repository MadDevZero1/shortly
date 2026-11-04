import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { HttpError } from '../utils/errors.js';
export function routes(c, authenticate) {
  const router=Router();
  const limit=(max,keyGenerator)=>rateLimit({windowMs:60000,limit:max,standardHeaders:'draft-8',legacyHeaders:false,...(keyGenerator?{keyGenerator}:{}),handler:(_req,_res,next)=>next(new HttpError(429,'RATE_LIMITED','Too many requests. Try again shortly.'))});
  const method=(allowed)=>(req,res,next)=>{res.set('Allow',allowed);next(new HttpError(405,'METHOD_NOT_ALLOWED','Method not allowed.'));};
  router.route('/health').get(c.health).all(method('GET, HEAD'));
  router.use(['/shorten','/urls','/summary','/stats'], authenticate);
  router.route('/shorten').post(limit(60),limit(20,req=>req.ownerId),c.create).all(method('POST'));
  const reads=limit(120,req=>req.ownerId);
  router.route('/urls').get(reads,c.list).all(method('GET, HEAD'));
  router.route('/summary').get(reads,c.summary).all(method('GET, HEAD'));
  router.route('/stats/:shortCode').get(reads,c.stats).all(method('GET, HEAD'));
  router.route('/urls/:shortCode').delete(limit(60,req=>req.ownerId),c.remove).all(method('DELETE'));
  return router;
}
