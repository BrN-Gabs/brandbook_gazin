// Capítulo 01 · Posicionamento da Marca.
//
// PROPOSTA EDITORIAL: todos os textos abaixo foram fornecidos como base para o Brandbook e
// ainda dependem de validação institucional antes da publicação definitiva. As duas frases de
// síntese (proposta de valor e posicionamento) são sínteses editoriais deste capítulo, não
// slogans ou assinaturas oficiais da Gazin. Não há números, rankings ou indicadores aqui.
//
// Para revisar um texto, edite apenas este arquivo: os componentes em
// src/components/positioning/ leem tudo daqui.

/** Subtítulo do capítulo (síntese editorial da introdução, validação pendente). */
export const positioningTitle = 'Confiança que se constrói com as pessoas.'
export const positioningIntro = 'Mais do que oferecer produtos e serviços, a Gazin constrói relações de confiança, valoriza as pessoas e transforma oportunidades em conquistas. Nosso posicionamento nasce de uma trajetória marcada pelo trabalho, pela proximidade e pelo compromisso de fazer sempre o melhor.'

/** Rótulo exibido junto às frases de síntese, para não serem lidas como slogans oficiais. */
export const editorialLabel = 'Síntese editorial do capítulo'

export type PersonalityAttribute = { id: string; name: string; description: string; /** Peso visual na composição. */ scale: 'xl' | 'l' | 'm' }
export const personality = {
  text: 'A personalidade da Gazin é construída a partir de valores que atravessam gerações. Somos uma marca próxima, humana e comprometida com as pessoas. Valorizamos relações verdadeiras, o trabalho, a simplicidade e a confiança conquistada em cada interação. Ao mesmo tempo, carregamos a determinação de evoluir, inovar e buscar novas oportunidades, sem perder a essência que nos trouxe até aqui.',
  hint: 'Selecione um atributo',
  attributes: [
    { id: 'humana', name: 'Humana', scale: 'xl', description: 'Colocamos as pessoas no centro das nossas relações, valorizando o respeito, a empatia e o cuidado.' },
    { id: 'proxima', name: 'Próxima', scale: 'l', description: 'Buscamos uma comunicação acessível e uma relação de confiança com clientes, colaboradores e parceiros.' },
    { id: 'confiavel', name: 'Confiável', scale: 'l', description: 'Construímos nossa trajetória com responsabilidade, transparência e compromisso.' },
    { id: 'empreendedora', name: 'Empreendedora', scale: 'm', description: 'Acreditamos no trabalho, na coragem e na capacidade de transformar oportunidades em resultados.' },
    { id: 'inovadora', name: 'Inovadora', scale: 'm', description: 'Valorizamos a evolução constante e buscamos novas formas de melhorar a experiência das pessoas.' },
    { id: 'simples', name: 'Simples', scale: 'l', description: 'Preservamos uma comunicação clara, verdadeira e conectada à realidade de quem faz parte da nossa história.' },
  ] satisfies PersonalityAttribute[],
}

export type DifferentialIcon = 'history' | 'people' | 'layers' | 'handshake' | 'sparkles'
export type Differential = { number: string; title: string; description: string; icon: DifferentialIcon }
export const differentials = {
  text: 'A Gazin construiu sua trajetória combinando experiência, relacionamento e capacidade de evolução. Nossa atuação é fortalecida por uma cultura que valoriza as pessoas, por uma estrutura de negócios diversificada e pelo compromisso de oferecer soluções que acompanhem as necessidades dos nossos públicos. Esses elementos contribuem para uma marca reconhecida por sua proximidade e por sua busca constante por excelência.',
  items: [
    { number: '01', title: 'História e tradição', icon: 'history', description: 'Uma trajetória iniciada em 1966, construída ao longo de décadas de trabalho, expansão e relacionamento com diferentes gerações.' },
    { number: '02', title: 'Valorização das pessoas', icon: 'people', description: 'Uma cultura organizacional que reconhece a importância dos colaboradores, clientes, parceiros e comunidades.' },
    { number: '03', title: 'Diversificação dos negócios', icon: 'layers', description: 'Uma atuação que abrange diferentes segmentos e soluções, ampliando as possibilidades de relacionamento com o mercado.' },
    { number: '04', title: 'Proximidade com o cliente', icon: 'handshake', description: 'Uma marca que valoriza o atendimento, o relacionamento e a construção de vínculos duradouros.' },
    { number: '05', title: 'Evolução e inovação', icon: 'sparkles', description: 'Uma trajetória marcada pela melhoria contínua, pela expansão e pela busca de novas oportunidades.' },
  ] satisfies Differential[],
}

