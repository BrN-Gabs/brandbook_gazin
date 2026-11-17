// 02.9 · Iconografia — Padrões e Biblioteca de Ícones.
//
// PROPOSTA para o sistema digital (validação institucional pendente): estilo, espessuras, escala
// e regras não vêm de um manual anterior. Os desenhos são da biblioteca open-source Lucide
// (licença ISC, versão instalada em node_modules/lucide-react), sem alteração de geometria: a
// Gazin define a SELEÇÃO, as cores e a padronização de uso. Nenhum ícone foi desenhado ou gerado.
//
// Para ampliar o catálogo: acrescente o componente em src/components/identity/iconography/icons.ts
// (o TypeScript recusa nomes inexistentes) e uma linha em `icons` abaixo.

export const lucide = {
  version: '0.468.0',
  site: 'https://lucide.dev/icons',
  repository: 'https://github.com/lucide-icons/lucide',
  licenseUrl: 'https://github.com/lucide-icons/lucide/blob/main/LICENSE',
  /** Local copy of the license distributed with the package. */
  licenseFile: 'assets/iconografia/LICENSE-lucide.txt',
  /** Text of node_modules/lucide-react/LICENSE (ISC), included in every ZIP. */
  license: `ISC License

Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
`,
}

export const iconographyIntro = {
  subtitle: 'Padrões e Biblioteca de Ícones',
  tagline: 'Uma linguagem visual simples, consistente e reconhecível.',
  text: 'Os ícones complementam a identidade visual da Gazin ao transformar informações, serviços e conceitos em representações gráficas simples e intuitivas. Sua utilização deve facilitar a comunicação, orientar a leitura e fortalecer a consistência visual entre diferentes canais e materiais. Por meio de formas equilibradas, traços uniformes e aplicações padronizadas, construímos uma linguagem que une clareza, funcionalidade e identidade.',
  credit: 'Ícones baseados na biblioteca open-source Lucide Icons.',
}

// ── Diretrizes ──────────────────────────────────────────────────────────────────────────
export const iconStyle = {
  traits: ['Traços uniformes', 'Geometria equilibrada', 'Cantos suavemente arredondados', 'Proporções consistentes', 'Leitura imediata', 'Poucos detalhes', 'Aparência moderna e minimalista'],
  avoid: ['Ícones 3D', 'Sombras fortes', 'Gradientes dentro dos desenhos', 'Pictogramas excessivamente detalhados', 'Mistura de estilos', 'Aparência cartoon', 'Ícones excessivamente abstratos'],
}
export const strokes = [
  { value: 1.5, label: 'Leve' },
  { value: 2, label: 'Padrão' },
  { value: 2.5, label: 'Destaque' },
]
export const strokeNote = 'Referência: o traço de 2 unidades do Lucide, na grade de 24 × 24. Ajustes são possíveis, mantendo a mesma espessura dentro de um conjunto. Valores propostos para o sistema digital, não prescritos por um manual anterior.'
export const sizeScale = [
  { px: 16, use: 'Interfaces compactas' },
  { px: 20, use: 'Textos e controles' },
  { px: 24, use: 'Padrão' },
  { px: 32, use: 'Destaques' },
  { px: 48, use: 'Comunicação visual' },
  { px: 64, use: 'Infográficos' },
]
export const sizeNote = 'Tamanhos maiores podem ser usados conforme a necessidade: em SVG, o ícone mantém a qualidade vetorial em qualquer escala.'
export const spacing = 'Mantenha uma área de respiro entre o ícone e os demais elementos. Evite aproximá-lo demais de textos, bordas ou outros pictogramas.'
export const consistency = ['Mesmo estilo', 'Espessuras equivalentes', 'Cores padronizadas', 'Proporções respeitadas', 'Alinhamento óptico']

export type IconColor = { id: string; name: string; hex: string; role: string }
export const iconColors: IconColor[] = [
  { id: 'institucional', name: 'Azul institucional', hex: '#080EA0', role: 'Cor principal sobre fundos claros.' },
  { id: 'vibrante', name: 'Azul vibrante', hex: '#4169FE', role: 'Elementos de destaque.' },
  { id: 'cinza', name: 'Cinza azulado', hex: '#494E64', role: 'Funções secundárias.' },
  { id: 'verde', name: 'Verde', hex: '#5DAF02', role: 'Diferenciação e elementos complementares.' },
  { id: 'laranja', name: 'Laranja', hex: '#FD9C0F', role: 'Diferenciação e elementos complementares.' },
  { id: 'branco', name: 'Branco', hex: '#FFFFFF', role: 'Sobre fundos azuis.' },
]
export const colorNote = 'A prioridade é o azul. Verde e laranja só em situações específicas. Evite ícones multicoloridos.'

