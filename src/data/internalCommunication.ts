// Capítulo 08 · Comunicação Interna.
//
// PROPOSTA EDITORIAL (validação institucional pendente): textos, diretrizes e exemplos não são
// políticas aprovadas. Comunicados, campanhas e vídeos internos reais NÃO são publicados aqui sem
// autorização (podem conter informações restritas ou pessoais): as demonstrações são didáticas,
// fictícias e identificadas como tais. Materiais oficiais usados: logo Gazin e logo TV Gazin
// (pasta oficial de logos) e fotografias demonstrativas do capítulo 04.
import { photos } from './photoVideo'
import templateSizes from './internalTemplates.json' with { type: 'json' }

export type TemplateFile = { format: string; path: string; name: string; bytes: number; kind?: string }
const tpl = (format: string, name: string, kind?: string): TemplateFile => ({ format, name, kind, path: `assets/comunicacao-interna/modelos/${name}`, bytes: (templateSizes as Record<string, number>)[name] })

export const internalIntro = {
  title: 'A comunicação que aproxima pessoas e fortalece nossa cultura.',
  text: 'A comunicação interna é essencial para conectar pessoas, compartilhar informações e fortalecer a cultura Gazin. Por meio de mensagens claras, conteúdos relevantes e iniciativas que valorizam nossos colaboradores, construímos um ambiente de maior integração, reconhecimento e pertencimento. Cada canal e material representa uma oportunidade de transmitir nossos valores e reforçar a identidade que nos une.',
}

export const internalLabels = {
  demo: 'Exemplo didático · conteúdo fictício',
  pending: 'Pendente de disponibilização',
}

export const internalAssets = {
  gazin: { src: 'assets/logos/gazin-fundo-escuro.png', width: 3034, height: 895 },
  gazinLight: { src: 'assets/logos/gazin-cores-originais.png', width: 2974, height: 835 },
  tvGazin: { src: 'assets/marcas/previa/tv-gazin.png' },
}

export type Item = { title: string; text: string }

// ── 08.1 TV Gazin ──────────────────────────────────────────────────────────────────────
export const tv = {
  summary: 'Vídeos e informativos para as telas internas, com a identidade Gazin.',
  text: 'A comunicação audiovisual aproxima informações do cotidiano dos colaboradores e torna as mensagens institucionais mais dinâmicas. Por meio de vídeos, informativos e conteúdos corporativos, a Gazin pode compartilhar novidades, reconhecer conquistas e fortalecer a conexão entre suas equipes.',
  scope: 'A TV Gazin também tem conteúdos para o público externo. Este capítulo trata só das aplicações de comunicação interna.',
  types: [
    { id: 'informativos', title: 'Informativos internos', text: 'Divulgação de novidades e informações relevantes para colaboradores.', screen: { kicker: 'Informativo interno', title: 'Novidades da semana', line: 'Mensagens curtas, uma ideia por tela.' } },
    { id: 'reconhecimento', title: 'Reconhecimento', text: 'Valorização de pessoas, equipes e conquistas.', screen: { kicker: 'Reconhecimento', title: 'Conquistas que merecem ser celebradas', line: 'Pessoas em destaque, com respeito e autorização.' } },
    { id: 'cultura', title: 'Cultura organizacional', text: 'Conteúdos que reforçam os valores, a história e a identidade Gazin.', screen: { kicker: 'Cultura Gazin', title: 'Nossos valores no dia a dia', line: 'Histórias reais contadas com simplicidade.' } },
    { id: 'treinamentos', title: 'Treinamentos', text: 'Orientações e conteúdos educativos relacionados ao ambiente profissional.', screen: { kicker: 'Treinamento', title: 'Aprender juntos, passo a passo', line: 'Instruções claras e legendas quando necessário.' } },
    { id: 'eventos', title: 'Eventos corporativos', text: 'Cobertura de encontros, iniciativas internas e acontecimentos institucionais.', screen: { kicker: 'Eventos internos', title: 'Momentos que nos aproximam', line: 'Data, local e orientações em destaque.' } },
  ],
  guidelines: ['Utilizar a identidade visual oficial da Gazin.', 'Preservar as proporções da logomarca.', 'Priorizar textos curtos e legíveis.', 'Utilizar imagens de qualidade.', 'Manter ritmo adequado.', 'Garantir boa qualidade de áudio.', 'Utilizar legendas quando necessário.', 'Evitar excesso de elementos gráficos simultâneos.', 'Adaptar os conteúdos ao contexto de exibição.'],
  formats: 'Para telas horizontais, a referência é a composição em 16:9. Outros formatos seguem os dispositivos e canais utilizados: nem todos os monitores internos têm a mesma resolução.',
  demoNote: 'Demonstração animada de uma tela interna. Não é um vídeo da TV Gazin: os textos são exemplos.',
}

