# Nossa História (Essência)

Linha do tempo interativa entre os **Pilares da Marca** e a **Árvore da Jornada de Sucesso** (que encerra a Essência antes do capítulo 01 · Posicionamento), listada no menu Essência como "Nossa História" (`#historia`).

## Fontes

- Acontecimentos: `Linha do Tempo Gazin.pdf`, páginas 2 a 6 (23 marcos, 1966–2023).
- Fotografias: pasta `Área de Trabalho/Imagens Linha do Tempo` (23 arquivos). Cada foto foi associada ao marco comparando-a com a miniatura usada no PDF.

## Arquivos

| Arquivo | Papel |
|---|---|
| `src/data/history.ts` | Textos dos marcos, introdução, marcos pendentes e o ciclo de composição (tamanho, rotação, deslocamento), separado do conteúdo |
| `src/data/historyPhotos.json` | Gerado pelo script: dimensões das fotos (evita deslocamento de layout) |
| `scripts/import-history-photos.mjs` | Associação foto → marco (`photoCatalog`) e geração das versões web |
| `public/assets/historia/` | `<id>-900.jpg` (molduras) e `<id>-1800.jpg` (visualizador) |
| `src/sections/OurHistory.tsx` | Seção: título, trilho, linha conectora, molduras, indicador de ano |
| `src/components/history/HistoryViewer.tsx` | Visualizador ampliado (modal) |
| `src/motion/HistoryAnimations.ts` | Pin + scroll horizontal (GSAP ScrollTrigger) e parallax das molduras |
| `src/styles/history.css` | Estilos (apenas tokens) |
| `tests/history.spec.ts` | Testes da seção |

Também foram alterados: `App.tsx` (posição da seção), `brandContent.ts` (menu Essência), `createBrandMotion.ts` (ordem das animações e limpeza), `ScrollManager.ts` (pausa do Lenis enquanto o visualizador está aberto) e `tests/chapters.spec.ts`.

## Navegação horizontal

- **Desktop** (≥ 1100 px, com mouse): não há setas. A seção fica fixa (`pin`) e a rolagem do mouse passa os anos, deslocando o trilho para a esquerda com `scrub`, ou seja, totalmente reversível. Isso vale também com movimento reduzido e em computadores de menor capacidade, porque o deslocamento só acompanha a rolagem do próprio leitor. A distância é a largura real do trilho e é recalculada no redimensionamento. A linha conectora se desenha conforme o avanço. Ao focar uma moldura pelo teclado, a linha do tempo leva até ela.
- **Só com movimento completo**: cada moldura tem parallax próprio (`containerAnimation`). Ela entra levemente deslocada e transparente, se endireita ao passar pelo centro e volta à inclinação original ao sair.
- **Tablet e celular (toque)**: sem pin. O trilho é um carrossel horizontal nativo com *scroll snap* e gesto de deslizar.
- **Indicador**: `1966 — 2023`, barra de progresso real e o ano/título do marco em destaque (o mais próximo do centro). Não interpola anos.
- **Visualizador**: clique (ou Enter) numa moldura. Mostra a foto ampliada, ano, título e descrição; setas/botões navegam; Escape, botão ou clique fora fecham; o foco volta para a moldura e a página não se move.
- **F5**: continua recomeçando pela introdução (regra do `index.html`).

## Como adicionar um marco

1. Coloque a fotografia na pasta `Imagens Linha do Tempo`.
2. Em `src/data/history.ts`, acrescente o marco em `historyEvents`, na ordem cronológica: `id` único (ex.: `2024-novo-marco`), `year`, `title`, `description`, `alt` (o que se vê na foto) e `source`. Vários marcos no mesmo ano são aceitos.
3. Em `scripts/import-history-photos.mjs`, acrescente `'<id>': '<arquivo>'` em `photoCatalog`.
4. Rode `node scripts/import-history-photos.mjs "C:/Users/<usuário>/Desktop/Imagens Linha do Tempo"`.

A composição (tamanho, rotação, deslocamento) segue o ciclo `layoutCycle` automaticamente. Um marco sem foto aparece com moldura de aviso. Os anos 2024 em diante não foram criados: entram quando houver material oficial.

## Pendências de validação

- **1966**: a foto usada no PDF é o arquivo `Jair 1970 - Douradina.jpg`. O nome indica 1970; confirmar a data da fotografia.
- **2004 · Consórcio Nacional Gazin**: a foto do PDF mostra um banner da *Garantia A Mais*. Associação mantida conforme o PDF.
- **Página 7 do PDF** (sem data confirmada e sem fotos na pasta), guardados em `pendingHistoryEvents` e **não exibidos**: Lojas Radisco, Varejo Experience, GazinBank, Instituto Mário Gazin e a campanha da Copa.
- Os títulos curtos e o texto de introdução da seção são editoriais; os fatos, nomes e anos seguem o PDF.
