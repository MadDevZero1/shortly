import { randomInt } from 'node:crypto';
import { HttpError } from './errors.js';
const invalid = (message) => new HttpError(400, 'INVALID_INPUT', message);
export function validateUrl(body) {
  if (!body || Array.isArray(body) || typeof body !== 'object' || Object.keys(body).some(k => k !== 'longUrl') || typeof body.longUrl !== 'string') throw invalid('Provide a JSON object containing only longUrl as a string.');
  if (body.longUrl.length > 8192 || /[\u0000-\u001f\u007f]/.test(body.longUrl)) throw invalid('URL is too long or contains control characters.');
  try {
    const url = new URL(body.longUrl.trim());
    if (!['http:', 'https:'].includes(url.protocol) || !url.hostname || url.username || url.password) throw Error();
    return url.href;
  } catch { throw invalid('Enter a valid HTTP or HTTPS URL without credentials.'); }
}
export function validateCode(code) {
  if (!/^[0-9a-zA-Z]{8}$/.test(code)) throw invalid('Short codes contain exactly eight letters or numbers.');
  return code;
}
export function generateCode() {
  const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return Array.from({ length: 8 }, () => alphabet[randomInt(62)]).join('');
}
export function referrerHost(value) {
  if (typeof value !== 'string' || value.length > 2048) return null;
  try { const u = new URL(value); return ['http:', 'https:'].includes(u.protocol) ? u.hostname.toLowerCase() : null; } catch { return null; }
}
export function pagination(query) {
  const integer = (value, fallback, max) => {
    if (value === undefined) return fallback;
    if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value) || !Number.isSafeInteger(Number(value)) || Number(value) > max) throw invalid('Invalid pagination.');
    return Number(value);
  };
  const page = integer(query.page, 1, 1000000), limit = integer(query.limit, 20, 100);
  const q = query.q ?? '';
  if (typeof q !== 'string' || q.length > 200) throw invalid('Search must be at most 200 characters.');
  return { page, limit, q };
}