// ── 08.2 Comunicados corporativos ──────────────────────────────────────────────────────
export const notices = {
  summary: 'Informações importantes com título claro, hierarquia e identidade.',
  text: 'Os comunicados corporativos têm a função de transmitir informações importantes de maneira clara, objetiva e confiável. Sua apresentação deve facilitar a leitura, destacar o assunto principal e preservar a identidade institucional da Gazin, independentemente do canal utilizado.',
  types: [
    { title: 'Comunicados gerais', text: 'Informações destinadas a diferentes equipes e unidades.' },
    { title: 'Avisos operacionais', text: 'Orientações relacionadas a processos, horários e procedimentos.' },
    { title: 'Informativos institucionais', text: 'Divulgação de acontecimentos, novidades e iniciativas corporativas.' },
    { title: 'Comunicados de eventos', text: 'Informações relacionadas a encontros, treinamentos e atividades internas.' },
    { title: 'Mensagens de reconhecimento', text: 'Comunicações que valorizam pessoas, equipes e conquistas.' },
  ] satisfies Item[],
  structure: [
    { title: 'Identificação institucional', text: 'Logomarca oficial da Gazin, conforme o padrão do material.' },
    { title: 'Título', text: 'Assunto principal do comunicado.' },
    { title: 'Contexto', text: 'Breve explicação da informação.' },
    { title: 'Orientações', text: 'Detalhes e instruções necessárias.' },
    { title: 'Data e informações complementares', text: 'Dados relevantes para compreensão ou execução.' },
    { title: 'Área responsável', text: 'Quando pertinente e conforme o procedimento interno aplicável.' },
  ] satisfies Item[],
  language: ['Utilizar títulos objetivos.', 'Priorizar frases curtas.', 'Evitar ambiguidades.', 'Destacar informações importantes.', 'Preservar o tom profissional.', 'Revisar ortografia e gramática.', 'Garantir que instruções estejam completas.', 'Evitar linguagem excessivamente burocrática.'],
  /** Fictitious notice (same content in both versions). */
  example: {
    title: 'Novo agendamento da sala de reuniões',
    context: 'A partir da próxima semana, as reservas da sala de reuniões passam a ser feitas pela agenda compartilhada da equipe.',
    steps: ['Acesse a agenda compartilhada.', 'Escolha o horário disponível.', 'Informe o assunto e o número de participantes.'],
    date: 'Válido a partir de [data] · Dúvidas: [canal de contato]',
    area: '[Área responsável]',
  },
  bad: {
    title: 'ATENÇÃO!!! INFORMAÇÃO IMPORTANTE PARA TODOS!!!',
    body: 'Informamos que conforme alinhamentos realizados anteriormente e considerando as necessidades verificadas no decorrer do período, a partir da próxima semana as reservas da sala de reuniões deverão obrigatoriamente passar a ser realizadas por meio da agenda compartilhada da equipe, devendo os interessados acessar a referida agenda, selecionar o horário que estiver disponível, bem como informar o assunto da reunião e o número de participantes, ficando desde já cientes de que solicitações realizadas por outros meios NÃO SERÃO CONSIDERADAS!!!',
  },
  compare: {
    bad: ['Título pouco claro', 'Texto extenso', 'Informações sem hierarquia', 'Destaques excessivos', 'Espaçamento inadequado'],
    good: ['Título claro', 'Texto objetivo', 'Boa hierarquia', 'Destaques discretos', 'Informações organizadas'],
  },
  templatesNote: 'Modelo proposto com a estrutura acima, em validação. Também está na Biblioteca de materiais (Materiais Institucionais Internos).',
}

