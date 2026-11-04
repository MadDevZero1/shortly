import { readEnv } from './config/env.js';
import { createPool } from './db/pool.js';
import { createApp } from './app.js';
const config=readEnv();
const db=createPool(config.databaseUrl);
db.on('error',()=>console.error({event:'database_pool_error'}));
await db.query('SELECT 1');
const server=createApp({db,config}).listen(config.port,'0.0.0.0',()=>console.log(`Shortly API listening on port ${config.port}`));
for(const signal of ['SIGINT','SIGTERM'])process.once(signal,()=>{
  const timeout=setTimeout(()=>process.exit(1),10000);timeout.unref();
  server.close(async()=>{await db.end();clearTimeout(timeout);process.exit(0);});
});
