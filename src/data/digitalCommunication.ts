// Capítulo 06 · Comunicação Digital.
//
// PROPOSTA EDITORIAL de boas práticas (validação institucional pendente): não são normas
// corporativas aprovadas. Não há materiais digitais oficiais (posts, banners, capturas de site)
// no projeto, então as demonstrações são DIDÁTICAS e identificadas como tal. Elas só reutilizam
// materiais oficiais já presentes: logos Gazin (capítulo 02), logos das campanhas 2027 (capítulo
// 05), fotografia demonstrativa (capítulo 04), a mensagem de redes sociais proposta no capítulo 03
// e o próprio Manual da Marca (prévia responsiva). Nenhum preço, produto, campanha ou métrica real.
import { photos } from './photoVideo'
import { applications } from './verbalIdentity'

export type Guideline = { title: string; text: string }
export type CrossLink = { href: string; label: string }

export const digitalIntro = {
  title: 'Nossa marca conectada em todos os canais.',
  text: 'A presença digital da Gazin vai além da divulgação de produtos e serviços. Cada publicação, página, banner ou experiência interativa representa uma oportunidade de fortalecer nossa identidade e construir relacionamentos. Uma comunicação digital consistente combina criatividade, clareza e tecnologia para oferecer experiências reconhecíveis, acessíveis e alinhadas à essência da marca.',
}

export const digitalLabels = {
  proposal: 'Proposta editorial de boas práticas · em validação interna',
  demo: 'Exemplo didático · não é uma peça oficial',
  fictional: 'Demonstração · produtos, valores e condições fictícios',
  related: 'Veja também',
  guidelines: 'Diretrizes',
}

/** Official files reused by the demonstrations (untouched). */
export const digitalAssets = {
  logo: { src: 'assets/logos/gazin-fundo-escuro.png', width: 3034, height: 895 },
  logoLight: { src: 'assets/logos/gazin-cores-originais.png', width: 2974, height: 835 },
  photo: photos.green,
  /** Campaign used by the banner demonstration (official logo, chapter 05). */
  bannerCampaign: 'black-friday-show',
}

// ── 06.1 Redes Sociais ─────────────────────────────────────────────────────────────────
const socialMessage = applications.examples.find(example => example.id === 'redes-sociais')!
export type SocialFormat = { id: 'feed' | 'story' | 'quadrado' | 'video'; label: string; ratio: string; aspect: string; text: string; note: string }
export const social = {
  text: 'As redes sociais aproximam a Gazin do cotidiano das pessoas. Nossa comunicação nesses canais deve combinar identidade visual, linguagem acessível e conteúdos relevantes. Cada publicação precisa transmitir a personalidade da marca, respeitando as características de cada plataforma e mantendo a clareza das mensagens.',
  guidelines: [
    { title: 'Identidade visual', text: 'Utilizar os logotipos oficiais e respeitar as cores e os elementos gráficos de cada campanha.' },
    { title: 'Consistência', text: 'Manter unidade entre publicações de uma mesma campanha, mesmo quando adaptadas para formatos diferentes.' },
    { title: 'Linguagem', text: 'Comunicação próxima, humana e objetiva, seguindo as orientações do capítulo de Identidade Verbal.' },
    { title: 'Hierarquia', text: 'Destacar as informações mais importantes, evitando o excesso de textos nas peças.' },
    { title: 'Imagens', text: 'Fotografias de qualidade, pessoas com aparência natural, produtos proporcionais e ambientes coerentes.' },
    { title: 'Acessibilidade', text: 'Contraste, legibilidade e alternativas textuais, como descrições de imagens e legendas em vídeos.' },
  ] satisfies Guideline[],
  formats: [
    { id: 'feed', label: 'Feed', ratio: '4:5', aspect: '4 / 5', text: 'Feed vertical', note: 'Formato indicado para peças editoriais e promocionais que precisam de maior área visual no feed.' },
    { id: 'story', label: 'Story', ratio: '9:16', aspect: '9 / 16', text: 'Story', note: 'Conteúdo em tela cheia: as informações ficam fora das faixas superior e inferior, ocupadas pela interface da plataforma.' },
    { id: 'quadrado', label: 'Quadrado', ratio: '1:1', aspect: '1 / 1', text: 'Post quadrado', note: 'Formato versátil para materiais institucionais e comerciais: imagem e mensagem lado a lado.' },
    { id: 'video', label: 'Vídeo', ratio: '9:16', aspect: '9 / 16', text: 'Vídeo vertical', note: 'Conteúdo audiovisual de consumo rápido: a mensagem entra em etapas curtas e a marca encerra a sequência.' },
  ] satisfies SocialFormat[],
  formatsNote: 'Proporções comuns em formatos digitais: não são uma lista definitiva das especificações de cada plataforma.',
  /** Message proposed in chapter 03 (03.5 · Redes sociais), shortened for the piece. */
  post: { title: 'Tem novidade boa chegando na Gazin!', text: 'Confira nossas ofertas e encontre o que combina com você.', cta: 'Saiba mais', source: socialMessage.channel },
  safeArea: 'Área da interface da plataforma',
  links: [{ href: '#identidade-verbal-5', label: 'Identidade Verbal · Exemplos de aplicação' }, { href: '#fotografia-video-1', label: 'Fotografia e Vídeo · Estilo fotográfico' }] satisfies CrossLink[],
}

