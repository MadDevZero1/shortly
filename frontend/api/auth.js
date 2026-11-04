// Same-origin gateway for managed sessions; application APIs remain on Render.
export async function proxyAuth(request, fetcher=fetch) {
  const incoming=new URL(request.url);
  const path=incoming.searchParams.get('path') || '';
  const base=process.env.NEON_AUTH_BASE_URL;
  if(!base)return Response.json({message:'Authentication is not configured.'},{status:503});
  if(!/^[a-zA-Z0-9/-]+$/.test(path)||path.includes('..'))return new Response(null,{status:400});
  if(!['GET','POST'].includes(request.method))return new Response(null,{status:405,headers:{Allow:'GET, POST'}});
  const target=new URL(`${base.replace(/\/$/,'')}/${path}`);
  if(target.protocol!=='https:')return new Response(null,{status:503});
  incoming.searchParams.delete('path');target.search=incoming.searchParams.toString();
  const headers=new Headers();
  for(const name of ['content-type','cookie','origin','referer'])if(request.headers.has(name))headers.set(name,request.headers.get(name));
  try{
    const body=request.method==='POST'?await request.text():undefined;
    if(body&&Buffer.byteLength(body)>16384)return new Response(null,{status:413});
    const upstream=await fetcher(target,{method:request.method,headers,body,redirect:'manual',signal:AbortSignal.timeout(15000)});
    const resultHeaders=new Headers({'Cache-Control':'no-store'});
    for(const name of ['content-type','location'])if(upstream.headers.has(name))resultHeaders.set(name,upstream.headers.get(name));
    for(const cookie of upstream.headers.getSetCookie())resultHeaders.append('Set-Cookie',cookie.replace(/;\s*Domain=[^;]*/ig,'').replace(/;\s*Path=[^;]*/ig,'; Path=/'));
    return new Response(upstream.body,{status:upstream.status,headers:resultHeaders});
  }catch{console.error({event:'auth_gateway_unavailable'});return Response.json({message:'Authentication is temporarily unavailable.'},{status:503});}
}
export const GET=request=>proxyAuth(request);
export const POST=request=>proxyAuth(request);