export const usage = {
  correct: ['Mesmo estilo', 'Traço consistente', 'Cores da paleta', 'Proporções preservadas', 'Alinhamento adequado', 'Boa legibilidade', 'Espaçamento equilibrado'],
  wrong: ['Ícones deformados', 'Mistura de outline com ícones 3D', 'Espessuras inconsistentes', 'Sombras exageradas', 'Cores aleatórias', 'Detalhes desnecessários', 'Ícones pouco compreensíveis'],
  note: 'Os exemplos incorretos existem só na tela, para fins educativos.',
}

// ── Customizer and export options ──────────────────────────────────────────────────────
export const previewSizes = [16, 24, 32, 48, 64, 128, 256]
export const pngSizes = [64, 128, 256, 512, 1024]
export const backgrounds = [
  { id: 'transparente', name: 'Transparente', hex: null },
  { id: 'branco', name: 'Branco', hex: '#FFFFFF' },
  { id: 'institucional', name: 'Azul institucional', hex: '#080EA0' },
  { id: 'marinho', name: 'Azul-marinho', hex: '#030720' },
] as const

// ── Catálogo ───────────────────────────────────────────────────────────────────────────
export type IconCategory = { id: string; name: string; folder: string }
export const iconCategories: IconCategory[] = [
  { id: 'varejo', name: 'Varejo', folder: 'Varejo' },
  { id: 'consorcio', name: 'Consórcio', folder: 'Consorcio' },
  { id: 'seguros', name: 'Seguros', folder: 'Seguros' },
  { id: 'gazinbank', name: 'GazinBank e serviços financeiros', folder: 'GazinBank' },
  { id: 'logistica', name: 'Logística e distribuição', folder: 'Logistica' },
  { id: 'industria', name: 'Indústria e produção', folder: 'Industria' },
  { id: 'tecnologia', name: 'Tecnologia e e-commerce', folder: 'Tecnologia' },
  { id: 'pessoas', name: 'Pessoas e atendimento', folder: 'Pessoas' },
  { id: 'marketing', name: 'Marketing e comunicação', folder: 'Marketing' },
  { id: 'institucional', name: 'Institucional e sustentabilidade', folder: 'Institucional' },
]

/**
 * One entry per Lucide icon (original name, never translated). `categories[0]` is the folder of
 * the icon in the full-library ZIP; the other categories reference the same file.
 */
export type CatalogIcon = { name: string; pt: string; keywords: string[]; categories: string[] }
const icon = (name: string, pt: string, keywords: string, ...categories: string[]): CatalogIcon => ({ name, pt, keywords: keywords.split(',').map(word => word.trim()).filter(Boolean), categories })

