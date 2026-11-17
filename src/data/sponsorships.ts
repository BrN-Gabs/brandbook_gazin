// Capítulo 09 · Patrocínios e Eventos.
//
// Fontes (consultadas em 16/11/2026):
//  · Instituto Mário Gazin: institutomariogazin.com.br (home, "O instituto" e páginas de projetos);
//  · VEX: varejoexperience.com.br (apresenta a edição 2026);
//  · Clube do Remo: anúncio de 03/02/2026 (Máquina do Esporte, MKT Esportivo);
//  · Paysandu: manchete "Paysandu e Grupo Gazin firmam patrocínio", 08/02/2026, site oficial do clube
//    (termos não verificados);
//  · Gazin Porto Velho: nome oficial "Gazin Porto Velho Esporte Clube", por patrocínio;
//  · Feiras: planilha "FEIRAS 2027 - OFICIAL (1).xlsx", aba "Calendário Feiras e Eventos".
// Não há valores, duração de contratos, números de público nem programação de 2027. Escudos,
// fotos dos clubes, fotos de projetos e fotos de estandes NÃO estão no projeto: os campos ficam
// prontos para material oficial autorizado (nada é baixado de sites de terceiros).
import files from './sponsorshipFiles.json' with { type: 'json' }

type Img = { path: string; width: number; height: number }
const img = (id: keyof typeof files.images): Img => files.images[id]

export const sponsorshipsIntro = {
  title: 'Conexões que transformam. Parcerias que fazem a diferença.',
  text: 'A presença da Gazin vai além de suas lojas e unidades de negócio. Por meio de iniciativas sociais, patrocínios esportivos, encontros empresariais e participação em feiras, fortalecemos relacionamentos, compartilhamos conhecimento e contribuímos para o desenvolvimento das comunidades e dos mercados em que atuamos. Cada iniciativa representa uma oportunidade de aproximar pessoas e construir novas histórias.',
}

export const pendingLabel = 'Material oficial a inserir'

// ── 09.1 Instituto Mário Gazin ─────────────────────────────────────────────────────────
export type InstituteProject = { id: string; name: string; area: string; text: string; url: string; image?: Img & { caption: string } }
export const institute = {
  name: 'Instituto Mário Gazin',
  url: 'https://institutomariogazin.com.br/',
  logo: { path: 'assets/marcas/previa/instituto-mario-gazin.png' },
  quote: 'O futuro é um filho que cuidamos hoje.',
  launched: 'Lançado em 2022 para reunir e fortalecer as iniciativas voltadas às pessoas e às comunidades.',
  text: 'Por meio do Instituto Mário Gazin, o compromisso com as pessoas ganha novas possibilidades de transformação. Suas iniciativas promovem oportunidades, valorizam a cultura, incentivam a educação, apoiam o esporte e contribuem para o desenvolvimento social e ambiental. Mais do que apoiar projetos, o Instituto representa a dedicação a um futuro construído com responsabilidade e cuidado.',
  areas: ['Social', 'Cultural', 'Ambiental', 'Educacional', 'Esportiva'],
  hero: { ...img('instituto-capa'), alt: 'Espaço do Instituto Mário Gazin, com o retrato de Mário Gazin, a frase do Instituto e objetos da história da empresa', caption: 'Instituto Mário Gazin · fotografia oficial' },
  projects: [
    { id: 'pintando-7', name: 'Pintando 7 com a APAE', area: 'Social', url: 'https://institutomariogazin.com.br/projetos/pintando-7-com-a-apae/', text: 'Iniciativa de arrecadação realizada em julho: parte das vendas do mês é destinada às APAEs, principalmente nas cidades onde há lojas Gazin.', image: { ...img('instituto-pintando7'), caption: 'Pintando o 7 com a APAE · peça de divulgação' } },
    { id: 'cine-gazin', name: 'Cine Gazin', area: 'Cultural', url: 'https://institutomariogazin.com.br/projetos/cine-gazin/', text: 'Cinema gratuito em uma carreta, que leva cultura e lazer a comunidades que, em sua maioria, nunca entraram em uma sala de cinema. Realizado por meio da Lei de Incentivo à Cultura.', image: { ...img('instituto-cine'), caption: 'Cine Gazin · fotografia oficial' } },
    { id: 'orquestra', name: 'Alfredo Gazin Orquestra', area: 'Educacional', url: 'https://institutomariogazin.com.br/projetos/alfredo-gazin-orquestra/', text: 'Orquestra escola com aulas gratuitas de instrumentos clássicos, canto e coral para crianças e adolescentes de escolas públicas de Douradina.', image: { ...img('instituto-orquestra'), caption: 'Alfredo Gazin Orquestra · fotografia oficial' } },
    { id: 'era-uma-vez', name: 'Era Uma Vez o Natal', area: 'Cultural', url: 'https://institutomariogazin.com.br/projetos/era-uma-vez-o-natal/', text: 'Musical de Natal patrocinado pela Lei de Incentivo à Cultura, que leva cultura e lazer a populações distantes dos grandes centros.', image: { ...img('instituto-natal'), caption: 'Era Uma Vez o Natal · fotografia oficial' } },
  ] satisfies InstituteProject[],
  photosNote: 'Fotografias oficiais fornecidas pela equipe de marketing.',
}

