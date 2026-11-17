// Capítulo 07 · Comunicação Física.
//
// Fonte: "MANUAL MERCHANDISIGN - A4.pdf" (Manual de Merchandising Gazin, 118 páginas). Os textos
// resumem as diretrizes do manual; cada imagem e cada ponto indicam a página de origem. As
// fotografias são as do próprio manual (scripts/import-merchandising.mjs), sem recortes nem
// alterações. Regras específicas de uma aplicação não foram generalizadas: medidas e
// detalhes técnicos remetem ao manual completo, disponível para download no capítulo.
import merchandisingPhotos from './merchandisingPhotos.json' with { type: 'json' }

/** Subtítulo do capítulo (síntese editorial da introdução, validação pendente). */
export const physicalTitle = 'Nossa identidade também nos espaços físicos.'
export const physicalIntro = 'A identidade da Gazin também se expressa nos espaços físicos. Das fachadas à organização dos produtos, cada detalhe contribui para fortalecer nossa marca e proporcionar uma experiência de compra agradável, acessível e acolhedora. A padronização dos ambientes, materiais e elementos visuais garante uma comunicação consistente em nossas lojas.'

export type Guideline = { title: string; text: string; page?: number }
export type Hotspot = { id: string; label: string; text: string; /** % da largura e da altura da imagem. */ x: number; y: number; page: number }
export type Photo = { id: string; alt: string; caption: string }

type PhotoMeta = { width: number; height: number; source: number }
const photos = merchandisingPhotos as Record<string, PhotoMeta>
export const photo = (id: string) => ({ ...photos[id], src: `assets/merchandising/${id}.jpg` })
export const manualPage = (page: number) => `Manual de Merchandising · pág. ${page}`

// ── 07.1 Fachadas ──────────────────────────────────────────────────────────────────────
export const facades = {
  text: 'A fachada representa o primeiro contato do cliente com a identidade física da Gazin. Sua apresentação deve transmitir organização, credibilidade e profissionalismo, valorizando a marca e convidando o público a conhecer a loja. A conservação dos materiais, a iluminação e a visibilidade são fundamentais para manter uma comunicação padronizada.',
  guidelines: [
    { title: 'Identidade visual', text: 'Utilizar a logomarca Gazin conforme os padrões oficiais, preservando sua geometria, suas proporções e as especificações de aplicação. Nas fachadas e aplicações físicas, a marca é produzida em ACM, conforme os projetos oficiais.', page: 11 },
    { title: 'Conservação', text: 'Manter fachadas, letreiros, painéis, adesivos e vitrines limpos e conservados, sem danos, manchas ou desbotamento.', page: 11 },
    { title: 'Iluminação', text: 'Garantir que a fachada e a identificação da loja permaneçam visíveis e valorizadas, com a manutenção da iluminação em dia.', page: 14 },
    { title: 'Acessibilidade', text: 'Preservar entradas desobstruídas, seguras e acessíveis para os clientes.', page: 11 },
    { title: 'Padronização', text: 'Seguir os projetos, materiais e especificações aprovados pelas áreas responsáveis.', page: 20 },
  ] satisfies Guideline[],
  image: { id: 'fachada-noite', alt: 'Fachada de loja Gazin à noite, com duas logomarcas iluminadas, vitrines e entrada', caption: 'Fachada de loja Gazin' } satisfies Photo,
  hotspots: [
    { id: 'marca', label: 'Identificação da marca', x: 30, y: 27, page: 11, text: 'Logomarca conforme o manual de identidade visual, produzida em ACM nas fachadas e aplicações físicas.' },
    { id: 'iluminacao', label: 'Iluminação', x: 12, y: 12, page: 14, text: 'Mantenha em dia a manutenção da iluminação das fachadas, evitando lâmpadas queimadas.' },
    { id: 'entrada', label: 'Entrada e acessibilidade', x: 51, y: 70, page: 11, text: 'Acesso desobstruído e sinalizado, com o horário de funcionamento visível e atualizado.' },
    { id: 'vitrine', label: 'Vitrine', x: 30, y: 63, page: 7, text: 'Mesmo em dias ensolarados, o interior da loja deve ser visível para quem passa pela rua.' },
    { id: 'conservacao', label: 'Conservação', x: 88, y: 32, page: 11, text: 'Logotipos, painéis, letreiros, adesivos e vitrines livres de danos, manchas e desbotamento.' },
  ] satisfies Hotspot[],
}

