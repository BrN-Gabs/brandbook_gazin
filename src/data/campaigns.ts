// Capítulo 05 · Campanhas — Campanhas Gazin 2027.
//
// Fonte: "CALENDÁRIO 2027 - V2.pdf" (38 páginas: 37 de conteúdo + contracapa) e a pasta
// "Logos Campanhas" (28 PNG originais, com transparência). Nomes conforme a grafia das logos;
// períodos e descrições conforme as páginas do calendário (citadas em `page`). Nada foi
// inventado: campanhas sem arquivo de logo aparecem como "Arquivo ainda não disponibilizado".
//
// Para acrescentar uma campanha: inclua um objeto em `campaigns` e, se houver logo, registre o
// arquivo em `logoCatalog` (scripts/import-campaigns.mjs) e rode o script.
import files from './campaignFiles.json' with { type: 'json' }

export type CampaignCategory = 'institucional' | 'promocional'
export type CampaignKind = 'recorrente' | 'sazonal' | 'aniversario'
export type Campaign = {
  id: string
  name: string
  category: CampaignCategory
  kind: CampaignKind
  /** 1–12; vazio nas recorrentes (acontecem ao longo do ano). */
  month?: number
  /** Período como aparece no calendário. */
  period: string
  startDate?: string
  endDate?: string
  description: string
  /** Página do calendário (numeração do PDF). */
  page: number
  note?: string
}

