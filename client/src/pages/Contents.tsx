import { useEffect, useState, type MouseEvent } from "react";
import { frontName, verticals } from "../data/content";
import { Breadcrumb } from "../components/SiteLayout";
import { guides } from "../data/guides";
import { orderedRadar } from "../data/radar";
import { RadarList } from "../components/Radar";
import { media } from "../data/media";

// "09/11/2026" -> 20261109, para ordenar do mais recente ao mais antigo.
const dateKey = (date: string) => Number(date.split("/").reverse().join(""));

function frontFromSearch(search: string) {
  return frontName(new URLSearchParams(search).get("frente"));
}

export default function Contents({ search = "" }: { search?: string }) {
  const [front, setFront] = useState(() => frontFromSearch(search));
  useEffect(() => {
    const sync = () => setFront(frontFromSearch(window.location.search));
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);
  // Link da home para uma nota (#radar-...): abre a nota correspondente.
  useEffect(() => {
    const openNote = () => {
      const note = document.getElementById(
        decodeURIComponent(window.location.hash.slice(1))
      );
      if (note instanceof HTMLDetailsElement) {
        note.open = true;
        note.scrollIntoView({ block: "start" });
      }
    };
    openNote();
    window.addEventListener("hashchange", openNote);
    return () => window.removeEventListener("hashchange", openNote);
  }, []);
  const notes = orderedRadar.filter(note => !front || note.frente === front);
  const articles = guides.filter(guide => !front || guide.frente === front);
  // Destaque: o guia mais recente da seleção (empate fica com o primeiro da lista); sai da lista abaixo.
  const featured = [...articles].sort(
    (a, b) => dateKey(b.data) - dateKey(a.data)
  )[0];
  const rest = articles.filter(guide => guide !== featured);
  const selected = verticals.find(vertical => vertical.name === front);

  function filter(event: MouseEvent<HTMLAnchorElement>, next: string) {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    event.preventDefault();
    const url = new URL(window.location.href);
    if (next) url.searchParams.set("frente", next);
    else url.searchParams.delete("frente");
    window.history.pushState(
      null,
      "",
      `${url.pathname}${url.search}${url.hash}`
    );
    setFront(next);
  }

  return (
    <div className="contents-page content-surface">
      <section className="photo-hero contents-hero">
        <img
          className="hero-photo"
          src={media.contents.src}
          alt=""
          aria-hidden="true"
          width={media.contents.width}
          height={media.contents.height}
          fetchPriority="high"
        />
        <div className="hero-shade" aria-hidden="true" />
        <div className="wrap hero-content">
          <Breadcrumb
            className="hero-kicker"
            items={[{ label: "Conteúdos" }]}
          />
          <h1>O que muda no seguro da sua empresa.</h1>
          <p className="hero-description">
            Guias e notícias do mercado, para cada empresa do Grupo irbroker.
          </p>
        </div>
      </section>
      <nav className="content-filters wrap" aria-label="Filtrar por empresa">
        {["", ...verticals.map(vertical => vertical.name)].map(name => (
          <a
            href={
              name
                ? `/conteudos?frente=${encodeURIComponent(name)}`
                : "/conteudos"
            }
            key={name}
            aria-current={front === name ? "true" : undefined}
            onClick={event => filter(event, name)}
          >
            {name || "Todas"}
          </a>
        ))}
      </nav>
      <div className="wrap content-feed" aria-live="polite" aria-atomic="false">
        {featured && (
          <article className="guide-featured">
            <div className="guide-featured-copy">
              <p className="content-meta">{featured.frente}</p>
              <h2>{featured.titulo}</h2>
              <p>{featured.linhaFina}</p>
              <a className="button button-solid" href={featured.slug}>
                Ler o guia<span className="sr-only">: {featured.titulo}</span>
              </a>
            </div>
          </article>
        )}
        {rest.length > 0 && (
          <section className="contents-guides">
            <h2>{featured ? "Outros guias" : "Guias"}</h2>
            <div className="guide-list">
              {rest.map(guide => (
                <article className="guide-list-item" key={guide.slug}>
                  <p className="content-meta">{guide.frente}</p>
                  <h3>
                    <a href={guide.slug}>{guide.titulo}</a>
                  </h3>
                  <p>{guide.linhaFina}</p>
                  <p className="guide-read-time">{guide.tempoLeitura}</p>
                </article>
              ))}
            </div>
          </section>
        )}
        {notes.length > 0 && (
          <section id="radar" className="contents-radar">
            <h2>Radar do mercado</h2>
            <RadarList notes={notes} />
          </section>
        )}
        {notes.length === 0 && articles.length === 0 && (
          <div className="content-empty">
            <p>Ainda não há conteúdos desta empresa.</p>
            {selected && (
              <a className="content-text-link" href={`/${selected.slug}`}>
                {selected.name}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
