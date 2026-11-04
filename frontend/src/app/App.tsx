import { BrowserRouter, Link, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { AuthProvider, useAuth } from './Auth';
import { AppLayout, PublicLayout } from '../components/Layout';
import { Loading } from '../components/ui';
import { Landing } from '../pages/Landing';
import { AuthPage } from '../pages/AuthPage';
import { Dashboard } from '../pages/Dashboard';
import { Analytics } from '../pages/Analytics';
import { Result } from '../pages/Result';
function Protected(){const{user,loading}=useAuth(),location=useLocation();if(loading)return <Loading/>;return user?<Outlet key={user.id}/>:<Navigate replace to={`/auth?next=${encodeURIComponent(location.pathname)}`}/>}
export function App(){return <MotionConfig reducedMotion="user"><BrowserRouter><AuthProvider><a className="skip-link" href="#main-content">Skip to content</a><div id="main-content"><Routes><Route element={<PublicLayout/>}><Route index element={<Landing/>}/><Route path="auth" element={<AuthPage/>}/><Route path="*" element={<main className="container not-found"><p className="eyebrow">404</p><h1>This link took a wrong turn.</h1><p>That page does not exist. Your workspace is a good place to start.</p><Link to="/dashboard" className="button">Go to dashboard</Link></main>}/></Route><Route element={<Protected/>}><Route element={<AppLayout/>}><Route path="dashboard" element={<Dashboard/>}/><Route path="analytics/:code" element={<Analytics/>}/><Route path="result/:code" element={<Result/>}/></Route></Route></Routes></div></AuthProvider></BrowserRouter></MotionConfig>}
