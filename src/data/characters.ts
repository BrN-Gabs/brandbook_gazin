// Capítulo · Personagens da Marca (Téo e GI.A).
//
// Fontes: imagem oficial do Téo ("TEO JOINHA FINAL 2026.png", a única pose disponível) e uma
// captura da tela inicial da GI.A (gia.gazin.com.br), da qual foram usados só recortes, sem o nome
// do usuário nem o histórico. Poses oficiais: pasta "Personagens" (TEO/ e GIA/), sem alteração.
// Textos institucionais, atributos e diretrizes são PROPOSTAS editoriais (validação pendente).
// As quatro funções da GI.A são exatamente as que aparecem na captura.
import files from './characterFiles.json' with { type: 'json' }

export type CharacterFile = (typeof files.teo)[number]
const pose = (who: 'teo' | 'gia', id: string) => files[who].find(item => item.id === id)!
export const characterFiles = files

export const charactersIntro = {
  title: 'Diferentes formas de conectar pessoas, marcas e tecnologia.',
  text: 'Os personagens da Gazin ampliam as possibilidades de comunicação e relacionamento da marca. Com personalidades e aplicações próprias, eles ajudam a representar diferentes experiências, desde o contato próximo com nossos clientes até o uso de tecnologias inteligentes para apoiar o trabalho das equipes. Cada personagem possui uma identidade que deve ser preservada, garantindo consistência e reconhecimento em todos os seus pontos de contato.',
  concept: 'Personagens que aproximam. Tecnologia que transforma.',
  proposal: 'Proposta editorial · em validação interna',
}

export const teo = {
  name: 'Téo',
  role: 'Atendimento e relacionamento',
  short: 'Um personagem que representa a proximidade, a simpatia e o cuidado presentes na comunicação de atendimento da Gazin.',
  keywords: ['Proximidade', 'Relacionamento', 'Confiança', 'Atendimento'],
  uses: ['Atendimento', 'Relacionamento', 'Orientações ao cliente', 'Comunicação comercial contextual', 'Peças de varejo'],
  image: { ...pose('teo', 'teo-joinha').preview, alt: 'Téo, personagem 3D da Gazin, sorrindo e fazendo joinha, com camisa polo azul-marinho e a logomarca Gazin no peito' },
  text: 'O Téo representa a proximidade e a simpatia presentes no relacionamento da Gazin com seus clientes. Com uma linguagem visual amigável, expressões positivas e uma apresentação acolhedora, o personagem contribui para tornar a comunicação mais acessível, humana e reconhecível. Sua utilização é especialmente adequada para conteúdos de atendimento, orientações e materiais comerciais que buscam criar uma conexão mais próxima com o público.',
  traits: [
    { title: 'Simpático', text: 'Transmite acolhimento e receptividade.' },
    { title: 'Próximo', text: 'Favorece uma comunicação acessível.' },
    { title: 'Positivo', text: 'Utiliza expressões otimistas e amigáveis.' },
    { title: 'Confiável', text: 'Reforça mensagens claras e responsáveis.' },
    { title: 'Prestativo', text: 'Representa disposição para orientar e ajudar.' },
  ],
  traitsNote: 'Atributos propostos para padronização editorial, a validar internamente.',
  preserve: ['Características faciais', 'Cabelo escuro e olhos castanhos', 'Proporções cartunizadas 3D', 'Expressão amigável', 'Uniforme polo azul-marinho', 'Logomarca Gazin no peito', 'Estilo de renderização'],
  poses: {
    note: 'Poses oficiais do personagem, com fundo transparente. Use a pose que combina com a mensagem.',
  },
  applications: [
    { title: 'Atendimento', text: 'Orientações e mensagens de suporte.' },
    { title: 'Comunicação comercial', text: 'Destaque de informações e oportunidades.' },
    { title: 'Tutoriais', text: 'Explicações de processos e instruções.' },
    { title: 'Relacionamento', text: 'Mensagens de boas-vindas e agradecimento.' },
    { title: 'Varejo', text: 'Peças pontuais em que o personagem ajuda a contextualizar uma informação.' },
  ],
  scenes: [
    { id: 'atendimento', label: 'Atendimento', pose: 'teo-acenando', message: 'Olá! Estou aqui para ajudar você a encontrar as informações de que precisa.', tip: 'Mensagens de boas-vindas e de suporte, com linguagem próxima e orientação clara para o próximo passo.' },
    { id: 'orientacoes', label: 'Orientações', pose: 'teo-orientando', message: 'Confira o passo a passo e acompanhe cada etapa com tranquilidade.', tip: 'Tutoriais e instruções: o Téo apresenta o tema e o conteúdo traz as informações completas.' },
    { id: 'varejo', label: 'Varejo', pose: 'teo-produto', message: 'Tem novidade na loja! Confira as condições com nossos vendedores.', tip: 'Peças pontuais de varejo, sem promessas: preços e condições ficam nas informações comerciais da peça.' },
  ],
  sceneNote: 'Exemplo ilustrativo de aplicação · não é um canal de atendimento.',
}

