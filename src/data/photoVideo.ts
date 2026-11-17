// Capítulo 04 · Fotografia e Vídeo.
//
// PROPOSTA EDITORIAL: as diretrizes deste capítulo são sugestões para o Manual da Marca e não
// normas oficiais aprovadas pela Gazin. As fotografias de pessoas foram geradas por IA e são
// DEMONSTRATIVAS (não retratam lojas nem colaboradores reais); as fotografias de loja vêm do
// Manual de Merchandising Gazin. Ambas podem ser substituídas por material oficial: troque o
// arquivo (scripts/import-photo-video.mjs) ou o caminho em `photos` abaixo.
import generated from './photoVideoPhotos.json' with { type: 'json' }
import merchandising from './merchandisingPhotos.json' with { type: 'json' }

export const photoVideoIntro = {
  title: 'Nossa essência em cada imagem.',
  text: 'A fotografia e o vídeo são importantes formas de expressar a identidade da Gazin. Por meio de imagens autênticas, valorizamos as pessoas, os produtos e os momentos que fazem parte da nossa história. Nossa linguagem visual busca transmitir proximidade, confiança e emoção, mantendo uma comunicação clara, moderna e conectada ao cotidiano dos nossos públicos.',
}

export const pvLabels = {
  demo: 'Fotografia demonstrativa',
  store: 'Fotografia de loja · Manual de Merchandising',
  didactic: 'Demonstração didática',
  simulation: 'Simulação visual com fotografia · não é um vídeo',
}

export type PvPhoto = { src: string; width: number; height: number; alt: string; credit: string }
type Meta = { width: number; height: number }
const demo = (id: keyof typeof generated, alt: string): PvPhoto => ({ src: `images/brandbook/fotografia-video/${id}.jpg`, ...(generated[id] as Meta), alt, credit: pvLabels.demo })
const store = (id: keyof typeof merchandising, alt: string): PvPhoto => ({ src: `assets/merchandising/${id}.jpg`, ...(merchandising[id] as Meta), alt, credit: pvLabels.store })

export const photos = {
  green: demo('retrato-camiseta-verde', 'Vendedora sorrindo em frente a uma loja Gazin, de camisa polo azul-marinho, com as mãos juntas'),
  navy: demo('retrato-camiseta-azul', 'Homem sorrindo de braços cruzados, de camisa polo azul-marinho, em frente a uma loja Gazin'),
  white: demo('retrato-camiseta-branca', 'Mulher sorrindo de braços cruzados, de camisa polo azul-marinho, em frente a uma loja Gazin'),
  medium: demo('plano-medio', 'Plano médio da mesma mulher, da cabeça à cintura, com a fachada Gazin ao fundo'),
  closeUp: demo('close-up-retrato', 'Close-up do rosto sorridente da mesma mulher, de cabelos castanhos'),
  before: demo('tratamento-antes', 'Homem sorrindo de braços cruzados, de camisa polo azul-marinho, em frente a uma loja Gazin — fotografia original'),
  after: demo('tratamento-depois', 'A mesma fotografia do homem de camisa polo azul-marinho, com ajustes sutis de luz, contraste e cor'),
  facade: store('fachada-dia', 'Fachada de loja Gazin durante o dia, com o interior visível pelas vitrines'),
  kitchen: store('ambientacao-cozinha', 'Ambientação de cozinha em loja Gazin, com eletrodomésticos e mesa posta'),
}

export type Topic = { title: string; text: string }
export type PvSection = { summary: string; photo: PvPhoto; text: string }

// ── 04.1 Estilo fotográfico ─────────────────────────────────────────────────────────────
export const style = {
  summary: 'Pessoas, relações e experiências reais, com imagens naturais e acolhedoras.',
  photo: photos.green,
  text: 'A linguagem fotográfica da Gazin busca retratar pessoas, ambientes e situações de maneira autêntica. As imagens devem transmitir confiança, proximidade e naturalidade, valorizando expressões espontâneas, interações humanas e o papel dos produtos no cotidiano. A composição deve ser limpa, equilibrada e visualmente agradável.',
  traits: [
    { title: 'Humanização', text: 'Valorizar pessoas e relações reais.' },
    { title: 'Naturalidade', text: 'Priorizar gestos e expressões espontâneas.' },
    { title: 'Proximidade', text: 'Criar imagens que transmitam acolhimento e confiança.' },
    { title: 'Autenticidade', text: 'Representar situações próximas da realidade dos clientes e colaboradores.' },
    { title: 'Profissionalismo', text: 'Manter qualidade técnica sem perder a sensação de espontaneidade.' },
  ] satisfies Topic[],
  gallery: [photos.green, photos.navy, photos.white],
  recommended: ['Atendimento de vendedor a cliente.', 'Famílias em ambientes residenciais.', 'Pessoas utilizando produtos.', 'Colaboradores em situações cotidianas.', 'Interações positivas dentro das lojas.'],
  avoid: ['Sorrisos excessivamente artificiais.', 'Expressões exageradas.', 'Poses rígidas.', 'Ambientes visualmente poluídos.', 'Pessoas com aparência excessivamente retocada.', 'Elementos gráficos artificiais incorporados às fotografias.', 'Logotipos distorcidos ou inventados.'],
}

