# Capítulo 03 · Identidade Verbal

O capítulo foi preenchido com a proposta editorial. **Todos os conteúdos, exceto o slogan, aguardam validação institucional.** Por isso o capítulo está marcado como `status: 'draft'` em `brandChapters.ts`; esse status não aparece no site.

## Estrutura (preservada)

- A numeração (03.1 a 03.5), os IDs (`#identidade-verbal-1` a `#identidade-verbal-5`), o índice do capítulo e o menu global foram mantidos.
- O layout continua o mesmo, em linhas: número grande, título, texto, fundo branco e divisórias finas.
- **Desktop:** cada subtópico alterna entre o visual na coluna da direita e o visual na largura toda, abaixo do texto.
- **Celular e tablet:** uma coluna, sem rolagem lateral.
- **Introdução:** o título de apoio "Nossa essência também está nas palavras." e o texto institucional, que aparece palavra por palavra.

| Subtópico | Composição | Interação |
|---|---|---|
| 03.1 Tom de Voz | Os cinco atributos em tipografia grande: PRÓXIMO · HUMANO · CLARO · POSITIVO · CONFIÁVEL. | Clicar, tocar, usar o teclado ou passar o mouse destaca o atributo. Ele mostra a descrição, "Na prática" e um exemplo de mensagem; os demais ficam discretos. |
| 03.2 Linguagem e Estilo | Listas "Preferimos" e "Evitamos", e um comparador com quatro situações. | Alternância EVITAR \| PREFERIR com transição; as setas do teclado também funcionam. A recomendação nunca depende só da cor: há texto ("Evitar"/"Preferir"), ícone (✕/✓) e o texto riscado na versão a evitar. |
| 03.3 Slogans e Assinaturas | O slogan em destaque, com aspas grandes, a leitura editorial e o **arquivo oficial** da logomarca com slogan, sem nenhuma alteração. Ao lado, separado, fica o título editorial do Manual da Marca. | Animação de entrada. |
| 03.4 Mensagens-chave | Seis conceitos ligados por uma linha fina: PESSOAS · CONFIANÇA · TRABALHO · SIMPLICIDADE · EVOLUÇÃO · CONEXÃO. | Selecionar um conceito revela o eixo, a descrição e a frase editorial. As setas navegam entre os conceitos e a linha mostra o progresso. |
| 03.5 Exemplos de Aplicação | Galeria com seis canais. Cada um mostra contexto, mensagem, diretriz do tom de voz e um mockup simples: post, comunicado, mensagem interna, conversa de atendimento, produto e campanha. | Abas que funcionam com o teclado (setas). Os mockups são neutros: não usam logos nem interfaces de outras plataformas. |

## Arquivos

| Arquivo | Papel |
|---|---|
| `src/data/verbalIdentity.ts` | **Todos os textos** do capítulo. |
| `src/components/verbal/VerbalBody.tsx` | Os cinco subtópicos, com a mesma anatomia do layout em linhas. |
| `src/components/verbal/VoiceAttributes.tsx` | 03.1 |
| `src/components/verbal/LanguageComparison.tsx` | 03.2 |
| `src/components/verbal/BrandSignatures.tsx` | 03.3 |
| `src/components/verbal/KeyMessages.tsx` | 03.4 |
| `src/components/verbal/ApplicationExamples.tsx` | 03.5, com os mockups. |
| `src/motion/VerbalAnimations.ts` | Entradas discretas e reversíveis. Só rodam com as animações ativas. |
| `src/styles/verbal.css` | Estilos (apenas tokens Gazin). |
| `tests/verbal.spec.ts` | Testes do capítulo. |

Também foram alterados:
- `brandChapters.ts`: layout `verbal`, título de apoio e introdução.
- `BrandbookChapter.tsx`: introdução editorial e o corpo do capítulo.
- `createBrandMotion.ts`: chama as animações.
- `tests/chapters.spec.ts`: o capítulo deixou de ter espaços reservados.

## Fidelidade institucional

- **Documentado:** o slogan "Sempre fazendo o melhor pra Você!" consta no manual da logomarca Gazin. Ele aparece com o selo "Slogan documentado no manual da logomarca Gazin" e com o arquivo oficial da logomarca.
- **Editorial:** "DNA GAZIN — Nossa marca, nosso jeito!" aparece como "Título e conceito editorial do Manual da Marca". O site diz que ele não substitui o slogan e não acompanha a logomarca.
- **Propostas a validar:**
  - o texto da introdução e os textos dos subtópicos;
  - os atributos de tom de voz;
  - as diretrizes e as comparações;
  - a leitura do slogan;
  - os eixos e as frases editoriais;
  - os seis exemplos de aplicação.
- As frases dos eixos aparecem com o rótulo "Mensagem editorial sugerida · não é slogan oficial". Os exemplos de aplicação aparecem com "Demonstração editorial · não é uma peça oficial publicada".
- **Exemplos do tom de voz (03.1):** cada atributo mostra uma mensagem tirada das próprias mensagens de "Preferir" e dos exemplos de aplicação. Não foi criado nenhum texto novo.
- **Atendimento (03.5):** a fala do cliente ("Oi, preciso de ajuda.") é um texto curto e neutro, só para montar a conversa demonstrativa.
- **Exemplo institucional:** usa "Desde 1966", ano coerente com a fundação registrada na Nossa História.
- Não há slogans históricos, campanhas, frases de fundadores, prêmios ou números inventados.

## Como revisar os textos

Edite somente `src/data/verbalIdentity.ts`. O slogan vem de `src/data/visualIdentity.ts`, a mesma fonte do capítulo 02, para nunca divergir.
