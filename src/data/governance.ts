// Capítulo 10 · Governança da Marca.
//
// Duas naturezas de conteúdo, sempre identificadas no site:
//   · REGRA DOCUMENTADA — sustentada pelo manual da logomarca ou pelo Manual de Merchandising
//     (com a página de referência);
//   · MODELO DE REFERÊNCIA — proposta editorial de organização (responsabilidades, fluxo de
//     aprovação, manutenção) que depende de validação interna. Não define autoridades formais,
//     prazos, sistemas, níveis hierárquicos nem registros de revisão.
import { pages, type MisuseId } from './visualIdentity'

export const governanceIntro = {
  /** Subtítulo do capítulo (síntese editorial da introdução, validação pendente). */
  title: 'Consistência que preserva a nossa identidade.',
  text: 'A força de uma marca está na consistência de sua identidade. Na Gazin, preservar nossos elementos visuais, nossa linguagem e nossos princípios de comunicação é essencial para fortalecer o reconhecimento e a credibilidade construídos ao longo da nossa história. A governança da marca reúne orientações para promover o uso correto de sua identidade e manter uma comunicação alinhada em todos os pontos de contato.',
  highlight: 'Cuidar da nossa marca é preservar tudo o que ela representa.',
  highlightLabel: 'Síntese editorial do capítulo',
}

export const sourceLabels = {
  documented: 'Regra documentada',
  proposed: 'Modelo de referência',
}
/** "Manual da logomarca · pág. 20–21" */
export const logoManualPage = (page: { printed: string }) => `Manual da logomarca · pág. ${page.printed}`

// ── 10.1 Responsabilidades ─────────────────────────────────────────────────────────────
export type Role = { id: string; number: string; name: string; duties: string[] }
export const responsibilities = {
  summary: 'Quem contribui, no dia a dia, para preservar a identidade Gazin.',
  text: 'A identidade da Gazin é construída e fortalecida diariamente por todos que representam a empresa. Sua gestão depende de alinhamento, responsabilidade e respeito aos padrões estabelecidos. Cada área contribui para garantir que a marca seja aplicada de maneira consistente, preservando sua integridade visual e institucional.',
  center: 'Gestão da marca',
  note: 'Responsabilidades de referência para organizar o capítulo. Não representam um organograma nem atribuem autoridade formal de aprovação; verifique os documentos e processos internos existentes.',
  roles: [
    { id: 'marketing', number: '01', name: 'Marketing e Comunicação', duties: ['Orientar a comunicação institucional da marca.', 'Zelar pela consistência da identidade visual e verbal.', 'Organizar e disponibilizar materiais oficiais.', 'Avaliar a conformidade de peças de comunicação.', 'Contribuir para a atualização das diretrizes de marca.'] },
    { id: 'trade', number: '02', name: 'Trade Marketing', duties: ['Coordenar a aplicação de materiais promocionais no ponto de venda.', 'Orientar a execução visual de campanhas nas lojas.', 'Garantir alinhamento com os materiais aprovados.', 'Acompanhar a padronização das ações de merchandising.'] },
    { id: 'liderancas', number: '03', name: 'Gestores e Lideranças', duties: ['Orientar as equipes quanto à utilização da marca.', 'Promover o cumprimento dos padrões aplicáveis.', 'Encaminhar dúvidas e solicitações aos responsáveis.', 'Identificar necessidades de atualização ou correção.'] },
    { id: 'colaboradores', number: '04', name: 'Colaboradores', duties: ['Utilizar corretamente os materiais oficiais.', 'Preservar logotipos e elementos institucionais.', 'Evitar modificações não autorizadas.', 'Consultar as diretrizes antes de produzir materiais.'] },
    { id: 'parceiros', number: '05', name: 'Fornecedores e Parceiros', duties: ['Utilizar os arquivos oficiais disponibilizados.', 'Respeitar os padrões de aplicação.', 'Encaminhar materiais para validação quando exigida.', 'Não modificar a identidade Gazin sem autorização.'] },
  ] satisfies Role[],
}

