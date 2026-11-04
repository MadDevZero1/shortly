import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, Eye, EyeSlash } from '@phosphor-icons/react';
import { useAuth } from '../app/Auth';
import { requireAuth, authConfigured } from '../services/auth';
import { ErrorBox } from '../components/ui';

const rules = [
  { label: 'At least 15 characters', check: (value: string) => value.length >= 15 },
  { label: 'One uppercase letter', check: (value: string) => /[A-Z]/.test(value) },
  { label: 'One number', check: (value: string) => /[0-9]/.test(value) },
  { label: 'One symbol', check: (value: string) => /[^A-Za-z0-9\s]/.test(value) },
];

export function AuthPage() {
  const [params] = useSearchParams(), navigate = useNavigate(), { refresh } = useAuth();
  const [mode, setMode] = useState<'signin'|'signup'|'recover'|'reset'>(params.get('token') ? 'reset' : 'signin');
  const [email, setEmail] = useState(''), [password, setPassword] = useState(''), [confirmation, setConfirmation] = useState(''), [name, setName] = useState('');
  const [visible, setVisible] = useState(false), [pending, setPending] = useState(false), [error, setError] = useState(''), [notice, setNotice] = useState('');
  const newPassword = mode === 'signup' || mode === 'reset';
  async function submit(event: FormEvent) {
    event.preventDefault(); setError(''); setNotice('');
    if (newPassword && (!rules.every(rule => rule.check(password)) || password !== confirmation)) {
      setError(password !== confirmation ? 'Passwords do not match.' : 'Password does not meet all requirements.'); return;
    }
    setPending(true);
    try {
      const client = requireAuth();
      const result = mode === 'recover' ? await client.requestPasswordReset({ email, redirectTo: `${location.origin}/auth` })
        : mode === 'reset' ? await client.resetPassword({ newPassword: password, token: params.get('token') || '' })
        : mode === 'signup' ? await client.signUp.email({ email, password, name }) : await client.signIn.email({ email, password });
      if (result.error) throw new Error(result.error.message || 'Sign-in could not be completed.');
      if (mode === 'recover') { setNotice('If that account exists, a recovery email is on its way.'); return; }
      if (mode === 'reset') { setNotice('Password updated. You can now sign in.'); setMode('signin'); return; }
      await refresh(); const next = params.get('next'); navigate(next?.startsWith('/') && !next.startsWith('//') ? next : '/dashboard');
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Please try again.'); }
    finally { setPending(false); }
  }
  const title = { signin: 'Welcome back.', signup: 'A home for your links.', recover: 'Find your way back.', reset: 'A fresh start.' }[mode];
  return <main className="auth-wrap container"><section className="auth-story"><p className="eyebrow">YOUR LINKS, IN ONE PLACE</p><h1>Small links.<br/>Big possibilities.</h1><p>Create, share, and understand your links.<br/>Your insights stay with you.</p><Link to="/" className="text-link">Back to Shortly<ArrowRight/></Link></section><section className="auth-panel"><h2>{title}</h2><p>{mode === 'signup' ? 'Create your Shortly account.' : mode === 'recover' ? 'Enter your email to request a password reset.' : 'Sign in to your private workspace.'}</p>{!authConfigured && <p className="notice">Account services are not connected yet. Please check back shortly.</p>}<form onSubmit={submit}>
    {mode === 'signup' && <label>Your name<input autoComplete="name" value={name} onChange={event => setName(event.target.value)} required maxLength={100}/></label>}
    {mode !== 'reset' && <label>Email address<input type="email" autoComplete="email" required value={email} onChange={event => setEmail(event.target.value)}/></label>}
    {mode !== 'recover' && <label>Password<div className="password-field"><input type={visible ? 'text' : 'password'} autoComplete={newPassword ? 'new-password' : 'current-password'} minLength={newPassword ? 15 : undefined} required value={password} onChange={event => setPassword(event.target.value)}/><button type="button" className="password-toggle" onClick={() => setVisible(value => !value)} aria-label={visible ? 'Hide password' : 'Show password'}>{visible ? <EyeSlash/> : <Eye/>}</button></div></label>}
    {newPassword && <><ul className="password-rules" aria-label="Password requirements">{rules.map(rule => <li key={rule.label} className={rule.check(password) ? 'met' : ''}>{rule.label}</li>)}</ul><label>Confirm password<input type={visible ? 'text' : 'password'} autoComplete="new-password" required minLength={15} value={confirmation} onChange={event => setConfirmation(event.target.value)}/></label></>}
    {error && <ErrorBox message={error}/>}<p role="status" className="success-text">{notice}</p><button className="button" disabled={pending || !authConfigured}>{pending ? 'Please wait…' : mode === 'signup' ? 'Create account' : mode === 'recover' ? 'Send recovery email' : mode === 'reset' ? 'Update password' : 'Sign in'}<ArrowRight/></button></form><div className="auth-actions"><button className="text-button" onClick={() => { setMode(mode === 'signup' ? 'signin' : 'signup'); setError(''); setNotice(''); setPassword(''); setConfirmation(''); }}>{mode === 'signup' ? 'Already have an account? Sign in' : 'New here? Create an account'}</button>{mode === 'signin' && <button className="text-button" onClick={() => setMode('recover')}>Forgot your password?</button>}</div></section></main>;
}
