import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';

const root = document.getElementById('root')!;
const app = <App path={`${window.location.pathname.replace(/\/$/, '') || '/'}${window.location.search}`} />;
if (root.hasChildNodes()) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
