import { Fragment } from "react";
import { guides, type Guia } from "../data/guides";
import { Breadcrumb, Button } from "../components/SiteLayout";

function inline(text: string) {
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .map((part, index) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={index}>{part.slice(2, -2)}</strong>
      ) : (
        <Fragment key={index}>{part}</Fragment>
      )
    );
}

function MarkdownBody({ markdown }: { markdown: string }) {
  const blocks: { type: "p" | "h2" | "ul"; text?: string; items?: string[] }[] =
    [];
  let paragraph: string[] = [];
  let list: string[] = [];
  function flush() {
    if (paragraph.length) {
      blocks.push({ type: "p", text: paragraph.join(" ") });
      paragraph = [];
    }
    if (list.length) {
      blocks.push({ type: "ul", items: list });
      list = [];
    }
  }
  for (const line of markdown.split("\n")) {
    if (!line.trim()) {
      flush();
      continue;
    }
    if (line.startsWith("### ")) {
      flush();
      blocks.push({ type: "h2", text: line.slice(4) });
    } else if (line.startsWith("- ")) {
      if (paragraph.length) {
        blocks.push({ type: "p", text: paragraph.join(" ") });
        paragraph = [];
      }
      list.push(line.slice(2));
    } else {
      if (list.length) {
        blocks.push({ type: "ul", items: list });
        list = [];
      }
      paragraph.push(line);
    }
  }
  flush();
  return (
    <>
      {blocks.map((block, index) =>
        block.type === "h2" ? (
          <h2 key={index}>{inline(block.text!)}</h2>
        ) : block.type === "ul" ? (
          <ul key={index}>
            {block.items!.map((item, i) => (
              <li key={i}>{inline(item)}</li>
            ))}
          </ul>
        ) : (
          <p key={index}>{inline(block.text!)}</p>
        )
      )}
    </>
  );
}

export default function GuidePage({ guide }: { guide: Guia }) {
  // O JSON-LD (Article + BreadcrumbList) vai no <head>, gerado no build por components/StructuredData.tsx.
  return (
    <div className="guide-page content-surface">
      <article className="guide-reading">
        <header className="guide-heading">
          <Breadcrumb
            className="section-label"
            items={[{ label: "Conteúdos", href: "/conteudos" }, { label: guide.trilha }]}
          />
          <h1>{guide.titulo}</h1>
          <p className="guide-subtitle">{guide.linhaFina}</p>
          <p className="content-meta">
            <time dateTime="2026-11-09">{guide.data}</time>
            <span aria-hidden="true">·</span>
            <span>{guide.tempoLeitura}</span>
          </p>
        </header>
        <div className="guide-body">
          <MarkdownBody markdown={guide.corpo} />
        </div>
        <aside className="guide-informative">
          <p>
            <em>{guide.nota}</em>
          </p>
        </aside>
        <section className="guide-sources">
          <h2>Fontes</h2>
          <ul>
            {guide.fontes.map(source => (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noopener">
                  {source.nome}
                  <span className="sr-only"> (abre em nova aba)</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
        <div className="guide-contact">
          <Button href={`/contato?frente=${encodeURIComponent(guide.frente)}`}>
            {guide.botao}
          </Button>
        </div>
      </article>
      <section className="other-guides guide-reading">
        <h2>Outros guias</h2>
        <div className="guide-list">
          {guides
            .filter(other => other.slug !== guide.slug)
            .map(other => (
              <article className="guide-list-item" key={other.slug}>
                <p className="content-meta">{other.frente}</p>
                <h3>
                  <a href={other.slug}>{other.titulo}</a>
                </h3>
                <p>{other.linhaFina}</p>
                <p className="guide-read-time">{other.tempoLeitura}</p>
              </article>
            ))}
        </div>
      </section>
    </div>
  );
}
