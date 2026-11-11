import { guides } from "./guides";

export type VerticalImageKey =
  | "transport"
  | "port"
  | "construction"
  | "corporate"
  | "wellcare";

export type Vertical = {
  slug: string;
  name: string;
  tagline: string;
  title: string;
  intro?: string;
  audience: string[];
  solutions: string[];
  signals: string[];
  imageKey: VerticalImageKey;
  bridge?: "comex" | "wellcare";
};

export const acceptanceNote =
  "Disponibilidade, aceitação e coberturas dependem da análise de cada seguradora.";

const verticalData: Vertical[] = [
  {
    slug: "real-estate",
    name: "Real Estate",
    tagline: "Mercado imobiliário: do terreno ao ativo em operação.",
    title: "Seguros para o mercado imobiliário.",
    intro:
      "Real Estate é a vertical da irbroker para o mercado imobiliário: garantias e proteção patrimonial para quem investe, incorpora, constrói e opera imóveis.",
    audience: [
      "Fundos imobiliários e investidores",
      "Incorporadoras e construtoras",
      "Condomínios logísticos e torres de escritórios",
      "Administradoras de condomínios",
    ],
    solutions: [
      "Garantias contratuais: seguro garantia, fiança locatícia e título de capitalização",
      "Seguros patrimoniais: property, condomínios e risco de engenharia",
      "Linhas financeiras",
      "RC Profissional (E&O) e D&O",
    ],
    signals: [
      "Edital pedindo garantia de proposta ou de execução",
      "Aditivo que aumentou o valor do contrato",
      "Fiador que desistiu ou caução travando o caixa",
    ],
    imageKey: "construction",
  },
  {
    slug: "corporate",
    name: "Corporate",
    tagline: "Patrimônio, responsabilidade e quem decide.",
    title: "Patrimônio, responsabilidade e quem decide.",
    intro:
      "Corporate é a vertical da irbroker para o mercado corporativo: proteção para a empresa e para os gestores, em empresas de todos os portes.",
    audience: [
      "Pequenas e médias empresas",
      "Grandes empresas",
    ],
    solutions: [
      "Patrimonial e empresarial (PME)",
      "D&O e riscos cibernéticos",
      "Garantia judicial e contratual",
    ],
    signals: [
      "Conselho, investidor ou novo sócio pedindo D&O",
      "Cliente grande exigindo RC, cyber ou garantia",
      "Depósito judicial travando o caixa",
    ],
    imageKey: "corporate",
  },
  {
    slug: "comex-broker",
    name: "Comex Broker",
    tagline: "Seguro e gestão de riscos para o transporte de cargas, nacional e internacional.",
    title: "O seguro da carga, da estrada ao porto.",
    intro:
      "Seguro e gestão de riscos para o transporte de cargas, nacional e internacional. Para quem transporta, embarca, importa e exporta. Frente de transporte do Grupo irbroker.",
    audience: [
      "Transportadoras e operadores logísticos",
      "Embarcadores e indústrias",
      "Importadores, exportadores e tradings",
      "Agentes de carga e despachantes aduaneiros",
    ],
    solutions: [
      "Seguro de transporte nacional e internacional",
      "RCTR-C, RC-DC e RC-V (seguros obrigatórios do transportador)",
    ],
    signals: [
      "Nova rota, novo tipo de carga ou frota maior",
      "Novas origens, destinos ou mercadorias",
      "Compra em CIF sem saber o que o seguro do fornecedor cobre",
      "Dúvida se toda carga está averbada, com limite acima da carga mais cara",
    ],
    imageKey: "port",
    bridge: "comex",
  },
  {
    slug: "wellcare",
    name: "WellCare Broker",
    tagline: "Benefícios desenhados para a equipe da sua empresa.",
    title: "Benefícios desenhados para a equipe da sua empresa.",
    intro:
      "Saúde, odonto, vida e acidentes pessoais, da escolha à renovação. Área de benefícios do Grupo irbroker.",
    audience: [],
    solutions: [],
    signals: [
      "Aviso de reajuste ou aniversário do contrato",
      "Equipe nova em outra cidade",
      "Pedido de odonto, dependentes ou vida em grupo",
    ],
    imageKey: "wellcare",
    bridge: "wellcare",
  },
];

/** Ordem das 4 frentes (decisão de 11/11/2026): irbroker (Real Estate e Corporate), Comex Broker e WellCare Broker. */
export const verticals: Vertical[] = verticalData;

/** Endereços e nomes antigos (antes de 11/11/2026), mantidos para links já distribuídos. */
export const redirects: Record<string, string> = {
  "/transporte-de-cargas": "/comex-broker",
  "/construcao-e-imoveis": "/real-estate",
};
const frontAliases: Record<string, string> = {
  "Transporte de cargas": "Comex Broker",
  "Construção e imóveis": "Real Estate",
  WellCare: "WellCare Broker",
};
/** Nome da frente vindo de ?frente= (aceita os nomes antigos); "" se não for uma frente. */
export function frontName(value: string | null): string {
  const name = value ? frontAliases[value] ?? value : "";
  return verticals.some(vertical => vertical.name === name) ? name : "";
}

