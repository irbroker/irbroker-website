// Formato do cache gerado por scripts/indicadores.mjs (client/public/data/indicadores.json).
export type Valor = {
  rotulo?: string;
  valor: number | string;
  unidade?: string;
};
export type Indicador = {
  id: string;
  verticais: string[];
  nome: string;
  valores: Valor[];
  unidade: string;
  referencia: string;
  fonte: { nome: string; url: string };
  coletadoEm: string;
  mantido?: boolean;
};
export type CacheIndicadores = {
  geradoEm: string;
  aviso: string;
  indicadores: Indicador[];
};

export const AVISO = "Informativo; não é recomendação.";
export const CACHE_URL = "/data/indicadores.json";

// Áreas na ordem do site (slug da página -> chave usada no cache).
export const AREA_POR_SLUG: Record<string, string> = {
  // 11/11/2026: transporte passou para a Comex; "construcao" é a chave de Real Estate. WellCare sem indicadores (decisão do usuário).
  "real-estate": "construcao",
  corporate: "corporate",
  "comex-broker": "comex",
};

const casas = (unidade: string, n: number) =>
  unidade === "R$" && n < 100 ? 4 : 2;

export function formatar(
  { valor, unidade: propria }: Valor,
  unidadeGeral: string
): string {
  const unidade = propria ?? unidadeGeral;
  if (typeof valor === "string") return valor;
  const d = casas(unidade, valor);
  const n = valor.toLocaleString("pt-BR", {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });
  switch (unidade) {
    case "%":
      return `${n}%`;
    case "% ao ano":
      return `${n}% ao ano`;
    case "R$":
    case "R$ por US$":
      return `R$ ${n}`;
    case "R$ por litro":
      return `R$ ${n} por litro`;
    case "R$/m²":
      return `R$ ${n} por m²`;
    case "US$ bilhões":
      return `US$ ${n} bilhões`;
    default:
      return unidade ? `${n} ${unidade}` : n;
  }
}

export const dataHora = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    dateStyle: "short",
    timeStyle: "short",
  });

// Lê o cache sem nunca lançar erro: devolve null se o JSON faltar, vier inválido ou a rede falhar.
export async function carregarCache(): Promise<CacheIndicadores | null> {
  try {
    const r = await fetch(CACHE_URL, { cache: "no-cache" });
    if (!r.ok) return null;
    const c = (await r.json()) as CacheIndicadores;
    return Array.isArray(c?.indicadores) ? c : null;
  } catch {
    return null;
  }
}
