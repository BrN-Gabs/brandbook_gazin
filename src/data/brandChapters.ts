// Capítulos do Brandbook após os Pilares da Marca.
//
// ESTRUTURA APENAS: títulos e subtópicos definidos pela equipe de marca. Nenhum
// texto institucional foi escrito aqui. Para publicar conteúdo real em um subtópico:
//   1. preencha `content.text` (parágrafos) e/ou `content.media` (imagens e vídeos);
//   2. troque `status` para 'draft' (em revisão) ou 'ready' (aprovado).
// Os componentes trocam os espaços reservados pelo material automaticamente,
// sem mudar a navegação nem o layout.
import { positioningIntro, positioningTitle } from './positioning'
import { verbalIntro } from './verbalIdentity'
import { physicalIntro, physicalTitle } from './physicalCommunication'
import { photoVideoIntro } from './photoVideo'
import { governanceIntro } from './governance'
import { campaignsIntro } from './campaigns'
import { digitalIntro } from './digitalCommunication'
import { internalIntro } from './internalCommunication'
import { sponsorshipsIntro } from './sponsorships'
import { charactersIntro } from './characters'
import { ourBrandsIntro } from './ourBrands'

/** Tipos de material previstos em cada subtópico; definem o formato do espaço reservado. */
export type ContentKind =
  | 'text' | 'keywords' | 'infographic' | 'quote' | 'comparison'
  | 'logo' | 'colors' | 'typography' | 'grid' | 'graphics' | 'do-dont'
  | 'gallery' | 'video' | 'mockup' | 'devices' | 'print' | 'document' | 'flow' | 'brand' | 'example'

export type ContentStatus = 'planned' | 'draft' | 'ready'

export type MediaItem = {
  type: 'image' | 'video'
  /** Caminho em /public (ex.: 'assets/capitulos/logo-versoes.png') ou URL. */
  src: string
  alt: string
  caption?: string
  poster?: string
}

export type ChapterContent = { text?: string[]; media?: MediaItem[] }

export type Subsection = {
  id: string
  number: string
  title: string
  kinds: ContentKind[]
  status: ContentStatus
  content?: ChapterContent
}

/** Composição visual do capítulo: varia o ritmo do scroll dentro do mesmo sistema. */
export type ChapterLayout = 'split' | 'bento' | 'rows' | 'rail' | 'mosaic' | 'devices' | 'tree' | 'flow' | 'identity' | 'positioning' | 'verbal' | 'physical' | 'photo' | 'governance' | 'campaigns' | 'digital' | 'internal' | 'sponsorships' | 'characters' | 'our-brands'
/** Fundo do capítulo, sempre dentro da família de azuis (ou branco para respiro). */
export type ChapterTheme = 'night' | 'deep' | 'brand' | 'light'

export type Chapter = {
  id: string
  number: string
  title: string
  layout: ChapterLayout
  theme: ChapterTheme
  status: ContentStatus
  description?: string[]
  /** Título de apoio exibido acima da descrição do capítulo. */
  leadTitle?: string
  subsections: Subsection[]
}

/** Optional third item: a fixed id suffix, so a topic inserted later does not shift the ids
 * (and anchors) of the topics after it. The number always follows the position. */
type Draft = Omit<Chapter, 'subsections' | 'status' | 'number'> & { status?: ContentStatus; subsections: [title: string, kinds: ContentKind[], idSuffix?: string][] }

/** The chapter number comes from its POSITION in the list (no fixed numbers, no duplicates):
 * inserting a chapter renumbers the ones after it. Ids never change. */
const chapter = ({ subsections, status = 'planned', ...rest }: Draft) => (number: string): Chapter => ({
  ...rest,
  number,
  status,
  subsections: subsections.map(([title, kinds, idSuffix], index) => ({
    id: `${rest.id}-${idSuffix ?? index + 1}`,
    number: `${number}.${index + 1}`,
    title, kinds, status,
  })),
})