// ── 04.2 Enquadramentos ─────────────────────────────────────────────────────────────────
export type Shot = { id: string; label: string; text: string; uses: string[]; photo: PvPhoto; note?: string }
export const framing = {
  summary: 'O enquadramento conduz o olhar e destaca o que importa na mensagem.',
  photo: photos.white,
  text: 'Uma boa composição fotográfica orienta a atenção do público e valoriza os elementos principais da cena. O enquadramento deve respeitar o equilíbrio visual, a proporção dos objetos e o espaço necessário para a aplicação de textos e elementos gráficos.',
  shots: [
    { id: 'aberto', label: 'Plano aberto', text: 'Apresenta o ambiente e contextualiza a situação.', uses: ['Fachadas', 'Interior de lojas', 'Ambientes residenciais', 'Fotografias institucionais'], photo: photos.white, note: 'Os três planos usam a mesma fotografia: a cena inteira, o meio corpo e o rosto.' },
    { id: 'medio', label: 'Plano médio', text: 'Valoriza a relação entre pessoas e produtos.', uses: ['Atendimento', 'Demonstração de produtos', 'Interações familiares', 'Campanhas comerciais'], photo: photos.medium, note: 'Reenquadramento da mesma fotografia do plano aberto.' },
    { id: 'close', label: 'Close-up', text: 'Destaca expressões, detalhes e características de produtos.', uses: ['Detalhes de acabamento', 'Expressões humanas', 'Interações com produtos', 'Demonstrações de funcionalidades'], photo: photos.closeUp, note: 'Reenquadramento da mesma fotografia do plano aberto.' },
  ] satisfies Shot[],
  rules: ['Manter o elemento principal facilmente identificável.', 'Preservar proporções naturais.', 'Evitar cortes inadequados de rostos e mãos.', 'Utilizar a regra dos terços quando pertinente.', 'Preservar espaço negativo para textos publicitários.', 'Organizar os elementos do fundo.', 'Garantir que os produtos sejam reconhecíveis.'],
  composition: {
    photo: photos.white,
    good: { label: 'Composição adequada', points: ['Rosto e mãos inteiros no quadro.', 'Pessoa alinhada ao terço do quadro, com respiro ao redor.', 'Fundo organizado e reconhecível.'] },
    bad: { label: 'Composição inadequada', points: ['Corte no alto da cabeça, sem respiro acima do rosto.', 'Pessoa empurrada para a borda do quadro, sem intenção.', 'Mãos e braços fora do quadro e nenhum espaço para texto.'] },
    note: 'A versão inadequada é a mesma fotografia reenquadrada propositalmente, apenas para fins didáticos.',
  },
}

// ── 04.3 Iluminação e tratamento ────────────────────────────────────────────────────────
export const lighting = {
  summary: 'Luz que valoriza pessoas e produtos, com aparência natural.',
  photo: photos.after,
  text: 'A iluminação e o tratamento fotográfico contribuem para transmitir qualidade e credibilidade. Buscamos imagens bem iluminadas, com cores equilibradas, contraste adequado e aparência natural. O tratamento deve aprimorar a fotografia sem modificar características importantes das pessoas, dos produtos ou dos ambientes.',
  light: [
    { title: 'Luz natural', text: 'Priorizar iluminação suave e bem distribuída quando adequada à cena.' },
    { title: 'Equilíbrio', text: 'Evitar sombras excessivamente duras e áreas estouradas.' },
    { title: 'Produtos', text: 'Preservar detalhes, materiais e características reais.' },
    { title: 'Pessoas', text: 'Valorizar tons de pele naturais e expressões autênticas.' },
    { title: 'Ambientes', text: 'Manter uma atmosfera clara, acolhedora e profissional.' },
  ] satisfies Topic[],
  treatment: ['Correção de exposição', 'Ajuste de contraste', 'Balanço de branco', 'Correção de cor', 'Nitidez', 'Ajustes sutis de saturação'],
  avoid: ['Saturação exagerada.', 'HDR artificial.', 'Filtros intensos.', 'Pele excessivamente suavizada.', 'Alterações irreais nas cores dos produtos.', 'Sombras artificiais exageradas.', 'Iluminação azul excessiva sobre pessoas.'],
  comparison: {
    before: photos.before,
    after: photos.after,
    beforeLabel: 'Imagem original',
    beforeText: 'Fotografia sem tratamento adicional.',
    afterLabel: 'Imagem tratada',
    afterText: 'A mesma fotografia com ajustes sutis de luminosidade, contraste e cor.',
  },
}

