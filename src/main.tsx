import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { App } from './App';
import './styles.css';
document.documentElement.classList.add('js');
const path = window.location.pathname.replace(/\/?$/, '/');
const root = document.getElementById('root')!;
const app = (
  <StrictMode>
    <App path={path} />
  </StrictMode>
);
if (import.meta.env.DEV) createRoot(root).render(app);
else hydrateRoot(root, app);