export type SiteRoute = {
  path: string;
  title: string;
};

export const routes: SiteRoute[] = [
  { path: "/", title: "Home" },
  ...verticals.map(vertical => ({ path: `/${vertical.slug}`, title: vertical.name })),
  { path: "/sobre", title: "Sobre" },
  { path: "/conteudos", title: "Conteúdos" },
  ...guides.map((guide) => ({ path: guide.slug, title: guide.titulo, front: guide.frente })).sort((a, b) => verticals.findIndex(item => item.name === a.front) - verticals.findIndex(item => item.name === b.front)).map(({path, title}) => ({path, title})),
  { path: "/contato", title: "Contato" },
  { path: "/indicadores", title: "Indicadores" },
];

type PageImageKey = VerticalImageKey | "hero" | "about" | "comexHero" | "contents";

export type PageMeta = {
  title: string;
  description: string;
  imageKey: PageImageKey;
  ogType?: "article" | "website";
  noindex?: boolean;
};

const metadata: Record<string, PageMeta> = {
  "/": {
    title: "Corretora de seguros corporativos em São Paulo | irbroker",
    description:
      "Corretora de seguros para empresas em São Paulo (Faria Lima) e São Bernardo do Campo: mercado imobiliário, corporate, transporte de cargas e benefícios.",
    imageKey: "hero",
  },
  "/comex-broker": {
    title: "Seguro de transporte de cargas nacional e internacional | Comex Broker",
    description:
      "Seguro e gestão de riscos para o transporte de cargas, nacional e internacional, de transportadoras a importadores e exportadores. RCTR-C, RC-DC e RC-V.",
    imageKey: "comexHero",
  },
  "/wellcare": {
    title: "Plano de saúde e benefícios empresariais | irbroker",
    description:
      "Plano de saúde, odonto, vida em grupo e acidentes pessoais para empresas, da escolha à renovação. A WellCare Broker é a área de benefícios do Grupo irbroker.",
    imageKey: "wellcare",
  },
  "/real-estate": {
    title: "Seguros para o mercado imobiliário: Real Estate | irbroker",
    description:
      "Garantias, seguros patrimoniais, linhas financeiras, RC Profissional e D&O para fundos imobiliários, incorporadoras, construtoras e condomínios.",
    imageKey: "construction",
  },
  "/corporate": {
    title: "Seguro empresarial, D&O e responsabilidade civil | irbroker",
    description:
      "Seguro patrimonial e empresarial, D&O, riscos cibernéticos e garantia judicial para pequenas, médias e grandes empresas e para os seus gestores.",
    imageKey: "corporate",
  },
  "/sobre": {
    title: "Quem somos: corretora de seguros para empresas | irbroker",
    description:
      "Corretora de seguros para empresas, com equipe de longa experiência no mercado segurador e escritórios em São Bernardo do Campo e na Faria Lima (SP).",
    imageKey: "about",
  },
  "/conteudos": {
    title: "Radar do mercado e guias de seguros para empresas | irbroker",
    description:
      "Notícias do mercado segurador e guias de seguros para empresas, área por área: mercado imobiliário, corporate, transporte de cargas e benefícios.",
    imageKey: "contents",
  },
  "/contato": {
    title: "Fale com a corretora em São Bernardo e Faria Lima | irbroker",
    description:
      "Fale com a irbroker sobre o seguro da sua empresa. Escritórios em São Bernardo do Campo e na Faria Lima (SP). WhatsApp e comercial@irbroker.com.br.",
    imageKey: "hero",
  },
  // Prévia: fora do menu e do sitemap (noindex) até a aprovação.
  "/indicadores": {
    title: "Indicadores de mercado | irbroker",
    description:
      "Indicadores públicos por área (câmbio, comércio exterior, diesel, tempo, construção, juros, inflação e saúde), com fonte e data de referência.",
    imageKey: "hero",
    noindex: true,
  },
};

/** Rota desconhecida: gerada como 404.html, com noindex e sem canonical. */
export const notFoundMeta: PageMeta = {
  title: "Página não encontrada | irbroker",
  description: "A página procurada não existe ou mudou de endereço. Acesse a home ou uma das áreas da irbroker.",
  imageKey: "hero",
  noindex: true,
};

const guideImageKeys: Record<string, PageImageKey> = {
  "Comex Broker": "port",
  "Real Estate": "construction",
  "WellCare Broker": "wellcare",
};

for (const guide of guides) {
  metadata[guide.slug] = {
    title: `${guide.seoTitle ?? guide.titulo} | irbroker`,
    description: guide.seoDescription ?? guide.linhaFina,
    imageKey: guideImageKeys[guide.frente] ?? "hero",
    ogType: "article",
  };
}

function normalizePath(path: string): string {
  const pathname = path.split(/[?#]/, 1)[0] || "/";
  if (pathname === "/") return "/";
  return `/${pathname.replace(/^\/+|\/+$/g, "")}`;
}

export function pageMeta(path: string): PageMeta {
  return metadata[normalizePath(path)] ?? notFoundMeta;
}