// ── 09.2 Patrocínios esportivos ────────────────────────────────────────────────────────
export type SponsorshipStatus = 'anunciado' | 'a-confirmar'
export type ClubSeason = { year: number; status: SponsorshipStatus; note: string; source?: { label: string; url: string } }
export type Club = { id: string; name: string; short: string; state: string; text: string; site: string; crest?: Img; photo?: Img; seasons: ClubSeason[] }
export const statusLabel: Record<SponsorshipStatus, string> = { anunciado: 'Patrocínio anunciado', 'a-confirmar': 'A confirmar' }
export const sports = {
  text: 'O esporte representa união, superação, trabalho em equipe e paixão. Por meio de seus patrocínios esportivos, a Gazin fortalece sua presença junto às comunidades, valoriza instituições com histórias importantes e amplia sua conexão com torcedores de diferentes regiões do Brasil.',
  clubs: [
    {
      id: 'porto-velho', name: 'Gazin Porto Velho Esporte Clube', short: 'Gazin Porto Velho', state: 'Porto Velho · RO', site: 'https://www.portovelhoec.org.br/', crest: img('clube-porto-velho-escudo'), photo: img('clube-porto-velho-foto'),
      text: 'Clube de Porto Velho, em Rondônia, que leva o nome Gazin em sua denominação oficial por meio do patrocínio.',
      seasons: [{ year: 2026, status: 'anunciado', note: 'Nome oficial do clube com a marca Gazin.', source: { label: 'Fonte: portal do clube', url: 'https://www.portovelhoec.org.br/' } }, { year: 2027, status: 'a-confirmar', note: 'Condição para 2027 a confirmar.' }],
    },
    {
      id: 'remo', name: 'Clube do Remo', short: 'Remo', state: 'Belém · PA', site: 'https://www.clubedoremo.com.br/', crest: img('clube-remo-escudo'), photo: img('clube-remo-foto'),
      text: 'O Grupo Gazin passou a integrar o quadro de patrocinadores do Remo na temporada 2026, com a marca na parte superior das costas do uniforme. Valores e duração não foram divulgados.',
      seasons: [{ year: 2026, status: 'anunciado', note: 'Anunciado em 03/02/2026.', source: { label: 'Máquina do Esporte', url: 'https://maquinadoesporte.com.br/futebol/remo-anuncia-grupo-gazin-como-patrocinador-para-parte-superior-das-costas/' } }, { year: 2027, status: 'a-confirmar', note: 'Condição para 2027 a confirmar.' }],
    },
    {
      id: 'paysandu', name: 'Paysandu Sport Club', short: 'Paysandu', state: 'Belém · PA', site: 'https://www.paysandu.com.br/', crest: img('clube-paysandu-escudo'), photo: img('clube-paysandu-foto'),
      text: 'Parceria anunciada pelo clube em fevereiro de 2026. Detalhes do patrocínio (temporada, propriedade e duração) a confirmar com os canais oficiais.',
      seasons: [{ year: 2026, status: 'anunciado', note: 'Anunciado pelo clube em 08/02/2026 (“Paysandu e Grupo Gazin firmam patrocínio”).', source: { label: 'Site oficial do Paysandu', url: 'https://www.paysandu.com.br/' } }, { year: 2027, status: 'a-confirmar', note: 'Condição para 2027 a confirmar.' }],
    },
  ] satisfies Club[],
  note: 'Escudos e fotografias fornecidos pela equipe de marketing, aplicados sem alterações.',
}