export const icons: CatalogIcon[] = [
  // 01 · Varejo
  icon('Store', 'Loja', 'loja, filial, ponto de venda, varejo, comércio', 'varejo'),
  icon('ShoppingCart', 'Carrinho de compras', 'carrinho, compra, comprar, pedido, mercado', 'varejo', 'tecnologia'),
  icon('ShoppingBag', 'Sacola', 'sacola, compra, bolsa, loja', 'varejo'),
  icon('ShoppingBasket', 'Cesta de compras', 'cesta, compra, mercado', 'varejo'),
  icon('Tag', 'Etiqueta', 'etiqueta, preço, oferta', 'varejo'),
  icon('Tags', 'Etiquetas', 'etiquetas, preços, ofertas', 'varejo'),
  icon('Gift', 'Presente', 'presente, brinde, datas comemorativas', 'varejo'),
  icon('Package', 'Produto', 'produto, caixa, pacote, embalagem, encomenda', 'varejo', 'logistica'),
  icon('PackageOpen', 'Pacote aberto', 'produto, caixa aberta, desembalar', 'varejo'),
  icon('BadgePercent', 'Promoção', 'promoção, desconto, porcentagem, oferta', 'varejo'),
  icon('Percent', 'Desconto', 'desconto, porcentagem, promoção', 'varejo'),
  icon('TicketPercent', 'Cupom', 'cupom, desconto, voucher', 'varejo'),
  icon('Receipt', 'Nota fiscal', 'nota, recibo, cupom fiscal, caixa', 'varejo'),
  icon('Wallet', 'Carteira', 'carteira, pagamento, dinheiro, caixa', 'varejo', 'gazinbank'),
  icon('Boxes', 'Estoque', 'estoque, caixas, depósito, armazenagem', 'varejo', 'logistica'),
  icon('CircleDollarSign', 'Vendas', 'vendas, valor, preço, cifrão', 'varejo'),
  icon('ScanBarcode', 'Leitor de código de barras', 'código de barras, caixa, leitor, venda', 'varejo'),
  icon('Sofa', 'Sofá', 'sofá, móveis, estofado, sala', 'varejo'),
  icon('Armchair', 'Poltrona', 'poltrona, móveis, cadeira', 'varejo'),
  icon('BedDouble', 'Cama de casal', 'cama, colchão, quarto, dormir', 'varejo', 'industria'),
  icon('Refrigerator', 'Refrigerador', 'geladeira, refrigerador, eletrodoméstico, cozinha', 'varejo'),
  icon('WashingMachine', 'Lavadora', 'máquina de lavar, lavadora, eletrodoméstico', 'varejo'),
  icon('Microwave', 'Micro-ondas', 'micro-ondas, eletrodoméstico, cozinha', 'varejo'),
  icon('Tv', 'Televisor', 'tv, televisão, televisor, eletrônico', 'varejo'),
  icon('Shirt', 'Moda', 'roupa, camiseta, moda, vestuário', 'varejo'),
  icon('Lamp', 'Luminária', 'luminária, iluminação, decoração', 'varejo'),

  // 02 · Consórcio
  icon('House', 'Casa', 'casa, residência, imóvel, moradia, lar', 'consorcio'),
  icon('Building2', 'Imóvel comercial', 'prédio, imóvel, edifício, apartamento, empresa', 'consorcio'),
  icon('KeyRound', 'Chave', 'chave, entrega, imóvel, conquista', 'consorcio'),
  icon('CarFront', 'Automóvel', 'carro, automóvel, veículo', 'consorcio'),
  icon('Truck', 'Caminhão', 'caminhão, transporte, frete, entrega, veículo pesado', 'logistica', 'consorcio'),
  icon('Tractor', 'Trator', 'trator, máquina agrícola, agronegócio, campo', 'consorcio'),
  icon('Ship', 'Embarcação', 'barco, embarcação, navio', 'consorcio'),
  icon('Sailboat', 'Barco a vela', 'barco, lancha, embarcação, lazer', 'consorcio'),
  icon('Target', 'Objetivo', 'objetivo, meta, alvo, plano', 'consorcio'),
  icon('Goal', 'Meta alcançada', 'meta, conquista, objetivo, bandeira', 'consorcio'),
  icon('CalendarDays', 'Calendário', 'calendário, data, agenda, prazo, assembleia', 'consorcio', 'marketing'),
  icon('CalendarCheck', 'Data confirmada', 'calendário, contemplação, data, confirmação', 'consorcio'),
  icon('FileText', 'Contrato', 'contrato, documento, arquivo, termo', 'consorcio'),
  icon('FilePenLine', 'Assinatura', 'assinatura, contrato, assinar, adesão', 'consorcio'),
  icon('Handshake', 'Acordo', 'aperto de mão, acordo, parceria, negócio', 'consorcio', 'pessoas'),
  icon('CircleCheck', 'Conquista', 'confirmado, aprovado, conquista, ok', 'consorcio'),
  icon('Sun', 'Energia solar', 'sol, energia solar, energia', 'consorcio'),
  icon('Wrench', 'Serviços', 'serviços, ferramenta, manutenção, reforma', 'consorcio', 'industria'),

  // 03 · Seguros
  icon('Shield', 'Proteção', 'proteção, seguro, segurança, escudo', 'seguros'),
  icon('ShieldCheck', 'Proteção garantida', 'seguro, segurança, proteção, garantia, verificado', 'seguros', 'gazinbank'),
  icon('ShieldPlus', 'Garantia estendida', 'garantia, garantia estendida, seguro, proteção', 'seguros'),
  icon('HousePlus', 'Seguro residencial', 'seguro residencial, casa, residência, lar', 'seguros'),
  icon('HeartPulse', 'Saúde', 'saúde, vida, batimentos, seguro de vida', 'seguros'),
  icon('Stethoscope', 'Atendimento médico', 'saúde, médico, consulta, assistência', 'seguros'),
  icon('HeartHandshake', 'Cuidado', 'cuidado, assistência, apoio, relacionamento', 'seguros', 'pessoas'),
  icon('LifeBuoy', 'Assistência', 'assistência, socorro, suporte, ajuda', 'seguros'),
  icon('LockKeyhole', 'Segurança', 'cadeado, segurança, privacidade, proteção', 'seguros'),
  icon('FileCheck', 'Apólice', 'apólice, documento, aprovado, contrato', 'seguros'),
  icon('Umbrella', 'Prevenção', 'guarda-chuva, prevenção, proteção, seguro', 'seguros'),
  icon('Users', 'Família', 'família, pessoas, grupo, clientes', 'seguros', 'pessoas'),
  icon('Headset', 'Central de atendimento', 'atendimento, suporte, central, sac, fone', 'seguros', 'pessoas'),

  // 04 · GazinBank e serviços financeiros
  icon('Landmark', 'Banco', 'banco, instituição financeira, conta', 'gazinbank'),
  icon('CreditCard', 'Cartão', 'cartão, crédito, débito, pagamento', 'gazinbank'),
  icon('ArrowLeftRight', 'Transferência', 'transferência, enviar, receber, transação', 'gazinbank'),
  icon('ReceiptText', 'Extrato', 'extrato, comprovante, histórico, transações', 'gazinbank'),
  icon('Banknote', 'Pagamento', 'pagamento, dinheiro, nota, saldo', 'gazinbank'),
  icon('Coins', 'Moedas', 'moedas, troco, valores', 'gazinbank'),
  icon('HandCoins', 'Recebimento', 'recebimento, pagamento, dinheiro na mão', 'gazinbank'),
  icon('QrCode', 'QR Code', 'qr code, pagamento por código, leitura', 'gazinbank', 'tecnologia'),
  icon('ChartNoAxesCombined', 'Finanças', 'finanças, gráfico, resultados, indicadores', 'gazinbank', 'industria'),
  icon('Calculator', 'Simulação', 'calculadora, simulação, cálculo, parcelas', 'gazinbank'),
  icon('Smartphone', 'Celular', 'celular, smartphone, app, aplicativo', 'gazinbank', 'tecnologia'),
  icon('Fingerprint', 'Biometria', 'biometria, digital, autenticação, segurança', 'gazinbank'),

  // 05 · Logística e distribuição
  icon('Warehouse', 'Centro de distribuição', 'centro de distribuição, armazém, depósito, galpão', 'logistica'),
  icon('Container', 'Contêiner', 'contêiner, carga, armazenagem', 'logistica'),
  icon('Forklift', 'Empilhadeira', 'empilhadeira, movimentação, carga, armazém', 'logistica'),
  icon('PackageCheck', 'Entrega concluída', 'entrega, entregue, pedido, conferência', 'logistica'),
  icon('PackageSearch', 'Rastreamento', 'rastreamento, rastrear, localizar pedido', 'logistica'),
  icon('MapPin', 'Localização', 'localização, endereço, ponto, mapa', 'logistica'),
  icon('MapPinned', 'Destino', 'destino, mapa, local de entrega', 'logistica'),
  icon('Route', 'Rota', 'rota, trajeto, caminho, percurso', 'logistica'),
  icon('Navigation', 'Navegação', 'navegação, direção, gps', 'logistica'),
  icon('ClipboardList', 'Lista de conferência', 'conferência, lista, checklist, romaneio', 'logistica'),
  icon('Clock', 'Prazo', 'relógio, horário, prazo, tempo', 'logistica'),
  icon('Fuel', 'Combustível', 'combustível, posto, abastecimento, auto posto', 'logistica'),
  icon('Plane', 'Viagem', 'avião, viagem, voo, turismo', 'logistica'),

  // 06 · Indústria e produção
  icon('Factory', 'Indústria', 'indústria, fábrica, produção', 'industria'),
  icon('Cog', 'Processos', 'engrenagem, processos, produção, mecanismo', 'industria'),
  icon('Settings', 'Configurações', 'configurações, ajustes, engrenagem', 'industria'),
  icon('Hammer', 'Ferramenta', 'martelo, ferramenta, montagem, construção', 'industria'),
  icon('Drill', 'Equipamento', 'furadeira, equipamento, ferramenta', 'industria'),
  icon('Ruler', 'Medida', 'régua, medida, dimensão, precisão', 'industria'),
  icon('PencilRuler', 'Engenharia', 'engenharia, projeto, desenho técnico', 'industria'),
  icon('HardHat', 'Segurança do trabalho', 'capacete, segurança do trabalho, obra, epi', 'industria'),
  icon('Gauge', 'Eficiência', 'eficiência, desempenho, medidor, velocidade', 'industria'),
  icon('BadgeCheck', 'Qualidade', 'qualidade, certificado, aprovado, selo', 'industria'),
  icon('Layers', 'Camadas', 'camadas, composição, materiais, colchão', 'industria'),
  icon('Scissors', 'Corte', 'tesoura, corte, costura, confecção', 'industria'),

  // 07 · Tecnologia e e-commerce
  icon('Monitor', 'Computador', 'computador, monitor, tela, desktop', 'tecnologia'),
  icon('Laptop', 'Notebook', 'notebook, laptop, computador', 'tecnologia'),
  icon('Tablet', 'Tablet', 'tablet, dispositivo, tela', 'tecnologia'),
  icon('Globe', 'Internet', 'internet, site, web, mundo, online', 'tecnologia'),
  icon('MousePointerClick', 'Clique', 'clique, navegação, compra online, interação', 'tecnologia'),
  icon('AppWindow', 'Aplicativo', 'aplicativo, janela, sistema, app', 'tecnologia'),
  icon('Database', 'Dados', 'dados, banco de dados, informação', 'tecnologia'),
  icon('Server', 'Servidor', 'servidor, infraestrutura, hospedagem', 'tecnologia'),
  icon('Cloud', 'Nuvem', 'nuvem, cloud, armazenamento online', 'tecnologia'),
  icon('Bot', 'Inteligência artificial', 'robô, inteligência artificial, ia, assistente virtual, chatbot', 'tecnologia'),
  icon('Cpu', 'Processamento', 'processador, chip, tecnologia, hardware', 'tecnologia'),
  icon('Wifi', 'Conectividade', 'wifi, conexão, internet, rede', 'tecnologia'),
  icon('Router', 'Roteador', 'roteador, rede, conexão', 'tecnologia'),
  icon('CodeXml', 'Desenvolvimento', 'código, desenvolvimento, programação, software', 'tecnologia'),
  icon('Lock', 'Segurança digital', 'cadeado, segurança digital, senha, privacidade', 'tecnologia'),

  // 08 · Pessoas e atendimento
  icon('UserRound', 'Cliente', 'cliente, pessoa, usuário, perfil', 'pessoas'),
  icon('UserRoundCheck', 'Cliente atendido', 'cliente, cadastro, aprovado, pessoa', 'pessoas'),
  icon('UsersRound', 'Equipe', 'equipe, colaboradores, time, pessoas, comunidade', 'pessoas', 'institucional'),
  icon('HandHeart', 'Relacionamento', 'relacionamento, carinho, solidariedade, responsabilidade social', 'pessoas', 'institucional'),
  icon('MessageCircle', 'Mensagem', 'mensagem, conversa, chat, comunicação', 'pessoas'),
  icon('MessagesSquare', 'Conversas', 'conversas, chat, atendimento, comunicação', 'pessoas'),
  icon('Phone', 'Telefone', 'telefone, ligação, contato', 'pessoas'),
  icon('Mail', 'E-mail', 'e-mail, mensagem, contato, carta', 'pessoas'),
  icon('Smile', 'Satisfação', 'satisfação, sorriso, feliz, experiência', 'pessoas'),
  icon('ThumbsUp', 'Aprovação', 'aprovação, curtir, positivo, confiança', 'pessoas'),
  icon('Baby', 'Infantil', 'bebê, criança, infantil, família', 'pessoas'),

  // 09 · Marketing e comunicação
  icon('Megaphone', 'Campanha', 'megafone, campanha, anúncio, divulgação, publicidade', 'marketing'),
  icon('MonitorPlay', 'Publicidade digital', 'publicidade, vídeo, mídia digital, anúncio', 'marketing'),
  icon('Camera', 'Fotografia', 'câmera, fotografia, foto', 'marketing'),
  icon('Image', 'Imagem', 'imagem, foto, figura', 'marketing'),
  icon('FileImage', 'Arquivo de imagem', 'arquivo, imagem, arte, peça', 'marketing'),
  icon('Video', 'Vídeo', 'vídeo, filmagem, gravação', 'marketing'),
  icon('Clapperboard', 'Produção audiovisual', 'claquete, produção, filme, audiovisual', 'marketing'),
  icon('Play', 'Reproduzir', 'play, reproduzir, vídeo', 'marketing'),
  icon('Mic', 'Áudio', 'microfone, áudio, locução, podcast', 'marketing'),
  icon('Radio', 'Rádio', 'rádio, transmissão, mídia', 'marketing'),
  icon('Newspaper', 'Notícias', 'jornal, notícias, imprensa, comunicado', 'marketing'),
  icon('Share2', 'Compartilhar', 'compartilhar, redes sociais, divulgar', 'marketing'),
  icon('AtSign', 'Redes sociais', 'arroba, redes sociais, perfil, menção', 'marketing'),
  icon('Send', 'Enviar', 'enviar, mensagem, disparo', 'marketing'),
  icon('Download', 'Download', 'download, baixar, arquivo', 'marketing'),
  icon('Palette', 'Criação', 'paleta, criação, design, cores, arte', 'marketing'),

  // 10 · Institucional e sustentabilidade
  icon('History', 'História', 'história, trajetória, tempo, passado', 'institucional'),
  icon('TrendingUp', 'Crescimento', 'crescimento, evolução, resultado, alta', 'institucional'),
  icon('Heart', 'Valores', 'coração, valores, amor, cuidado', 'institucional'),
  icon('Sprout', 'Sustentabilidade', 'broto, sustentabilidade, crescimento, futuro', 'institucional'),
  icon('Leaf', 'Meio ambiente', 'folha, meio ambiente, natureza, ecologia', 'institucional'),
  icon('Trees', 'Natureza', 'árvores, natureza, floresta, preservação', 'institucional'),
  icon('Recycle', 'Reciclagem', 'reciclagem, reutilização, sustentabilidade', 'institucional'),
  icon('Trophy', 'Reconhecimento', 'troféu, prêmio, reconhecimento, conquista', 'institucional'),
  icon('Award', 'Premiação', 'prêmio, premiação, mérito, selo', 'institucional'),
  icon('Medal', 'Medalha', 'medalha, conquista, reconhecimento', 'institucional'),
  icon('Earth', 'Comunidade global', 'mundo, planeta, terra, global, futuro', 'institucional'),
  icon('Flag', 'Compromisso', 'bandeira, compromisso, marco, meta', 'institucional'),
  icon('Lightbulb', 'Ideias', 'lâmpada, ideia, inovação, criatividade', 'institucional'),
  icon('GraduationCap', 'Educação', 'educação, formação, capacitação, ensino', 'institucional'),
  icon('Compass', 'Direção', 'bússola, direção, propósito, rumo', 'institucional'),
  icon('Wheat', 'Agronegócio', 'trigo, agronegócio, campo, agricultura', 'institucional'),
]

const normalize = (text: string) => text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
/** Portuguese search: name, keywords, category and the original Lucide name (accent-insensitive). */
export function matchIcon(item: CatalogIcon, query: string) {
  const term = normalize(query.trim())
  if (!term) return true
  const categoryNames = item.categories.map(id => iconCategories.find(category => category.id === id)!.name)
  return normalize([item.pt, ...item.keywords, ...categoryNames, item.name].join(' ')).includes(term)
}
/** Lucide file name: "ShoppingCart" → "shopping-cart", "Share2" → "share-2". */
export const kebab = (name: string) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([a-zA-Z])(\d)/g, '$1-$2').toLowerCase()
