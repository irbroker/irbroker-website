import { orderedRadar, type RadarNote } from '../data/radar';
import { verticals } from '../data/content';

/** Âncora estável de cada nota (título sem acentos), usada pela home e pela lista de /conteudos. */
export function radarId(note: RadarNote) {
  return 'radar-' + note.titulo.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
}

export function RadarMeta({ note }: { note: RadarNote }) {
  const date = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(note.data);
  return <div className="content-meta"><span>{note.frente}</span><span aria-hidden="true">·</span>{date ? <time dateTime={`${date[3]}-${date[2]}-${date[1]}`}>{note.data}</time> : <span>{note.data}</span>}</div>;
}

function RadarBody({ note, showFront }: { note: RadarNote; showFront: boolean }) {
  return <>
    <p className="radar-summary">{note.resumo}</p>
    <div className="radar-impact"><p className="radar-impact-label">O que muda para a sua empresa</p><p>{note.oQueMuda}</p></div>
    <p className="radar-sources"><span>Fonte: </span>{note.fontes.map((source, index) => <span key={source.url}>{index > 0 && <span aria-hidden="true"> · </span>}<a href={source.url} target="_blank" rel="noopener">{source.nome}<span className="sr-only"> (abre em nova aba)</span></a></span>)}</p>
    {showFront && <a className="content-text-link" href={`/${verticals.find(vertical => vertical.name === note.frente)?.slug ?? ''}`}>Ver a área {note.frente}</a>}
  </>;
}

/** Nota inteira aberta, na grade editorial: área e data na coluna lateral, conteúdo na principal. */
export function RadarNotes({ notes }: { notes: RadarNote[] }) {
  return <div className="radar-notes">{notes.map(note => <article className="radar-note" key={note.titulo}>
    <RadarMeta note={note} />
    <h3>{note.titulo}</h3>
    <RadarBody note={note} showFront={false} />
  </article>)}</div>;
}

/** Lista de títulos (como a faixa da home); cada nota abre no próprio lugar. */
export function RadarList({ notes }: { notes: RadarNote[] }) {
  return <ul className="radar-list">{notes.map(note => <li key={note.titulo}><details className="radar-item" id={radarId(note)}>
    <summary><RadarMeta note={note} /><h3>{note.titulo}</h3></summary>
    <div className="radar-detail"><div><RadarBody note={note} showFront /></div></div>
  </details></li>)}</ul>;
}

export function FrontRadar({ front }: { front: string }) {
  const notes = orderedRadar.filter(note => note.frente === front);
  if (!notes.length) return null;
  return <section className="front-radar content-surface"><div className="wrap"><h2>Radar do mercado</h2><RadarNotes notes={notes} /></div></section>;
}

export function HomeRadar() {
  return <section className="home-radar content-surface"><div className="wrap">
    <div className="home-radar-heading"><h2>Radar do mercado</h2><a className="content-text-link" href="/conteudos#radar">Ver o radar completo</a></div>
    <div className="home-radar-notes">{orderedRadar.slice(0, 3).map(note => <article key={note.titulo}><RadarMeta note={note} /><h3><a href={`/conteudos#${radarId(note)}`}>{note.titulo}</a></h3></article>)}</div>
  </div></section>;
}