// ── 06.2 Sites e Landing Pages ─────────────────────────────────────────────────────────
export type Device = { id: 'desktop' | 'tablet' | 'mobile'; label: string; width: number; height: number; changes: string[] }
export const web = {
  text: 'Os sites e as landing pages representam importantes pontos de contato entre a Gazin e seus públicos. Sua construção deve unir identidade visual, organização das informações, acessibilidade e facilidade de uso. O design precisa valorizar a marca, comunicar com clareza e oferecer uma experiência consistente em diferentes dispositivos.',
  guidelines: [
    { title: 'Identidade', text: 'Cores, logotipos e elementos gráficos conforme o sistema visual aprovado para cada projeto.' },
    { title: 'Navegação', text: 'Estruturas claras, menus compreensíveis e caminhos intuitivos.' },
    { title: 'Responsividade', text: 'Adaptar o conteúdo a diferentes resoluções, preservando funcionalidade e legibilidade.' },
    { title: 'Hierarquia visual', text: 'Organizar títulos, informações, imagens e botões conforme sua importância.' },
    { title: 'Performance', text: 'Carregamento eficiente, imagens otimizadas e animações leves.' },
    { title: 'Acessibilidade', text: 'Contraste, foco visível, navegação por teclado e estrutura semântica.' },
    { title: 'Consistência', text: 'Componentes e padrões de interação coerentes ao longo da experiência.' },
  ] satisfies Guideline[],
  devices: [
    { id: 'desktop', label: 'Desktop', width: 1200, height: 760, changes: ['Menu completo visível no topo.', 'Título e imagem lado a lado.', 'Capítulos em três colunas.'] },
    { id: 'tablet', label: 'Tablet', width: 768, height: 1000, changes: ['Menu compacto, com os itens principais.', 'Título acima da imagem.', 'Capítulos em duas colunas.'] },
    { id: 'mobile', label: 'Mobile', width: 375, height: 720, changes: ['Menu recolhido em um botão.', 'Uma coluna, com textos e botões maiores ao toque.', 'Capítulos empilhados, na mesma ordem.'] },
  ] satisfies Device[],
  /** Real content of this Manual, used by the simplified preview (no copy of the whole site). */
  preview: {
    eyebrow: 'Manual da Marca',
    title: 'DNA GAZIN',
    subtitle: 'Nossa marca, nosso jeito!',
    nav: ['Essência', 'Capítulos', 'Campanhas', 'Governança'],
  },
  previewNote: 'Prévia simplificada deste Manual da Marca, que se reorganiza de verdade conforme a largura. Não é um site Gazin publicado.',
  brandbook: 'O próprio Manual da Marca serve de referência: navegação por capítulos, tipografia hierarquizada, movimento discreto, aplicação dos azuis e conteúdo organizado em blocos.',
  links: [{ href: '#identidade-visual', label: 'Identidade Visual' }] satisfies CrossLink[],
}

