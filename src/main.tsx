import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

const root = document.getElementById('root')!;
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

/* The professional pages are rendered to HTML at build time and marked with the
   route they were rendered for. Hydrate only when that is the route actually
   being shown; anything else (the unbuilt dev page, the legacy routes, a host
   that fell back to the wrong file) starts from an empty root. */
const path = window.location.pathname.replace(/\/+$/, '') || '/';
if (root.dataset.prerendered === path) {
  hydrateRoot(root, app);
} else {
  root.replaceChildren();
  createRoot(root).render(app);
}