export const brandChapters: Chapter[] = [
  // Conteúdo em proposta editorial (validação institucional pendente): os subtópicos são
  // renderizados por src/components/positioning/ (textos em src/data/positioning.ts).
  chapter({ id: 'posicionamento', title: 'Posicionamento da Marca', layout: 'positioning', theme: 'night', status: 'draft',
    leadTitle: positioningTitle, description: [positioningIntro],
    subsections: [
    ['Personalidade da Marca', ['text', 'keywords']],
    ['Diferenciais Competitivos', ['text', 'infographic']],
    ['Proposta de Valor', ['text', 'keywords']],
    ['Percepção e Posicionamento no Mercado', ['text', 'infographic']],
  ] }),
  // Conteúdo completo, baseado no manual da logomarca Gazin: os subtópicos são
  // renderizados por src/components/identity/ (dados em src/data/visualIdentity.ts).
  chapter({ id: 'identidade-visual', title: 'Identidade Visual', layout: 'identity', theme: 'deep', status: 'ready',
    // Subtítulo: síntese editorial da introdução (validação pendente).
    leadTitle: 'Reconhecida antes mesmo de qualquer palavra.',
    description: [
      'A identidade visual é a forma como a Gazin é reconhecida antes mesmo de qualquer palavra. Um retângulo azul, inclinado e de cantos arredondados, com o nome GAZIN em branco: um símbolo que traduz autoridade, estabilidade e confiança, com a modernidade e a ousadia de uma marca em movimento.',
      'Este capítulo reúne as regras que mantêm essa marca íntegra em qualquer superfície ou meio: a construção da logomarca e seus significados, o azul para impressão e para telas, a tipografia, as versões para cada fundo, a área de segurança, os tamanhos mínimos e os usos que devem ser evitados.',
      'Use estas diretrizes sempre que a marca Gazin for aplicada, em peças institucionais, comerciais ou internas. Todas as versões corretas da logomarca estão disponíveis para download, com e sem o slogan “Sempre fazendo o melhor pra Você!”.',
    ],
    subsections: [
      ['A Logomarca', ['logo', 'text']],
      ['Cores Institucionais', ['colors', 'text']],
      ['Tipografia', ['typography', 'text']],
      ['Versões e Aplicações', ['logo', 'example']],
      ['Área de Segurança', ['grid', 'logo']],
      ['Reduções e Legibilidade', ['logo', 'text']],
      ['Usos Incorretos', ['do-dont', 'example']],
      ['Elementos Gráficos', ['graphics', 'text']],
      // Inserido depois: id fixo, para a Arquitetura manter o id "identidade-visual-9".
      ['Iconografia', ['graphics', 'gallery'], 'iconografia'],
      // Mescla do antigo capítulo 09 · Arquitetura de Marcas com as marcas para download.
      ['Arquitetura de Marcas do Grupo Gazin', ['brand', 'gallery'], '9'],
    ] }),
  // Nossas Marcas (portfólio de 10 marcas, logos extraídas do PDF), logo após a Arquitetura de
  // Marcas (02.10): renderizado por src/components/brands/ (dados em src/data/ourBrands.ts).
  chapter({ id: 'nossas-marcas', title: 'Nossas Marcas', layout: 'our-brands', theme: 'light', status: 'draft',
    leadTitle: ourBrandsIntro.title, description: [ourBrandsIntro.text],
    subsections: [
    ['Galeria de Marcas', ['brand', 'gallery']],
    ['Conheça Cada Marca', ['brand', 'text']],
  ] }),
  // Personagens da Marca (Téo e GI.A): renderizado por src/components/characters/
  // (textos e arquivos em src/data/characters.ts).
  chapter({ id: 'personagens', title: 'Personagens da Marca', layout: 'characters', theme: 'night', status: 'draft',
    leadTitle: charactersIntro.title, description: [charactersIntro.text],
    subsections: [
    ['Conheça os Personagens', ['brand', 'comparison']],
    ['Téo: Atendimento e Relacionamento', ['brand', 'example']],
    ['GI.A: Inteligência Artificial Gazin', ['devices', 'example']],
    ['Diretrizes de Aplicação', ['do-dont', 'text']],
    ['Biblioteca de Personagens', ['gallery', 'document']],
  ] }),
  // Conteúdo em proposta editorial (validação institucional pendente): os subtópicos são
  // renderizados por src/components/verbal/ (textos em src/data/verbalIdentity.ts).
  chapter({ id: 'identidade-verbal', title: 'Identidade Verbal', layout: 'verbal', theme: 'light', status: 'draft',
    leadTitle: verbalIntro.title, description: [verbalIntro.text],
    subsections: [
    ['Tom de Voz da Marca', ['text', 'keywords']],
    ['Linguagem e Estilo de Comunicação', ['text', 'comparison']],
    ['Slogans e Assinaturas', ['quote']],
    ['Expressões e Mensagens-chave', ['quote', 'keywords']],
    ['Exemplos de Aplicação', ['example', 'comparison']],
  ] }),
  // Proposta editorial com fotografias demonstrativas: renderizado por src/components/photo/
  // (textos em src/data/photoVideo.ts).
  chapter({ id: 'fotografia-video', title: 'Fotografia e Vídeo', layout: 'photo', theme: 'night', status: 'draft',
    leadTitle: photoVideoIntro.title, description: [photoVideoIntro.text],
    subsections: [
    ['Estilo Fotográfico', ['gallery', 'text']],
    ['Enquadramentos e Composição', ['gallery', 'comparison']],
    ['Iluminação e Tratamento de Imagens', ['comparison', 'text']],
    ['Direção de Arte Audiovisual', ['video', 'text']],
    ['Movimento e Edição de Vídeo', ['video', 'example']],
  ] }),
  // Campanhas Gazin 2027 (calendário + logos oficiais): renderizado por src/components/campaigns/
  // (dados em src/data/campaigns.ts).
  chapter({ id: 'campanhas', title: 'Campanhas', layout: 'campaigns', theme: 'brand', status: 'draft',
    leadTitle: campaignsIntro.title, description: [campaignsIntro.text],
    subsections: [
    ['Campanhas Institucionais', ['gallery', 'text']],
    ['Campanhas Promocionais', ['gallery', 'text']],
    ['Diretrizes Criativas', ['text', 'example']],
    ['Hierarquia das Informações', ['infographic', 'example']],
    ['Padronização Visual das Peças', ['mockup', 'do-dont']],
  ] }),
  // Proposta editorial de boas práticas com demonstrações didáticas: renderizado por
  // src/components/digital/ (textos em src/data/digitalCommunication.ts).
  chapter({ id: 'comunicacao-digital', title: 'Comunicação Digital', layout: 'digital', theme: 'night', status: 'draft',
    leadTitle: digitalIntro.title, description: [digitalIntro.text],
    subsections: [
    ['Redes Sociais', ['devices', 'gallery']],
    ['Sites e Landing Pages', ['devices', 'text']],
    ['Banners Digitais', ['mockup', 'example']],
    ['E-commerce', ['devices', 'example']],
    ['Animações e Experiências Interativas', ['video', 'text']],
  ] }),
  // Conteúdo baseado no Manual de Merchandising Gazin: os subtópicos são renderizados por
  // src/components/physical/ (textos em src/data/physicalCommunication.ts).
  chapter({ id: 'comunicacao-fisica', title: 'Comunicação Física', layout: 'physical', theme: 'deep', status: 'draft',
    leadTitle: physicalTitle, description: [physicalIntro],
    subsections: [
    ['Fachadas e Identificação das Lojas', ['gallery', 'text']],
    ['Comunicação Visual Interna', ['gallery', 'example']],
    ['Materiais de PDV', ['print', 'mockup']],
    ['Uniformes e Identificação', ['mockup', 'text']],
    ['Sinalização e Ambientação', ['gallery', 'example']],
  ] }),
  // Proposta editorial com demonstrações didáticas (cards na faixa horizontal + painel de detalhes):
  // renderizado por src/components/internal/ (textos em src/data/internalCommunication.ts).
  chapter({ id: 'comunicacao-interna', title: 'Comunicação Interna', layout: 'internal', theme: 'light', status: 'draft',
    leadTitle: internalIntro.title, description: [internalIntro.text],
    subsections: [
    ['TV Gazin', ['video', 'text']],
    ['Comunicados Corporativos', ['document', 'example']],
    ['Campanhas para Colaboradores', ['gallery', 'text']],
    ['Materiais Institucionais Internos', ['document', 'mockup']],
    ['Padronização da Linguagem Interna', ['text', 'comparison']],
  ] }),
  // Iniciativas reais (Instituto, clubes, VEX e feiras 2027): renderizado por
  // src/components/sponsorships/ (dados e fontes em src/data/sponsorships.ts).
  chapter({ id: 'patrocinios-eventos', title: 'Patrocínios e Eventos', layout: 'sponsorships', theme: 'night', status: 'draft',
    leadTitle: sponsorshipsIntro.title, description: [sponsorshipsIntro.text],
    subsections: [
    ['Patrocínios Institucionais', ['gallery', 'text']],
    ['Patrocínios Esportivos', ['gallery', 'brand']],
    ['Materiais e Comunicação de Eventos', ['gallery', 'print']],
    ['Participação em Feiras', ['flow', 'document']],
  ] }),
  // Regras documentadas + modelos de referência (validação pendente): renderizado por
  // src/components/governance/ (textos em src/data/governance.ts).
  chapter({ id: 'governanca', title: 'Governança da Marca', layout: 'governance', theme: 'light', status: 'draft',
    leadTitle: governanceIntro.title, description: [governanceIntro.text],
    subsections: [
    ['Responsabilidades e Gestão da Marca', ['text', 'document']],
    ['Fluxos de Aprovação', ['flow', 'text']],
    ['Diretrizes de Utilização', ['text', 'document']],
    ['Usos Incorretos e Restrições', ['do-dont', 'text']],
    ['Atualizações e Manutenção do Manual da Marca', ['text', 'document']],
  ] }),
].map((build, index) => build(String(index + 1).padStart(2, '0')))

