import { generateCode } from '../utils/validation.js';
import { HttpError } from '../utils/errors.js';
export function createService(repo, baseUrl, codeGenerator = generateCode) {
  const metadata = row => ({ id: String(row.id), shortCode: row.short_code, shortUrl: `${baseUrl}/${row.short_code}`, longUrl: row.long_url, createdAt: row.created_at, ...(row.total_clicks !== undefined ? {totalClicks: row.total_clicks} : {}) });
  return {
    metadata,
    async create(owner, url) {
      for (let attempt=0; attempt<5; attempt++) {
        try { return metadata(await repo.insert(owner,codeGenerator(),url)); }
        catch (error) { if (error.code !== '23505' || error.constraint !== 'urls_short_code_key') throw error; }
      }
      throw new HttpError(500,'CODE_EXHAUSTED','Could not create a link. Try again.');
    },
    async stats(owner, code) {
      const row = await repo.find(code,owner);
      if (!row) throw new HttpError(404,'NOT_FOUND','Link not found.');
      return { ...metadata(row), timezone: 'UTC', ...await repo.stats(row.id) };
    }
  };
}
