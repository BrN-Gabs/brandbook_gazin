# Capítulo 03 · Personagens da Marca

**Status:** proposta editorial, em validação interna. Os textos institucionais, os atributos do Téo e as diretrizes são propostas.

## Posição e numeração

- O capítulo fica logo depois de **02 · Identidade Visual**, que termina em 02.10 Arquitetura de Marcas.
- A numeração dos capítulos agora é **calculada pela posição** em `src/data/brandChapters.ts`. Inserir um capítulo renumera os seguintes; os IDs e âncoras não mudam.
- Com a inserção, os capítulos seguintes passaram a ser: 04 Identidade Verbal, 05 Fotografia e Vídeo, 06 Campanhas, 07 Comunicação Digital, 08 Comunicação Física, 09 Comunicação Interna, 10 Patrocínios e Eventos e 11 Governança.

## Materiais usados

| Personagem | Arquivo | Uso |
|---|---|---|
| Téo | `TEO JOINHA FINAL 2026.png` (Downloads), 1254 × 1254, fundo transparente | Exibição (prévia WebP) e download: o original sem alteração, mais versões de 1024 e 512 px |
| GI.A | Captura da tela inicial da plataforma | Recorte da área central (avatar, GI.A, chamada e as quatro funções), **sem** o cabeçalho com o nome do usuário e sem o histórico de conversas. Recortes do avatar e da assinatura servem só para exibição |

Não existem em arquivo: o logo da GI.A, o avatar isolado da GI.A e outras poses do Téo. Nada foi redesenhado ou gerado.

## Subtópicos

| Subtópico | Conteúdo e interações |
|---|---|
| 03.1 Conheça os Personagens | Conceito "Personagens que aproximam. Tecnologia que transforma.", seletor Téo \| GI.A e as duas composições lado a lado (o personagem escolhido fica em destaque), com descrição, palavras-chave e principais aplicações |
| 03.2 Téo | Imagem em destaque, texto, 5 atributos, identidade a preservar, poses (só "joinha" disponível), aplicações e **Téo em ação** (Atendimento \| Orientações \| Varejo: balão de mensagem e aplicação recomendada), marcado como ilustrativo |
| 03.3 GI.A | Avatar e assinatura sobre linhas e pontos azuis animados, conceito "Inteligência que conecta, transforma e potencializa.", texto, botão **Acessar GI.A** (nova aba), as 4 funções da captura com ilustração conceitual identificada e a captura da interface |
| 03.4 Diretrizes | 9 regras e um comparador Téo \| GI.A × Correto \| Incorreto. Os erros (deformação, recoloração, efeitos, contexto, promessa de resultado) existem só na tela |
| 03.5 Biblioteca | Abas Téo \| GI.A, cards com prévia, nome, formato, dimensões e download, e ZIPs "Baixar materiais do Téo" e "Baixar materiais da GI.A" |

## Arquivos

- Importação: `scripts/import-characters.mjs` → `public/assets/brandbook/personagens/` (`teo/`, `gia/`, `previas/` e os ZIPs) e `src/data/characterFiles.json`.
- Dados: `src/data/characters.ts`.
- Componente: `src/components/characters/CharactersBody.tsx`.
- Estilos: `src/styles/characters.css` (prefixo `ch-`).
- Testes: `tests/characters.spec.ts`. As capturas ficam em `docs/screenshots/personagens/`.

## Pendências

1. Logo e avatar oficiais da GI.A em arquivo (de preferência vetorial ou PNG com transparência).
2. Novas poses e expressões do Téo, quando produzidas e aprovadas.
3. Autorização para publicar a captura da interface da GI.A no Manual.
4. Validação dos textos, atributos, aplicações e diretrizes.

## Atualização · poses oficiais (pasta "Personagens")

- **Téo:** 9 poses: joinha (busto, fundo transparente), acenando, apontando, apresentando um produto, segurando um dispositivo, atenção, orientando, comemorando e joinha de corpo inteiro.
  - Todas com fundo transparente (arquivos renomeados e atualizados na pasta em 17/11/2026).
  - O "Téo em ação" usa a pose de cada contexto: acenando (atendimento), orientando (orientações) e apresentando um produto (varejo).
- **GI.A:** 9 poses com fundo transparente: joinha, com tablet, ideia, acenando, apontando, apresentando, explicando, atenção e comemorando.
  - A personagem passou a aparecer pelas próprias poses na abertura, no 04.3 e no comparador.
  - A captura da plataforma continua só como "Interface da plataforma".
- **Biblioteca:** todas as poses têm download do original. A captura da interface da GI.A aparece só na página, sem download.
- **Importação:** `node scripts/import-characters.mjs "<Desktop/Personagens>" "<captura GI.A.png>"`.
