import { getToken } from './auth';
import type { LinkList, ShortLink, Stats, Summary } from '../types';
export class ApiError extends Error { constructor(message:string, public status:number) { super(message); } }
async function request<T>(path:string, init:RequestInit = {}):Promise<T> {
  const token = await getToken();
  let response:Response;
  try { response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${path}`, {...init, cache:'no-store', headers:{'Content-Type':'application/json', Authorization:`Bearer ${token}`, ...init.headers}}); }
  catch (error) { if (init.signal?.aborted) throw error; throw new Error('We could not reach Shortly. Check your connection and try again.'); }
  if (response.status===204) return undefined as T;
  const result = await response.json();
  if (!response.ok) throw new ApiError(result.error?.message || 'The request could not be completed.', response.status);
  return result.data as T;
}
export const api = {
  create:(longUrl:string)=>request<ShortLink>('/api/shorten',{method:'POST',body:JSON.stringify({longUrl})}),
  links:(q:string,page:number,signal?:AbortSignal)=>request<LinkList>(`/api/urls?q=${encodeURIComponent(q)}&page=${page}&limit=10`,{signal}),
  summary:(signal?:AbortSignal)=>request<Summary>('/api/summary',{signal}),
  stats:(code:string,signal?:AbortSignal)=>request<Stats>(`/api/stats/${encodeURIComponent(code)}`,{signal}),
  remove:(code:string)=>request<void>(`/api/urls/${encodeURIComponent(code)}`,{method:'DELETE'}),
};
