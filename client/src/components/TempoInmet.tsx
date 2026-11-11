import { useEffect, useState } from "react";
import { Editorial } from "./SiteLayout";
import IndicadorItem from "./IndicadorItem";
import { carregarCache, type Indicador } from "../data/indicadores";

// Bloco de tempo (prévia) das páginas Comex Broker e Real Estate, montado por IndicadorSeguro: avisos do INMET
// para SP e previsão das cidades dos escritórios, lidos do cache da rotina. Sem cache ou sem previsão, não aparece.
export default function TempoInmet() {
  const [itens, setItens] = useState<Indicador[]>([]);
  useEffect(() => {
    let vivo = true;
    carregarCache().then(c => {
      if (!vivo || !c) return;
      const previsoes = c.indicadores.filter(i => i.id.startsWith("previsao-"));
      if (!previsoes.length) return;
      const avisos = c.indicadores.find(i => i.id === "inmet-avisos");
      // Cada aviso traz "UF, UF; de ... a ...": mantém só os que incluem SP.
      const sp = avisos && {
        ...avisos,
        nome: "Avisos do INMET para São Paulo (estado)",
        valores: avisos.valores.filter(v => String(v.valor).split(";")[0].split(", ").includes("SP")),
      };
      if (sp && !sp.valores.length) sp.valores = [{ rotulo: "Nenhum aviso", valor: "Sem aviso do INMET para SP nesta consulta." }];
      setItens(sp ? [sp, ...previsoes] : previsoes);
    });
    return () => {
      vivo = false;
    };
  }, []);
  if (!itens.length) return null;
  return (
    <section className="section wrap ind-tempo" aria-label="Tempo">
      <Editorial label="Tempo em São Paulo e São Bernardo do Campo">
        <div className="ind-item-list">
          {itens.map(item => (
            <IndicadorItem key={item.id} item={item} />
          ))}
        </div>
      </Editorial>
    </section>
  );
}