// ── 09.3 VEX ───────────────────────────────────────────────────────────────────────────
export type VexItem = { id: string; title: string; text: string; image: Img; kind: 'wide' | 'tall' | 'stage' }
const vexItem = (id: keyof typeof files.images, title: string, text: string, kind: VexItem['kind']): VexItem => ({ id, title, text, image: img(id), kind })
export const vex = {
  name: 'Varejo Experience Brasil',
  short: 'VEX',
  url: 'https://varejoexperience.com.br/',
  tagline: 'A evolução começa aqui',
  text: 'O Varejo Experience Brasil reúne conhecimento, inovação e relacionamento em uma experiência dedicada ao desenvolvimento do varejo. Por meio de palestras, encontros e oportunidades de networking, o evento aproxima profissionais, empresários e lideranças, incentivando a troca de ideias e a construção de novos caminhos para os negócios.',
  hero: img('vex-identidade'),
  editions: {
    current: { label: 'VEX26 · edição realizada', text: '18 a 20 de agosto de 2026 · Rafain Palace Hotel & Convention, Foz do Iguaçu (PR) · realização Grupo Gazin.', source: 'Site oficial do evento' },
    next: { label: 'VEX 2027 · previsto', text: '18 a 20 de agosto de 2027 · Foz do Iguaçu (PR).', source: 'Datas previstas no calendário interno de feiras 2027, a confirmar com a organização.' },
  },
  /** Official VEX26 photographs (folder "Patrocínios e Eventos/VEX"), shown as a demonstration of the event. */
  photos: [
    vexItem('vex-foto-plenaria', 'Plenária principal', 'Público e palco com a identidade do VEX26.', 'stage'),
    vexItem('vex-foto-fornecedores-palco', 'Encontro de Fornecedores', 'Mário Gazin no palco do encontro com fornecedores.', 'wide'),
    vexItem('vex-foto-fornecedores-salao', 'Salão do encontro', 'Fornecedores e equipes reunidos no salão.', 'wide'),
    vexItem('vex-foto-convencao', 'Convenção interna', 'Colaboradores circulando pela área de expositores.', 'wide'),
    vexItem('vex-foto-show', 'Apresentação musical', 'Momento de entretenimento no palco do evento.', 'wide'),
  ],
  materialsNote: 'Fotografias oficiais da edição 2026 (VEX26).',
}

// ── 09.4 Feiras 2027 ───────────────────────────────────────────────────────────────────
export const monthsShort = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
export const monthsLong = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
export type TradeFair = {
  id: string; order: number; name: string; city: string; uf: string; start: string; end: string; year: 2027
  /** Exactly as in the spreadsheet (source of truth). */
  original: { name: string; city: string; uf: string; period: string }
  source: string; confirmation: 'planejado' | 'a-conferir'; warning?: string
  /** Prepared for official material (left empty: no fictitious data). */
  logo?: string; photo?: string; booth?: string; pavilion?: string; address?: string; visitorInfo?: string; link?: string; materials?: string
}
const SOURCE = 'Planilha “FEIRAS 2027 - OFICIAL” · Gazin Atacado e Gazin Colchões'
const fair = (order: number, id: string, name: string, city: string, uf: string, start: string, end: string, original: TradeFair['original'], extra: Partial<TradeFair> = {}): TradeFair =>
  ({ order, id, name, city, uf, start: `2027-${start}`, end: `2027-${end}`, year: 2027, original, source: SOURCE, confirmation: 'planejado', ...extra })
