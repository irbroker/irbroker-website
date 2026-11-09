export interface Guia {
  frente: string;
  slug: string;
  titulo: string;
  /** Rótulo curto da trilha de navegação. */
  trilha: string;
  /** Título para busca (sem o sufixo " | irbroker"), quando o título passa de 60 caracteres. */
  seoTitle?: string;
  linhaFina: string;
  /** Description para busca (120 a 155 caracteres), quando a linha fina é curta. */
  seoDescription?: string;
  data: string;
  tempoLeitura: string;
  corpo: string;
  nota: string;
  fontes: { nome: string; url: string }[];
}

export const guides: Guia[] = [
  {
    frente: "Transporte de cargas",
    slug: "/conteudos/seguros-obrigatorios-do-transportador",
    trilha: "Seguros obrigatórios do transportador",
    titulo:
      "RCTR-C, RC-DC e RC-V: os três seguros obrigatórios do transportador",
    seoTitle: "RCTR-C, RC-DC e RC-V: seguros obrigatórios",
    seoDescription:
      'Desde a Lei 14.599/2023, a pergunta "qual dos dois?" ficou para trás. Entenda o RCTR-C, o RC-DC e o RC-V: cada seguro responde a um risco diferente.',
    linhaFina:
      'Desde a Lei 14.599/2023, a pergunta "qual dos dois?" ficou para trás. Cada seguro responde a um risco diferente.',
    data: "09/11/2026",
    tempoLeitura: "4 min de leitura",
    corpo:
      'Por muitos anos, a conversa dentro das transportadoras foi "RCTR-C ou RC-DC?". A Lei 14.599/2023 encerrou essa escolha. Ela deu nova redação ao art. 13 da Lei 11.442/2007 e definiu que três seguros são de contratação obrigatória para quem presta o serviço de transporte rodoviário de cargas: o RCTR-C, o RC-DC e o RC-V.\n\nSegundo a Susep, a lei tornou obrigatórios seguros que até então eram de contratação facultativa, caso do RC-DC e do RC-V. Ela não criou produtos novos: mudou a obrigação.\n\n### RCTR-C: quando o veículo se acidenta\n\nO RCTR-C (Responsabilidade Civil do Transportador Rodoviário de Carga) cobre perdas ou danos causados à carga em consequência de acidentes com o veículo transportador. A lei lista os eventos: colisão, abalroamento, tombamento, capotamento, incêndio ou explosão.\n\n### RC-DC: quando a carga desaparece\n\nO RC-DC (Responsabilidade Civil do Transportador Rodoviário por Desaparecimento de Carga) responde por outro tipo de evento. Pela lei, cobre roubo, furto simples ou qualificado, apropriação indébita, estelionato e extorsão simples ou mediante sequestro sobrevindos à carga durante o transporte.\n\nOs dois tratam da carga, mas de situações diferentes. Um acidente não é um roubo, e o seguro de um não faz o papel do outro.\n\n### RC-V: os danos a terceiros\n\nO terceiro seguro obrigatório olha para fora do caminhão. O RC-V cobre danos corporais e materiais causados a terceiros pelo veículo automotor usado no transporte de cargas. A Susep publicou a norma do RC-V em dezembro de 2024.\n\n### O plano de gerenciamento de riscos\n\nA lei também amarra o RCTR-C e o RC-DC a um plano de gerenciamento de riscos (PGR), estabelecido de comum acordo entre o transportador e a sua seguradora. Na prática, as regras de operação, como rotas, rastreamento e procedimentos, fazem parte do seguro. Mudou a operação? Vale olhar o PGR junto com a apólice.\n\n### Carta DDR não substitui o seguro\n\nUma dúvida comum é se a carta de Dispensa de Direito de Regresso (DDR), dada pelo embarcador, dispensa o seguro. A Susep responde que a DDR não isenta, sob qualquer hipótese, a contratação dos seguros legalmente obrigatórios, inclusive o RC-DC.\n\n### Ter contratado não basta: precisa estar vigente\n\nSegundo a ANTT, o descumprimento das regras de comprovação dos seguros pode levar à suspensão do RNTRC, o registro que permite à empresa operar. Por isso a pergunta útil hoje é outra: o RCTR-C, o RC-DC e o RC-V da sua transportadora estão contratados, vigentes e de acordo com a operação atual?\n\nTrês pontos para conferir na próxima revisão:\n- se as três apólices estão vigentes e vinculadas ao RNTRC da empresa;\n- se o PGR combinado com a seguradora corresponde às rotas e cargas de hoje;\n- se novas origens, destinos ou tipos de mercadoria foram informados.',
    nota: "Conteúdo informativo. O alcance de cada cobertura depende das condições da apólice e da análise da seguradora.",
    fontes: [
      {
        nome: "Lei 11.442/2007, art. 13, com redação da Lei 14.599/2023 (ANTTlegis)",
        url: "https://anttlegis.datalegis.inf.br/action/UrlPublicasAction.php?acao=abrirAtoPublico&num_ato=00011442&sgl_tipo=LEI&sgl_orgao=NI&vlr_ano=2007&seq_ato=000",
      },
      {
        nome: "Susep, comunicado sobre seguros obrigatórios dos transportadores (11/10/2023)",
        url: "https://www.gov.br/susep/pt-br/central-de-conteudos/noticias/2023/outubro/susep-emite-comunicado-acerca-de-seguros-de-contratacao-obrigatoria-dos-transportadores-rodoviarios-de-carga",
      },
      {
        nome: "Susep, norma do RC-V (27/12/2024)",
        url: "https://www.gov.br/susep/pt-br/central-de-conteudos/noticias/2024/dezembro/publicada-norma-sobre-o-seguro-de-responsabilidade-civil-de-veiculo-rc-v-do-transportador-de-cargas",
      },
      {
        nome: "ANTT, exigência de seguros obrigatórios (03/09/2025)",
        url: "https://www.gov.br/antt/pt-br/assuntos/ultimas-noticias/antt-reforca-exigencia-de-seguros-obrigatorios-para-transportadores-de-cargas-e-garante-mais-seguranca-nas-estradas",
      },
    ],
  },
  {
    frente: "Comex Broker",
    slug: "/conteudos/cif-fob-seguro-da-carga",
    trilha: "CIF, FOB e o seguro da carga",
    titulo:
      "Fechou CIF? Saiba quem contrata o seguro da carga, e com qual cobertura",
    seoTitle: "CIF e FOB: quem contrata o seguro da carga",
    linhaFina:
      "O Incoterm do contrato define quem faz o seguro da viagem. E, mesmo quando é o vendedor, o nível exigido muda de um termo para outro.",
    data: "09/11/2026",
    tempoLeitura: "4 min de leitura",
    corpo:
      "Na negociação de uma importação ou exportação, o Incoterm costuma ser decidido junto com o preço. Ele parece um detalhe do contrato, mas define quem paga o frete e quem é responsável pela contratação do seguro. E, segundo o portal Siscomex, depois de agregados aos contratos de compra e venda, os Incoterms passam a ter força legal.\n\n### Só dois termos colocam o seguro com o vendedor\n\nOs Incoterms 2020 são onze termos de três letras, publicados pela Câmara de Comércio Internacional (ICC). Na tabela-resumo oficial do Siscomex, só dois deles incluem o seguro entre as tarefas do vendedor: o CIF e o CIP. Nos outros nove, FOB incluído, o seguro não aparece entre as obrigações de quem vende. Quem compra precisa decidir se vai contratar e como.\n\n### CIF e CIP não fazem o mesmo caminho\n\n- **CIF (custo, seguro e frete):** usado só no transporte aquaviário, marítimo ou hidroviário interior. O vendedor contrata e paga frete, custos e seguro relativos ao transporte da mercadoria até o porto de destino combinado.\n- **CIP (transporte e seguro pagos até):** usado em qualquer modalidade de transporte. O seguro vai até o local de destino combinado, que pode ser além do porto.\n\n### A cobertura também é diferente\n\nAqui está o ponto que mais passa despercebido. Segundo a ICC, no CIF as Institute Cargo Clauses (C) continuam sendo o nível padrão de cobertura, e as partes podem combinar uma cobertura maior. No CIP, a regra dos Incoterms 2020 passou a exigir um nível mais alto, de acordo com as Institute Cargo Clauses (A) ou cláusulas similares.\n\nEm outras palavras: fechar em CIF garante que existe um seguro feito pelo vendedor, mas não diz, sozinho, que esse seguro é o adequado para a sua carga. Se o contrato não falar nada além do termo, vale a cobertura padrão.\n\n### O que perguntar antes do próximo embarque\n\n- Qual Incoterm está no contrato, e quem contrata o seguro por ele?\n- Se for CIF, a cobertura combinada é a padrão ou foi pedida uma cobertura maior?\n- Se for FOB ou outro termo sem seguro do vendedor, a sua empresa contratou o seguro da viagem?\n- O seguro vai até onde a carga precisa chegar: o porto ou o destino final?\n\nAs respostas dependem do contrato e da apólice. Ler os dois juntos antes do embarque é o caminho mais seguro.",
    nota: "Conteúdo informativo. O resumo dos Incoterms não substitui as regras da ICC, e o alcance de cada cobertura depende das condições da apólice e da análise da seguradora.",
    fontes: [
      {
        nome: "Siscomex, Incoterms",
        url: "https://www.gov.br/siscomex/pt-br/servicos/aprendendo-a-exportar/7-negociacao-com-o-importador/incoterms",
      },
      {
        nome: "Siscomex, Tabela-resumo Incoterms 2020",
        url: "https://www.gov.br/siscomex/pt-br/servicos/aprendendo-a-exportar/7-negociacao-com-o-importador/tabela-resumo-incoterms-2020",
      },
      {
        nome: "ICC, Incoterms 2020",
        url: "https://iccwbo.org/business-solutions/incoterms-rules/incoterms-2020/",
      },
    ],
  },
  {
    frente: "Construção e imóveis",
    slug: "/conteudos/seguro-do-condominio-predio-e-terceiros",
    trilha: "Seguro do condomínio",
    titulo:
      "Seguro do condomínio: o prédio e os terceiros são perguntas diferentes",
    seoTitle: "Seguro de condomínio: prédio e terceiros",
    seoDescription:
      "A lei obriga o seguro da edificação do condomínio. Os danos a moradores, visitantes e vizinhos pedem outra análise: a cobertura de responsabilidade civil.",
    linhaFina:
      "A lei obriga o seguro da edificação. Os danos a moradores, visitantes e vizinhos pedem outra análise.",
    data: "09/11/2026",
    tempoLeitura: "3 min de leitura",
    corpo:
      'Em muitas assembleias, "o seguro do prédio" é tratado como uma coisa só. Mas existem duas perguntas diferentes por trás dele. A primeira é: e se o meu bem for danificado? A segunda é: e se alguém me cobrar por um dano que sofreu? Cada uma pede um tipo de proteção.\n\n### O que a lei exige do condomínio\n\nO Código Civil é direto: é obrigatório o seguro de toda a edificação contra o risco de incêndio ou destruição, total ou parcial (art. 1.346). E cabe ao síndico realizar esse seguro (art. 1.348, IX). É a proteção do próprio prédio.\n\n### O que é o seguro de responsabilidade civil\n\nO seguro de responsabilidade civil (RC) cuida da segunda pergunta. Pela Lei 15.040/2024, que hoje rege os contratos de seguro, ele garante o interesse do segurado contra os efeitos da imputação de responsabilidade, assim como o direito dos terceiros prejudicados à indenização (art. 98).\n\nEm termos práticos: o seguro da edificação olha para o prejuízo no seu bem. O RC olha para o dano que outra pessoa atribui a você, como um visitante que se fere na área comum ou um vizinho atingido por algo que saiu do prédio.\n\n### A lei fala do prédio. E os terceiros?\n\nO artigo que obriga o seguro trata da edificação. Os danos a moradores, visitantes ou vizinhos pedem uma análise à parte, que pode entrar na apólice como cobertura de responsabilidade civil. Cumprir a obrigação legal, portanto, não responde sozinho à segunda pergunta.\n\nO mesmo raciocínio vale para empresas, incorporadoras e administradoras: proteger o patrimônio e proteger a empresa contra cobranças de terceiros são decisões diferentes, que convém olhar juntas.\n\n### Aconteceu um sinistro? Avise antes de mexer\n\nA Lei 15.040/2024 também orienta o que fazer quando o dano acontece. O segurado deve avisar prontamente a seguradora, por qualquer meio idôneo, e seguir as suas instruções, além de tomar as providências necessárias e úteis para evitar ou minorar os efeitos (art. 66). E é vedado promover modificações no local do sinistro (art. 68).\n\nNa próxima renovação, vale fazer as duas perguntas à apólice: ela protege o prédio? E protege o condomínio quando alguém atribui a ele um dano?',
    nota: "Conteúdo informativo. O alcance de cada cobertura depende das condições da apólice e da análise da seguradora.",
    fontes: [
      {
        nome: "Código Civil, arts. 1.346 e 1.348, IX",
        url: "https://www.planalto.gov.br/ccivil_03/leis/2002/l10406compilada.htm",
      },
      {
        nome: "Lei 15.040/2024, arts. 66, 68 e 98",
        url: "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2024/lei/l15040.htm",
      },
    ],
  },
  {
    frente: "WellCare",
    slug: "/conteudos/vida-saude-odonto-beneficios",
    trilha: "Vida, saúde e odonto",
    titulo: "Vida em grupo, saúde e odonto: três benefícios, duas regras",
    seoTitle: "Vida em grupo, plano de saúde e odonto na empresa",
    seoDescription:
      "Vida em grupo, saúde e odonto chegam juntos no pacote da equipe, mas seguem leis e órgãos diferentes. Saber disso ajuda na próxima revisão de benefícios.",
    linhaFina:
      "Eles chegam juntos no pacote da equipe, mas seguem leis e órgãos diferentes. Saber disso ajuda na próxima revisão.",
    data: "09/11/2026",
    tempoLeitura: "3 min de leitura",
    corpo:
      "Seguro de vida em grupo, plano de saúde e plano odontológico costumam ser discutidos na mesma reunião, como itens da mesma lista. Na regra, cada um mora em um lugar diferente.\n\n### Vida em grupo é seguro\n\nO seguro de vida em grupo é um seguro coletivo. Pela Lei 15.040/2024, estipulante é quem contrata em proveito de um grupo de pessoas, e só pode ser estipulante quem tiver vínculo anterior e não securitário com esse grupo. É o papel da empresa em relação à própria equipe. O mercado de seguros privados tem a Susep como órgão fiscalizador.\n\n### Saúde e odonto são planos\n\nPlano de saúde e plano odontológico seguem outra lei, a 9.656/1998, que trata da assistência médica, hospitalar e odontológica. Quem regula e fiscaliza o setor é a ANS, a Agência Nacional de Saúde Suplementar.\n\nA mesma lei prevê tipos de contratação diferentes, entre eles o individual ou familiar, o coletivo empresarial e o coletivo por adesão. Vale saber qual é o do contrato da sua empresa antes de qualquer revisão.\n\n### Na CLT, não conta como salário\n\nA CLT diz que não serão consideradas como salário algumas utilidades concedidas pelo empregador, entre elas a assistência médica, hospitalar e odontológica e os seguros de vida e de acidentes pessoais (art. 458, § 2º). Os efeitos na folha merecem conferência com o contador da empresa.\n\n### Leia a convenção da sua categoria\n\nA convenção coletiva fixa condições de trabalho da categoria e pode tratar de benefícios, inclusive de seguro de vida. Antes de montar ou mudar o pacote, vale conferir o que a convenção da sua categoria prevê.\n\nTrês perguntas para a próxima revisão de benefícios:\n- Qual é o tipo de contratação do plano de saúde e do odontológico?\n- O seguro de vida em grupo acompanha o tamanho atual da equipe?\n- A convenção coletiva da categoria exige algum benefício?",
    nota: "Conteúdo informativo. Condições, carências, rede e coberturas dependem de cada contrato e da análise da operadora ou seguradora.",
    fontes: [
      {
        nome: "Lei 15.040/2024 (seguro coletivo e estipulante)",
        url: "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2024/lei/l15040.htm",
      },
      {
        nome: "Decreto-Lei 73/1966 (Susep)",
        url: "https://www.planalto.gov.br/ccivil_03/decreto-lei/del0073.htm",
      },
      {
        nome: "Lei 9.656/1998 (planos de saúde)",
        url: "https://www.planalto.gov.br/ccivil_03/leis/l9656.htm",
      },
      {
        nome: "Lei 9.961/2000 (ANS)",
        url: "https://www.planalto.gov.br/ccivil_03/leis/l9961.htm",
      },
      {
        nome: "CLT, art. 458",
        url: "https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452compilado.htm",
      },
    ],
  },
];
