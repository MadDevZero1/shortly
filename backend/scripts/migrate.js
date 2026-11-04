import { readFile } from 'node:fs/promises';
import 'dotenv/config';
import { createPool } from '../src/db/pool.js';
if(!process.env.DATABASE_URL)throw Error('DATABASE_URL is required');
const db=createPool(process.env.DATABASE_URL);
try { await db.query(await readFile(new URL('../db/schema.sql',import.meta.url),'utf8')); console.log('Schema applied.'); } finally { await db.end(); }
