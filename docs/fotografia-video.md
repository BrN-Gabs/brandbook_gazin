# Capítulo 04 · Fotografia e Vídeo

Este capítulo é uma **proposta editorial**. As diretrizes não são normas oficiais aprovadas pela Gazin. No código ele está marcado como `status: 'draft'`, e no site cada demonstração mostra o rótulo "Proposta editorial · sujeita à validação".

## Estrutura

- **Navegação horizontal (preservada):** os cinco cards (04.1 a 04.5) mantêm os mesmos IDs, então os links do menu continuam funcionando.
  - Cada card mostra uma foto, o título, um resumo e o botão "Ver demonstração".
  - O trilho rola com mouse, trackpad, teclado ou swipe, com snap.
- **Palco de demonstração:** um palco único, abaixo do trilho, mostra a demonstração completa do card selecionado.
  - Não há cinco modais.
  - Os links do menu para um subtópico também o selecionam.
- **Visualizador de fotos:** um só para todo o capítulo (`<dialog>` nativo), abre ao clicar em qualquer foto. Escape ou clicar fora fecha, e o foco volta para a foto.
- **Introdução:** o título "Nossa essência em cada imagem." e o texto, que aparece palavra por palavra.

| Subtópico | Demonstração |
|---|---|
| 04.1 Estilo Fotográfico | Foto principal grande, com miniaturas para trocá-la. Cinco características para selecionar e as listas de fotografias recomendadas e do que evitar. |
| 04.2 Enquadramentos | Visualizador PLANO ABERTO \| PLANO MÉDIO \| CLOSE-UP, que troca a foto e a descrição. Comparação Adequada/Inadequada, com a grade dos terços na versão adequada. Lista de recomendações. |
| 04.3 Iluminação e Tratamento | Comparador **Antes/Depois** com divisor arrastável (mouse, toque e setas do teclado). As **duas versões partem do mesmo arquivo**. Ao lado ficam as diretrizes de luz, o tratamento e o que evitar. |
| 04.4 Direção de Arte Audiovisual | Storyboard em quatro quadros: começo, desenvolvimento e conclusão. Diretrizes de pessoas, cenários, figurino, produtos, identidade e narrativa. Há um espaço para vídeo, **sem botão de play enquanto não houver vídeo oficial**. |
| 04.5 Movimento e Edição | Duas simulações com foto: **panorâmica** na fachada e **aproximação** no retrato. Ambas têm o rótulo "não é um vídeo" e o botão Pausar/Retomar. Lista de movimentos, edição e o que evitar. |

**Animações reduzidas:** as simulações ficam paradas, o botão de pausa some e as transições são desligadas.

## Fotografias

| Arquivo (`public/images/brandbook/fotografia-video/`) | Origem | Uso |
|---|---|---|
| `retrato-camiseta-verde.jpg` | Enviada (gerada por IA) | 04.1 (principal) e simulação de aproximação |
| `retrato-camiseta-azul.jpg` | Enviada (gerada por IA) | Plano médio, 04.1 e storyboard |
| `retrato-camiseta-branca.jpg` | Enviada (gerada por IA) | Composição adequada/inadequada, 04.1 e storyboard |
| `close-up-retrato.jpg` | Recorte da foto de camiseta branca | Close-up (reenquadramento demonstrativo) |
| `tratamento-antes.jpg` / `tratamento-depois.jpg` | Mesmo arquivo: a foto de camiseta preta (gerada por IA) | Comparador. O "depois" tem brilho +6%, contraste +8% e saturação +8% |
| `assets/merchandising/fachada-dia.jpg` e `ambientacao-cozinha.jpg` | Manual de Merchandising (fotos reais de loja) | Plano aberto, storyboard e panorâmica |

- **Originais preservados:** os PNGs enviados estão, sem alterações, em `assets-source/fotografia-video/`. Essa pasta fica fora de `public` e não é publicada.
- **Script:** `scripts/import-photo-video.mjs` gera as versões web.
- **Rótulo no site:** as fotos de pessoas aparecem como "Fotografia demonstrativa". Não são registros reais de lojas ou colaboradores.
- **Fotos não usadas:** as fotos da Nossa Missão e da Nossa Visão (vendedor com família e colaboradora) ficaram de fora deste capítulo. Elas mostram uniformes com a logomarca gerada por IA, com letras distorcidas, e este próprio capítulo orienta a evitar "logotipos distorcidos ou inventados".

## Para substituir no futuro

1. **Fotos de pessoas:** troque pelas fotografias oficiais, de preferência com atendimento real, famílias e colaboradores com o uniforme oficial. Atualize os caminhos em `photos`, em `src/data/photoVideo.ts`, ou rode o script com os novos arquivos.
2. **Close-up:** troque por uma foto feita de fato em close-up.
3. **Vídeo institucional:** preencha `audiovisual.video.src` com um MP4 em `/public`. `poster` e `captions` (.vtt) são opcionais. O player aparece automaticamente, com controles.
4. **Simulações de movimento:** podem ser trocadas por vídeos curtos de demonstração reais.

## Arquivos

- **Textos e fotos:** `src/data/photoVideo.ts`, com as dimensões em `photoVideoPhotos.json`.
- **Componentes:** `src/components/photo/`
  - `PhotoVideoBody`: trilho e palco.
  - `PhotographyLightbox`: visualizador de fotos.
  - `PhotoVideoDemos`: `PhotographyStyle`, `FramingShowcase`, `ImageTreatmentComparison`, `AudiovisualDirection` e `VideoMotionExamples`.
- **Estilos:** `src/styles/photo-video.css`.
- **Testes:** `tests/photo-video.spec.ts`.
- **Também alterados:**
  - `brandChapters.ts`: layout `photo`, título de apoio e introdução.
  - `BrandbookChapter.tsx`.
  - `VerbalAnimations.ts`: entrada da introdução.
  - `tests/chapters.spec.ts`.
