import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Check, Copy, LinkSimple, SpinnerGap } from '@phosphor-icons/react';
export function Logo(){return <Link className="logo" to="/" aria-label="Shortly home"><span className="logo-mark"><LinkSimple weight="bold" size={23}/></span>shortly<span className="logo-period">.</span></Link>}
export function Loading(){return <div className="state" role="status"><SpinnerGap className="spin" size={25}/><p>Getting things ready…</p></div>}
export function ErrorBox({message}:{message:string}){return <p className="error" role="alert">{message}</p>}
export function Empty({title,children}:{title:string;children:ReactNode}){return <div className="state"><LinkSimple size={32}/><h3>{title}</h3><p>{children}</p></div>}
export function CopyButton({value}:{value:string}){const[state,setState]=useState('Copy');async function copy(){try{await navigator.clipboard.writeText(value);setState('Copied');}catch{setState('Select link to copy');}setTimeout(()=>setState('Copy'),2500);}return <button type="button" className="button secondary copy" onClick={copy}>{state==='Copied'?<Check/>:<Copy/>}<span aria-live="polite">{state}</span></button>}
export function ExternalLink({href,children}:{href:string;children:ReactNode}){return <a href={href} target="_blank" rel="noopener noreferrer" className="external">{children}<ArrowUpRight aria-hidden="true"/></a>}
export const formatDate=(date?:string)=>date?new Intl.DateTimeFormat(undefined,{dateStyle:'medium',timeStyle:'short'}).format(new Date(date)):'Just created';
export const formatCount=(count?:string)=>new Intl.NumberFormat().format(BigInt(count || '0'));
