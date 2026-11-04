import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { repository } from './db/queries/urls.js';
import { createVerifier,authMiddleware } from './middleware/auth.js';
import { createService } from './services/urls.js';
import { controllers } from './controllers/urls.js';
import { routes } from './routes/index.js';
import { HttpError } from './utils/errors.js';
export function createApp({db,config,verifyToken,logger=console,repo=repository(db),codeGenerator}) {
  const app=express(); app.disable('x-powered-by'); app.set('trust proxy',config.trustProxyHops||false);
  app.use(helmet());
  app.use(cors({origin:(origin,callback)=>callback(null,!origin || origin===config.frontendUrl),methods:['GET','HEAD','POST','DELETE','OPTIONS'],allowedHeaders:['Content-Type','Authorization']}));
  app.use(express.json({limit:'16kb',strict:true}));
  const c=controllers(repo,createService(repo,config.publicBaseUrl,codeGenerator),logger);
  app.use('/api',routes(c,authMiddleware(verifyToken||createVerifier(config))));
  app.use('/api',(_req,_res,next)=>next(new HttpError(404,'NOT_FOUND','API route not found.')));
  app.route('/:shortCode').head(c.redirect).get(c.redirect).all((req,res,next)=>{res.set('Allow','GET, HEAD');next(new HttpError(405,'METHOD_NOT_ALLOWED','Method not allowed.'));});
  app.use((_req,_res,next)=>next(new HttpError(404,'NOT_FOUND','Page not found.')));
  app.use((error,_req,res,_next)=>{
    const status=error.status || (error.type==='entity.too.large'?413:error.type==='entity.parse.failed'?400:503);
    if(!error.status && !error.type)logger.error({event:'request_failed',code:typeof error.code==='string'?error.code:'INTERNAL'});
    const code=error instanceof HttpError ? error.code : (status===413?'BODY_TOO_LARGE':status===400?'INVALID_JSON':'SERVICE_UNAVAILABLE');
    if(status===429)res.set('Retry-After','60');
    res.status(status).json({success:false,error:{code,message:error instanceof HttpError?error.message:status===400?'Invalid JSON body.':status===413?'Request body is too large.':'Service is temporarily unavailable.'}});
  });
  return app;
}