// ── 10.2 Fluxo de aprovação ────────────────────────────────────────────────────────────
export type Step = { id: string; number: string; name: string; icon: 'inbox' | 'pen' | 'checklist' | 'stamp' | 'send'; text: string; items?: string[] }
export const workflow = {
  summary: 'Um caminho organizado da solicitação à publicação.',
  text: 'A utilização consistente da marca depende de processos claros de criação, conferência e validação. Antes da publicação ou produção de um material, é importante verificar sua adequação à identidade visual, à linguagem institucional e às diretrizes aplicáveis.',
  note: 'Modelo editorial de boas práticas, não um procedimento corporativo vigente. Não define prazos, sistemas, níveis de autorização nem quem aprova.',
  steps: [
    { id: 'solicitacao', number: '01', name: 'Solicitação', icon: 'inbox', text: 'A área solicitante apresenta a necessidade de comunicação.', items: ['Objetivo do material', 'Público', 'Canal de divulgação', 'Formato', 'Prazo necessário', 'Conteúdo e referências'] },
    { id: 'criacao', number: '02', name: 'Criação', icon: 'pen', text: 'A equipe responsável desenvolve o material utilizando os arquivos oficiais e as diretrizes do Manual da Marca.' },
    { id: 'conferencia', number: '03', name: 'Conferência', icon: 'checklist', text: 'Verificação dos principais pontos antes de seguir para validação.', items: ['Aplicação da logomarca', 'Uso das cores', 'Tipografia', 'Linguagem', 'Informações comerciais', 'Qualidade visual', 'Adequação ao canal'] },
    { id: 'validacao', number: '04', name: 'Validação', icon: 'stamp', text: 'O material é encaminhado aos responsáveis pela aprovação, conforme o fluxo interno aplicável. Se forem necessárias alterações, retorna para ajustes.' },
    { id: 'publicacao', number: '05', name: 'Publicação ou produção', icon: 'send', text: 'Após a aprovação necessária, o material segue para publicação, impressão, instalação ou distribuição.' },
  ] satisfies Step[],
  decision: { question: 'Aprovado?', yes: 'Sim: segue para publicação ou produção.', no: 'Não: retorna à criação para ajustes.' },
}

// ── 10.3 Diretrizes de utilização ──────────────────────────────────────────────────────
export type Rule = { title: string; text: string; source?: string }
export const usage = {
  summary: 'As regras essenciais e onde consultar cada detalhe.',
  text: 'A utilização correta da identidade Gazin fortalece seu reconhecimento e garante consistência entre os materiais institucionais, comerciais e internos. Todos os elementos da marca devem ser aplicados de acordo com suas especificações, respeitando versões oficiais, proporções, cores e áreas de proteção.',
  groups: [
    {
      id: 'visual', title: 'Identidade visual', lead: 'Regras de aplicação da logomarca.',
      rules: [
        { title: 'Logomarca', text: 'Utilizar sempre os arquivos oficiais, preservando geometria, proporção, cores autorizadas, área de segurança e legibilidade.', source: logoManualPage(pages.logomarca) },
        { title: 'Cores', text: 'Respeitar as especificações do manual e diferenciar as cores de impressão da logomarca das cores da interface digital deste Manual da Marca.', source: logoManualPage(pages.cores) },
        { title: 'Tipografia', text: 'Renfrew no nome GAZIN e Gotham Bold inclinada no slogan, como parte da logomarca. Não reconstruir a logomarca com fontes comuns.', source: logoManualPage(pages.alfabeto) },
      ] satisfies Rule[],
      links: [{ href: '#identidade-visual', label: '02 · Identidade Visual' }],
    },
    {
      id: 'verbal', title: 'Identidade verbal', lead: 'Consistência da linguagem e das mensagens.',
      rules: [
        { title: 'Integridade da marca', text: 'Não alterar a logomarca, o slogan ou os elementos institucionais. O manual determina que a logomarca não deve sofrer variações gráficas em nenhuma aplicação.', source: logoManualPage(pages.logomarca) },
        { title: 'Linguagem', text: 'Seguir o tom de voz e as diretrizes de linguagem propostos no capítulo de Identidade Verbal.' },
      ] satisfies Rule[],
      links: [{ href: '#identidade-verbal', label: '03 · Identidade Verbal' }],
    },
    {
      id: 'aplicacoes', title: 'Aplicações', lead: 'Uso correto em materiais digitais, impressos e físicos.',
      rules: [
        { title: 'Formatos', text: 'Adaptar a comunicação aos diferentes formatos sem comprometer a identidade.' },
        { title: 'Materiais oficiais', text: 'Utilizar arquivos e templates disponibilizados pelas áreas responsáveis. No ponto de venda, apenas materiais oficiais fornecidos pelo Marketing ou Trade Marketing.', source: 'Manual de Merchandising · pág. 70' },
      ] satisfies Rule[],
      links: [{ href: '#comunicacao-digital', label: '06 · Comunicação Digital' }, { href: '#comunicacao-fisica', label: '07 · Comunicação Física' }],
    },
  ],
}

