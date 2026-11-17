// Capítulo 03 · Identidade Verbal.
//
// PROPOSTA EDITORIAL: os textos, atributos, diretrizes, comparações, mensagens e exemplos deste
// arquivo são sugestões para o Manual da Marca e dependem de validação institucional. A única
// referência documentada é o slogan "Sempre fazendo o melhor pra Você!", que consta no manual da
// logomarca Gazin. "Nossa marca, nosso jeito!" é o título editorial deste Manual da Marca e não
// substitui o slogan. Não há números, campanhas históricas nem declarações oficiais aqui.
//
// Para revisar um texto, edite apenas este arquivo: os componentes em src/components/verbal/
// leem tudo daqui.
import { slogan } from './visualIdentity'

export const verbalIntro = {
  title: 'Nossa essência também está nas palavras.',
  text: 'A forma como nos comunicamos expressa quem somos. Na Gazin, cada palavra deve refletir a proximidade com as pessoas, o respeito pelas relações e a confiança construída ao longo da nossa história. Nossa identidade verbal une simplicidade, clareza e humanidade para criar mensagens que informam, aproximam e fortalecem nossa marca em cada ponto de contato.',
}

/** Rótulos que identificam conteúdo proposto (não oficial). */
export const verbalLabels = {
  example: 'Exemplo editorial',
  editorialMessage: 'Mensagem editorial sugerida · não é slogan oficial',
  demonstration: 'Demonstração editorial · não é uma peça oficial publicada',
}

// ── 03.1 Tom de voz ─────────────────────────────────────────────────────────────────────
export type VoiceAttribute = { id: string; number: string; name: string; description: string; practice: string; example: string }
export const voice = {
  text: 'A Gazin se comunica de forma próxima, humana e verdadeira. Nossa voz valoriza a simplicidade, transmite confiança e demonstra respeito por quem está do outro lado da mensagem. Falamos com clareza, entusiasmo e responsabilidade, buscando criar conexões reais com clientes, colaboradores e parceiros. Independentemente do canal, nossa comunicação deve preservar a mesma essência: fazer as pessoas se sentirem acolhidas, respeitadas e valorizadas.',
  concept: 'O tom de voz é a maneira como a Gazin expressa sua personalidade em palavras, reconhecível em qualquer canal, de uma campanha promocional a um comunicado institucional.',
  hint: 'Selecione um atributo',
  // Os exemplos reaproveitam as mensagens "preferir" e de aplicação deste capítulo.
  attributes: [
    { id: 'proximo', number: '01', name: 'Próximo', description: 'Falamos de maneira acessível, criando uma conexão natural com as pessoas.', practice: 'Utilizamos expressões compreensíveis e evitamos formalidades desnecessárias.', example: 'Tem ofertas especiais esperando por você na Gazin. Confira os produtos e aproveite!' },
    { id: 'humano', number: '02', name: 'Humano', description: 'Reconhecemos que nos comunicamos com pessoas, não apenas com consumidores.', practice: 'Demonstramos empatia, respeito e atenção às necessidades de cada público.', example: 'Olá! Vamos ajudar você. Conte um pouco mais sobre o que aconteceu para que possamos verificar a melhor forma de atendimento.' },
    { id: 'claro', number: '03', name: 'Claro', description: 'Transmitimos informações de maneira objetiva, organizada e fácil de compreender.', practice: 'Evitamos complicações, ambiguidades e termos técnicos quando não forem necessários.', example: 'Recebemos sua solicitação e estamos verificando os detalhes. Assim que tivermos uma atualização, vamos informar você.' },
    { id: 'positivo', number: '04', name: 'Positivo', description: 'Valorizamos uma comunicação otimista, acolhedora e motivadora.', practice: 'Destacamos possibilidades, soluções e benefícios reais, sem exageros ou promessas infundadas.', example: 'Trabalhamos todos os dias para evoluir, melhorar nossos processos e oferecer experiências cada vez melhores.' },
    { id: 'confiavel', number: '05', name: 'Confiável', description: 'Nossa comunicação deve transmitir credibilidade e responsabilidade.', practice: 'Utilizamos informações verificáveis, condições transparentes e mensagens coerentes com aquilo que oferecemos.', example: 'Ofertas especiais para você aproveitar. Confira os produtos participantes e as condições da campanha.' },
  ] satisfies VoiceAttribute[],
}