// ── 08.3 Campanhas para colaboradores ──────────────────────────────────────────────────
export const campaigns = {
  summary: 'Reconhecimento, integração e cultura, com linguagem humana.',
  text: 'As campanhas internas são oportunidades de aproximar equipes, valorizar conquistas e reforçar os princípios que fazem parte da cultura Gazin. Sua comunicação deve combinar mensagens relevantes, linguagem humana e identidade visual consistente, criando experiências que incentivem a participação e fortaleçam o sentimento de pertencimento.',
  categories: [
    { title: 'Reconhecimento', text: 'Iniciativas destinadas a valorizar colaboradores e equipes.' },
    { title: 'Integração', text: 'Ações que promovam a aproximação entre pessoas e áreas.' },
    { title: 'Cultura Gazin', text: 'Conteúdos relacionados aos valores, à história e à identidade da empresa.' },
    { title: 'Desenvolvimento', text: 'Campanhas voltadas à aprendizagem e ao aprimoramento profissional.' },
    { title: 'Saúde e bem-estar', text: 'Ações relacionadas à qualidade de vida e ao cuidado com as pessoas.' },
    { title: 'Eventos internos', text: 'Comunicação de encontros, celebrações e iniciativas corporativas.' },
  ] satisfies Item[],
  guidelines: ['Valorizar pessoas.', 'Utilizar mensagens claras.', 'Preservar o respeito e a inclusão.', 'Aplicar a identidade visual adequada.', 'Utilizar fotografias autênticas.', 'Manter consistência entre formatos.', 'Adaptar a linguagem ao público interno.', 'Evitar campanhas excessivamente poluídas.'],
  /** Neutral editorial demonstrations: no real campaign names, nothing claimed as done. */
  gallery: [
    { id: 'reconhecimento', category: 'Reconhecimento', title: 'Peça de reconhecimento', headline: 'Quem faz a diferença merece ser lembrado.', text: 'Foto autêntica, mensagem curta e o nome da pessoa ou da equipe em destaque, com autorização.', photo: photos.navy },
    { id: 'integracao', category: 'Integração', title: 'Peça de integração', headline: 'Juntos, somos ainda mais fortes.', text: 'Convite claro, data e local em destaque e linguagem acolhedora para todas as áreas.', photo: photos.green },
    { id: 'institucional', category: 'Cultura Gazin', title: 'Peça institucional interna', headline: 'Nossos valores no dia a dia.', text: 'Um valor por peça, com exemplo prático e identidade Gazin preservada.', photo: photos.white },
  ],
  galleryNote: 'Demonstrações editoriais com fotografias demonstrativas (capítulo Fotografia e Vídeo). Não representam campanhas realizadas.',
}

// ── 08.4 Materiais institucionais internos ─────────────────────────────────────────────
export const materials = {
  summary: 'Apresentações, documentos e relatórios organizados e consistentes.',
  text: 'Os materiais institucionais internos devem transmitir organização, clareza e consistência visual. Apresentações, documentos, relatórios e peças de apoio precisam respeitar a identidade Gazin, valorizando a informação e facilitando a comunicação entre equipes e áreas.',
  types: [
    { title: 'Apresentações corporativas', text: 'Materiais utilizados em reuniões, treinamentos e encontros internos.' },
    { title: 'Documentos institucionais', text: 'Comunicados, orientações e documentos administrativos.' },
    { title: 'Relatórios', text: 'Materiais com indicadores, informações e resultados.' },
    { title: 'Templates internos', text: 'Modelos reutilizáveis para diferentes necessidades de comunicação.' },
    { title: 'Materiais de eventos', text: 'Peças de apoio para encontros e ações internas.' },
  ] satisfies Item[],
  guidelines: [
    { title: 'Identidade visual', text: 'Preservar cores, tipografia e logomarca.' },
    { title: 'Organização', text: 'Utilizar hierarquia clara e espaçamento adequado.' },
    { title: 'Legibilidade', text: 'Garantir textos e elementos gráficos fáceis de compreender.' },
    { title: 'Consistência', text: 'Manter unidade entre documentos do mesmo tipo.' },
    { title: 'Qualidade', text: 'Utilizar imagens, gráficos e elementos visuais com resolução adequada.' },
    { title: 'Atualização', text: 'Priorizar versões vigentes e materiais aprovados.' },
  ] satisfies Item[],
  mockups: [
    { id: 'apresentacao', label: 'Apresentação' },
    { id: 'documento', label: 'Documento' },
    { id: 'relatorio', label: 'Relatório' },
  ],
  mockupNote: 'Mockups de estrutura, com textos de exemplo: não são arquivos oficiais.',
  /**
   * Proposed templates generated by scripts/generate-internal-templates.mjs (official logo,
   * palette and fonts; placeholder texts only). An entry with no `files` shows "pendente".
   */
  library: [
    { id: 'apresentacao', name: 'Modelo de apresentação corporativa', category: 'Apresentações', description: 'Capa, divisória, conteúdo, conteúdo com imagem, pontos-chave e encerramento, em 16:9.', files: [tpl('PPTX', 'modelo-apresentacao-corporativa-gazin.pptx')] },
    { id: 'documento', name: 'Modelo de documento institucional', category: 'Documentos', description: 'Cabeçalho com a logomarca, título, área, data, versão, seções e assinatura.', files: [tpl('DOCX', 'modelo-documento-institucional-gazin.docx')] },
    { id: 'comunicado', name: 'Modelo de comunicado interno', category: 'Comunicados', description: 'As seis partes do comunicado (Comunicados Corporativos), da logomarca à área responsável.', files: [tpl('DOCX', 'modelo-comunicado-interno-gazin.docx'), tpl('PDF', 'modelo-comunicado-interno-gazin.pdf')] },
    { id: 'relatorio', name: 'Modelo de relatório', category: 'Relatórios', description: 'Apresentação com indicadores, gráfico editável e conclusões, e planilha com atingimento calculado.', files: [tpl('PPTX', 'modelo-relatorio-gazin.pptx'), tpl('XLSX', 'modelo-relatorio-gazin.xlsx')] },
    { id: 'eventos', name: 'Kit de materiais de eventos', category: 'Eventos', description: 'Tela de abertura 16:9, sinalização direcional A4 e crachá.', files: [tpl('PDF', 'kit-materiais-eventos-gazin.pdf'), tpl('PNG', 'kit-materiais-eventos-gazin-png.zip', 'ZIP')] },
  ] satisfies { id: string; name: string; category: string; description: string; files: TemplateFile[] }[],
  libraryNote: 'Modelos propostos pelo Manual da Marca, em validação: os textos entre colchetes são campos a preencher. Use as fontes Plus Jakarta Sans e Inter (gratuitas, SIL OFL); sem elas, o Office aplica fontes substitutas.',
}

