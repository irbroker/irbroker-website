import { orderedRadar, type RadarNote } from '../data/radar';

export function RadarMeta({ note }: { note: RadarNote }) {
  const date = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(note.data);
  return <div className="content-meta"><span>{note.frente}</span><span aria-hidden="true">·</span>{date ? <time dateTime={`${date[3]}-${date[2]}-${date[1]}`}>{note.data}</time> : <span>{note.data}</span>}</div>;
}

export function RadarNotes({ notes, showContact = true }: { notes: RadarNote[]; showContact?: boolean }) {
  return <div className="radar-notes">{notes.map(note => <article className="radar-note" key={note.titulo}>
    <RadarMeta note={note} />
    <h3>{note.titulo}</h3>
    <p className="radar-summary">{note.resumo}</p>
    <div className="radar-impact"><p className="radar-impact-label">O que muda para a sua empresa</p><p>{note.oQueMuda}</p></div>
    <p className="radar-sources"><span>Fonte: </span>{note.fontes.map((source, index) => <span key={source.url}>{index > 0 && <span aria-hidden="true"> · </span>}<a href={source.url} target="_blank" rel="noopener">{source.nome}</a></span>)}</p>
    {showContact && <a className="content-text-link" href={`/contato?frente=${encodeURIComponent(note.frente)}`}>{note.botao}</a>}
  </article>)}</div>;
}

export function FrontRadar({ front }: { front: string }) {
  const notes = orderedRadar.filter(note => note.frente === front);
  if (!notes.length) return null;
  return <section className="front-radar content-surface"><div className="wrap"><h2>Radar do mercado</h2><RadarNotes notes={notes} showContact={false} /></div></section>;
}

export function HomeRadar() {
  return <section className="home-radar content-surface"><div className="wrap">
    <div className="home-radar-heading"><h2>Radar do mercado</h2><a className="content-text-link" href="/conteudos#radar">Ver o radar completo</a></div>
    <div className="home-radar-notes">{orderedRadar.slice(0, 3).map(note => <article key={note.titulo}><RadarMeta note={note} /><h3><a href={`/conteudos?frente=${encodeURIComponent(note.frente)}#radar`}>{note.titulo}</a></h3></article>)}</div>
  </div></section>;
}