export type ValueDimension = { id: string; audience: string; title: string; description: string; icon: 'clients' | 'team' | 'community' }
export const valueProposition = {
  statement: 'Fazer sempre o melhor, construindo relações de confiança e criando oportunidades que transformam vidas.',
  text: 'A Gazin acredita que seu papel vai além da comercialização de produtos e serviços. Nossa proposta de valor está em oferecer soluções que façam sentido para as pessoas, construindo experiências positivas e relações sustentadas pelo respeito, pela confiança e pelo compromisso. Queremos contribuir para a realização de objetivos, o desenvolvimento das comunidades e a criação de oportunidades para todos que fazem parte da nossa trajetória.',
  dimensions: [
    { id: 'clientes', audience: 'Clientes', title: 'Para nossos clientes', icon: 'clients', description: 'Oferecer soluções, atendimento próximo e experiências que contribuam para suas necessidades e conquistas.' },
    { id: 'colaboradores', audience: 'Colaboradores', title: 'Para nossos colaboradores', icon: 'team', description: 'Valorizar pessoas, incentivar o desenvolvimento e fortalecer um ambiente de respeito, trabalho e oportunidades.' },
    { id: 'comunidades', audience: 'Parceiros e comunidades', title: 'Para nossos parceiros e comunidades', icon: 'community', description: 'Construir relações duradouras, promover o desenvolvimento e contribuir positivamente para os lugares onde estamos presentes.' },
  ] satisfies ValueDimension[],
}

export type PositioningAttribute = { id: string; name: string; description: string; /** Posição na constelação (% da largura e da altura). */ point: [number, number] }
export const marketPositioning = {
  text: 'Queremos que a Gazin seja percebida como uma marca confiável, próxima e em constante evolução. Uma empresa que respeita sua história, valoriza suas origens e acompanha as transformações do mercado sem abrir mão dos princípios que sustentam sua identidade. Nosso posicionamento conecta tradição e inovação, resultados e relacionamento, crescimento e responsabilidade.',
  synthesis: 'Uma marca que cresce com as pessoas, evolui com o mercado e preserva sua essência.',
  hint: 'Explore os atributos',
  attributes: [
    { id: 'confianca', name: 'Confiança', point: [16, 32], description: 'Construir relações sólidas por meio de uma atuação responsável e coerente.' },
    { id: 'proximidade', name: 'Proximidade', point: [50, 14], description: 'Manter uma relação acessível e humana com diferentes públicos.' },
    { id: 'credibilidade', name: 'Credibilidade', point: [86, 40], description: 'Preservar a consistência entre aquilo que comunicamos e aquilo que fazemos.' },
    { id: 'evolucao', name: 'Evolução', point: [66, 82], description: 'Demonstrar capacidade de adaptação, desenvolvimento e inovação.' },
    { id: 'responsabilidade', name: 'Responsabilidade', point: [20, 72], description: 'Valorizar decisões e relacionamentos que considerem pessoas, negócios e comunidades.' },
  ] satisfies PositioningAttribute[],
  /** Ligações da constelação (índices em `attributes`): o contorno e duas diagonais. */
  links: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [0, 2], [1, 3]] as [number, number][],
}