// ── 06.3 Banners Digitais ──────────────────────────────────────────────────────────────
export type BannerFormat = { id: 'horizontal' | 'quadrado' | 'vertical' | 'mobile'; label: string; aspect: string }
export const banners = {
  text: 'Os banners digitais precisam comunicar mensagens de maneira rápida e objetiva. Sua composição deve equilibrar elementos visuais, informações comerciais e identidade da campanha, garantindo legibilidade e reconhecimento da marca mesmo em espaços reduzidos.',
  elements: [
    { title: 'Identificação da campanha', text: 'A identidade original da campanha, respeitando cores, proporções e elementos gráficos.' },
    { title: 'Mensagem principal', text: 'Destacar a chamada mais importante da comunicação.' },
    { title: 'Produtos', text: 'Fotografias nítidas, proporcionais e coerentes com a oferta.' },
    { title: 'Informações comerciais', text: 'Clareza na apresentação de preços, descontos e condições.' },
    { title: 'Chamada para ação', text: 'Mensagens objetivas e botões visuais adequados ao contexto.' },
    { title: 'Identidade Gazin', text: 'Preservar a marca, sua legibilidade e suas áreas de proteção.' },
  ] satisfies Guideline[],
  hierarchy: ['Identidade da campanha', 'Mensagem principal', 'Produto ou benefício', 'Informação comercial', 'Chamada para ação'],
  hierarchyNote: 'A ordem pode variar conforme a finalidade do banner: é uma referência, não um modelo obrigatório.',
  formats: [
    { id: 'horizontal', label: 'Horizontal', aspect: '3 / 1' },
    { id: 'quadrado', label: 'Quadrado', aspect: '1 / 1' },
    { id: 'vertical', label: 'Vertical', aspect: '2 / 3' },
    { id: 'mobile', label: 'Mobile', aspect: '4 / 3' },
  ] satisfies BannerFormat[],
  formatsNote: 'Proporções ilustrativas: as dimensões exatas seguem a especificação de cada canal de publicação.',
  criteria: [
    { good: 'Boa hierarquia', bad: 'Textos sobrepostos' },
    { good: 'Organização visual', bad: 'Excesso de elementos' },
    { good: 'Identidade preservada', bad: 'Logo distorcida' },
    { good: 'Informações legíveis', bad: 'Informação comercial ilegível' },
    { good: 'Contraste adequado', bad: 'Contraste insuficiente' },
  ],
  piece: { title: 'Mensagem principal da campanha', product: 'Imagem do produto', price: 'R$ 0.000,00', terms: 'Valores ilustrativos', cta: 'Confira' },
  links: [{ href: '#campanhas-4', label: 'Campanhas · Hierarquia das informações' }, { href: '#campanhas-5', label: 'Campanhas · Padronização visual' }] satisfies CrossLink[],
}

// ── 06.4 E-commerce ────────────────────────────────────────────────────────────────────
export type DemoProduct = { id: string; name: string; icon: 'tv' | 'refrigerator' | 'washer' | 'sofa' | 'smartphone' | 'bed' }
export const ecommerce = {
  text: 'No e-commerce, a comunicação deve facilitar a escolha do cliente e transmitir confiança em cada etapa da jornada. Imagens de qualidade, descrições claras, informações comerciais transparentes e uma navegação intuitiva são essenciais para construir uma experiência de compra prática e confiável.',
  guidelines: [
    { title: 'Fotografias de produtos', text: 'Imagens nítidas que representem corretamente o produto.' },
    { title: 'Fidelidade', text: 'Preservar características, cores, proporções e detalhes reais.' },
    { title: 'Informações técnicas', text: 'Características e especificações relevantes para a decisão de compra.' },
    { title: 'Preços e condições', text: 'Valores, descontos e condições de pagamento com clareza.' },
    { title: 'Organização', text: 'Títulos, imagens, descrições e ações de compra em posições intuitivas.' },
    { title: 'Responsividade', text: 'Apresentação adequada dos produtos em dispositivos móveis.' },
    { title: 'Acessibilidade', text: 'Descrições alternativas para imagens, controles legíveis e elementos acessíveis.' },
  ] satisfies Guideline[],
  products: [
    { id: 'televisor', name: 'Televisor', icon: 'tv' },
    { id: 'refrigerador', name: 'Refrigerador', icon: 'refrigerator' },
    { id: 'lavadora', name: 'Lavadora', icon: 'washer' },
    { id: 'sofa', name: 'Sofá', icon: 'sofa' },
    { id: 'smartphone', name: 'Smartphone', icon: 'smartphone' },
    { id: 'colchao', name: 'Colchão', icon: 'bed' },
  ] satisfies DemoProduct[],
  price: 'R$ 0.000,00',
  installments: 'ou 10x de R$ 000,00',
  views: ['Vista frontal', 'Vista lateral', 'Detalhe'],
  specs: ['Dimensões', 'Peso', 'Voltagem', 'Garantia'],
  specValue: 'Conforme o fabricante',
  /** Description proposed in chapter 03 (03.5 · E-commerce). */
  description: applications.examples.find(example => example.id === 'e-commerce')!.message,
  hierarchy: {
    vitrine: ['Imagem do produto em destaque', 'Nome claro e curto', 'Preço e condição legíveis', 'Ação para ver o produto'],
    produto: ['Galeria com vistas do produto', 'Nome e descrição', 'Preço e condições transparentes', 'Informações técnicas', 'Ação de compra em destaque'],
  },
  links: [{ href: '#fotografia-video-1', label: 'Fotografia e Vídeo' }, { href: '#identidade-verbal-5', label: 'Identidade Verbal · Linguagem no e-commerce' }] satisfies CrossLink[],
}

