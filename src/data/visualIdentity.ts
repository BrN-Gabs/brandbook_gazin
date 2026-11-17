// Capítulo 02 · Identidade Visual — dados centralizados.
//
// Fonte técnica: "Manual da Logomarca Gazin" (PDF de 16 páginas digitais, com duas
// páginas impressas lado a lado em quase todas). `pdf` guarda a página digital para
// consulta interna; a interface mostra só a numeração impressa.
//
// Procedência de cada informação (exibida na interface):
//   'manual'   → texto ou especificação escrita no manual;
//   'medido'   → medida tirada do arquivo original da logo do projeto (não é regra escrita);
//   'digital'  → decisão do Brandbook digital (não consta no manual);
//   'didatico' → demonstração didática de uma regra geral do manual.

export type Provenance = 'manual' | 'medido' | 'digital' | 'didatico'

export const provenanceLabel: Record<Provenance, string> = {
  manual: 'Documentado no manual',
  medido: 'Medido no arquivo original',
  digital: 'Manual da Marca digital',
  didatico: 'Interpretação didática',
}

/** Página do manual: numeração impressa e página digital do PDF (1–16). */
export type ManualPage = { printed: string; pdf: number }
export const manualSource = { title: 'Manual da Logomarca Gazin', pdfPages: 16 } as const
export const formatPage = (page: ManualPage) => `Manual · pág. ${page.printed}`

export const pages = {
  apresentacao: { printed: '05', pdf: 3 },
  logomarca: { printed: '06–07', pdf: 5 },
  defesa: { printed: '08–09', pdf: 4 },
  alfabeto: { printed: '10–11', pdf: 6 },
  cores: { printed: '12–13', pdf: 7 },
  aplicacoes: { printed: '14', pdf: 8 },
  seguranca: { printed: '15', pdf: 8 },
  bordados: { printed: '16', pdf: 9 },
  reducoes: { printed: '17', pdf: 9 },
  pretoBranco: { printed: '18', pdf: 10 },
  umaCor: { printed: '19', pdf: 10 },
  naoRecomendados: { printed: '20–21', pdf: 11 },
  papelaria: { printed: '22–25', pdf: 12 },
  caminhoes: { printed: '26–27', pdf: 14 },
  fachadas: { printed: '28–29', pdf: 15 },
  unidades: { printed: '30–31', pdf: 16 },
} satisfies Record<string, ManualPage>

/* ── Arquivo oficial da logo disponível no projeto ─────────────────────────── */
export const logoFile = {
  src: 'assets/logo-gazin.png',
  width: 2974,
  height: 835,
  alt: 'Logomarca Gazin: retângulo azul inclinado, de cantos arredondados, com o nome GAZIN em branco',
  /** Cor predominante medida nos pixels do PNG (não é especificação). */
  measuredHex: '#0B109F',
  hasSlogan: false,
} as const

/** Medidas tiradas do PNG original (scripts de medição descritos em docs/identidade-visual.md). */
export const logoMeasures = {
  /** Largura horizontal da haste da letra "i" (constante nas linhas 260–540 px). */
  iWidth: 183,
  /** Linha usada para indicar a medida: a haste do "i" começa em x = 2009 na linha y = 300. */
  iSample: { x: 2009, y: 300 },
  /** Lado esquerdo do retângulo (pontos do contorno extraído): define a inclinação. */
  slantSide: { from: [13.5, 700.2], to: [366.2, 89.3] },
} as const

export const clearSpaceRatio = logoMeasures.iWidth / logoFile.width
export const slantAngle = Math.round(Math.atan2(
  logoMeasures.slantSide.from[1] - logoMeasures.slantSide.to[1],
  logoMeasures.slantSide.to[0] - logoMeasures.slantSide.from[0],
) * 180 / Math.PI)

export const slogan = 'Sempre fazendo o melhor pra Você!'

