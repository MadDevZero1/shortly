import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { authClient } from '../services/auth';
import type { User } from '../types';
const AuthContext = createContext<{user:User|null;loading:boolean;error:string;refresh:()=>Promise<void>;logout:()=>Promise<void>}>({user:null,loading:true,error:'',refresh:async()=>{},logout:async()=>{}});
export function AuthProvider({children}:{children:ReactNode}) {
  const [user,setUser]=useState<User|null>(null), [loading,setLoading]=useState(true), [error,setError]=useState('');
  const requestVersion=useRef(0);
  async function refresh() {
    const version=++requestVersion.current;
    try { const result=await authClient?.getSession(); if(result?.error) throw new Error(result.error.message); if(version===requestVersion.current){setUser(result?.data?.user as User || null); setError('');} }
    catch { if(version===requestVersion.current){setUser(null); setError('We could not restore your session. Please sign in again.');} }
    finally { if(version===requestVersion.current)setLoading(false); }
  }
  useEffect(()=>{void refresh();return()=>{requestVersion.current++;};},[]);
  async function logout(){const result=await authClient?.signOut();if(result?.error) throw new Error(result.error.message || 'Sign-out failed. Please try again.');requestVersion.current++;setUser(null);sessionStorage.removeItem('shortly-draft');}
  return <AuthContext.Provider value={{user,loading,error,refresh,logout}}>{children}</AuthContext.Provider>;
}
export const useAuth=()=>useContext(AuthContext);
