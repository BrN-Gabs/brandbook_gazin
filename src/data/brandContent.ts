// Conteúdo editorial organizado por seção. Edite os textos aqui, sem alterar os componentes.
// Missão, visão e valores conferidos em 31/10/2026.
// Os pilares são uma proposta editorial pendente de aprovação institucional.
export const brandContent = {
  meta: {
    title: 'Manual da Marca Gazin',
    description: 'Manual da Marca Gazin. Nossa essência, missão, visão e os pilares que orientam um jeito de fazer, conectar e transformar.',
    logoAlt: 'Gazin',
    logoSrc: 'assets/logo-gazin.png',
    signature: 'Sempre fazendo o melhor pra você.',
    edition: 'MANUAL DA MARCA',
    guide: 'GUIA DA MARCA',
  },
  /** Rodapé: redes oficiais (Gazin: Instagram verificado @gazin; Jeito Gazin: Douradina-PR). */
  footer: {
    social: [
      { brand: 'Gazin', links: [{ network: 'Instagram', handle: '@gazin', url: 'https://www.instagram.com/gazin/' }, { network: 'Facebook', handle: 'Gazin', url: 'https://www.facebook.com/gazin' }] },
      { brand: 'Jeito Gazin', links: [{ network: 'Instagram', handle: '@jeitogazin', url: 'https://www.instagram.com/jeitogazin/' }, { network: 'Facebook', handle: 'Jeito Gazin', url: 'https://www.facebook.com/jeitogazin' }] },
    ],
    phone: { label: '(44) 3663-8000', href: 'tel:+554436638000' },
    credit: 'Desenvolvido pela equipe de Marketing Gazin',
  },
  accessibility: {
    mainNavigation: 'Navegação principal',
    mobileNavigation: 'Navegação do Manual da Marca',
    openMenu: 'Abrir menu de navegação',
    closeMenu: 'Fechar menu de navegação',
    skipToContent: 'Pular para o conteúdo',
    home: 'Gazin — voltar ao início',
    backToTop: 'Voltar ao início',
  },
  navigation: [
    {
      id: 'inicio',
      label: 'Início',
    },
    {
      id: 'introducao',
      label: 'Introdução',
    },
    {
      id: 'missao',
      label: 'Nossa Missão',
    },
    {
      id: 'visao',
      label: 'Nossa Visão',
    },
    {
      id: 'valores',
      label: 'Nossos Valores',
    },
    {
      id: 'pilares',
      label: 'Pilares',
    },
    {
      id: 'historia',
      label: 'Nossa História',
    },
    {
      id: 'arvore',
      label: 'Árvore da Jornada',
    },
  ],
  hero: {
    title: [
      'Manual da Marca',
      'Gazin',
    ],
    description: 'Mais que uma identidade, um jeito de fazer, conectar e transformar.',
    scrollLabel: 'Explore nossa marca',
    chapter: 'ESSÊNCIA & PROPÓSITO',
    index: '01 — 05',
  },
  introduction: {
    title: 'INTRODUÇÃO',
    description: 'A marca Gazin carrega uma história construída com dedicação, confiança e compromisso com as pessoas. Este Manual da Marca reúne orientações para apresentar e preservar essa identidade em diferentes pontos de contato.',
    items: [
      {
        number: '01',
        title: 'Consulta',
        text: 'Antes de criar uma comunicação da Gazin, comece por este guia. Ele reúne orientações para aplicar nossa identidade com clareza e consistência, facilitando o trabalho sem limitar a criatividade. Consulte essas diretrizes para que cada nova ideia mantenha a marca reconhecível.',
      },
      {
        number: '02',
        title: 'Apoio',
        text: 'Este Manual da Marca acompanha o dia a dia de quem cria para a Gazin. Suas recomendações e exemplos ajudam a desenvolver peças, adaptar formatos e revisar materiais. Recorra a essas referências para esclarecer dúvidas e tomar decisões com mais segurança.',
      },
      {
        number: '03',
        title: 'Coerência',
        text: 'A Gazin deve ser reconhecida em todos os seus pontos de contato. Quando uma situação não estiver prevista neste guia, deixe os princípios da identidade orientarem suas escolhas. Os formatos podem mudar, mas os valores e as características da marca devem permanecer presentes.',
      },
    ],
  },
  purpose: {
    title: 'Missão e Visão',
    mission: {
      label: 'Nossa Missão',
      lines: [
        'Estabelecer vínculos',
        'duradouros com nossos',
        'clientes, promovendo as',
        'melhores condições para a',
        'venda de produtos e serviços.',
      ],
      // Foto da moldura ao lado da missão: caminho em /public (ex.: 'assets/proposito/missao.jpg')
      // e descrição do que se vê. Vazio = moldura com espaço reservado.
      photo: { src: 'assets/proposito/missao-familia.jpg', alt: 'Vendedor da Gazin, de uniforme e com um tablet, atende uma família sorridente — pai, mãe e filha — na loja' },
    },
    vision: {
      label: 'Nossa Visão',
      lines: [
        'Ser um grupo econômico',
        'centenário, comprometido',
        'com a felicidade',
        'das pessoas.',
      ],
      // Foto da moldura ao lado da visão (mesmas regras da missão).
      photo: { src: 'assets/proposito/visao-colaboradora.jpg', alt: 'Colaboradora da Gazin sorrindo, de braços cruzados, com uniforme e crachá, em uma loja com televisores ao fundo' },
    },
  },
  // Pontos do DNA Gazin revelados ao passar o mouse sobre a hélice da introdução.
  dnaTraits: [
    { number: '01', title: 'Ter fé' },
    { number: '02', title: 'Sentimento de dono' },
    { number: '03', title: 'Espírito de equipe' },
    { number: '04', title: 'Lealdade e integridade' },
    { number: '05', title: 'Empatia e respeito' },
    { number: '06', title: 'Atitude e proatividade' },
    { number: '07', title: 'Simplicidade e objetividade' },
    { number: '08', title: 'Competitividade' },
    { number: '09', title: 'Pontualidade' },
    { number: '10', title: 'Comunicação' },
    { number: '11', title: 'Flexibilidade e senso de urgência' },
  ],
  values: {
    title: 'Nossos Valores',
    items: [
      'Respeito',
      'Trabalho',
      'Integridade',
      'Transparência',
      'Excelência com simplicidade',
    ],
  },
  pillars: {
    title: 'PILARES DA MARCA',
    note: 'Pilares propostos a partir da missão, visão e valores da Gazin.',
    items: [
      {
        number: '01',
        title: 'Pessoas em Primeiro Lugar',
        attributes: [
          'RESPEITO',
          'PROXIMIDADE',
        ],
        description: 'Acreditamos que as pessoas são a essência de tudo o que fazemos. São elas que constroem nossa história, fortalecem nossos valores e impulsionam nossas conquistas. Por isso, cultivamos um ambiente onde o respeito, a empatia e a proximidade estão presentes em cada atitude. Valorizamos a escuta, o diálogo e a compreensão, reconhecendo a importância de cada pessoa e de suas individualidades. Mais do que oferecer produtos e serviços, buscamos criar experiências positivas, fortalecer conexões verdadeiras e construir relações que fazem a diferença na vida de nossos colaboradores, clientes e comunidades.',
        symbol: 'people',
      },
      {
        number: '02',
        title: 'Relações que Duram',
        attributes: [
          'CONFIANÇA',
          'TRANSPARÊNCIA',
        ],
        description: 'Nossa história é construída por pessoas e relações que atravessam gerações. Acreditamos que vínculos sólidos nascem da confiança, da transparência e do compromisso presente em cada interação. Por isso, atuamos com integridade, responsabilidade e respeito, valorizando cada oportunidade de fortalecer nossas conexões. Buscamos estar próximos de nossos clientes, colaboradores, fornecedores e parceiros, construindo relações baseadas no diálogo, na honestidade e na colaboração. Mais do que resultados imediatos, acreditamos no valor das parcerias duradouras, que crescem com o tempo e nos permitem evoluir juntos.',
        symbol: 'connections',
      },
      {
        number: '03',
        title: 'Excelência com Simplicidade',
        attributes: [
          'QUALIDADE',
          'EFICIÊNCIA',
        ],
        description: 'Buscamos a excelência em tudo o que fazemos, sempre com a simplicidade que faz parte da nossa essência. Acreditamos que oferecer o melhor significa unir qualidade, eficiência e dedicação, tornando cada experiência mais prática, acessível e positiva. Valorizamos soluções inteligentes, processos bem estruturados e atitudes que realmente fazem a diferença no dia a dia. Trabalhamos com responsabilidade e atenção aos detalhes, procurando evoluir continuamente sem perder a proximidade e a facilidade que nos caracterizam. Para nós, a verdadeira excelência está em fazer bem-feito, com clareza, agilidade e propósito.',
        symbol: 'excellence',
      },
      {
        number: '04',
        title: 'Evolução Responsável',
        attributes: [
          'INOVAÇÃO',
          'FUTURO',
        ],
        description: 'Evoluir faz parte da nossa história e do nosso compromisso com o amanhã. Acreditamos que crescer significa estar aberto a novas ideias, acompanhar transformações e buscar constantemente maneiras melhores de fazer as coisas. Incentivamos a inovação, o aprendizado contínuo e o desenvolvimento de soluções que gerem valor para as pessoas e para os negócios. Ao mesmo tempo, entendemos que cada avanço deve acontecer com responsabilidade, equilíbrio e visão de longo prazo. Queremos construir um futuro de oportunidades, contribuindo para o desenvolvimento das comunidades, o fortalecimento das relações e o crescimento sustentável da nossa marca.',
        symbol: 'evolution',
      },
    ],
  },
  sources: {
    company: 'https://www.grupogazin.com.br/empresa',
    retail: 'https://grupogazin.com.br/negocio/varejo',
  },
} as const

export type SectionId = (typeof brandContent.navigation)[number]['id']
export type PurposeStatement = typeof brandContent.purpose.mission | typeof brandContent.purpose.vision
