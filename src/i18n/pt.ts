import type { Dict } from './en'

// Português (Brasil). Mesma estrutura de en.ts.

const pt: Dict = {
  meta: {
    title: 'Waygex — Da primeira ideia ao app no ar',
    successTitle: 'Reunião agendada — Waygex',
  },

  nav: {
    skip: 'Pular para o conteúdo',
    services: 'O que fazemos',
    process: 'Como trabalhamos',
    partners: 'Parceiros',
    faq: 'Dúvidas',
    contact: 'Enviar briefing',
    book: 'Marcar conversa',
    otherLanguage: 'English',
    otherLanguageLabel: 'Read in English',
    home: 'Início Waygex',
  },

  hero: {
    title: ['Seu app,', 'do zero ao ar'],
    lead: 'Um estúdio de software brasileiro que desenha e desenvolve apps web e mobile, com IA no produto e no nosso jeito de trabalhar.',
    cta: 'Marcar conversa',
    secondary: 'ou envie um briefing',
  },

  services: {
    heading: 'O que fazemos',
    items: [
      { name: 'Apps web', text: 'Plataformas SaaS, marketplaces, painéis e sistemas internos, numa stack fácil de contratar depois.' },
      { name: 'Apps mobile', text: 'iOS e Android a partir de um único código, até a aprovação na App Store e no Google Play.' },
      { name: 'Recursos de IA', text: 'Assistentes, leitura de documentos, busca e agentes ligados aos seus dados, com limites e custos visíveis.' },
      { name: 'Automações', text: 'As etapas manuais e repetitivas da sua operação viram fluxos que rodam sozinhos.' },
      { name: 'Nuvem e infra', text: 'Hospedagem, migrações, backups e monitoramento, para o lançamento não ser o último dia em que tudo funciona.' },
      { name: 'Reforço de time', text: 'Desenvolvedores e designers que entram no seu time por projeto, ou um time inteiro quando precisar.' },
    ],
    statement: 'A IA escreve o código rotineiro. Um engenheiro sênior revisa cada linha antes de ir ao ar, e você testa software funcionando toda semana.',
  },

  process: {
    heading: 'Como trabalhamos',
    picker: 'De onde você está partindo?',
    stages: { idea: 'Uma ideia', prototype: 'Um protótipo', live: 'Um produto no ar' },
    paths: {
      idea: [
        { name: 'Primeira conversa', text: 'Trinta minutos sobre o que você quer construir, para quem, e o que precisa funcionar no lançamento.' },
        { name: 'Proposta em dois dias', text: 'Escopo, etapas e preço fechado por etapa em 1 a 2 dias úteis. Sem custo e sem compromisso.' },
        { name: 'Entregas semanais', text: 'Uma versão para você testar toda semana, desenhada e desenvolvida pelo mesmo time pequeno.' },
        { name: 'Lançamento', text: 'Publicamos na web, na App Store e no Google Play, e acompanhamos de perto as primeiras semanas.' },
      ],
      prototype: [
        { name: 'Primeira conversa', text: 'Mostre o que já existe: o protótipo, o design, o código e o que ainda não funciona.' },
        { name: 'Análise e proposta', text: 'Em 1 a 2 dias úteis: o que manter, o que refazer e um preço fechado por etapa.' },
        { name: 'Tornar real', text: 'Transformamos o protótipo em código de produção, com contas, pagamentos, dados e testes.' },
        { name: 'Lançamento', text: 'Lojas, domínio, monitoramento e métricas prontos antes do primeiro usuário real.' },
      ],
      live: [
        { name: 'Primeira conversa', text: 'Conte onde o produto dói: entregas lentas, um recurso que falta, custo de nuvem ou uma ideia com IA.' },
        { name: 'Diagnóstico e proposta', text: 'Lemos o código e a infraestrutura e enviamos um plano com preços fechados em 1 a 2 dias úteis.' },
        { name: 'Entregas pequenas e seguras', text: 'Melhorias publicadas em passos pequenos e reversíveis, junto com o seu time ou por conta nossa.' },
        { name: 'Manter no ar', text: 'Monitoramento, backups e um plano mensal para os próximos passos.' },
      ],
    },
    cta: 'Enviar briefing a partir daqui',
  },

  partners: {
    label: 'Parceiros',
    sentence: 'Empresas e instituições com quem já construímos software, de São Paulo a Nova York.',
    ask: 'Quer sua empresa nesta lista?',
    cta: 'Marcar conversa',
  },

  about: {
    heading: ['Estúdio pequeno,', 'mãos experientes'],
    blocks: [
      {
        title: 'O estúdio',
        text: 'A Waygex é um estúdio de software em Presidente Prudente, SP, que atende clientes no Brasil e no exterior desde 2022. Quem está na sua reunião é quem escreve o código.',
      },
      {
        title: 'Vinicius Padovan, fundador',
        text: 'Engenheiro de software que liderou projetos em empresas com faturamento acima de R$ 20 milhões e mais de 10.000 pedidos por mês, e lançou um sistema de cobrança que movimentou R$ 2 milhões em 30 dias.',
      },
    ],
    cta: 'Marcar conversa',
    linkedin: 'Vinicius no LinkedIn',
    portraitAlt: 'Vinicius Padovan, fundador da Waygex',
  },

  faq: {
    heading: 'Dúvidas',
    items: [
      {
        q: 'O que a Waygex faz?',
        a: 'Desenhamos, desenvolvemos e lançamos apps web e mobile, e adicionamos recursos de IA a produtos que já existem. Somos do Brasil e trabalhamos em português e inglês.',
      },
      {
        q: 'Como vocês usam IA?',
        a: 'Em dois lugares. Dentro do seu produto: assistentes, leitura de documentos, busca e automações, com o modelo escolhido para cada caso. No nosso trabalho: a IA escreve código rotineiro e testes, e um engenheiro revisa tudo antes de ir ao ar.',
      },
      {
        q: 'Minha ideia é complexa. Vocês conseguem?',
        a: 'Provavelmente sim. Já construímos e-commerces, sistemas de pagamento e plataformas de serviços. Na primeira conversa dizemos com clareza o que faríamos primeiro, o que deixaríamos para depois e o que não assumiríamos.',
      },
      {
        q: 'Como começamos?',
        a: 'Marque uma conversa ou envie um briefing. Em 1 a 2 dias úteis após a conversa você recebe uma proposta com escopo, etapas e preço. A proposta não tem custo nem compromisso.',
      },
      {
        q: 'Aceitei a proposta. E agora?',
        a: 'Você confirma pelo link da proposta e assina o contrato. Pedimos alguns documentos e informações, e a primeira semana de trabalho começa.',
      },
      {
        q: 'Quando e como eu pago?',
        a: 'As datas de pagamento são combinadas no contrato. Você acompanha cada fatura na área de clientes Waygex. Aceitamos boleto, transferência bancária e Pix.',
      },
      {
        q: 'Como encerro o contrato?',
        a: 'Envie um e-mail para {mail} com o assunto “Encerrar serviço” e encerramos tudo em até 5 dias úteis. Estaremos aqui para o próximo projeto.',
      },
    ],
  },

  contact: {
    heading: 'Conte o que você quer construir',
    lead: 'Envie um briefing curto e respondemos em 1 a 2 dias úteis.',
    talk: 'Prefere conversar?',
    book: 'Marcar conversa',
    fields: {
      name: 'Seu nome',
      email: 'E-mail',
      company: 'Empresa',
      optional: 'opcional',
      project: 'O que você quer construir?',
      projectHelp: 'Algumas frases bastam: para quem é e o que precisa fazer.',
      stage: 'Em que ponto você está?',
      platforms: 'Do que você precisa?',
      budget: 'Orçamento',
      budgetNone: 'Escolha uma faixa',
    },
    budgets: { small: 'Até R$ 75 mil', medium: 'R$ 75 mil – 250 mil', large: 'Acima de R$ 250 mil', unsure: 'Ainda não sei' },
    platforms: { web: 'App web', ios: 'App iOS', android: 'App Android', ai: 'Recursos de IA' },
    submit: 'Enviar briefing',
    sending: 'Enviando…',
    privacy: 'Usamos esses dados apenas para responder ao seu briefing.',
    success: {
      heading: 'Briefing recebido',
      text: 'Obrigado, {name}. Uma cópia está a caminho de {email}, e respondemos em 1 a 2 dias úteis.',
      again: 'Enviar outro briefing',
    },
    errors: {
      required: 'Preencha este campo.',
      too_short: 'Conte um pouco mais, por favor.',
      too_long: 'Está longo demais.',
      invalid: 'Confira este campo.',
      email: 'Confira este endereço.',
      platforms: 'Escolha pelo menos um.',
      rate_limited: 'Muitas mensagens desta conexão. Tente de novo em alguns minutos ou escreva para {mail}.',
      send_failed: 'O briefing não foi enviado. Tente de novo ou escreva para {mail}.',
      not_configured: 'O formulário está fora do ar agora. Escreva para {mail}.',
      network: 'Sem conexão. Verifique sua internet e tente de novo.',
      summary: 'Alguns campos precisam de atenção antes do envio.',
    },
  },

  footer: {
    place: 'Presidente Prudente, São Paulo, Brasil',
    what: 'Apps web, mobile e IA, da primeira ideia ao lançamento.',
    top: 'Voltar ao topo',
    careers: 'Trabalhe conosco',
    credits: 'Fotografias',
    rights: 'Todos os direitos reservados.',
  },

  screens: {
    assistant: {
      app: 'Pedidos',
      question: 'Quais pedidos estão atrasados esta semana?',
      answer: '4 pedidos estão atrasados. 3 deles dependem do mesmo fornecedor.',
      rows: [
        { label: 'Fornecedor A, #2841', value: '2 dias' },
        { label: 'Fornecedor A, #2853', value: '1 dia' },
        { label: 'Fornecedor B, #2860', value: '1 dia' },
      ],
      action: 'Enviar e-mail ao fornecedor',
      input: 'Pergunte sobre seus pedidos',
    },
    notes: { title: 'Anotações da conversa', items: ['Para: recepções de clínicas', 'Precisa: agendar em menos de um minuto', 'Depois: pagamento online'] },
    proposal: {
      title: 'Proposta',
      rows: [
        { label: 'Contas e agendamento', value: '3 semanas' },
        { label: 'Lembretes e pagamentos', value: '2 semanas' },
        { label: 'Lançamento nas lojas', value: '1 semana' },
      ],
      foot: 'Preço fechado por etapa',
    },
    builds: {
      title: 'Entregas',
      rows: [
        { label: 'Semana 4: agendamento', status: 'Pronto para testar' },
        { label: 'Semana 3: perfis', status: 'Aprovado' },
        { label: 'Semana 2: login', status: 'Aprovado' },
        { label: 'Semana 1: primeiras telas', status: 'Aprovado' },
      ],
    },
    launch: {
      title: 'Agendar consulta',
      day: 'Terça, 14 de outubro',
      times: ['09:00', '09:30', '10:30', '11:00', '14:00', '15:30'],
      selected: '10:30',
      hint: 'Sugestão: 10:30, seu horário de sempre',
      cta: 'Confirmar 10:30',
    },
  },

  success: {
    heading: 'Sua conversa está marcada',
    text: 'O convite está no seu e-mail. Até lá, um briefing nos ajuda a chegar preparados.',
    details: 'Detalhes',
    event: 'Reunião',
    with: 'Com',
    when: 'Quando',
    missing: 'Confira seu e-mail para ver o convite e os detalhes da reunião.',
    back: 'Voltar ao site',
    brief: 'Enviar briefing',
  },
}

export default pt
