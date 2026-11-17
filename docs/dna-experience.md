# DNA Gazin

A experiência está integrada ao aplicativo React existente. Three.js gera e ilumina a dupla hélice em tempo real, sem vídeo ou modelo externo.

## Organização

- `src/components/dna/DNAExperience.tsx`: conteúdo, prontidão dos recursos, abertura e ciclo de vida. Os três textos institucionais vêm diretamente de `brandContent.introduction.items`.
- `DNACanvas.ts`: uma cena persistente e controle de câmera, renderização e descarte de recursos.
- `DNAParticles.ts`: hélice de até 26 mil partículas azuis com brilhos brancos (fitas com sulcos maior/menor e degraus em contas), profundidade de campo, poeira fina orbitando a hélice e duas hélices desfocadas ao fundo, além da camada de bokeh. Todas as camadas reagem ao cursor na GPU (repulsão, redemoinho e rastro conforme a velocidade do mouse).
- `DNANetwork.ts`: rede de nós conectados que estende fios até o cursor e moléculas de bases nitrogenadas (hexágonos e purinas) flutuando, empurradas e giradas pelo mouse.
- Pontos do DNA: os 11 traços (`brandContent.dnaTraits`) são pontos brancos luminosos ancorados nas fitas da hélice. `DNACanvas.ts` projeta cada ponto para a tela a cada quadro, define o lado do rótulo e atenua os pontos que estão atrás da hélice. Ao passar o mouse (ou focar pelo teclado), o ponto vira o selo numerado e revela o título em branco; a rotação da hélice e a paralaxe param enquanto o ponto está em foco. Sem WebGL, os pontos não aparecem.
- `DNAScrollController.ts`: timeline GSAP central, sincronizada ao scroll nativo/Lenis existente. Controla enquadramentos e revelações HTML, recalculando posições ao redimensionar a janela.
- `src/styles/dna.css`: composição desktop/mobile e continuidade visual das seções institucionais.

Os valores de `poses` definem a jornada: posição horizontal relativa à viewport, deslocamento vertical, rotação, inclinação, escala e opacidade. Movimento orgânico e resposta amortecida ao mouse são adicionados em outro grupo 3D, sem alterar a transformação do scroll.

## Abertura cinematográfica

Fases, controladas por `IntroController.ts` com um único relógio (ticker do GSAP) e uma única timeline: `loading → midpoint → accelerating → logoReveal → dnaMorph → introReveal → ready`. A fase atual fica em `data-phase` na seção.

1. **Luz no contorno**: uma luz branca percorre a silhueta real da moldura Gazin (`logoOutline.ts`, extraída do PNG original por `scripts/extract-logo-outline.mjs`, porque o projeto não tem o vetor da marca). O rastro tem três camadas e solta partículas.
2. **0% → 50% → 100%**: o percentual sobe com easing, desacelera perto de 50% (rastro mais longo, brilho mais forte, partículas convergindo para a luz) e acelera até 100%. O número nunca passa do que já está pronto: módulo 3D, primeira renderização, fontes e logo decodificada.
3. **Logo**: o caminho da luz revela a arte original da borda para dentro (máscara SVG com a mesma imagem e na mesma caixa), e depois troca pela `<img>` real. O próprio elemento da logo vai do centro até a posição do layout (FLIP com translate e scale, recalculado a cada quadro, então acompanha redimensionamentos).
4. **DNA**: no mesmo ponto da tela, a luz passa para a cena WebGL existente (`DNAEnergy.ts`, mesmo renderizador). Ela voa em arco 3D até a base da hélice, se divide em duas e desenha as fitas e os degraus. As partículas do DNA atual nascem da linha central dessa hélice luminosa (`aOrigin`) e assumem suas posições finais, de baixo para cima.
5. **Home**: DNA → BRANDBOOK → título → texto → botão (opacity, translateY e blur leve). Por último entram o fundo (hélices desfocadas, bokeh, rede e moléculas) e os pontos do DNA (`state.ambient`).

Recursos travados: em 9 s o contador deixa de esperar; em 16 s a página é liberada de qualquer forma. Pular abertura, qualquer tecla, rolar ou arrastar no toque leva direto ao estado final. Falha de WebGL ou do módulo 3D libera a página com o fallback vetorial. Em movimento reduzido, não há abertura: o hero aparece com um fade curto.

## Atualização da página (F5)

`src/motion/entry.ts` roda antes do React: usa `history.scrollRestoration = 'manual'`, remove o `#seção` da URL quando a navegação é do tipo `reload` e volta ao topo. Assim toda atualização (F5, Ctrl+R ou botão) recomeça na home com a abertura, com ScrollTrigger, Lenis e a cena 3D recriados do zero. A navegação interna (âncoras, voltar e avançar dentro da página) não recarrega o documento, então não repete a abertura. Um link direto aberto pela primeira vez (ex.: `/#pilares`) não é atualização e continua levando à seção.

## Verificação

`npm run build` verifica TypeScript e gera a versão de produção. `npm run test:e2e` executa Playwright no Chrome, incluindo desktop, tablet, mobile, scroll reversível, mouse, preferência de movimento, navegação por teclado, links diretos, recursos travados e falhas WebGL. Capturas em `docs/screenshots/dna`.

O bundle WebGL é carregado por importação dinâmica e tem aproximadamente 137 kB comprimidos com gzip. A compilação pode emitir o aviso padrão de chunk acima de 500 kB sem compressão. Isso não impede a compilação; o conteúdo React e o fallback não dependem desse chunk para existir.