// ── 07.2 Comunicação visual interna ────────────────────────────────────────────────────
export const internal = {
  text: 'A comunicação visual interna organiza a experiência do cliente e fortalece a identidade Gazin em cada ambiente. A distribuição correta dos materiais, a setorização dos produtos e a aplicação das campanhas ajudam a construir espaços mais claros, funcionais e atrativos.',
  guidelines: [
    { title: 'Organização dos setores', text: 'Agrupar os produtos por categorias, respeitando o layout e os planogramas definidos.', page: 6 },
    { title: 'Visibilidade', text: 'Garantir que os materiais de comunicação e os produtos possam ser visualizados sem obstáculos desnecessários.', page: 6 },
    { title: 'Padronização', text: 'Utilizar materiais alinhados às campanhas e à identidade visual da Gazin.', page: 70 },
    { title: 'Conservação', text: 'Manter os elementos gráficos, mobiliários e expositores limpos e em boas condições.', page: 20 },
    { title: 'Circulação', text: 'Evitar que produtos, displays ou materiais promocionais prejudiquem o deslocamento dos clientes.', page: 14 },
  ] satisfies Guideline[],
  layout: {
    image: { id: 'layout-loja', alt: 'Planta em perspectiva de uma loja Gazin com os setores numerados', caption: 'Organização e setorização da loja' } satisfies Photo,
    // Legenda da planta, como no manual (pág. 10).
    zones: ['Fachada da loja', 'Linha Marrom', 'Móveis', 'Colchões', 'Ambientação de Sala', 'Ilha de Tecnologia', 'Linha Branca', 'Ambientação de Cozinha', 'Pilhas de Produtos', 'Portáteis e UD', 'Espaços Kids', 'Esporte e Lazer', 'Caixa e Crediário'],
  },
  example: {
    image: { id: 'caixa-comunicacao', alt: 'Área de caixa de uma loja Gazin com placas aéreas “Caixa” e “Cadastro” numeradas', caption: 'Comunicação visual do caixa' } satisfies Photo,
    hotspots: [
      { id: 'placas', label: 'Placas aéreas', x: 40, y: 15, page: 66, text: 'Placas dos caixas seguindo a padronização da comunicação visual.' },
      { id: 'numeracao', label: 'Numeração', x: 27, y: 30, page: 67, text: 'Cada caixa identificado com sua numeração, conforme a quantidade indicada no layout.' },
      { id: 'informativo', label: 'Materiais autorizados', x: 69, y: 46, page: 64, text: 'Apenas materiais que valorizam a empresa e documentos oficiais, solicitados à Matriz.' },
      { id: 'balcao', label: 'Ambiente limpo', x: 46, y: 76, page: 6, text: 'Espaço livre de papéis acumulados, produtos devolvidos e aglomerações.' },
    ] satisfies Hotspot[],
  },
}

// ── 07.3 Materiais de PDV ──────────────────────────────────────────────────────────────
export const pdv = {
  text: 'Os materiais de PDV são fundamentais para destacar produtos, comunicar ofertas e orientar as decisões de compra. Sua utilização deve seguir os padrões oficiais da Gazin, garantindo clareza nas informações, organização visual e coerência com as campanhas vigentes.',
  guidelines: [
    { title: 'Materiais oficiais', text: 'Utilizar exclusivamente materiais promocionais oficiais, fornecidos ou aprovados pelas áreas de Marketing e Trade Marketing.', page: 70 },
    { title: 'Cartazes de preço', text: 'Cartaz Oficial de Preço de 46 × 64 cm, nos modelos KIT 1, KIT 2 e KIT 3, solicitado ao Centro de Distribuição da região. Outros formatos previstos no manual seguem suas próprias orientações.', page: 13 },
    { title: 'Informações claras', text: 'Preços legíveis, visíveis e acompanhados das condições comerciais aplicáveis: valor à vista, parcelamento e encargos, quando houver.', page: 7 },
    { title: 'Campanhas atualizadas', text: 'Retirar os materiais de campanhas encerradas e manter a comunicação alinhada às ações vigentes.', page: 70 },
    { title: 'Materiais não autorizados', text: 'Não utilizar cartazes improvisados, materiais fora do padrão ou peças de fornecedores sem aprovação.', page: 70 },
  ] satisfies Guideline[],
  responsibilities: [
    { title: 'Trade Marketing', text: 'Planejamento, definição e orientação dos materiais e ações promocionais.' },
    { title: 'Gerência da loja', text: 'Garantia da correta execução, conservação e organização dos materiais.' },
    { title: 'Equipe de vendas', text: 'Manutenção da exposição e utilização adequada da comunicação promocional.' },
  ],
  responsibilitiesPage: 70,
  gallery: [
    { id: 'cartaz-frente-loja', alt: 'Cartaz de preço de frente de loja Gazin, com moldura azul e área para o preço', caption: 'Cartaz de frente de loja · Kit 1, 2 e 3' },
    { id: 'cartaz-ofertas', alt: 'Cartaz promocional azul “Ofertas imperdíveis — em até 12x sem entrada no carnê”, com a logomarca Gazin', caption: 'Material promocional · Ofertas' },
    { id: 'cartazes-entrada', alt: 'Entrada de loja Gazin com produtos e cartazes de preço oficiais', caption: 'Aplicação na loja' },
  ] satisfies Photo[],
  comparison: {
    page: 14,
    wrong: { id: 'calcada-inadequada', alt: 'Calçada de loja com excesso de produtos e cartazes, prejudicando a fachada', caption: 'Inadequado', text: 'Fachada visualmente poluída e produtos em excesso na calçada.' } satisfies Photo & { text: string },
    right: { id: 'calcada-adequada', alt: 'Fachada de loja Gazin organizada, com entrada livre e vitrines visíveis', caption: 'Adequado', text: 'Entrada livre, exposição organizada e comunicação padronizada.' } satisfies Photo & { text: string },
  },
}