/* ── 02.1 A Logomarca ──────────────────────────────────────────────────────── */
export const logoIntro = [
  'A logomarca é a expressão visual da “personalidade” da Gazin. É composta por um elemento gráfico, um desenho geométrico, e por um elemento tipográfico, o nome da empresa. Em algumas aplicações, um segundo elemento tipográfico apresenta o slogan.',
  'Ela não deve sofrer variações gráficas em nenhum tipo de aplicação institucional, comercial ou interna, preservando sempre a integridade visual da empresa.',
]

export const constructionSteps = [
  { id: 'forma', label: 'Forma geométrica', text: 'Um retângulo, inclinado e com os cantos arredondados. O contorno foi extraído do próprio arquivo original, sem redesenho.' },
  { id: 'estrutura', label: 'Estrutura e inclinação', text: `Os lados do retângulo seguem a mesma inclinação. No arquivo original, ela mede cerca de ${slantAngle}° em relação à base. O manual não especifica um ângulo; a medida é apenas uma referência.` },
  { id: 'tipografia', label: 'Tipografia', text: 'O nome GAZIN, em branco, ocupa o interior da forma. As letras são destacadas a partir do próprio arquivo, sem redesenho.' },
  { id: 'final', label: 'Composição final', text: 'Retângulo azul e nome em branco formam a logomarca: um único arquivo, exibido sempre intacto.' },
] as const

export const symbology = [
  { id: 'retangulo', title: 'Retângulo', words: ['autoridade', 'estabilidade', 'força'], text: 'Desperta a ideia de confiança, credibilidade e consistência.' },
  { id: 'inclinacao', title: 'Inclinação e cantos arredondados', words: ['modernidade', 'ousadia'], text: 'Sugerem uma marca em movimento, sem perder a solidez da forma.' },
  { id: 'azul', title: 'Cor azul', words: ['devoção', 'fé', 'aspiração', 'sinceridade', 'lealdade', 'confiança', 'tranquilidade'], text: 'Cor do retângulo e do slogan.' },
  { id: 'branco', title: 'Cor branca', words: ['pureza', 'sinceridade', 'verdade'], text: 'Cor do nome GAZIN.' },
] as const

export const symbologyClosing = 'Todas essas formas foram encaixadas de forma simétrica, produzindo um elemento que traduz as qualidades e virtudes do Grupo Gazin. A marca é sinônimo de uma promessa de credibilidade, confiabilidade, ética, eficiência e segurança para funcionários, clientes e comunidade.'

export const sloganNotes = [
  'O slogan complementa e justifica os valores da marca.',
  'Na tela, o slogan usa o azul digital #080EA0; na impressão, o mesmo Blue 072 C do retângulo.',
  'Aparece abaixo do retângulo, em Gotham Bold com inclinação, no mesmo azul da logomarca.',
  'Nas fachadas das lojas, o slogan não é utilizado.',
]

/* ── 02.2 Cores ────────────────────────────────────────────────────────────── */
export type ColorSpec = {
  id: string
  name: string
  hex: string
  /** Variável CSS que pinta a amostra (definida em globals.css). */
  token: string
  role: string
  cmyk?: string
  pantone?: string
  provenance: Provenance
  page?: ManualPage
  onDark?: boolean
}

/** Cores da logomarca para impressão (manual, pág. 12–13 e 18). Na tela, as amostras são simulações. */
export const printColors = [
  { id: 'azul-impressao', name: 'Azul da logomarca', token: '--manual-blue', pantone: 'Blue 072 C', cmyk: 'C100 M100 Y0 K0', role: 'Retângulo e slogan em todo material impresso. É também a cor da versão em uma cor.' },
  { id: 'preto-impressao', name: 'Preto da versão P&B', token: '--manual-black', pantone: 'Process Black C', cmyk: 'C0 M0 Y0 K100', role: 'Logomarca inteira quando a impressão é em preto e branco.' },
] as const

