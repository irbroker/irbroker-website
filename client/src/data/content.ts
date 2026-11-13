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
  /** Perguntas frequentes da página (base: cérebro da Lia, 12/11/2026). */
  faq?: [string, string][];
  /** Nota de aceitação própria (saúde: quem aceita é a operadora). */
  acceptance?: string;
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
      "A irbroker Real Estate atende o mercado imobiliário: garantias e proteção patrimonial para quem investe, incorpora, constrói e opera imóveis.",
    audience: [
      "Fundos imobiliários e investidores",
      "Incorporadoras e construtoras",
      "Condomínios logísticos e torres de escritórios",
      "Administradoras de condomínios",
      "Escritórios de advocacia (demandas patrimoniais e tributárias)",
    ],
    solutions: [
      "Garantias contratuais: seguro garantia, fiança locatícia e título de capitalização",
      "Seguros patrimoniais: grandes riscos (property), condomínios e risco de engenharia",
      "Linhas financeiras",
      "RC Profissional (E&O) e D&O",
    ],
    signals: [
      "Contrato de obra ou de locação exigindo garantia",
      "Aditivo que aumentou o valor do contrato",
      "Fiador que desistiu ou caução travando o caixa",
    ],
    faq: [
      ["A irbroker faz seguro garantia para obras e contratos imobiliários?", "Sim. Trabalhamos com garantias contratuais para obras, incorporações e contratos de locação, além de fiança locatícia e título de capitalização. A aceitação e as condições dependem da análise da seguradora sobre a empresa e o contrato."],
      ["O que é o título de capitalização usado no aluguel?", "É um título com regras próprias que pode ser usado como garantia no contrato de locação. Em geral o valor fica aplicado durante o contrato e pode ser resgatado no final, conforme as regras do título. Não é seguro, e vale comparar com as outras garantias."],
      ["Dá para usar seguro no lugar do fiador na locação?", "Sim. A fiança locatícia substitui o fiador ou o depósito caução e garante ao proprietário o aluguel e os encargos previstos no contrato. A aprovação depende da análise de quem aluga."],
      ["O seguro garantia cobre danos à obra?", "Não, são proteções diferentes. A garantia de execução cobre o cumprimento do contrato; danos à própria obra são tema do seguro de riscos de engenharia, e danos a vizinhos e terceiros, da responsabilidade civil de obras."],
      ["A irbroker atende fundos imobiliários e condomínios logísticos?", "Sim. Fundos e investidores, incorporadoras, construtoras, condomínios logísticos e torres de escritórios estão entre os perfis que atendemos, com garantias, seguro patrimonial e responsabilidades."],
    ],
    imageKey: "construction",
  },
  {
    slug: "corporate",
    name: "Corporate",
    tagline: "Seguros para a empresa e para quem a dirige.",
    title: "Seguros para a empresa e para quem a dirige.",
    intro:
      "A irbroker Corporate atende o mercado corporativo, de pequenas a grandes empresas.",
    audience: [
      "Empresas que fecham contratos com o poder público ou grandes clientes",
      "Sócios, diretoria e conselhos",
      "Empresas de serviços profissionais",
      "Indústrias e operações com risco ambiental",
    ],
    solutions: [
      "Garantias: seguro garantia contratual e judicial",
      "Patrimonial e empresarial (PME)",
      "Linhas financeiras",
      "RC geral, RC Profissional (E&O) e D&O",
      "Riscos cibernéticos, ambientais e de engenharia",
    ],
    signals: [
      "Conselho, investidor ou novo sócio pedindo D&O",
      "Edital ou cliente grande exigindo garantia, RC ou seguro de riscos cibernéticos",
      "Depósito judicial travando o caixa",
    ],
    faq: [
      ["O que é o seguro D&O?", "É o seguro de responsabilidade de diretores e administradores por atos de gestão. Protege o patrimônio pessoal dos gestores, com custos de defesa e indenizações conforme a apólice."],
      ["Qual a diferença entre RC geral e D&O?", "O RC geral responde por danos a terceiros causados pela atividade da empresa. O D&O protege os gestores por reclamações ligadas a decisões de gestão. São riscos diferentes, e um não substitui o outro."],
      ["O que o seguro de riscos cibernéticos costuma cobrir?", "Em geral, as consequências de incidentes como vazamento de dados ou ataque: custos de resposta e recuperação e reclamações de terceiros, conforme a apólice. O desenho muda bastante de uma empresa para outra."],
      ["Qual a diferença entre garantia de proposta e garantia de execução?", "A de proposta acompanha a participação na licitação. A de execução garante que o contrato será cumprido depois de assinado. O edital ou o contrato diz qual é exigida e em que condições."],
      ["O seguro garantia pode substituir um depósito judicial?", "A garantia judicial existe para ser usada no processo no lugar de depósito ou penhora, conforme o que o juízo aceitar. Se cabe no seu processo depende da análise do caso."],
      ["A irbroker atende pequenas e médias empresas?", "Sim. Trabalhamos com seguro empresarial e patrimonial para pequenas, médias e grandes empresas, além das linhas de responsabilidade e garantias."],
    ],
    imageKey: "corporate",
  },
  {
    slug: "comex-broker",
    name: "Comex Broker",
    tagline: "Seguro e gestão de riscos para o transporte de cargas, internacional e nacional.",
    title: "O seguro da carga, do porto à estrada.",
    intro:
      "Seguro e gestão de riscos para o transporte de cargas, internacional e nacional. Para quem importa, exporta, embarca e transporta. Empresa de seguro de transporte do Grupo irbroker.",
    audience: [
      "Importadores, exportadores e tradings",
      "Agentes de carga e despachantes aduaneiros",
      "Embarcadores e indústrias",
      "Transportadoras e operadores logísticos",
    ],
    solutions: [
      "Seguro de transporte internacional e nacional",
      "RCTR-C, RC-DC e RC-V (seguros obrigatórios do transportador)",
      "Certificado do embarque emitido na hora, com as informações em mãos",
    ],
    signals: [
      "Novas origens, destinos ou mercadorias",
      "Nova rota, novo tipo de carga ou frota maior",
      "Compra em CIF sem saber o que o seguro do fornecedor cobre",
      "Dúvida se toda carga está averbada, com limite acima da carga mais cara",
    ],
    faq: [
      ["A Comex Broker faz frete ou despacho aduaneiro?", "Não. A Comex Broker é corretora de seguros, empresa do Grupo irbroker, e cuida do seguro de transporte de cargas, internacional e nacional. Frete e despacho ficam com transportadoras, agentes de carga e despachantes."],
      ["Comprei em CIF. Minha carga já está protegida?", "No CIF quem contrata o seguro é o vendedor, e a regra pede apenas uma cobertura mínima, mais restrita. Se o embarque está protegido, e em que condições, depende da apólice que foi feita."],
      ["Comprei em FOB. Preciso contratar seguro?", "No FOB o seguro não está entre as obrigações do vendedor, e o risco passa ao comprador em um ponto da viagem. Contratar é decisão de quem compra, e muitos importadores preferem ter apólice própria."],
      ["Quais seguros a transportadora rodoviária precisa ter?", "Desde a Lei 14.599/2023, o RCTR-C, o RC-DC e o RC-V são os três seguros obrigatórios do transportador rodoviário de cargas, cada um para um risco diferente."],
      ["O RCTR-C cobre roubo de carga?", "Não. O RCTR-C responde por danos à carga em acidentes com o veículo, como colisão, tombamento ou incêndio. Roubo e furto são assunto do RC-DC."],
      ["O que é averbação?", "É a comunicação de cada embarque à seguradora, com os dados da carga. Embarque não averbado, ou averbado fora do prazo, pode ficar sem proteção."],
    ],
    imageKey: "port",
    bridge: "comex",
  },
  {
    slug: "wellcare",
    name: "WellCare Broker",
    // Slogan da WellCare Broker aprovado pelo usuário em 12/11/2026.
    tagline: "Por pessoas, para pessoas, através de pessoas.",
    title: "Por pessoas, para pessoas, através de pessoas.",
    intro:
      "Saúde, odonto, vida, previdência e benefícios da equipe, da escolha à renovação. Empresa de benefícios do Grupo irbroker.",
    audience: [
      "Empresas de todos os portes",
      "RH e gestão de benefícios",
      "Diretoria e financeiro",
      "Pessoas e famílias",
    ],
    // Direção de 11/11 (seção 4). Previdência e o nome do benefício de bem-estar seguem "a confirmar" e ficam de fora.
    solutions: [
      "Saúde corporativa e individual",
      "Odontologia",
      "Vida em grupo e acidentes pessoais",
      "Previdência",
      "Vale-refeição, vale-alimentação e bem-estar",
    ],
    signals: [
      "Aviso de reajuste ou aniversário do contrato",
      "Equipe nova em outra cidade",
      "Pedido de odonto, dependentes ou vida em grupo",
    ],
    faq: [
      ["A WellCare Broker é uma operadora de plano de saúde?", "Não. A WellCare Broker é corretora, empresa de benefícios do Grupo irbroker. Entende o perfil da equipe, busca alternativas junto às operadoras e seguradoras e acompanha a empresa depois da contratação."],
      ["O que é carência?", "É o período depois da contratação em que alguns procedimentos ainda não podem ser usados. O prazo muda conforme o procedimento e o contrato."],
      ["O que é coparticipação?", "É quando o colaborador paga uma parte da consulta ou do exame no momento em que usa. Muitas empresas adotam para equilibrar o custo do plano."],
      ["Seguro de vida é a mesma coisa que plano de saúde?", "Não. O plano de saúde cuida das despesas com atendimento médico; o seguro de vida é uma proteção financeira para a família em caso de morte ou invalidez, conforme a apólice."],
      ["Dá para incluir dependentes no plano da empresa?", "Em geral os planos empresariais permitem dependentes, mas quem pode entrar depende das regras de cada contrato."],
    ],
    imageKey: "wellcare",
    bridge: "wellcare",
    acceptance: "Disponibilidade, aceitação e coberturas dependem da análise de cada seguradora ou operadora.",
  },
];