// ── 06.5 Animações e Experiências Interativas ──────────────────────────────────────────
export const motion = {
  text: 'O movimento é um recurso importante para tornar a comunicação digital mais dinâmica e envolvente. Quando utilizado com propósito, ele orienta a atenção, destaca informações e contribui para uma experiência visual mais fluida. As animações devem complementar a mensagem, mantendo a identidade da marca e respeitando a usabilidade.',
  principles: [
    { title: 'Movimento com propósito', text: 'Toda animação deve possuir uma função visual ou comunicativa.' },
    { title: 'Fluidez', text: 'Movimentos suaves e transições naturais.' },
    { title: 'Hierarquia', text: 'Animações que destacam as informações importantes.' },
    { title: 'Consistência', text: 'Uma linguagem de movimento coerente entre os materiais.' },
    { title: 'Performance', text: 'Evitar efeitos pesados que comprometam o carregamento ou a navegação.' },
    { title: 'Acessibilidade', text: 'Respeitar a preferência de redução de movimento e evitar flashes intensos.' },
  ] satisfies Guideline[],
  applications: [
    { title: 'Microinterações', text: 'Botões, menus, cards, indicadores e estados de seleção.' },
    { title: 'Revelação de conteúdo', text: 'Entrada progressiva dos elementos durante a navegação.' },
    { title: 'Motion graphics', text: 'Títulos, formas, elementos gráficos e mensagens animados.' },
    { title: 'Vídeos de campanha', text: 'Movimento e composição audiovisual para campanhas, produtos e conceitos.' },
    { title: 'Experiências interativas', text: 'Elementos que respondem ao scroll, ao mouse ou ao toque.' },
  ] satisfies Guideline[],
  demos: [
    { id: 'texto', number: '01', label: 'Revelação de texto', note: 'A mensagem aparece palavra por palavra, em uma transição curta, e para no estado final.' },
    { id: 'elementos', number: '02', label: 'Animação de elementos', note: 'Linhas e formas azuis se organizam e formam a composição: o movimento conduz o olhar até a marca.' },
    { id: 'interacao', number: '03', label: 'Interação', note: 'Os cards respondem ao mouse, ao teclado e ao toque: um destaque discreto ao passar e a confirmação ao selecionar.' },
  ],
  revealText: 'Sempre fazendo o melhor pra Você!',
  reduced: 'Movimento reduzido: as demonstrações mostram o estado final.',
  dna: { text: 'A animação de DNA 3D da abertura é a referência da linguagem de movimento deste Manual: entra com propósito, responde ao visitante e respeita a redução de movimento.', href: '#inicio', label: 'Ver a abertura do Manual' },
  links: [{ href: '#fotografia-video-5', label: 'Fotografia e Vídeo · Movimento e edição' }] satisfies CrossLink[],
}
