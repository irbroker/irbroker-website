import { useEffect, useState } from "react";
import { AVISO, carregarCache, formatar, type Indicador } from "../data/indicadores";

// Faixa de câmbio da Comex Broker (prévia), montada por IndicadorSeguro (só no navegador, depois do "load").
// Comercial quase em tempo real pela AwesomeAPI (sem chave; o provedor guarda cache de ~5 min). Se ela falhar, usa o
// último valor salvo no navegador; sem nada salvo, mostra só a PTAX do cache da rotina; sem nenhum dos dois, não aparece.
const API = "https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL";
const FONTE_API = "https://docs.awesomeapi.com.br/api-de-moedas";
const GUARDA = "irbroker-cambio";
const INTERVALO = 5 * 60 * 1000;

type Cotacao = { usd: number; eur: number; hora: string };

function lerGuardado(): Cotacao | null {
  try {
    const c = JSON.parse(localStorage.getItem(GUARDA) ?? "null");
    return c && Number.isFinite(c.usd) && Number.isFinite(c.eur) && typeof c.hora === "string" ? c : null;
  } catch {
    return null;
  }
}

async function buscarComercial(): Promise<Cotacao | null> {
  try {
    const r = await fetch(API);
    if (!r.ok) return null;
    const j = await r.json();
    // A hora mais antiga das duas moedas (a do dólar para no fechamento do mercado).
    const c = { usd: Number(j.USDBRL.ask), eur: Number(j.EURBRL.ask), hora: [String(j.USDBRL.create_date), String(j.EURBRL.create_date)].sort()[0] };
    return Number.isFinite(c.usd) && Number.isFinite(c.eur) ? c : null;
  } catch {
    return null;
  }
}

// "2026-11-10 19:05:10" (horário de Brasília) -> "10/11 às 19:05"
const horaBr = (s: string) => `${s.slice(8, 10)}/${s.slice(5, 7)} às ${s.slice(11, 16)}`;

export default function CambioAgora() {
  const [agora, setAgora] = useState<Cotacao | null>(null);
  const [salvo, setSalvo] = useState(false);
  const [ptax, setPtax] = useState<Indicador | null>(null);

  useEffect(() => {
    let vivo = true;
    const atualizar = async () => {
      const c = await buscarComercial();
      if (!vivo) return;
      if (c) {
        setAgora(c);
        setSalvo(false);
        try {
          localStorage.setItem(GUARDA, JSON.stringify(c));
        } catch {
          // navegador sem armazenamento: segue sem guardar
        }
      } else {
        const g = lerGuardado();
        if (g) {
          setAgora(a => a ?? g);
          setSalvo(true);
        }
      }
    };
    atualizar();
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") atualizar();
    }, INTERVALO);
    carregarCache().then(c => {
      if (vivo) setPtax(c?.indicadores.find(i => i.id === "ptax") ?? null);
    });
    return () => {
      vivo = false;
      window.clearInterval(timer);
    };
  }, []);

  const ptaxUsd = ptax?.valores.find(v => v.rotulo?.startsWith("Dólar"));
  const ptaxEur = ptax?.valores.find(v => v.rotulo?.startsWith("Euro"));
  const temPtax = Boolean(ptax && ptaxUsd && ptaxEur);
  if (!agora && !temPtax) return null;

  return (
    <section className="ind-fx" aria-label="Câmbio">
      <div className="wrap ind-fx-inner">
        <span className="small-rule" aria-hidden="true" />
        <dl className="ind-fx-values">
          <div>
            <dt>{agora ? "Dólar comercial" : "Dólar PTAX"}</dt>
            <dd>{agora ? formatar({ valor: agora.usd }, "R$") : formatar(ptaxUsd!, "R$")}</dd>
          </div>
          <div>
            <dt>{agora ? "Euro comercial" : "Euro PTAX"}</dt>
            <dd>{agora ? formatar({ valor: agora.eur }, "R$") : formatar(ptaxEur!, "R$")}</dd>
          </div>
        </dl>
        <p className="ind-fx-meta">
          {agora && (
            <>
              Venda, {salvo ? "último valor salvo, de" : "atualizado em"} {horaBr(agora.hora)}. Fonte:{" "}
              <a href={FONTE_API} target="_blank" rel="noopener noreferrer">
                AwesomeAPI<span className="sr-only"> (abre em nova aba)</span>
              </a>
              .{" "}
            </>
          )}
          {temPtax && (
            <>
              Valor oficial do dia: PTAX do{" "}
              <a href={ptax!.fonte.url} target="_blank" rel="noopener noreferrer">
                Banco Central<span className="sr-only"> (abre em nova aba)</span>
              </a>{" "}
              de {ptax!.referencia}
              {agora && <>, dólar {formatar(ptaxUsd!, "R$")} e euro {formatar(ptaxEur!, "R$")}</>}.{" "}
            </>
          )}
          {AVISO}
        </p>
      </div>
    </section>
  );
}