// ── 08.5 Linguagem interna ─────────────────────────────────────────────────────────────
export const language = {
  summary: 'Mensagens claras, respeitosas e próximas para todas as equipes.',
  text: 'A linguagem utilizada na comunicação interna deve refletir os valores e a personalidade da Gazin. Buscamos mensagens claras, respeitosas e próximas, capazes de informar, orientar e valorizar as pessoas. Independentemente do assunto, a comunicação deve preservar a confiança e favorecer a compreensão.',
  attributes: [
    { title: 'Clara', text: 'Transmitir informações de maneira simples e objetiva.' },
    { title: 'Respeitosa', text: 'Valorizar as pessoas e suas diferentes realidades.' },
    { title: 'Próxima', text: 'Utilizar uma linguagem humana e acessível.' },
    { title: 'Confiável', text: 'Compartilhar informações verificadas e coerentes.' },
    { title: 'Positiva', text: 'Valorizar soluções, oportunidades e reconhecimento.' },
  ] satisfies Item[],
  prefer: ['Frases objetivas.', 'Informações organizadas.', 'Linguagem acessível.', 'Orientações claras.', 'Tom respeitoso.', 'Mensagens acolhedoras.'],
  avoid: ['Excesso de formalidade.', 'Termos técnicos desnecessários.', 'Mensagens ambíguas.', 'Informações incompletas.', 'Linguagem autoritária sem necessidade.', 'Excesso de letras maiúsculas.', 'Mensagens que possam gerar interpretações equivocadas.'],
  examples: [
    { id: 'orientacao', number: '01', title: 'Orientação interna', avoid: 'Solicitamos a observância integral dos procedimentos supracitados.', prefer: 'Confira as orientações e siga os procedimentos indicados.', why: 'Troca termos formais ("observância", "supracitados") por um convite direto à ação.' },
    { id: 'treinamento', number: '02', title: 'Comunicado de treinamento', avoid: 'Informamos a obrigatoriedade de comparecimento dos envolvidos na capacitação supramencionada.', prefer: 'O treinamento será realizado na data informada. Confira as orientações e organize sua participação.', why: 'A informação principal vem primeiro e a orientação fica clara, sem tom de imposição.' },
    { id: 'reconhecimento', number: '03', title: 'Reconhecimento', avoid: 'A organização manifesta reconhecimento pelo desempenho operacional apresentado.', prefer: 'Parabéns pelo trabalho e pela dedicação! Cada conquista é resultado do esforço de pessoas que fazem a diferença.', why: 'Fala com as pessoas, não sobre elas, e valoriza o esforço com proximidade.' },
    { id: 'processo', number: '04', title: 'Atualização de processo', avoid: 'Os procedimentos foram alterados, devendo todos se adequar imediatamente.', prefer: 'Atualizamos algumas orientações do processo. Confira o que mudou e como aplicar as novas etapas no dia a dia.', why: 'Explica a mudança e mostra o caminho, em vez de só exigir adequação.' },
  ],
  examplesNote: 'Propostas didáticas: não são comunicados reais da empresa.',
}
