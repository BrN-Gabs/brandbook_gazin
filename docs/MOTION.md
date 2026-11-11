# Motion Design — Brandbook Gazin

A implementação preserva o conteúdo em `src/data/brandContent.ts`, a logo PNG, o SVG de pilar, as fontes, a paleta e a estrutura editorial existente. A referência solicitada foi [Incredibles](https://incredibles.dev/); seu conteúdo público foi acessado, mas a inspeção visual interativa da referência não ficou disponível nesta sessão. A coreografia implementada é própria, orientada pelo briefing.

## Narrativa

- **Abertura e introdução:** loading SVG ligado aos recursos essenciais, composição tipográfica e deslocamento da logo até a introdução, com título e colunas escalonados. A sequência é gerenciada por `BrandbookPreloader`; o motor de scroll inicia depois dela. Consulte [Abertura cinematográfica](PRELOADER.md).
- **Missão:** palavras evoluem de opacidade 0.2 até 1 com scrub reversível. Pin de até 620 px somente com mouse, largura mínima de 1100 px, altura mínima de 900 px e conteúdo que cabe inteiro na viewport. Caso contrário, a leitura progride no fluxo normal.
- **Visão:** máscaras nas linhas editoriais no desktop; entrada do bloco no mobile para preservar suas quebras naturais. Painel azul cresce atrás do conteúdo; círculos acompanham o scroll com deslocamento, rotação e escala discretos. Não há loop permanente.
- **Valores:** entradas por item e destaque progressivo na região de leitura; hover sutil em texto e marcador. Itens estáticos não são inseridos artificialmente na ordem de tabulação.
- **Pilares:** número, título, linha, atributos e parágrafo entram conforme cada elemento alcança a área visível, com um pequeno intervalo entre colunas no desktop. Os disparos são independentes para evitar que os textos terminem de animar abaixo da tela. As entradas são rearmadas ao voltar acima dos elementos; o ícone e a nota também repetem. No desktop com quatro colunas, o destaque percorre números e linhas. Sem pin: os textos extensos excedem a altura de muitos notebooks e precisam permanecer livremente navegáveis. Hover não reduz o contraste dos parágrafos.
- **Continuidade:** parallax na saída da introdução, preenchimento azul antes da visão, deslocamento discreto na sua saída e progresso superior de 2 px com cor adaptada ao fundo.
- **Fundo interativo da introdução:** malha contínua de X em canvas, na abertura e introdução. O ponteiro nativo é preservado; uma bolinha `--color-motion-light` o acompanha com suavização. O movimento emite ondas limitadas que deslocam, ampliam e clareiam os X. A malha perde intensidade sob os textos e fica protegida atrás da logo. No touch, em capacidade limitada ou movimento reduzido, permanece apenas a textura estática.

## Arquitetura

O clique esquerdo na abertura ou introdução emite uma onda radial forte em azul-ciano. Os X se deslocam até aproximadamente 52 px, giram e crescem na passagem da onda, retornando à malha em 2,4 segundos. O centro permanece no ponto clicado mesmo com o mouse em movimento. Até três ondas de clique podem coexistir, separadas das ondas suaves do ponteiro; os recursos são descartados ao desativar as animações.

O hover sobre a logo e os textos da abertura/introdução acrescenta um realce azul-ciano (`--color-motion-light`), com brilho suave e pontos discretos ao redor do cursor. O filtro SVG colore os traços originais sem duplicar, deslocar ou desfocar as letras, preservando a leitura. `IntroHoverEffect.ts` acompanha o mesmo ticker do campo de fundo, restaura o elemento ao sair e remove seus recursos ao desativar o movimento. Touch e movimento reduzido não recebem esse efeito.

O título grande “brandbook” tem uma interação própria em `BrandbookDistortion.ts`, inspirada no título inicial de https://airbagstudio.it/. Uma malha fixa de células quadradas recebe impulsos na direção e proporção do deslocamento do mouse. Cada célula relaxa independentemente, deixando um breve rastro de recortes que desaparece mesmo com o ponteiro parado sobre o título. O mapa SVG alimenta `feDisplacementMap` sobre o texto original, sem alterar fonte, cor, layout ou semântica. A dimensão das células acompanha a tipografia; a amplitude é limitada e o decaimento usa o tempo entre frames. O RAF encerra quando as células repousam. A distorção substitui o realce ciano apenas nesse título e mantém o cursor de seta. Scroll, resize, perda de foco, mudança de preferência e desmontagem restauram o filtro original e descartam os recursos. Touch, movimento reduzido e o modo de capacidade limitada permanecem estáticos.

| Arquivo em `src/motion/` | Responsabilidade |
| --- | --- |
| `useBrandMotion.ts` | Carregamento separado, espera pelas fontes e descarte seguro no React StrictMode. |
| `createBrandMotion.ts` | Ciclo de vida via `gsap.matchMedia`, coordenação em ordem de leitura e indicador. |
| `MotionConfig.ts` | Easing, distâncias, durações, scrub, breakpoints e helper de revelação. |
| `ScrollManager.ts` | Uma instância de Lenis ligada ao ticker GSAP; atualização de ScrollTrigger; âncoras, foco e limpeza. |
| `IntroAnimations.ts` | Saída da introdução; a entrada pertence ao preloader. |
| `IntroPointerField.ts` | Malha de X, propagação de ondas e acompanhamento do mouse; parâmetros em `fieldConfig`. |
| `MissionAnimations.ts` | Revelação por palavra e pin condicional. |
| `VisionAnimations.ts` | Máscaras, painel e círculos. |
| `ValuesAnimations.ts` | Revelação e ênfase de leitura. |
| `PillarsAnimations.ts` | Sequenciamento e destaque editorial. |

O antigo `Reveal` renderiza um wrapper visível com atributos `data-reveal`; sua animação é gerenciada pelo mesmo ciclo GSAP. Header/MobileMenu, que não estão montados na página atual, conservam sua implementação existente; não há dois controladores ativos de scroll.

## Responsividade, acessibilidade e custo

Lenis atua somente no desktop com ponteiro fino. Touch usa scroll nativo, sem sincronização artificial. Equipamentos que reportam até quatro núcleos, até 4 GB de memória ou economia de dados recebem a versão sem smooth scroll, parallax complexo ou pin. Essas informações são apenas pistas de capacidade, não um benchmark.

`prefers-reduced-motion` é observado em tempo real: GSAP reverte os estilos, remove pins e destrói Lenis. O conteúdo fica integralmente legível; o indicador acompanha a posição diretamente, sem interpolação. O CSS não oculta textos por padrão. Se o módulo de animações falhar, o React continua apresentando o brandbook e os links diretos são reposicionados após as fontes.

O controle no canto inferior direito permite **Ativar animações** ou **Reduzir animações** somente neste site. A escolha explícita é lembrada no navegador e pode ser removida pelo botão **Usar preferência de movimento do sistema**. Sem escolha explícita, a preferência do sistema continua sendo respeitada. GSAP, CSS e Lenis usam a mesma decisão; ativar o site não altera configurações do Windows.

Diagnóstico local em 04/11/2026: o Chrome sem emulação retornou `prefers-reduced-motion: reduce`, fazendo a versão anterior permanecer estática. A suíte agora cobre também a preferência real da máquina e a ativação explícita pelo controle, além dos cenários emulados.

Transformações e opacidade predominam. Pequenas mudanças de cor ficam limitadas a números, linhas e microinterações. Não há `will-change` permanente, snapping ou rotação contínua. O marcador do mouse existe apenas na abertura/introdução e nunca intercepta cliques. O canvas limita a densidade de pixels a 2, agrupa os traços por opacidade e encerra seus frames quando o movimento estabiliza. Medições ficam no `ResizeObserver`, fora dos eventos de ponteiro. Listeners, observador e frames são descartados na mudança de preferência e desmontagem. O pin adiciona espaço apenas na configuração que comporta a frase. Fontes e imagens têm dimensões estáveis antes do `ScrollTrigger.refresh()`.

## Validação local

```sh
npm run build
npm run test:e2e
```

Os testes existentes mantêm cobertura do conteúdo, logo, grid e movimento reduzido. A suíte de movimento verifica larguras de 320 a 1920 px, navegação nos dois sentidos, âncoras e histórico, foco, preferência alterada durante o uso, reflow, wheel, capacidade limitada e falha do módulo. Capturas por seção são salvas em `docs/screenshots/motion/`.

Testes e capturas no Chrome não equivalem a medir 60 FPS em todos os aparelhos. Para homologação em produção, revisar também Safari/iOS e dispositivos físicos disponíveis.
