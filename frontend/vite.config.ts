import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig(({mode})=>{
  const env=loadEnv(mode,process.cwd(),'');
  const upstream=env.VITE_NEON_AUTH_URL;
  return {plugins:[react(),tailwindcss()], server:{proxy:upstream?{'/neon-auth':{target:new URL(upstream).origin,changeOrigin:true,secure:true,cookieDomainRewrite:'',cookiePathRewrite:'/',rewrite:(path:string)=>path.replace(/^\/neon-auth/,new URL(upstream).pathname)}}:{}}};
});
