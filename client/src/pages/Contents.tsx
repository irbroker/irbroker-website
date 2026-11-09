import { useEffect, useState, type MouseEvent } from 'react';
import { verticals } from '../data/content';
import { Breadcrumb } from '../components/SiteLayout';
import { guides } from '../data/guides';
import { orderedRadar } from '../data/radar';
import { RadarList } from '../components/Radar';

function frontFromSearch(search: string) {
  const front = new URLSearchParams(search).get('frente') ?? '';
  return verticals.some(vertical => vertical.name === front) ? front : '';
}

export default function Contents({ search = '' }: { search?: string }) {
  const [front, setFront] = useState(() => frontFromSearch(search));
  useEffect(() => {
    const sync = () => setFront(frontFromSearch(window.location.search));
    sync();
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);
  // Link da home para uma nota (#radar-...): abre a nota correspondente.
  useEffect(() => {
    const openNote = () => {
      const note = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
      if (note instanceof HTMLDetailsElement) { note.open = true; note.scrollIntoView({ block: 'start' }); }
    };
    openNote();
    window.addEventListener('hashchange', openNote);
    return () => window.removeEventListener('hashchange', openNote);
  }, []);
  const notes = orderedRadar.filter(note => !front || note.frente === front);
  const articles = guides.filter(guide => !front || guide.frente === front);
  const selected = verticals.find(vertical => vertical.name === front);

  function filter(event: MouseEvent<HTMLAnchorElement>, next: string) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const url = new URL(window.location.href);
    if (next) url.searchParams.set('frente', next); else url.searchParams.delete('frente');
    window.history.pushState(null, '', `${url.pathname}${url.search}${url.hash}`);
    setFront(next);
  }

  return <div className="contents-page content-surface">
    <header className="content-page-heading wrap"><Breadcrumb className="section-label" items={[{ label: 'Conteúdos' }]} /><h1>O que muda no seguro da sua empresa.</h1><p>Guias e notícias do mercado, área por área.</p></header>
    <nav className="content-filters wrap" aria-label="Área de interesse">{['', ...verticals.map(vertical => vertical.name)].map(name => <a href={name ? `/conteudos?frente=${encodeURIComponent(name)}` : '/conteudos'} key={name} aria-current={front === name ? 'true' : undefined} onClick={event => filter(event, name)}>{name || 'Todas as áreas'}</a>)}</nav>
    <div className="wrap content-feed" aria-live="polite" aria-atomic="false">
      {articles.length > 0 && <section className="contents-guides"><h2>Guias</h2><div className="guide-list">{articles.map(guide => <article className="guide-list-item" key={guide.slug}><p className="content-meta">{guide.frente}</p><h3><a href={guide.slug}>{guide.titulo}</a></h3><p>{guide.linhaFina}</p><p className="guide-read-time">{guide.tempoLeitura}</p></article>)}</div></section>}
      {notes.length > 0 && <section id="radar" className="contents-radar"><h2>Radar do mercado</h2><RadarList notes={notes} /></section>}
      {notes.length === 0 && articles.length === 0 && <div className="content-empty"><p>Ainda não há conteúdos desta área.</p>{selected && <a className="content-text-link" href={`/${selected.slug}`}>{selected.name}</a>}</div>}
    </div>
  </div>;
}