// ── 03.2 Linguagem e estilo ─────────────────────────────────────────────────────────────
export type LanguageExample = { id: string; label: string; avoid: string; prefer: string }
export const language = {
  text: 'Nossa linguagem deve facilitar a comunicação e fortalecer relacionamentos. Buscamos mensagens diretas, naturais e acessíveis, respeitando as características de cada público e situação. Em campanhas, podemos utilizar entusiasmo e criatividade. Em comunicações institucionais, priorizamos clareza e credibilidade. No relacionamento com clientes e colaboradores, valorizamos atenção, empatia e respeito.',
  prefer: ['Frases claras e objetivas.', 'Palavras do cotidiano.', 'Mensagens acolhedoras.', 'Informações completas e transparentes.', 'Benefícios apresentados de forma realista.', 'Chamadas comerciais diretas.', 'Linguagem adaptada ao contexto.'],
  avoid: ['Excesso de formalidade.', 'Termos técnicos desnecessários.', 'Frases excessivamente longas.', 'Promessas exageradas.', 'Informações ambíguas.', 'Linguagem artificial ou robótica.', 'Urgência comercial enganosa.', 'Expressões que possam desrespeitar ou excluir pessoas.'],
  examples: [
    { id: 'comercial', label: 'Comunicação comercial', avoid: 'Prezado consumidor, informamos que determinadas mercadorias encontram-se disponíveis em condições comerciais diferenciadas.', prefer: 'Tem ofertas especiais esperando por você na Gazin. Confira os produtos e aproveite!' },
    { id: 'atendimento', label: 'Atendimento', avoid: 'Sua solicitação encontra-se em processamento. Aguarde novas informações.', prefer: 'Recebemos sua solicitação e estamos verificando os detalhes. Assim que tivermos uma atualização, vamos informar você.' },
    { id: 'institucional', label: 'Comunicação institucional', avoid: 'Nossa organização objetiva maximizar a excelência operacional por meio de estratégias sinérgicas.', prefer: 'Trabalhamos todos os dias para evoluir, melhorar nossos processos e oferecer experiências cada vez melhores.' },
    { id: 'promocional', label: 'Comunicação promocional', avoid: 'Descontos imperdíveis em todos os produtos! Os menores preços do Brasil!', prefer: 'Ofertas especiais para você aproveitar. Confira os produtos participantes e as condições da campanha.' },
  ] satisfies LanguageExample[],
}

// ── 03.3 Slogans e assinaturas ──────────────────────────────────────────────────────────
export const signatures = {
  text: 'As assinaturas da marca sintetizam valores, compromissos e mensagens que acompanham sua comunicação. Sua utilização deve respeitar os materiais oficiais, preservando a redação, a identidade visual e o contexto adequado de aplicação.',
  slogan: {
    text: slogan,
    status: 'Slogan documentado no manual da logomarca Gazin',
    meaning: 'A assinatura expressa o compromisso de buscar sempre o melhor para as pessoas, valorizando o cuidado, a dedicação e a responsabilidade presentes na trajetória da Gazin.',
    meaningLabel: 'Leitura editorial',
    logo: { src: 'assets/logos/gazin-cores-originais-slogan.png', alt: 'Logomarca Gazin com o slogan “Sempre fazendo o melhor pra Você!”, arquivo oficial em cores originais' },
    rule: 'Use sempre os arquivos oficiais da logomarca com slogan, sem redigitar ou alterar a frase (ver 02 · Identidade Visual).',
  },
  editorialTitle: {
    text: 'DNA GAZIN — Nossa marca, nosso jeito!',
    status: 'Título e conceito editorial do Manual da Marca',
    note: 'Nomeia este Manual da Marca digital. Não substitui o slogan institucional da Gazin e não acompanha a logomarca.',
  },
}