/** Textos provisórios dos espaços reservados (não são diretrizes oficiais). */
export const placeholderCopy = {
  status: { planned: 'Conteúdo em desenvolvimento', draft: 'Em revisão', ready: 'Publicado' } satisfies Record<ContentStatus, string>,
  chapterSubtitle: 'Espaço reservado para o subtítulo do capítulo',
  chapterDescription: 'Espaço reservado para a descrição do capítulo',
  description: 'Espaço reservado para descrição',
  visual: 'Adicionar imagem ou material visual',
  example: 'Adicionar exemplo de aplicação',
  kinds: {
    text: 'Espaço reservado para descrição',
    keywords: 'Adicionar palavras-chave',
    infographic: 'Adicionar infográfico',
    quote: 'Adicionar frase ou assinatura',
    comparison: 'Adicionar comparação',
    logo: 'Adicionar versões do logotipo',
    colors: 'Adicionar amostras de cor',
    typography: 'Adicionar família tipográfica',
    grid: 'Adicionar grid ou construção',
    graphics: 'Adicionar elementos gráficos',
    'do-dont': 'Adicionar usos corretos e incorretos',
    gallery: 'Adicionar imagem ou material visual',
    video: 'Adicionar vídeo',
    mockup: 'Adicionar mockup',
    devices: 'Adicionar tela ou mockup digital',
    print: 'Adicionar material impresso',
    document: 'Adicionar documento ou template',
    flow: 'Adicionar fluxograma',
    brand: 'Adicionar logotipo',
    example: 'Adicionar exemplo de aplicação',
  } satisfies Record<ContentKind, string>,
} as const