export const gia = {
  name: 'GI.A',
  role: 'Inteligência artificial Gazin',
  url: 'https://gia.gazin.com.br/',
  short: 'A interface de inteligência artificial da Gazin, desenvolvida para apoiar atividades, facilitar o acesso à informação e contribuir para a produtividade das equipes.',
  keywords: ['Tecnologia', 'Inteligência', 'Produtividade', 'Conhecimento', 'Inovação'],
  uses: ['Pesquisa de informações', 'Criação de conteúdos', 'Análise de materiais', 'Aprendizado', 'Apoio às atividades profissionais'],
  concept: 'Inteligência que conecta, transforma e potencializa.',
  text: 'A GI.A representa a integração da inteligência artificial ao dia a dia da Gazin. Desenvolvida para apoiar diferentes atividades profissionais, a plataforma reúne recursos que facilitam o acesso à informação, a criação de conteúdos, a análise de materiais e o aprendizado. Sua proposta é contribuir para processos mais ágeis, ampliar possibilidades e apoiar as equipes na realização de suas tarefas.',
  interface: { ...files.interface, alt: 'Tela inicial da GI.A: avatar, a assinatura GI.A, “Como posso te ajudar hoje?” e as funções Pesquisar, Criar, Analisar e Aprender' },
  image: { ...pose('gia', 'gia-joinha').preview, alt: 'GI.A, personagem 3D da Gazin, sorrindo, piscando e fazendo joinha, com a camiseta branca G.I.A.' },
  hero: { ...pose('gia', 'gia-tablet').preview, alt: 'GI.A de corpo inteiro, segurando um tablet e apresentando com a outra mão' },
  poses: { note: 'Poses oficiais da personagem, com fundo transparente.' },
  /** The four functions shown in the screenshot (no others). */
  features: [
    { id: 'pesquisar', label: 'Pesquisar', text: 'Encontre dados e respostas rápidas.', demo: 'Ex.: localizar uma informação em documentos e materiais de referência.' },
    { id: 'criar', label: 'Criar', text: 'Textos, e-mails e materiais.', demo: 'Ex.: estruturar o rascunho de um e-mail ou de um comunicado.' },
    { id: 'analisar', label: 'Analisar', text: 'Planilhas, PDFs e relatórios.', demo: 'Ex.: resumir os pontos principais de um relatório em PDF.' },
    { id: 'aprender', label: 'Aprender', text: 'Tire dúvidas e estude um tema.', demo: 'Ex.: explicar um conceito em etapas simples.' },
  ],
  featuresNote: 'Ilustrações conceituais: não são respostas da plataforma. A disponibilidade de cada recurso pode variar por usuário e setor.',
  pending: 'A interface é a tela inicial da plataforma; a personagem GI.A é apresentada pelas poses oficiais.',
}

export const guidelines = {
  general: 'Personagens são elementos reconhecíveis da comunicação: suas características precisam permanecer consistentes em todos os formatos e canais.',
  rules: [
    { title: 'Proporções', text: 'Não esticar, comprimir ou alterar proporções.' },
    { title: 'Cores', text: 'Preservar as cores originais, sem recolorações.' },
    { title: 'Expressões', text: 'Usar versões compatíveis com o contexto da comunicação.' },
    { title: 'Uniforme', text: 'No Téo, preservar o uniforme institucional e a logomarca.' },
    { title: 'Integridade', text: 'Não alterar características faciais, estrutura ou elementos oficiais.' },
    { title: 'Qualidade', text: 'Usar arquivos com resolução adequada a cada aplicação.' },
    { title: 'Contraste', text: 'Garantir que o personagem se destaque do fundo.' },
    { title: 'Espaçamento', text: 'Preservar área de respiro e evitar sobreposições.' },
    { title: 'Contexto', text: 'Aplicar cada personagem em situações coerentes com sua finalidade.' },
  ],
  compare: {
    teo: {
      correct: ['Imagem oficial', 'Uniforme preservado', 'Proporções naturais do personagem', 'Boa legibilidade', 'Contexto coerente de atendimento'],
      wrong: ['Rosto e cores alterados', 'Corpo e logomarca esticados', 'Efeitos exagerados (sombra, brilho, desfoque)', 'Aplicação em contexto incompatível'],
    },
    gia: {
      correct: ['Identidade oficial', 'Avatar original', 'Interface apresentada fielmente', 'Uso ligado à tecnologia e à inteligência artificial'],
      wrong: ['Cores originais substituídas', 'Interface deformada', 'Apresentação como inteligência humana', 'Promessa de resultados garantidos'],
    },
    note: 'As versões incorretas existem só na tela, para fins didáticos, e não estão disponíveis para download.',
  },
}

export const library = {
  title: 'Biblioteca de Personagens Gazin',
  text: 'Consulte os personagens e acesse os arquivos oficiais para utilização nos materiais de comunicação.',
  pending: {
    teo: [] as string[],
    gia: ['Logo GI.A em arquivo vetorial', 'Materiais de apresentação'],
  },
}