// ── 03.4 Expressões e mensagens-chave ───────────────────────────────────────────────────
export type KeyMessage = { id: string; word: string; number: string; axis: string; description: string; phrase: string }
export const keyMessages = {
  text: 'Existem conceitos que acompanham nossa trajetória e ajudam a expressar nossa essência. São ideias ligadas ao trabalho, à confiança, às pessoas, à simplicidade e à evolução. Quando utilizadas com coerência, essas mensagens reforçam a identidade Gazin e contribuem para uma comunicação consistente.',
  concept: 'As mensagens-chave traduzem os valores da Gazin em ideias que orientam diferentes formas de comunicação.',
  messages: [
    { id: 'pessoas', word: 'Pessoas', number: '01', axis: 'Pessoas em primeiro lugar', description: 'Valorizar quem faz parte da nossa história: clientes, colaboradores, parceiros e comunidades.', phrase: 'São as pessoas que dão sentido à nossa história.' },
    { id: 'confianca', word: 'Confiança', number: '02', axis: 'Confiança construída todos os dias', description: 'Transmitir responsabilidade, credibilidade e coerência.', phrase: 'A confiança se constrói em cada atitude.' },
    { id: 'trabalho', word: 'Trabalho', number: '03', axis: 'Trabalho que transforma', description: 'Valorizar a dedicação e o compromisso com resultados.', phrase: 'Cada conquista começa com dedicação.' },
    { id: 'simplicidade', word: 'Simplicidade', number: '04', axis: 'Simplicidade que aproxima', description: 'Demonstrar que a comunicação clara e humana fortalece relações.', phrase: 'Falar de forma simples também é uma forma de cuidar.' },
    { id: 'evolucao', word: 'Evolução', number: '05', axis: 'Evoluir sem perder a essência', description: 'Conectar tradição, inovação e crescimento.', phrase: 'Seguimos em frente, valorizando tudo o que nos trouxe até aqui.' },
    { id: 'conexao', word: 'Conexão', number: '06', axis: 'Crescer juntos', description: 'Reforçar a importância das relações duradouras.', phrase: 'Quando crescemos juntos, nossas conquistas ganham ainda mais significado.' },
  ] satisfies KeyMessage[],
}

// ── 03.5 Exemplos de aplicação ──────────────────────────────────────────────────────────
export type ApplicationFormat = 'social' | 'institutional' | 'internal' | 'support' | 'ecommerce' | 'relationship'
export type ApplicationExample = { id: string; number: string; channel: string; context: string; message: string; guideline: string; format: ApplicationFormat }
export const applications = {
  text: 'Uma identidade verbal consistente precisa estar presente em todos os pontos de contato da marca. Embora a linguagem se adapte ao público, ao canal e ao objetivo da mensagem, sua essência deve permanecer reconhecível.',
  examples: [
    { id: 'redes-sociais', number: '01', channel: 'Redes sociais', format: 'social', context: 'Divulgação de campanha promocional.', message: 'Tem novidade boa chegando na Gazin! 💙 Confira nossas ofertas e encontre o que combina com você. Aproveite as condições especiais dos produtos participantes.', guideline: 'Linguagem próxima, positiva e comercial, com informações claras e sem exageros.' },
    { id: 'institucional', number: '02', channel: 'Comunicação institucional', format: 'institutional', context: 'Valorização da trajetória da empresa.', message: 'Desde 1966, nossa história é construída com trabalho, dedicação e pessoas que acreditam no poder de fazer sempre o melhor. Seguimos evoluindo, valorizando nossas origens e construindo novos caminhos.', guideline: 'Linguagem respeitosa, inspiradora e conectada à história da Gazin.' },
    { id: 'interna', number: '03', channel: 'Comunicação interna', format: 'internal', context: 'Mensagem aos colaboradores.', message: 'Cada conquista da Gazin tem a participação de pessoas que fazem a diferença todos os dias. Obrigado por contribuir com dedicação, compromisso e espírito de equipe para a nossa história.', guideline: 'Linguagem humana, valorizadora e acolhedora.' },
    { id: 'atendimento', number: '04', channel: 'Atendimento ao cliente', format: 'support', context: 'Solicitação de suporte.', message: 'Olá! Vamos ajudar você. Conte um pouco mais sobre o que aconteceu para que possamos verificar a melhor forma de atendimento.', guideline: 'Comunicação clara, respeitosa e orientada à solução.' },
    { id: 'e-commerce', number: '05', channel: 'E-commerce', format: 'ecommerce', context: 'Descrição comercial de produto.', message: 'Mais praticidade para o seu dia a dia. Conheça os recursos deste produto, confira as especificações e escolha a opção ideal para sua necessidade.', guideline: 'Foco em clareza, benefícios verificáveis e informações úteis.' },
    { id: 'relacionamento', number: '06', channel: 'Campanha de relacionamento', format: 'relationship', context: 'Dia do Cliente.', message: 'Hoje é dia de celebrar quem faz parte da nossa história: você! Obrigado pela confiança e por permitir que a Gazin esteja presente em tantos momentos especiais.', guideline: 'Linguagem próxima, afetiva e de reconhecimento.' },
  ] satisfies ApplicationExample[],
}
