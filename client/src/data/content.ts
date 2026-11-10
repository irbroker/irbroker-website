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
    slug: "transporte-de-cargas",
    name: "Transporte de cargas",
    tagline: "Seguros de responsabilidade para quem transporta carga de terceiros.",
    title: "Os seguros obrigatórios do transportador, em dia.",
    intro: "Seguros de responsabilidade para quem transporta carga de terceiros.",
    audience: [
      "Transportadoras e operadores logísticos",
      "Agentes de carga e despachantes",
    ],
    solutions: [
      "RCTR-C, RC-DC e RC-V (seguros obrigatórios)",
      "Seguro de transporte nacional",
    ],
    signals: [
      "Nova rota, novo tipo de carga ou frota maior",
      "Cliente ou contrato exigindo seguro específico",
      "Dúvida se toda carga está averbada, com limite acima da carga mais cara",
    ],
    imageKey: "transport",
  },
  {
    slug: "comex-broker",
    name: "Comex Broker",
    tagline: "Seguro internacional de cargas para quem importa e exporta.",
    title: "O seguro da carga que você importa ou exporta.",
    intro:
      "Seguro internacional de cargas para importadores e exportadores. Área de comércio exterior do Grupo irbroker.",
    audience: [],
    solutions: [],
    signals: [
      "Novas origens, destinos ou mercadorias",
      "Compra em CIF sem saber o que o seguro do fornecedor cobre",
    ],
    imageKey: "port",
    bridge: "comex",
  },
  {
    slug: "construcao-e-imoveis",
    name: "Construção e imóveis",
    tagline: "Do terreno à entrega das chaves.",
    title: "Do terreno à entrega das chaves.",
    intro:
      "Garantias e proteção patrimonial para quem incorpora, constrói, administra e investe.",
    audience: [
      "Incorporadoras e construtoras",
      "Administradoras de condomínios",
      "Investidores",
    ],
    solutions: [
      "Seguro garantia: licitação e execução",
      "Risco de engenharia e RC obras",
      "Patrimonial e condomínios",
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
    intro: "Proteção para a empresa e para os gestores, em empresas de todos os portes.",
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
    slug: "wellcare",
    name: "WellCare",
    tagline: "Benefícios desenhados para a equipe da sua empresa.",
    title: "Benefícios desenhados para a equipe da sua empresa.",
    intro:
      "Saúde, odonto, vida e acidentes pessoais, da escolha à renovação. A WellCare é a área de benefícios do Grupo irbroker.",
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

export const frontOrder = ['Comex Broker', 'WellCare', 'Transporte de cargas', 'Construção e imóveis', 'Corporate'] as const;
export const verticals: Vertical[] = frontOrder.map(name => verticalData.find(vertical => vertical.name === name)!);

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
];

type PageImageKey = VerticalImageKey | "hero" | "about" | "comexHero";

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
      "Corretora de seguros para empresas em São Paulo (Faria Lima) e São Bernardo do Campo: comércio exterior, benefícios, transporte, construção e corporate.",
    imageKey: "hero",
  },
  "/comex-broker": {
    title: "Seguro de carga para importação e exportação | irbroker",
    description:
      "Seguro internacional de cargas para empresas importadoras e exportadoras. A Comex Broker é a área de comércio exterior do Grupo irbroker, em São Paulo.",
    imageKey: "comexHero",
  },
  "/wellcare": {
    title: "Plano de saúde e benefícios empresariais | irbroker",
    description:
      "Plano de saúde, odonto, vida em grupo e acidentes pessoais para empresas, da escolha à renovação. A WellCare é a área de benefícios do Grupo irbroker.",
    imageKey: "wellcare",
  },
  "/transporte-de-cargas": {
    title: "RCTR-C, RC-DC e RC-V para transportadoras | irbroker",
    description:
      "Seguros obrigatórios do transportador (RCTR-C, RC-DC e RC-V) e seguro de transporte nacional para transportadoras, operadores logísticos e agentes de carga.",
    imageKey: "transport",
  },
  "/construcao-e-imoveis": {
    title: "Seguro garantia e risco de engenharia | irbroker",
    description:
      "Seguro garantia de licitação e execução, risco de engenharia, RC obras e seguro de condomínio para incorporadoras, construtoras e administradoras.",
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
      "Notícias do mercado segurador e guias de seguros para empresas, área por área: comércio exterior, benefícios, transporte, construção e corporate.",
    imageKey: "hero",
  },
  "/contato": {
    title: "Fale com a corretora em São Bernardo e Faria Lima | irbroker",
    description:
      "Fale com a irbroker sobre o seguro da sua empresa. Escritórios em São Bernardo do Campo e na Faria Lima (SP). WhatsApp e comercial@irbroker.com.br.",
    imageKey: "hero",
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
  "Transporte de cargas": "transport",
  "Comex Broker": "port",
  "Construção e imóveis": "construction",
  WellCare: "wellcare",
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