// ── 04.4 Direção de arte audiovisual ────────────────────────────────────────────────────
export type Frame = { id: string; act: string; title: string; text: string; photo: PvPhoto }
export const audiovisual = {
  summary: 'Pessoas, cenários e narrativa que aproximam a marca do público.',
  photo: photos.kitchen,
  text: 'A direção de arte audiovisual deve criar experiências que aproximem a marca do público. Cada produção precisa valorizar pessoas e produtos, utilizando cenários organizados, iluminação agradável, composições equilibradas e movimentos que reforcem a mensagem. O resultado deve ser profissional, autêntico e visualmente coerente com a identidade Gazin.',
  guidelines: [
    { title: 'Pessoas', text: 'Valorizar expressões naturais e interações espontâneas.' },
    { title: 'Cenários', text: 'Utilizar ambientes organizados, modernos e coerentes com a mensagem.' },
    { title: 'Figurino', text: 'Priorizar roupas adequadas ao contexto. Ao representar colaboradores Gazin, utilizar os uniformes oficiais como referência.' },
    { title: 'Produtos', text: 'Garantir boa iluminação, posicionamento e visibilidade.' },
    { title: 'Identidade visual', text: 'Preservar os logotipos e as cores da marca.' },
    { title: 'Narrativa', text: 'Construir uma mensagem clara, com começo, desenvolvimento e conclusão.' },
  ] satisfies Topic[],
  storyboard: [
    { id: 'abertura', act: 'Começo', title: 'Abertura: a loja', text: 'Plano aberto apresenta o lugar e contextualiza a história.', photo: photos.facade },
    { id: 'ambiente', act: 'Desenvolvimento', title: 'O produto em ambiente', text: 'O produto aparece em uso, bem iluminado e reconhecível.', photo: photos.kitchen },
    { id: 'pessoa', act: 'Desenvolvimento', title: 'Quem apresenta a solução', text: 'Plano médio aproxima o público de quem fala.', photo: photos.white },
    { id: 'fechamento', act: 'Conclusão', title: 'Fechamento: confiança', text: 'Câmera estável e expressão natural encerram a mensagem.', photo: photos.navy },
  ] satisfies Frame[],
  /**
   * Vídeo institucional de referência. Enquanto `src` estiver vazio, o capítulo mostra só o
   * storyboard (sem botão de reprodução). Para publicar: caminho de um MP4 em /public
   * (ex.: 'videos/institucional.mp4') e, opcionalmente, `poster` e `captions` (.vtt).
   */
  video: { src: '', poster: '', captions: '', title: 'Vídeo institucional de referência' },
}

// ── 04.5 Movimento e edição ─────────────────────────────────────────────────────────────
export type Movement = { id: 'pan' | 'push'; label: string; text: string; photo: PvPhoto }
export const motionEditing = {
  summary: 'Movimentos e cortes que acompanham a narrativa, sem competir com ela.',
  photo: photos.facade,
  text: 'A movimentação de câmera e o ritmo de edição devem acompanhar o objetivo de cada produção. Buscamos transições fluidas, enquadramentos bem definidos e uma narrativa visual que valorize pessoas, produtos e experiências. Os efeitos devem complementar a mensagem, sem competir com seu conteúdo.',
  movements: [
    { title: 'Travelling suave', text: 'Movimento de câmera que acompanha pessoas ou produtos.' },
    { title: 'Panorâmica', text: 'Movimento horizontal utilizado para apresentar ambientes.' },
    { title: 'Aproximação', text: 'Movimento gradual que destaca detalhes ou expressões.' },
    { title: 'Câmera estável', text: 'Indicada para entrevistas, depoimentos e demonstrações.' },
  ] satisfies Topic[],
  editing: ['Cortes limpos', 'Ritmo adequado à mensagem', 'Transições discretas', 'Continuidade visual', 'Tratamento cromático consistente', 'Legendas legíveis', 'Áudio claro', 'Identidade visual preservada'],
  avoid: ['Zooms bruscos desnecessários.', 'Transições excessivamente chamativas.', 'Glitches exagerados.', 'Movimentos que dificultem a leitura.', 'Efeitos desconectados da mensagem.', 'Uso excessivo de filtros.'],
  simulations: [
    { id: 'pan', label: 'Panorâmica', text: 'Movimento horizontal suave apresenta o ambiente da loja.', photo: photos.facade },
    { id: 'push', label: 'Aproximação', text: 'Aproximação controlada destaca a expressão da pessoa.', photo: photos.green },
  ] satisfies Movement[],
}
