import { validateUrl, validateCode, pagination, referrerHost } from '../utils/validation.js';
import { HttpError } from '../utils/errors.js';
export function controllers(repo, service, logger) {
  const send = (res,data,status=200) => res.status(status).json({success:true,data});
  return {
    health: async (_req,res) => { try { await repo.health(); send(res,{status:'ok',database:'available'}); } catch { res.status(503).json({success:false,error:{code:'DATABASE_UNAVAILABLE',message:'Database is unavailable.'}}); } },
    create: async (req,res) => { if (!req.is('application/json')) throw new HttpError(415,'UNSUPPORTED_MEDIA_TYPE','Use application/json.'); send(res,await service.create(req.ownerId,validateUrl(req.body)),201); },
    list: async (req,res) => { const args=pagination(req.query); const {rows,total}=await repo.list(req.ownerId,args); send(res,{items:rows.map(service.metadata),page:args.page,limit:args.limit,total}); },
    summary: async (req,res) => send(res,await repo.summary(req.ownerId)),
    stats: async (req,res) => send(res,await service.stats(req.ownerId,validateCode(req.params.shortCode))),
    remove: async (req,res) => { const deleted=await repo.remove(validateCode(req.params.shortCode),req.ownerId); if(!deleted) throw new HttpError(404,'NOT_FOUND','Link not found.'); res.status(204).end(); },
    redirect: async (req,res) => {
      const row=await repo.destination(validateCode(req.params.shortCode));
      if (!row) throw new HttpError(404,'NOT_FOUND','Link not found.');
      if(req.method==='GET') try { await repo.click(row.id,referrerHost(req.get('referer'))); } catch { logger.error({event:'click_write_failed'}); }
      res.set('Cache-Control','no-store').redirect(302,row.long_url);
    }
  };
}