/** Ordem de exibição (decisão do usuário em 12/11/2026): Comex Broker, WellCare Broker, Corporate e Real Estate.
 *  Vale para os cards da Home, o menu, o rodapé, o formulário de contato e os filtros de Conteúdos. */
const ORDEM = ["comex-broker", "wellcare", "corporate", "real-estate"];
export const verticals: Vertical[] = ORDEM.map(slug => {
  const vertical = verticalData.find(item => item.slug === slug);
  if (!vertical) throw new Error(`Especialidade sem dados: ${slug}`);
  return vertical;
});

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
      "Corretora de seguros para empresas em São Paulo (Faria Lima) e São Bernardo do Campo: transporte de cargas, benefícios, corporate e mercado imobiliário.",
    imageKey: "hero",
  },
  "/comex-broker": {
    title: "Seguro de transporte de cargas internacional e nacional | Comex Broker",
    description:
      "Seguro e gestão de riscos para o transporte de cargas, internacional e nacional, de importadores e exportadores a transportadoras. RCTR-C, RC-DC e RC-V.",
    imageKey: "comexHero",
  },
  "/wellcare": {
    title: "Plano de saúde e benefícios empresariais | WellCare Broker",
    description:
      "Plano de saúde, odonto, vida em grupo, acidentes pessoais e previdência para empresas, da escolha à renovação. A WellCare Broker é a empresa de benefícios do Grupo irbroker.",
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
      "Seguro garantia, patrimonial e empresarial, linhas financeiras, RC, D&O, cyber, ambiental e engenharia para pequenas, médias e grandes empresas e para os seus gestores.",
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
      "Notícias do mercado segurador e guias de seguros para empresas, por especialidade do Grupo irbroker: transporte de cargas, benefícios, corporate e mercado imobiliário.",
    imageKey: "contents",
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
  description: "A página procurada não existe ou mudou de endereço. Acesse a home ou uma das especialidades do Grupo irbroker.",
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
