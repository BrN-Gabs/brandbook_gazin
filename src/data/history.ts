// Nossa História — linha do tempo da Gazin (Essência).
//
// Fonte: "Linha do Tempo Gazin.pdf" (págs. 2–6). Fotografias: pasta "Imagens Linha do Tempo",
// importadas por scripts/import-history-photos.mjs (associação foto → acontecimento no script).
//
// Para adicionar um marco: inclua um objeto em `historyEvents` (ordem cronológica), coloque a
// fotografia na pasta, registre-a em `photoCatalog` do script e rode o script. Vários marcos no
// mesmo ano são aceitos (ids diferentes). Sem foto, o marco aparece com uma moldura vazia.
import historyPhotos from './historyPhotos.json' with { type: 'json' }

export type HistoryEvent = {
  id: string
  year: number
  title: string
  description: string
  /** Texto alternativo da fotografia: descreve o que se vê, não o acontecimento. */
  alt: string
  /** Página do PDF de origem. */
  source: string
  /** Observação interna para validação (não exibida). */
  note?: string
}

export const historyIntro = {
  eyebrow: 'Essência',
  title: 'Nossa História',
  subtitle: 'Uma trajetória que nos conecta.',
  text: 'De uma loja em Douradina a centenas de filiais pelo Brasil: momentos que construíram o jeito Gazin de fazer, conectar e transformar.',
  hint: 'Role para percorrer a linha do tempo',
  closing: 'Nossa história continua…',
}

const pdf = (page: number) => `Linha do Tempo Gazin.pdf, pág. ${page}`

export const historyEvents: HistoryEvent[] = [
  { id: '1966-primeira-loja', year: 1966, title: 'O início de tudo', description: 'Em 13 de dezembro, nasce a primeira loja da família Gazin, em Douradina, no Paraná.', alt: 'Fotografia antiga em tons sépia de um homem sorrindo com os braços erguidos diante de um caminhão', source: pdf(2), note: 'O nome do arquivo indica 1970; validar a data da fotografia.' },
  { id: '1974-primeira-filial', year: 1974, title: 'Primeira filial', description: 'Inauguração da primeira filial da Gazin, em Mundo Novo, Mato Grosso do Sul.', alt: 'Fachada antiga da loja Móveis Gazin, com mercadorias expostas na calçada', source: pdf(2) },
  { id: '1995-rondonia', year: 1995, title: 'Expansão para Rondônia', description: 'A Gazin chega ao estado de Rondônia.', alt: 'Dois homens trabalhando em uma mesa de escritório com documentos', source: pdf(2) },
  { id: '1996-centro-distribuicao', year: 1996, title: 'Primeiro Centro de Distribuição', description: 'Criação do primeiro Centro de Distribuição, marco da operação do Gazin Atacado.', alt: 'Interior de um galpão com produtos embalados empilhados', source: pdf(2) },
  { id: '1998-primeira-industria', year: 1998, title: 'Primeira indústria', description: 'Fundação da primeira indústria da Gazin.', alt: 'Grupo de pessoas em frente à entrada de um galpão da Gazin Colchões', source: pdf(2) },
  { id: '2000-acre', year: 2000, title: 'Chegada ao Acre', description: 'Inauguração da primeira filial da Gazin no Acre.', alt: 'Embarcações às margens de um rio, com carga coberta por lona amarela', source: pdf(3) },
  { id: '2002-paranatec-auto-posto', year: 2002, title: 'Novos negócios', description: 'Surgimento da Paranatec e do Gazin Auto Posto.', alt: 'Posto de combustível com a marca Gazin na cobertura', source: pdf(3) },
  { id: '2004-consorcio', year: 2004, title: 'Consórcio Nacional Gazin', description: 'Marco do Consórcio Nacional Gazin.', alt: 'Dois homens ao lado de um banner da Garantia A Mais Gazin', source: pdf(3), note: 'A fotografia mostra um banner da Garantia A Mais; associação conforme o PDF, validar.' },
  { id: '2005-filial-100', year: 2005, title: 'A 100ª filial', description: 'Inauguração da filial de número 100.', alt: 'Corte de fita inaugural cercado por uma multidão', source: pdf(3) },
  { id: '2006-amazonas', year: 2006, title: 'Expansão para o Amazonas', description: 'Inauguração da primeira filial da Gazin no Amazonas.', alt: 'Casa flutuante em um rio cercado de floresta', source: pdf(3) },
  { id: '2009-daniel', year: 2009, title: 'Daniel, garoto-propaganda', description: 'O cantor Daniel é contratado como garoto-propaganda da marca.', alt: 'O cantor Daniel deitado em uma cama, sorrindo', source: pdf(4) },
  { id: '2010-gazincred', year: 2010, title: 'Surgimento da GazinCred', description: 'Marco do surgimento da GazinCred.', alt: 'Homem segurando uma bola diante de um painel da GazinCred', source: pdf(4) },
  { id: '2011-gazin-viagens', year: 2011, title: 'Gazin Viagens', description: 'Nasce a Gazin Viagens.', alt: 'Atendentes em uma agência com a marca Gazin na parede', source: pdf(4) },
  { id: '2013-filial-200', year: 2013, title: 'A 200ª filial', description: 'Inauguração da filial de número 200.', alt: 'Fachada de uma loja Gazin decorada, com movimento na calçada', source: pdf(4) },
  { id: '2014-osmar', year: 2014, title: 'Nova presidência', description: 'Em 2 de janeiro, Osmar Della Valentina assume como segundo presidente da história do Grupo Gazin.', alt: 'Retrato de Osmar Della Valentina sorrindo em seu escritório', source: pdf(4) },
  { id: '2016-ipameri', year: 2016, title: 'Expansão logística', description: 'Inauguração de um Centro de Distribuição e mais sete lojas em Ipameri, Goiás.', alt: 'Vista externa do Centro de Distribuição Gazin', source: pdf(5) },
  { id: '2017-tlg', year: 2017, title: 'Criação da TLG', description: 'Criação da TLG, a transportadora do Grupo Gazin.', alt: 'Escritório amplo com colaboradores em suas estações de trabalho', source: pdf(5) },
  { id: '2018-daniel-na-minha-casa', year: 2018, title: 'Daniel na Minha Casa', description: 'Criação da campanha “Daniel na Minha Casa”.', alt: 'O cantor Daniel com uma família diante de um bolo, em frente a um painel da campanha', source: pdf(5) },
  { id: '2019-mato-grosso', year: 2019, title: 'Marco em Mato Grosso', description: 'O estado de Mato Grosso recebe sua 100ª filial Gazin.', alt: 'Fachada de loja Gazin com três logomarcas', source: pdf(5) },
  { id: '2020-55-anos', year: 2020, title: '55 anos, 55 SUVs', description: 'Lançamento da campanha “55 anos, 55 SUVs”.', alt: 'Carreta com a campanha 55 anos, 55 SUVs estampada', source: pdf(5) },
  { id: '2021-filial-300', year: 2021, title: 'A 300ª filial', description: 'Inauguração da filial de número 300, no Shopping de Porto Velho.', alt: 'Interior de loja com eletrodomésticos e balões azuis e brancos', source: pdf(6) },
  { id: '2022-gilmar', year: 2022, title: 'Terceiro presidente', description: 'Gilmar Alves de Oliveira assume como terceiro presidente da história do Grupo Gazin.', alt: 'Retrato de Gilmar Alves de Oliveira sorrindo, com a bandeira do Brasil ao fundo', source: pdf(6) },
  { id: '2023-encontro-fornecedores', year: 2023, title: 'Encontro de Fornecedores', description: 'Realização do primeiro Encontro de Fornecedores na matriz, em Douradina, Paraná.', alt: 'Auditório lotado diante de um palco com telão', source: pdf(6) },
]

