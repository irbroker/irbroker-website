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
    title: "A mercadoria e quem a transporta.",
    intro: "Seguros de responsabilidade para quem transporta carga de terceiros.",
    audience: [
      "Transportadoras e operadores logísticos",
      "Agentes de carga e despachantes",
    ],
    solutions: [
      "Seguro de transporte nacional",
      "Seguros de responsabilidade do transportador",
    ],
    signals: [
      "Novas origens, destinos ou mercadorias",
      "Cliente ou contrato exigindo seguro específico",
      "Dúvida se toda carga está averbada, com limite acima da carga mais cara",
    ],
    imageKey: "transport",
  },
  {
    slug: "comex-broker",
    name: "Comex Broker",
    tagline: "Seguro internacional de cargas para quem importa e exporta.",
    title: "A mercadoria que cruza fronteiras.",
    intro:
      "Seguro internacional de cargas para importadores e exportadores. A Comex Broker é a área de comércio exterior do Grupo irbroker.",
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
};

const metadata: Record<string, PageMeta> = {
  "/": {
    title: "irbroker | Seguros corporativos",
    description:
      "Corretora consultiva para empresas que precisam proteger patrimônio, operações e pessoas.",
    imageKey: "hero",
  },
  "/transporte-de-cargas": {
    title: "irbroker | Transporte de cargas",
    description:
      "Seguros de responsabilidade para quem transporta carga de terceiros.",
    imageKey: "transport",
  },
  "/construcao-e-imoveis": {
    title: "irbroker | Construção e imóveis",
    description:
      "Garantias e proteção patrimonial para quem incorpora, constrói, administra e investe.",
    imageKey: "construction",
  },
  "/corporate": {
    title: "irbroker | Corporate",
    description:
      "Proteção para a empresa e para os gestores, em empresas de todos os portes.",
    imageKey: "corporate",
  },
  "/comex-broker": {
    title: "irbroker | Comex Broker",
    description:
      "Seguro internacional de cargas para importadores e exportadores. A Comex Broker é a área de comércio exterior do Grupo irbroker.",
    imageKey: "comexHero",
  },
  "/wellcare": {
    title: "irbroker | WellCare",
    description:
      "Saúde, odonto, vida e acidentes pessoais, da escolha à renovação. A WellCare é a área de benefícios do Grupo irbroker.",
    imageKey: "wellcare",
  },
  "/sobre": {
    title: "irbroker | Sobre",
    description:
      "Uma equipe com mais de duas décadas no mercado segurador. Escritórios em São Bernardo do Campo e em São Paulo, na Faria Lima.",
    imageKey: "hero",
  },
  "/conteudos": {
    title: "Conteúdos | irbroker",
    description: "Notícias e guias, frente por frente.",
    imageKey: "hero",
  },
  "/contato": {
    title: "irbroker | Contato",
    description: "Vamos conversar sobre a sua empresa.",
    imageKey: "hero",
  },
};

const guideImageKeys: Record<string, PageImageKey> = {
  "Transporte de cargas": "transport",
  "Comex Broker": "port",
  "Construção e imóveis": "construction",
  WellCare: "wellcare",
};

for (const guide of guides) {
  metadata[guide.slug] = {
    title: `${guide.titulo} | irbroker`,
    description: guide.linhaFina,
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
  return metadata[normalizePath(path)] ?? metadata["/"];
}
