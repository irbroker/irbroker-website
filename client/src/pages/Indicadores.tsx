import { useEffect, useState } from "react";
import { verticals } from "../data/content";
import { Breadcrumb, Editorial } from "../components/SiteLayout";
import IndicadorItem from "../components/IndicadorItem";
import { AREA_POR_SLUG, AVISO, carregarCache, dataHora, type CacheIndicadores } from "../data/indicadores";

// Prévia (noindex, fora do menu). Lê só o cache gerado por scripts/indicadores.mjs; nenhuma fonte é chamada daqui.
const AREAS = [
  { chave: "todas", nome: "Todas as áreas", ancora: "todas-as-areas" },
  ...verticals.map(v => ({
    chave: AREA_POR_SLUG[v.slug],
    nome: v.name,
    ancora: v.slug,
  })),
];

export default function Indicadores() {
  const [cache, setCache] = useState<CacheIndicadores | null>(null);
  const [erro, setErro] = useState(false);
  useEffect(() => {
    carregarCache().then(c => (c ? setCache(c) : setErro(true)));
  }, []);

  return (
    <div className="ind-page content-surface">
      <header className="content-page-heading wrap">
        <Breadcrumb
          className="section-label"
          items={[{ label: "Indicadores" }]}
        />
        <h1>Indicadores de mercado</h1>
        <p>
          Números públicos que pesam no seguro de cada área, com a fonte e a
          data de referência de cada um. {AVISO}
        </p>
      </header>
      <nav className="content-filters wrap" aria-label="Áreas">
        {AREAS.map(area => (
          <a key={area.ancora} href={`#${area.ancora}`}>
            {area.nome}
          </a>
        ))}
      </nav>
      <div
        className="wrap ind-feed"
        aria-live="polite"
        aria-busy={!cache && !erro}
      >
        {erro ? (
          <p className="ind-status" role="alert">
            Não foi possível carregar os indicadores agora. Tente recarregar a
            página em alguns minutos.
          </p>
        ) : !cache ? (
          <p className="ind-status">Carregando os indicadores…</p>
        ) : (
          <>
            <p className="ind-updated">
              Dados coletados em {dataHora(cache.geradoEm)}.
            </p>
            {AREAS.map(area => {
              const itens = cache.indicadores.filter(i =>
                i.verticais.includes(area.chave)
              );
              if (!itens.length) return null;
              return (
                <section
                  key={area.ancora}
                  id={area.ancora}
                  className="ind-area"
                >
                  <Editorial label={area.nome} className="ind-editorial">
                    <div className="ind-item-list">
                      {itens.map(item => (
                        <IndicadorItem key={item.id} item={item} />
                      ))}
                    </div>
                  </Editorial>
                </section>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