export const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
const d = (month: number, day: number) => `2027-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
const seasonal = (id: string, name: string, month: number, from: number, to: number, description: string, page: number, note?: string): Campaign => ({
  id, name, category: 'promocional', kind: 'sazonal', month, period: from === to ? `Dia ${String(from).padStart(2, '0')}` : `De ${String(from).padStart(2, '0')} a ${String(to).padStart(2, '0')}`,
  startDate: d(month, from), endDate: d(month, to), description, page, note,
})

export const campaignsIntro = {
  title: 'Campanhas que conectam nossa marca às pessoas.',
  text: 'As campanhas da Gazin traduzem nossa identidade em ações que aproximam a marca de clientes, colaboradores e parceiros. Seja na comunicação institucional ou nas iniciativas promocionais, cada campanha possui um propósito, uma linguagem visual e uma mensagem que devem ser preservados. A consistência entre criatividade, informação e identidade fortalece o reconhecimento da Gazin em todos os pontos de contato.',
}

export const institutional = {
  summary: 'Marca, história e relacionamento.',
  text: 'As campanhas institucionais expressam a essência da Gazin e reforçam sua relação com as pessoas. Elas valorizam nossa trajetória, nossas conquistas e os princípios que sustentam a marca. Diferentemente das campanhas comerciais, seu foco principal está na construção de significado, reconhecimento e conexão com os públicos.',
  feature: {
    id: '61-anos',
    name: '61 anos Gazin',
    concept: 'Além do brilho, 61 anos iluminando caminhos.',
    text: 'Em 2027, a Gazin celebra 61 anos de uma trajetória construída com trabalho, dedicação e pessoas. A campanha de aniversário valoriza as conexões que acompanham a empresa ao longo das gerações e reforça a importância de continuar evoluindo sem perder sua essência.',
    // Trecho do texto de apresentação do calendário (pág. 2).
    quote: 'Em 2027, celebramos muito mais do que o tempo. Celebramos os caminhos que ajudamos a construir, as oportunidades que criamos e os sonhos que ainda vamos realizar.',
    page: 1,
  },
}

export const promotional = {
  summary: 'Ofertas e oportunidades ao longo de 2027.',
  text: 'As campanhas promocionais da Gazin são desenvolvidas para comunicar oportunidades comerciais de maneira atrativa, clara e consistente. Cada ação possui uma identidade visual própria, que valoriza seu conceito criativo e facilita o reconhecimento pelo público. A correta aplicação dos elementos gráficos, das mensagens e das informações comerciais contribui para campanhas mais organizadas e eficientes.',
}

export const campaigns: Campaign[] = [
  { id: '61-anos', name: '61 anos Gazin', category: 'institucional', kind: 'aniversario', period: 'Ano de 2027', description: 'Além do brilho, 61 anos iluminando caminhos. Identidade do calendário e da comemoração dos 61 anos da Gazin.', page: 1 },

  // Recorrentes (pág. 9). "Hoje é Dia D" (pág. 8) é exclusiva para fornecedores: ver `supplierCampaign`.
  { id: 'dia-unico', name: 'Dia Único', category: 'promocional', kind: 'recorrente', period: 'Um dia por mês, conforme o calendário (01/01, 02/02… 12/12)', description: 'Em cada Dia Único do ano, um dia exclusivo para vender muito! Ações especiais, ofertas exclusivas e condições que chamem atenção.', page: 9 },
  { id: 'dia-d', name: 'Dia D', category: 'promocional', kind: 'recorrente', period: 'Ao longo do ano, conforme o calendário', description: 'O momento certo para acelerar as vendas: combos atrativos, melhores ofertas e destaque aos itens de maior saída.', page: 9 },
  { id: 'alerta-de-ofertas', name: 'Alerta de Ofertas', category: 'promocional', kind: 'recorrente', period: 'Ao longo do ano, conforme o calendário', description: 'Desperta o interesse dos clientes com as melhores oportunidades e aquele senso de urgência que faz diferença na hora da compra.', page: 9 },
  { id: 'fecha-mes', name: 'Fecha Mês', category: 'promocional', kind: 'recorrente', period: 'Reta final de cada mês, conforme o calendário', description: 'A reta final do mês para intensificar as negociações, movimentar o estoque e alcançar as metas de vendas.', page: 9 },

  // Sazonais (págs. 10–32)
  seasonal('queima-total-nacional', 'Queima Total Nacional', 1, 2, 10, 'É hora de liquidar os estoques de 2026 e dar destaque para as novidades de 2027.', 10, 'O arquivo da logo chama-se “QUEIMA TOTAL GAZIN.png” e tem fundo próprio (não transparente).'),
  seasonal('verao-e-na-gazin', 'Verão é na Gazin', 1, 18, 24, 'A estação mais quente do ano chegou! Aproveite o clima de verão para aquecer as vendas com ofertas imperdíveis.', 10),
  seasonal('os-precos-cairam-na-folia', 'Os Preços Caíram na Folia', 2, 1, 9, 'A folia chegou com descontos de arrasar! É hora de entrar no ritmo das ofertas e fazer as vendas acontecerem.', 12),
  seasonal('semana-do-esportista', 'Semana do Esportista', 2, 15, 21, 'Destaque produtos que incentivam o esporte, o movimento e o bem-estar.', 12),
  seasonal('quinzena-do-consumidor', 'Quinzena do Consumidor', 3, 1, 15, 'O consumidor é a estrela da vez! Prepare ofertas atrativas e transforme cada oportunidade em uma grande venda.', 14),
  seasonal('tudo-que-ela-quer', 'Tudo que Ela Quer', 3, 5, 7, 'O momento perfeito para valorizar as mulheres com ofertas especiais e presentes que fazem a diferença.', 14),
  seasonal('parece-mentira-mas-e-verdade', 'Parece Mentira, Mas é Verdade', 4, 1, 3, 'Ofertas tão incríveis que parecem mentira! Surpreenda os clientes com preços de verdade e oportunidades irresistíveis.', 16),
  seasonal('o-melhor-pra-mamae', 'O Melhor pra Mamãe de A a Z', 5, 1, 9, 'Mãe merece sempre o melhor! É hora de destacar presentes especiais e transformar carinho em grandes oportunidades.', 18),
  seasonal('par-perfeito', 'Par Perfeito', 6, 1, 13, 'As melhores combinações estão na Gazin! Ofertas especiais e produtos que formam o par perfeito para vender mais.', 20),
  seasonal('festanca-do-preco-baixo', 'Festança do Preço Baixo', 6, 14, 20, 'O arraiá de ofertas começou! Prepare os melhores preços e faça dessa festança uma verdadeira celebração de vendas.', 20),
  seasonal('pintando-7-apae', 'Pintando 7 · APAE', 7, 1, 31, 'Um mês para colorir histórias e transformar vidas! Una boas ofertas à solidariedade e fortaleça o apoio às APAEs.', 22, 'Ação comercial com apoio às APAEs. O arquivo da logo chama-se “PT7.png”.'),
  seasonal('o-melhor-pro-paizao', 'O Melhor pro Paizão', 8, 1, 8, 'Todo paizão merece um presente especial! Destaque produtos que surpreendem e aproveite a data para impulsionar as vendas.', 24),
  seasonal('semana-da-tv-e-informatica', 'Semana da TV e Informática', 8, 9, 14, 'Tecnologia e entretenimento em destaque! Aproveite a semana para apresentar novidades e várias ofertas.', 24),
  seasonal('13-da-sorte', '13 da Sorte', 8, 13, 13, 'A sorte está do lado de quem aproveita as melhores ofertas!', 24),
  seasonal('o-gerente-viajou', 'O Gerente Viajou', 8, 15, 22, 'O gerente viajou e deixou os preços lá embaixo! Surpreenda os clientes com ofertas de tirar o fôlego.', 24),
  seasonal('semana-do-brasil', 'Semana do Brasil', 9, 1, 7, 'Uma semana de oportunidades para todo o Brasil! Valorize as melhores ofertas e faça as vendas ganharem força.', 26),
  seasonal('quinzena-do-cliente', 'Quinzena do Cliente', 9, 13, 25, 'Quem faz a nossa história merece condições especiais! Celebre nossos clientes com ofertas que valorizam cada conquista.', 26),
  seasonal('outubro-e-10', 'Outubro é 10', 10, 1, 30, 'Outubro chegou com nota máxima em oportunidades! Um mês inteiro para surpreender os clientes e multiplicar as vendas.', 28, 'Período conforme o calendário (“De 01 a 30”).'),
  seasonal('o-melhor-pra-criancada', 'O Melhor pra Criançada', 10, 1, 12, 'A diversão está garantida! Ofertas especiais para encantar os pequenos e tornar o Dia das Crianças inesquecível.', 28),
  seasonal('black-friday-show', 'Black Friday Show', 11, 1, 30, 'O maior espetáculo de ofertas do ano começou! Preços surpreendentes e um verdadeiro show de vendas.', 30),
  seasonal('natal-mais-azul-do-brasil', 'Natal Mais Azul do Brasil', 12, 1, 25, 'A magia do Natal chegou à Gazin! Encante os clientes com presentes especiais, grandes ofertas e momentos inesquecíveis.', 32, 'O arquivo da logo tem resolução menor (643 × 495 px).'),
  seasonal('aniversario-gazin', 'Aniversário Gazin', 12, 13, 13, 'É dia de celebrar mais um ano de história, conquistas e confiança! Comemore o aniversário da Gazin com ofertas especiais.', 32, 'No calendário, a data é apresentada com ofertas especiais: classificada como promocional.'),
  seasonal('colchao-da-virada', 'Colchão da Virada', 12, 27, 31, 'Comece o novo ano com mais conforto! Destaque as melhores ofertas em colchões e ajude os clientes a renovarem suas noites de sono.', 32),
  seasonal('selfie-da-virada', 'Selfie da Virada', 12, 27, 31, 'Os últimos dias do ano para destacar ofertas em smartphones e fechar o ano com grandes vendas.', 32),
]

// ── Campanha exclusiva para fornecedores (pág. 8) ──────────────────────────────────────
// Não é voltada ao consumidor: é a ação oferecida às marcas parceiras. Por isso fica fora da
// biblioteca e dos downloads, num bloco próprio. Textos conforme a pág. 8 do calendário.
export const supplierCampaign = {
  id: 'hoje-e-dia-d',
  name: 'Hoje é Dia D',
  signature: 'Gazin + sua marca aqui!',
  audience: 'Exclusiva para fornecedores',
  headline: 'Deixe sua marca em evidência o ano todo.',
  text: 'A Gazin realiza uma campanha exclusiva para os fornecedores e marcas parceiras, sempre na terceira sexta e sábado de cada mês, com foco em acelerar vendas e ampliar a visibilidade das marcas.',
  facts: [
    { label: 'Quando', value: 'Terceira sexta e sábado de cada mês' },
    { label: 'Canais', value: 'Varejo, e-commerce e atacado' },
    { label: 'Objetivo', value: 'Destacar os produtos da marca parceira, movimentar o estoque e alcançar resultados com a força comercial e a estrutura da Gazin' },
  ],
  note: 'Campanha de relacionamento comercial com fornecedores, não uma campanha para o consumidor final. Não há arquivo de logo para download: a identidade aparece na pág. 8 do calendário.',
  page: 8,
}

/** Logo Gazin oficial, versão para fundo escuro (capítulo 02 · Identidade Visual). */
export const gazinLogo = { src: 'assets/logos/gazin-fundo-escuro.png', width: 3034, height: 895 }

type LogoFile ={ file: string; path: string; preview: string; bytes: number; width: number; height: number; previewWidth: number; previewHeight: number }
const logos = files.logos as Record<string, LogoFile | undefined>
const pages = files.pages as Record<string, { path: string; width: number; height: number } | undefined>
/** Original logo file (download) and its light preview; undefined when not available. */
export const logoOf = (id: string) => logos[id]
/** Calendar page preview, used when a campaign has no logo file. */
export const pagePreviewOf = (id: string) => pages[id]
export const calendarCover = pages['calendario-capa']!

export const calendar = {
  title: 'Calendário Gazin 2027',
  description: 'Consulte o planejamento anual de campanhas, períodos promocionais, datas comemorativas e orientações comerciais da Gazin.',
  path: files.calendar.path,
  fileName: 'Calendario-Gazin-2027.pdf',
  pages: 38,
  pagesNote: '37 páginas de conteúdo e contracapa',
  sizeMB: Math.round(files.calendar.bytes / 104857.6) / 10,
}
export const logosZip = { path: files.zip.path, fileName: 'Logos-Campanhas-Gazin-2027.zip', sizeMB: Math.round(files.zip.bytes / 104857.6) / 10, count: files.zip.files }

export const library = {
  title: 'Biblioteca de Campanhas Gazin 2027',
  description: 'Explore as identidades visuais das campanhas e acesse os materiais para aplicação nas peças de comunicação.',
  unavailable: 'Arquivo ainda não disponibilizado',
}

// ── 05.3 Diretrizes criativas ───────────────────────────────────────────────────────────
export const creative = {
  summary: 'Identidade, clareza e criatividade em equilíbrio.',
  text: 'A criação de campanhas deve equilibrar identidade, criatividade e clareza. Cada conceito visual precisa comunicar sua proposta de maneira reconhecível, utilizando cores, elementos gráficos, tipografia e imagens de forma organizada. A criatividade deve valorizar a mensagem sem comprometer a identificação da marca.',
  /** Regra obrigatória: a logo Gazin acompanha a logo de toda campanha. */
  brandRule: {
    title: 'Logo Gazin obrigatória',
    text: 'Toda peça de campanha leva a logo Gazin, posicionada logo abaixo da logo da campanha ou sobreposta à parte inferior dela, sem encobrir o nome da campanha, que precisa continuar legível.',
  },
  principles: [
    { title: 'Identidade', text: 'Respeitar os elementos originais da Gazin e da campanha.' },
    { title: 'Clareza', text: 'Garantir que a mensagem principal seja compreendida rapidamente.' },
    { title: 'Consistência', text: 'Manter unidade visual entre diferentes formatos e canais.' },
    { title: 'Legibilidade', text: 'Utilizar tipografia e contraste adequados.' },
    { title: 'Criatividade', text: 'Explorar conceitos e composições sem descaracterizar a identidade aprovada.' },
    { title: 'Adaptabilidade', text: 'Preparar as campanhas para formatos digitais, impressos e materiais físicos.' },
  ],
}

// ── 05.4 Hierarquia ────────────────────────────────────────────────────────────────────
export const hierarchy = {
  summary: 'A ordem em que cada informação é percebida.',
  text: 'A hierarquia visual determina a ordem em que as informações são percebidas. Em uma campanha, os elementos mais importantes devem receber maior destaque, enquanto textos de apoio, condições comerciais e informações complementares precisam permanecer organizados e legíveis.',
  levels: [
    { id: 'identificacao', number: '01', title: 'Identificação da campanha', text: 'Logo da campanha com a logo Gazin, abaixo dela ou sobreposta à sua parte inferior, sem encobrir o nome da campanha.' },
    { id: 'mensagem', number: '02', title: 'Mensagem principal', text: 'Chamada que comunica a oportunidade ou a proposta da peça.' },
    { id: 'produto', number: '03', title: 'Produto ou benefício', text: 'Imagem, característica ou vantagem principal.' },
    { id: 'comercial', number: '04', title: 'Informação comercial', text: 'Preço, condição de pagamento ou benefício verificável.' },
    { id: 'complementar', number: '05', title: 'Informações complementares', text: 'Período, regras e observações necessárias.' },
    { id: 'marca', number: '06', title: 'Identidade e chamada para ação', text: 'Marca Gazin, canal de compra ou orientação para o consumidor, conforme a composição aprovada.' },
  ],
  flexible: 'A ordem pode variar conforme o tipo de peça: é uma estrutura de referência, não um modelo rígido.',
  transparency: ['Descontos sem base verificável.', 'Parcelamentos ambíguos.', 'Informações essenciais ilegíveis.', 'Promessas não comprovadas.', 'Chamadas que induzam o consumidor ao erro.'],
  demoNote: 'Peça demonstrativa montada com a logo oficial da campanha: os textos, o produto e os valores são ilustrativos e não representam uma oferta real.',
}

// ── 05.5 Padronização ──────────────────────────────────────────────────────────────────
export const standardization = {
  summary: 'A mesma campanha, reconhecível em qualquer formato.',
  text: 'A padronização visual permite que uma campanha seja reconhecida independentemente do formato ou canal de divulgação. A aplicação consistente das logos, cores, elementos gráficos e mensagens contribui para fortalecer sua identidade e garantir unidade entre os materiais produzidos.',
  rules: [
    { title: 'Logotipos', text: 'Preservar as logos oficiais da Gazin e das campanhas. A logo Gazin é obrigatória em todas as peças.' },
    { title: 'Cores', text: 'Respeitar a identidade original de cada campanha.' },
    { title: 'Tipografia', text: 'Preservar o estilo e a hierarquia definidos nos materiais aprovados.' },
    { title: 'Elementos gráficos', text: 'Utilizar os recursos visuais da campanha sem distorções ou alterações desnecessárias.' },
    { title: 'Proporções', text: 'Adaptar a composição aos formatos mantendo a legibilidade.' },
    { title: 'Produtos e preços', text: 'Manter imagens proporcionais e informações comerciais claras.' },
  ],
  formats: [
    { id: 'story', label: 'Story', ratio: '9 / 16', text: '9:16' },
    { id: 'feed', label: 'Feed', ratio: '4 / 5', text: '4:5' },
    { id: 'quadrado', label: 'Quadrado', ratio: '1 / 1', text: '1:1' },
    { id: 'banner', label: 'Banner', ratio: '16 / 9', text: '16:9' },
    { id: 'impresso', label: 'Impresso (A4)', ratio: '210 / 297', text: 'A4 vertical' },
  ],
  formatsNote: 'Exemplos de adaptação, não regras universais para todos os canais.',
  errors: [
    { id: 'distorcida', label: 'Logo distorcida', text: 'A logo da campanha foi esticada: perde a proporção original.' },
    { id: 'cores', label: 'Cores alteradas', text: 'A identidade da campanha foi recolorida: deixa de ser reconhecível.' },
    { id: 'sobreposicao', label: 'Elementos sobrepostos', text: 'Logo, título e preço disputam o mesmo espaço e se encobrem.' },
    { id: 'sem-gazin', label: 'Sem a logo Gazin', text: 'A peça traz só a logo da campanha: a logo Gazin é obrigatória em todas as peças.' },
    { id: 'legibilidade', label: 'Texto ilegível', text: 'Informação comercial pequena e sem contraste: o consumidor não consegue ler.' },
  ],
}