export const tradeFairs = {
  text: 'A participação em feiras e eventos comerciais fortalece a presença da Gazin no mercado e amplia as oportunidades de relacionamento com clientes, fornecedores e parceiros. Esses encontros permitem apresentar produtos, compartilhar conhecimento, acompanhar tendências e desenvolver novas conexões comerciais em diferentes regiões do Brasil.',
  owner: 'Gazin Atacado · Gazin Colchões',
  fairs: [
    fair(1, 'femur', 'FEMUR', 'Ubá', 'MG', '01-25', '01-28', { name: 'FEMUR', city: 'UBÁ - MG', uf: 'MG', period: '25 JAN a 28 JAN' }),
    fair(2, 'movelbra', 'MOVELBRA', 'Arapongas', 'PR', '02-16', '02-18', { name: 'MOVELBRA', city: 'ARAPONGAS', uf: 'PR', period: '16 FEV a 18 FEV' }),
    fair(3, 'expoaju-moveis', 'EXPOAJU MÓVEIS', 'Aracaju', 'SE', '02-24', '02-26', { name: 'EXPOAJU MÓVEIS', city: 'ARACAJU', uf: 'SE', period: '24 FEV a 26 FEV' }),
    fair(4, 'yes-sao-paulo', 'YES SÃO PAULO', 'São Paulo', 'SP', '03-15', '03-18', { name: 'YES SÃO PAULO', city: 'SÃO PAULO', uf: 'SP', period: '15 MAR a 18 MAR' }),
    fair(5, 'expomovel-sao-luis', 'EXPOMÓVEL SÃO LUÍS', 'São Luís', 'MA', '03-10', '03-12', { name: 'EXPOMÓVEL SÃO LUIS', city: 'SÃO LUIS', uf: 'MA', period: '10 MAR a 12 MAR' }),
    fair(6, 'yes-goias', 'YES GOIÁS', 'Goiânia', 'GO', '04-13', '04-15', { name: 'YES GOIAS', city: 'GOIANIA', uf: 'GO', period: '13 ABR a 15 ABR' }),
    fair(7, 'expomovel-ceara', 'EXPOMÓVEL CEARÁ', 'Fortaleza', 'CE', '05-05', '05-07', { name: 'EXPOMOVEL CEARÁ', city: 'FORTALEZA', uf: 'CE', period: '05 MAI a 07 MAI' }),
    fair(8, 'yes-minas-gerais', 'YES MINAS GERAIS', 'Belo Horizonte', 'MG', '05-11', '05-13', { name: 'YES MINAS GERAIS', city: 'BELO HORIZONTE', uf: 'MG', period: '11 MAI a 13 MAI' }),
    fair(9, 'movinter', 'MOVINTER', 'São José do Rio Claro', 'SP', '06-15', '06-17', { name: 'MOVINTER', city: 'SÃO JOSÉ DO RIO CLARO', uf: 'SP', period: '15 JUN a 17 JUN' }, { confirmation: 'a-conferir', warning: 'Cidade e UF a conferir: a planilha registra “São José do Rio Claro” com UF “SP”. Não usar em mapas antes da revisão.' }),
    fair(10, 'expomovel-pernambuco', 'EXPOMÓVEL PERNAMBUCO', 'Caruaru', 'PE', '08-12', '08-14', { name: 'EXPOMOVEL PERNAMBUCO', city: 'CARUARU', uf: 'PE', period: '12 AGO a 14 AGO' }),
    fair(11, 'vex-2027', 'VAREJO EXPERIENCE BRASIL', 'Foz do Iguaçu', 'PR', '08-18', '08-20', { name: 'VAREJO EXPERIENCE BRASIL', city: 'FOZ DO IGUAÇU', uf: 'PR', period: '18 AGO a 20 AGO' }, { link: 'https://varejoexperience.com.br/' }),
    fair(12, 'equipotel', 'EQUIPOTEL', 'São Paulo', 'SP', '09-14', '09-17', { name: 'EQUIPOTEL', city: 'SÃO PAULO', uf: 'SP', period: '14 SET a 17 SET' }),
    fair(13, 'expomovel-goias', 'EXPOMÓVEL GOIÁS', 'Goiânia', 'GO', '09-15', '09-17', { name: 'EXPOMOVEL GOIAS', city: 'GOIANIA - GO', uf: 'GO', period: '15 SET a 17 SET' }),
  ].sort((a, b) => a.start.localeCompare(b.start)) as TradeFair[],
  download: {
    title: 'Planejamento de Feiras 2027',
    text: 'Consulte os eventos, cidades e períodos previstos para a participação da Gazin Atacado e da Gazin Colchões em 2027.',
    ...files.sheet,
    fileName: 'Feiras-2027-Gazin.xlsx',
  },
  booths: {
    title: 'Galeria de estandes',
    text: 'Estandes da Gazin em participações anteriores. As fotos não são registros de 2027.',
    photos: [
      { ...img('feira-estande-colchoes'), title: 'Estande de colchões', caption: 'Exposição de colchões com a marca Gazin · participação anterior' },
      { ...img('feira-estande-01'), title: 'Estande Gazin', caption: 'Estande com identidade Gazin · participação anterior' },
      { ...img('feira-estande-02'), title: 'Estande de eletrônicos', caption: 'Estande Gazin com eletrônicos e eletrodomésticos · participação anterior' },
    ],
  },
}
export const fairMonth = (fairItem: TradeFair) => Number(fairItem.start.slice(5, 7))
export const fairDates = (fairItem: TradeFair) => {
  const [startDay, endDay] = [Number(fairItem.start.slice(8)), Number(fairItem.end.slice(8))]
  const [startMonth, endMonth] = [Number(fairItem.start.slice(5, 7)), Number(fairItem.end.slice(5, 7))]
  return startMonth === endMonth ? `${String(startDay).padStart(2, '0')} a ${String(endDay).padStart(2, '0')} de ${monthsLong[startMonth - 1].toLowerCase()}` : `${startDay}/${startMonth} a ${endDay}/${endMonth}`
}
