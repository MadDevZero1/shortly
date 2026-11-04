import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/geist-sans/400.css';
import '@fontsource/geist-sans/500.css';
import '@fontsource/geist-sans/600.css';
import '@fontsource/geist-mono/400.css';
import './styles/main.css';
import { App } from './app/App';
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