/** Azul da marca para telas: o mesmo azul principal da paleta digital. */
export const digitalBlue = { name: 'Azul digital', hex: '#080EA0', token: '--gazin-blue', role: 'Sites, redes sociais, apresentações, vídeos e qualquer aplicação em tela.' } as const

export const interfaceColors: ColorSpec[] = [
  { id: 'azul', name: 'Azul principal', hex: '#080EA0', token: '--gazin-blue', provenance: 'digital', onDark: true, role: 'Azul da marca nas telas: fundos institucionais, títulos sobre claro, slogan.' },
  { id: 'azul-vibrante', name: 'Azul vibrante', hex: '#4169FE', token: '--gazin-blue-bright', provenance: 'digital', onDark: true, role: 'Luz, interação, destaques e degradês.' },
  { id: 'cinza', name: 'Cinza azulado', hex: '#494E64', token: '--gazin-gray', provenance: 'digital', onDark: true, role: 'Texto corrido sobre claro, superfícies neutras.' },
  { id: 'branco', name: 'Branco', hex: '#FFFFFF', token: '--gazin-white', provenance: 'digital', role: 'Respiro, contraste e texto sobre azul.' },
  { id: 'verde', name: 'Verde', hex: '#5DAF02', token: '--gazin-green', provenance: 'digital', role: 'Complementar: indicadores pontuais. Nunca substitui o azul da logo.' },
  { id: 'laranja', name: 'Laranja', hex: '#FD9C0F', token: '--gazin-orange', provenance: 'digital', role: 'Complementar: destaques pontuais. Nunca substitui o azul da logo.' },
]

export const interfaceGradients = [
  { id: 'primary', name: 'Primário', token: '--gradient-primary', from: 'Azul principal', to: 'Azul vibrante' },
  { id: 'tech', name: 'Tecnológico', token: '--gradient-tech', from: 'Azul principal', to: 'Azul vibrante' },
  { id: 'institutional', name: 'Institucional', token: '--gradient-institutional', from: 'Azul profundo', to: 'Azul brilho' },
  { id: 'dark', name: 'Noturno', token: '--gradient-dark', from: 'Marinho', to: 'Azul brilho' },
] as const

/* ── 02.3 Tipografia ───────────────────────────────────────────────────────── */
export const typefaces = [
  { id: 'renfrew', family: 'Renfrew', use: 'Nome GAZIN, no logotipo', style: 'Na marca, aparece somente como parte do arquivo do logotipo, que não deve ser redigitado.', available: false },
  { id: 'gotham', family: 'Gotham Bold', use: 'Slogan, com inclinação', style: 'Geométrica, em peso bold, aplicada inclinada no slogan.', available: false },
] as const

export const interfaceTypefaces = [
  { id: 'jakarta', family: 'Plus Jakarta Sans', use: 'Títulos e destaques da interface', css: 'var(--font-display)', license: 'SIL Open Font License, servida pelo próprio site' },
  { id: 'inter', family: 'Inter', use: 'Textos, rótulos e dados técnicos', css: 'var(--font-sans)', license: 'SIL Open Font License, servida pelo próprio site' },
] as const

export const specimen = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  digits: '0123456789',
}

/* ── 02.4 Versões ──────────────────────────────────────────────────────────── */
// Os arquivos são gerados por scripts/export-logo-versions.mjs a partir do arquivo
// original (public/assets/logos/gazin-<id>.png e gazin-<id>-slogan.png).
export type VariantId = 'cores-originais' | 'fundo-escuro' | 'preto-branco' | 'uma-cor' | 'negativo'
export type Variant = {
  id: VariantId
  label: string
  short: string
  rule: string
  page: ManualPage
  specs?: { label: string; value: string }[]
  /** Fundos possíveis para o visualizador. */
  backgrounds: { id: string; label: string; token: string; dark: boolean }[]
}

export const logoAsset = (id: VariantId, withSlogan: boolean) => `assets/logos/gazin-${id}${withSlogan ? '-slogan' : ''}.png`
export const logoArchive = 'assets/logos/gazin-logos.zip'