// ── 10.4 Usos incorretos ───────────────────────────────────────────────────────────────
export const misuse = {
  summary: 'O que compromete a integridade da identidade Gazin.',
  text: 'O uso incorreto dos elementos da marca pode prejudicar sua legibilidade, seu reconhecimento e a consistência da comunicação. Por isso, é fundamental respeitar as versões oficiais e evitar alterações que descaracterizem a identidade Gazin.',
  rules: [
    { title: 'Distorção', text: 'Não esticar, comprimir ou alterar a proporção da logomarca.', source: logoManualPage(pages.naoRecomendados) },
    { title: 'Alteração de cores', text: 'Não substituir arbitrariamente as cores originais da marca.', source: logoManualPage(pages.naoRecomendados) },
    { title: 'Modificação tipográfica', text: 'Não alterar ou recriar o nome Gazin com outras fontes.', source: logoManualPage(pages.alfabeto) },
    { title: 'Efeitos não autorizados', text: 'Não adicionar sombras, contornos, texturas ou efeitos que descaracterizem a aplicação oficial.', source: logoManualPage(pages.logomarca) },
    { title: 'Área de segurança', text: 'Não posicionar textos ou elementos dentro da área mínima de proteção.', source: logoManualPage(pages.seguranca) },
    { title: 'Baixa legibilidade', text: 'Não utilizar a marca em condições que comprometam sua leitura, como abaixo do tamanho mínimo.', source: logoManualPage(pages.reducoes) },
    { title: 'Alteração da composição', text: 'Não reorganizar elementos da logomarca nem modificar sua geometria.', source: logoManualPage(pages.naoRecomendados) },
  ] satisfies Rule[],
  /** Casos do comparador: os mesmos exemplos documentados no capítulo 02 (pág. 20–21 e reduções). */
  comparisons: [
    { id: 'esticar', label: 'Proporção' },
    { id: 'cor', label: 'Cores' },
    { id: 'invasao', label: 'Área de segurança' },
    { id: 'inclinacao', label: 'Composição' },
    { id: 'reducao', label: 'Legibilidade' },
  ] satisfies { id: MisuseId; label: string }[],
  note: 'Os exemplos incorretos são demonstrações na tela, feitas a partir do arquivo oficial, apenas para fins educativos. Nunca são oferecidos para download.',
}

// ── 10.5 Manutenção ────────────────────────────────────────────────────────────────────
export const maintenance = {
  summary: 'Como a identidade evolui sem perder a consistência.',
  text: 'A identidade de uma marca precisa manter sua consistência mesmo diante de novas necessidades e transformações. A atualização das diretrizes permite incorporar aplicações, tecnologias e formatos de comunicação sem perder os elementos que tornam a Gazin reconhecível. Por isso, a manutenção do Manual da Marca deve considerar organização, rastreabilidade e validação das alterações.',
  principles: [
    { title: 'Centralização', text: 'Manter os materiais oficiais organizados e acessíveis em uma fonte de referência.' },
    { title: 'Versionamento', text: 'Identificar revisões dos documentos por meio de versões ou datas.' },
    { title: 'Revisão', text: 'Avaliar periodicamente se as orientações continuam adequadas às necessidades da comunicação.' },
    { title: 'Aprovação', text: 'Validar alterações conforme os responsáveis definidos pela empresa.' },
    { title: 'Distribuição', text: 'Garantir que as equipes tenham acesso às versões vigentes dos materiais.' },
    { title: 'Arquivamento', text: 'Preservar versões anteriores quando necessário para consulta e histórico institucional.' },
  ] satisfies Rule[],
  /** Controle documental: apenas o que está documentado (sem números de revisão ou datas de aprovação). */
  records: [
    { document: 'Manual da logomarca Gazin', reference: 'Identificado no arquivo como edição 2024', status: 'Documento de referência disponibilizado neste Manual da Marca' },
    { document: 'Manual de Merchandising Gazin', reference: 'Sem data ou versão identificada no documento', status: 'Documento de referência disponibilizado neste Manual da Marca' },
  ],
  historyColumns: ['Data', 'Documento', 'Versão', 'Descrição da alteração', 'Responsável', 'Situação da validação'],
  /** Histórico de atualizações: vazio até haver registros oficiais (não preencher com dados fictícios). */
  history: [] as { date: string; document: string; version: string; description: string; owner: string; status: string }[],
  emptyHistory: 'O histórico de atualizações ainda será disponibilizado pelas áreas responsáveis.',
}

// ── Documentos ─────────────────────────────────────────────────────────────────────────
export type BrandDocument = { id: string; name: string; description: string; topics: string[]; href: string; fileName: string; pages: number; sizeMB: number; edition?: string }
export const documents = {
  title: 'Documentos e Diretrizes da Marca',
  description: 'Consulte os materiais de referência para preservar a identidade e a padronização da comunicação Gazin.',
  items: [
    {
      id: 'logomarca', name: 'Manual da logomarca Gazin', edition: '2024',
      description: 'Referência para a construção e a aplicação da logomarca.',
      topics: ['Logomarca', 'Cores', 'Tipografia', 'Aplicações', 'Área de segurança', 'Reduções', 'Usos incorretos'],
      href: 'assets/documentos/manual-da-logomarca-gazin.pdf', fileName: 'Manual-da-Logomarca-Gazin.pdf', pages: 16, sizeMB: 2.4,
    },
    {
      id: 'merchandising', name: 'Manual de Merchandising Gazin',
      description: 'Referência para a comunicação física e a padronização das lojas.',
      topics: ['Comunicação física', 'Padronização das lojas', 'Materiais de PDV', 'Exposição dos produtos', 'Ambientação', 'Sinalização'],
      // Mesmo arquivo do capítulo 07 (sem duplicar o PDF).
      href: 'assets/merchandising/manual-merchandising-gazin.pdf', fileName: 'Manual-de-Merchandising-Gazin.pdf', pages: 118, sizeMB: 75.9,
    },
  ] satisfies BrandDocument[],
}
