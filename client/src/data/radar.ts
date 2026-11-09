export type RadarNote = {
  frente: string;
  data: string;
  titulo: string;
  resumo: string;
  oQueMuda: string;
  fontes: { nome: string; url: string }[];
};

// Only the four supplied, non-pending notes belong to the website.
export const radar: RadarNote[] = [
  {
    "frente": "Comex Broker",
    "data": "05/10/2026",
    "titulo": "Frete de contêiner sobe quase 300% em cinco meses e atrasos mudam rotas nos portos",
    "resumo": "Segundo reportagem da CNN Brasil, o frete internacional de contêineres chegou a subir quase 300% em cinco meses, pressionado pelo custo do combustível dos navios. A Associação Brasileira dos Terminais Portuários (ABTP) relata mais de 700 linhas marítimas afetadas, navios chegando concentrados, com filas para atracar, e empresas deslocando cargas entre portos.",
    "oQueMuda": "Atraso e troca de porto alongam o tempo da carga em trânsito e podem mudar o trajeto previsto. Vale conferir se o seguro da viagem acompanha a rota real, o destino final e o prazo do embarque, e se o valor declarado reflete os custos atuais.",
    "fontes": [
      {
        "nome": "CNN Brasil, \"Frete marítimo dispara e provoca mudança de rotas de cargas no Brasil\", 05/10/2026",
        "url": "https://www.cnnbrasil.com.br/blogs/jenifer-ribeiro/infra/frete-maritimo-dispara-e-provoca-mudanca-de-rotas-de-cargas-no-brasil/"
      }
    ]
  },
  {
    "frente": "Transporte de cargas",
    "data": "01/07/2026",
    "titulo": "Verificação automática dos seguros obrigatórios entrou na fase de produção na ANTT",
    "resumo": "Pelo cronograma da ANTT, o sistema que recebe das seguradoras os dados do RCTR-C, do RC-DC e do RC-V passou do período de homologação para o ambiente de produção a partir de 1º de julho de 2026, para inscrição e manutenção do RNTRC. Segundo a agência, o descumprimento das regras de comprovação pode levar à suspensão do RNTRC.",
    "oQueMuda": "A comprovação deixa de depender de papel. Se uma das três apólices vencer ou não estiver vinculada ao RNTRC, a falha aparece no cruzamento de dados. Vale conferir vigência e vínculo das três antes da próxima renovação.",
    "fontes": [
      {
        "nome": "ANTT, \"ANTT inicia integração nacional para verificação automática dos seguros obrigatórios do transporte de cargas\", 10/03/2026",
        "url": "https://www.gov.br/antt/pt-br/assuntos/ultimas-noticias/antt-inicia-integracao-nacional-para-verificacao-automatica-dos-seguros-obrigatorios-do-transporte-de-cargas"
      },
      {
        "nome": "ANTT, 03/09/2025",
        "url": "https://www.gov.br/antt/pt-br/assuntos/ultimas-noticias/antt-reforca-exigencia-de-seguros-obrigatorios-para-transportadores-de-cargas-e-garante-mais-seguranca-nas-estradas"
      }
    ]
  },
  {
    "frente": "Corporate",
    "data": "19/08/2026",
    "titulo": "Nova norma dos seguros de danos vale para contratos formados ou renovados a partir de 5 de janeiro de 2027",
    "resumo": "A Resolução CNSP 496/2026 fixa regras gerais para os contratos de seguros de danos e revoga a Resolução CNSP 407/2021. Segundo a Susep, as seguradoras têm até 4 de janeiro de 2027 para adaptar os planos, e a regra passa a ser obrigatória para contratos formados ou renovados a partir de 5 de janeiro de 2027. A norma fixa prazo máximo de 30 dias para a seguradora regular o sinistro e se manifestar sobre a cobertura.",
    "oQueMuda": "Renovações de patrimonial, responsabilidade civil e outros seguros de danos a partir de janeiro seguem as novas regras. É um bom momento para revisar as condições com a corretora antes da renovação, e não depois.",
    "fontes": [
      {
        "nome": "Susep, \"Nova norma do CNSP estabelece regras gerais para contratos de seguros de danos\", 19/08/2026",
        "url": "https://www.gov.br/susep/pt-br/central-de-conteudos/noticias/2026/agosto/nova-norma-do-cnsp-estabelece-regras-gerais-para-contratos-de-seguros-de-danos"
      }
    ]
  },
  {
    "frente": "WellCare",
    "data": "2026 (Agenda Regulatória 2026-2028)",
    "titulo": "ANS prevê para o fim de 2026 a decisão sobre novas regras de reajuste dos planos coletivos",
    "resumo": "A Agenda Regulatória 2026-2028 da ANS inclui o tema \"Reajuste coletivo\": concluir o aprimoramento das regras de reajuste dos planos coletivos, para reduzir a assimetria de informação. A deliberação final está prevista para o 4º trimestre de 2026.",
    "oQueMuda": "Os planos coletivos empresariais não seguem o teto que a ANS fixa para os planos individuais. Se as regras de reajuste mudarem, o aniversário do contrato da sua empresa pode ser afetado. Vale acompanhar e revisar o contrato antes da próxima data de reajuste.",
    "fontes": [
      {
        "nome": "ANS, Agenda Regulatória 2026-2028 (PDF)",
        "url": "https://www.gov.br/ans/pt-br/acesso-a-informacao/participacao-da-sociedade/agenda-regulatoria/Agenda_Regulatria_20262028_B.pdf"
      }
    ]
  }
];

function dateKey(data: string) {
  const exact = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(data);
  if (exact) return `${exact[3]}-${exact[2]}-${exact[1]}`;
  // Year-only facts have no invented day or month and follow precise dates.
  return data.slice(0, 4);
}

export const orderedRadar = [...radar].sort((a, b) => dateKey(b.data).localeCompare(dateKey(a.data)));