// ── 07.4 Uniformes ─────────────────────────────────────────────────────────────────────
export const uniforms = {
  text: 'Os uniformes contribuem para a identificação dos colaboradores e reforçam a imagem profissional da Gazin. Sua utilização padronizada transmite organização, facilita o reconhecimento da equipe e fortalece a presença da marca no relacionamento com os clientes.',
  page: 96,
  guidelines: [
    { title: 'Uniforme corporativo', text: 'Utilizar as camisetas oficiais fornecidas pela empresa. Cada colaborador recebe 2 camisetas.' },
    { title: 'Apresentação profissional', text: 'Recomenda-se o uso de calça jeans sem rasgos.' },
    { title: 'Calçados', text: 'Utilizar sapatos ou tênis fechados.' },
    { title: 'Identificação da marca', text: 'Preservar os elementos e as características originais do uniforme corporativo.' },
    { title: 'Solicitação', text: 'Pelo Portal Gazin, na opção “Solicitação de Uniformes Geral e Material de Uso e Consumo”.' },
  ] satisfies Guideline[],
  image: { id: 'uniforme', alt: 'Camiseta polo azul do uniforme Gazin, vista de frente e de costas', caption: 'Uniforme corporativo' } satisfies Photo,
}

// ── 07.5 Sinalização e ambientação ─────────────────────────────────────────────────────
export const signage = {
  text: 'A sinalização e a ambientação das lojas devem facilitar a circulação, orientar os clientes e valorizar os produtos. Espaços organizados, iluminados e visualmente coerentes fortalecem a identidade Gazin e tornam a jornada de compra mais confortável e intuitiva.',
  guidelines: [
    { title: 'Sinalização', text: 'Utilizar placas padronizadas para identificar setores, caixas e áreas de apoio.', page: 65 },
    { title: 'Circulação', text: 'Manter os corredores livres e acessíveis, evitando obstáculos na movimentação dos clientes.', page: 6 },
    { title: 'Iluminação', text: 'Garantir iluminação adequada para valorizar produtos, comunicar ofertas e proporcionar conforto visual.', page: 7 },
    { title: 'Ambientação', text: 'Organizar os ambientes e produtos de maneira harmônica, respeitando as categorias e os projetos de exposição. Toda loja deve apresentar uma ambientação de sala, quarto e cozinha.', page: 47 },
    { title: 'Conservação', text: 'Manter mobiliários, sinalizações e demais elementos físicos em boas condições de limpeza e funcionamento.', page: 91 },
  ] satisfies Guideline[],
  technical: { title: 'Padronização técnica', text: 'O manual define a altura da comunicação visual conforme o pé-direito de cada loja, com análise do departamento de Expansão. Consulte as medidas no manual completo e nos projetos aprovados.', page: 65 },
  plates: { id: 'placas-sinalizacao', alt: 'Placas de sinalização vermelhas: obrigado por não fumar, hidrante, extintor pó químico, extintor CO₂ e extintor água', caption: 'Placas de sinalização padronizadas' } satisfies Photo,
  ambience: {
    image: { id: 'ambientacao-cozinha', alt: 'Ambientação de cozinha em loja Gazin, com armários, eletrodomésticos e mesa posta', caption: 'Ambientação de cozinha' } satisfies Photo,
    hotspots: [
      { id: 'completo', label: 'Ambiente completo', x: 30, y: 30, page: 46, text: 'Fogão, refrigerador, micro-ondas, forno e eletroportáteis compõem a cozinha.' },
      { id: 'mesa', label: 'Mesa posta', x: 50, y: 70, page: 46, text: 'Aparelhos de jantar organizados na mesa, sem poluição visual.' },
      { id: 'precos', label: 'Produtos precificados', x: 75, y: 36, page: 47, text: 'Todos os produtos do ambiente precificados, sem plástico, embalagem ou etiqueta.' },
      { id: 'iluminacao', label: 'Iluminação', x: 48, y: 6, page: 7, text: 'A iluminação destaca os produtos, orienta a circulação e valoriza os ambientes.' },
    ] satisfies Hotspot[],
  },
}

// ── Download ───────────────────────────────────────────────────────────────────────────
export const manualDownload = {
  title: 'Manual de Merchandising Gazin',
  description: 'Consulte as orientações completas de padronização, exposição de produtos, comunicação visual e organização dos ambientes das lojas Gazin.',
  href: 'assets/merchandising/manual-merchandising-gazin.pdf',
  fileName: 'Manual-de-Merchandising-Gazin.pdf',
  cover: 'assets/merchandising/capa-manual.jpg',
  pages: 118,
  sizeMB: 75.9,
  button: 'Baixar manual completo',
}
