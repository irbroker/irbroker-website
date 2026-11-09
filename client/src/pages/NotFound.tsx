import { verticals } from "../data/content";

// Rota desconhecida. No build estático vira 404.html (noindex, sem canonical): scripts/ssg.mjs.
export default function NotFound() {
  return (
    <div className="content-surface not-found">
      <header className="content-page-heading wrap">
        <p className="section-label">
          <span className="small-rule" />
          Erro 404
        </p>
        <h1>Página não encontrada</h1>
        <p>O endereço não existe ou mudou. Siga por um dos caminhos abaixo.</p>
      </header>
      <nav className="content-filters wrap" aria-label="Páginas principais">
        <a href="/">Página inicial</a>
        {verticals.map(vertical => (
          <a key={vertical.slug} href={`/${vertical.slug}`}>
            {vertical.name}
          </a>
        ))}
      </nav>
    </div>
  );
}
