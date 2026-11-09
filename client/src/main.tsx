import { createRoot, hydrateRoot } from 'react-dom/client';
import Lenis from "lenis";
import App from './App';

const root = document.getElementById('root')!;
const app = <App path={`${window.location.pathname.replace(/\/$/, '') || '/'}${window.location.search}`} />;
if (root.hasChildNodes()) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}

// Rolagem suave só com ponteiro fino, tela ≥768px (sem menu móvel) e sem movimento reduzido.
// Âncoras ficam nativas (anchors: false) para o foco do skip link continuar indo para o alvo.
const smooth = window.matchMedia(
  "(pointer: fine) and (min-width: 768px) and (prefers-reduced-motion: no-preference)"
);
let lenis: Lenis | undefined;
function toggleSmooth() {
  if (smooth.matches && !lenis) lenis = new Lenis({ lerp: 0.1, autoRaf: true });
  else if (!smooth.matches && lenis) {
    lenis.destroy();
    lenis = undefined;
  }
}
toggleSmooth();
smooth.addEventListener("change", toggleSmooth);
