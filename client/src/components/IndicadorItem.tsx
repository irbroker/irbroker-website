import { AVISO, dataHora, formatar, type Indicador } from "../data/indicadores";

// Um indicador com valores, referência, fonte linkada e o aviso. Usado em /indicadores e no bloco de tempo das áreas.
export default function IndicadorItem({ item }: { item: Indicador }) {
  return (
    <article className="ind-item">
      <h3>{item.nome}</h3>
      <dl
        className={`ind-item-values${item.valores.some(v => typeof v.valor === "string") ? " is-text" : ""}`}
      >
        {item.valores.map((v, i) => (
          <div key={`${v.rotulo}-${i}`}>
            <dt>{v.rotulo ?? item.nome}</dt>
            <dd>{formatar(v, item.unidade)}</dd>
          </div>
        ))}
      </dl>
      <p className="ind-item-meta">
        Referência: {item.referencia}. Fonte:{" "}
        <a href={item.fonte.url} target="_blank" rel="noopener noreferrer">
          {item.fonte.nome}
          <span className="sr-only"> (abre em nova aba)</span>
        </a>
        . {AVISO}
      </p>
      {item.mantido && (
        <p className="ind-item-stale">
          A fonte não respondeu na última coleta. Valor mantido da coleta de{" "}
          {dataHora(item.coletadoEm)}.
        </p>
      )}
    </article>
  );
}