export const variants: Variant[] = [
  {
    id: 'cores-originais', label: 'Cores originais', short: 'Fundo branco', page: pages.aplicacoes,
    rule: 'Aplicação preferencial: fundo branco e cores originais.',
    specs: [{ label: 'Impressão', value: 'Blue 072 C · C100 M100 Y0 K0' }, { label: 'Digital', value: '#080EA0' }],
    backgrounds: [{ id: 'branco', label: 'Branco', token: '--gazin-white', dark: false }],
  },
  {
    id: 'fundo-escuro', label: 'Fundo escuro', short: 'Com contorno branco', page: pages.aplicacoes,
    rule: 'Em fundos escuros, a logomarca recebe um contorno branco em volta do retângulo. O slogan passa a ser branco.',
    backgrounds: [
      { id: 'preto', label: 'Preto', token: '--manual-black', dark: true },
      { id: 'marinho', label: 'Marinho', token: '--gazin-navy', dark: true },
    ],
  },
  {
    id: 'preto-branco', label: 'Preto e branco', short: 'Impressão P&B', page: pages.pretoBranco,
    rule: 'Em impressão preto e branco, a logomarca é aplicada em preto 100%, com o nome vazado.',
    specs: [{ label: 'CMYK', value: 'C0 M0 Y0 K100' }, { label: 'Pantone', value: 'Process Black C' }],
    backgrounds: [{ id: 'branco', label: 'Branco', token: '--gazin-white', dark: false }],
  },
  {
    id: 'uma-cor', label: 'Uma cor', short: 'Azul com vazado', page: pages.umaCor,
    rule: 'Em impressos de uma cor, quando não é possível manter as cores originais, usa-se o azul como base e o restante da logomarca vazado.',
    specs: [{ label: 'Impressão', value: 'Blue 072 C · C100 M100 Y0 K0' }, { label: 'Digital', value: '#080EA0' }],
    backgrounds: [{ id: 'branco', label: 'Branco', token: '--gazin-white', dark: false }],
  },
  {
    id: 'negativo', label: 'Negativo', short: 'Sobre fundo de cor', page: pages.umaCor,
    rule: 'Em alguns casos, a logomarca é aplicada em negativo: contorno e nome em branco sobre fundo azul ou escuro.',
    backgrounds: [
      { id: 'azul', label: 'Azul', token: '--gazin-blue', dark: true },
      { id: 'preto', label: 'Preto', token: '--manual-black', dark: true },
    ],
  },
]

/* ── 02.6 Reduções ─────────────────────────────────────────────────────────── */
export const minimumSizes = [
  { id: 'impressao', label: 'Aplicação mínima', width: 3, height: 1, page: pages.reducoes, text: 'Tamanho mínimo permitido de aplicação. Abaixo disso, a leitura e a identificação ficam comprometidas.' },
  { id: 'bordado', label: 'Peças bordadas', width: 6, height: 2, page: pages.bordados, text: 'Mínimo para a leitura de todos os caracteres no bordado, sempre na cor original. Se não for possível, aplicar em silkscreen.' },
] as const

/** O diagrama da pág. 16 traz cotas diferentes do texto. Mantidas visíveis, sem escolher uma. */
export const embroideryDiagramNote = 'O diagrama da página 16 traz as cotas 5,5 × 1,78 cm, enquanto o texto define 6 × 2 cm. Prevalece o texto; a diferença deve ser validada com a equipe de marca.'

/* ── 02.7 Usos incorretos ──────────────────────────────────────────────────── */
export type MisuseId = 'esticar' | 'comprimir' | 'inclinacao' | 'cor' | 'slogan' | 'reducao' | 'invasao' | 'moldura' | 'contorno'
export type Misuse = { id: MisuseId; title: string; error: string; correct: string; provenance: Provenance; page: ManualPage }