/**
 * Acontecimentos da pág. 7 do PDF, sem data confirmada nem fotografia na pasta.
 * NÃO são exibidos: aguardam validação antes de entrar na linha do tempo.
 */
export const pendingHistoryEvents = [
  { id: 'lojas-radisco', title: 'Lojas Radisco', description: 'O Grupo Gazin anexa as Lojas Radisco como novo negócio.' },
  { id: 'varejo-experience', title: 'Varejo Experience', description: 'Primeiro evento organizado pela Gazin com diversos palestrantes, para discutir o varejo.' },
  { id: 'gazin-bank', title: 'GazinBank', description: 'A Gazin lança seu banco exclusivo, o GazinBank.' },
  { id: 'instituto-mario-gazin', title: 'Instituto Mário Gazin', description: 'Como patrimônio histórico do Grupo, surge o Instituto Mário Gazin.' },
  { id: 'campanha-copa', title: 'Campanha da Copa', description: 'Campanha “Todo Dia é Dia de Hexa”. Não destacada na experiência principal.' },
] as const

/** Composição visual (separada do conteúdo): repete o ciclo ao longo da linha do tempo. */
export type FrameLayout = { size: 'l' | 'm' | 's'; rotation: number; offsetY: number; captionTop?: boolean }
const layoutCycle: FrameLayout[] = [
  { size: 'l', rotation: -4, offsetY: 4 },
  { size: 's', rotation: 3, offsetY: -12, captionTop: true },
  { size: 'm', rotation: -2, offsetY: 10 },
  { size: 'l', rotation: 5, offsetY: -8 },
  { size: 'm', rotation: -3, offsetY: 12, captionTop: true },
  { size: 's', rotation: 4, offsetY: -4 },
]
export const frameLayout = (index: number) => layoutCycle[index % layoutCycle.length]

type Photo = { width: number; height: number }
const photos = historyPhotos as Record<string, Photo | undefined>
export const historyPhoto = (id: string) => {
  const photo = photos[id]
  return photo ? { ...photo, small: `assets/historia/${id}-900.jpg`, large: `assets/historia/${id}-1800.jpg` } : undefined
}