export const misuses: Misuse[] = [
  { id: 'esticar', title: 'Deformar a proporção', error: 'Logomarca esticada na horizontal.', correct: 'Redimensione sempre em proporção, pelos cantos.', provenance: 'manual', page: pages.naoRecomendados },
  { id: 'comprimir', title: 'Comprimir as letras', error: 'Logomarca estreitada, com letras condensadas.', correct: 'Mantenha a proporção original do arquivo.', provenance: 'manual', page: pages.naoRecomendados },
  { id: 'inclinacao', title: 'Alterar a geometria', error: 'Retângulo sem a inclinação característica.', correct: 'A forma inclinada faz parte do desenho e não muda.', provenance: 'manual', page: pages.naoRecomendados },
  { id: 'cor', title: 'Trocar as cores', error: 'Nome GAZIN em cor fora da especificação.', correct: 'Use apenas as cores e versões documentadas.', provenance: 'manual', page: pages.naoRecomendados },
  { id: 'slogan', title: 'Alterar o slogan', error: 'Slogan em outra fonte e outra posição.', correct: 'Gotham Bold inclinada, abaixo do retângulo, no azul da marca.', provenance: 'manual', page: pages.naoRecomendados },
  { id: 'reducao', title: 'Reduzir demais', error: 'Aplicação abaixo do tamanho mínimo.', correct: 'Respeite o mínimo de 3 × 1 cm.', provenance: 'manual', page: pages.reducoes },
  { id: 'invasao', title: 'Invadir a área de segurança', error: 'Texto encostado na logomarca.', correct: 'Mantenha a área de proteção X livre em todos os lados.', provenance: 'manual', page: pages.seguranca },
  { id: 'moldura', title: 'Usar os limites como moldura', error: 'Área de segurança desenhada como um quadro.', correct: 'Os limites são invisíveis: servem apenas para afastar outros elementos.', provenance: 'manual', page: pages.seguranca },
  { id: 'contorno', title: 'Fundo escuro sem contorno', error: 'Logomarca sobre fundo escuro sem o contorno branco.', correct: 'Em fundo escuro, aplique o contorno branco em volta do retângulo.', provenance: 'didatico', page: pages.aplicacoes },
]

/* ── 02.8 Elementos gráficos ───────────────────────────────────────────────── */
export const documentedElements = [
  { id: 'retangulo', title: 'Retângulo inclinado', text: 'Base geométrica da marca: autoridade, estabilidade e força.' },
  { id: 'cantos', title: 'Cantos arredondados', text: 'Suavizam a forma e sugerem modernidade e ousadia.' },
  { id: 'azul', title: 'Predominância do azul', text: 'O retângulo azul é o campo onde a marca acontece.' },
  { id: 'tipografia', title: 'Composição tipográfica', text: 'Nome em branco dentro da forma; slogan em azul, abaixo.' },
  { id: 'equilibrio', title: 'Equilíbrio geométrico', text: 'Formas encaixadas de forma simétrica, num único elemento.' },
] as const

export const digitalElements = [
  { id: 'dna', title: 'DNA tridimensional', text: 'Metáfora central do Manual da Marca: a marca como código que se repete em tudo.' },
  { id: 'particulas', title: 'Micropartículas azuis', text: 'Pontos de luz que constroem formas e reagem ao movimento.' },
  { id: 'conexoes', title: 'Linhas de conexão', text: 'Ligam ideias, pessoas e capítulos.' },
  { id: 'gradientes', title: 'Gradientes azuis', text: 'Derivados dos dois azuis da interface, nunca multicoloridos.' },
  { id: 'luz', title: 'Iluminação branca e azul', text: 'Brilhos discretos que dão profundidade aos fundos escuros.' },
  { id: 'geometria', title: 'Formas geométricas sutis', text: 'Linhas, nós e diagonais que ecoam a inclinação da marca.' },
  { id: 'movimento', title: 'Animações suaves', text: 'Movimento que explica, sempre respeitando a redução de movimento.' },
] as const
