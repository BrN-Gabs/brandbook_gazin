# Árvore da Jornada de Sucesso (Essência · encerramento)

Última seção da categoria Essência, logo após **Nossa História** e antes do capítulo **01 · Posicionamento**. Aparece no menu Essência como "Árvore da Jornada" (`#arvore`).

## Fonte

Imagem `ARVORE GAZIN.jpg`, a Árvore da Jornada de Sucesso do Grupo Gazin. Todos os textos da imagem foram preservados com a grafia original.
- Não foram usadas as fotografias laterais, as molduras nem as placas da composição original.
- Os frutos com números, rankings e prêmios mantêm a formulação do material. No site, o painel informa: "Conforme registrado no material original".
- **Atenção:** a imagem diz "Mais de **480** unidades de negócio". O pedido de implementação citava 460, mas prevaleceu o texto da imagem. Vale validar o número com a área responsável.
- Os títulos curtos dos frutos, como "Destaque no varejo" e "Empregabilidade", são editoriais. A descrição de cada fruto é o texto da imagem.

## Arquivos

| Arquivo | Papel |
|---|---|
| `src/data/successTree.ts` | **Todos os textos**: introdução, conceitos das quatro regiões, raízes, tronco, galhos e frutos. Também guarda as posições 3D e o enquadramento de cada região. |
| `src/sections/SuccessTree.tsx` | Seção: título, palco 3D, barra de regiões, painel e encerramento da Essência. |
| `src/components/tree/TreeInterface.tsx` | Rótulos ancorados aos pontos 3D (`TreeLabels`), barra de regiões (`TreeNavigation`), painel contextual (`TreeInfoPanel`) e árvore vetorial de reserva (`TreeFallback`). |
| `src/components/tree/SuccessTreeScene.ts` | Cena Three.js: renderizador, câmera, formação, destaques, rótulos projetados e hover em 3D. |
| `src/components/tree/treeStructure.ts` | Geometria construída a partir dos dados: raízes, tronco, galhos e sub-ramos (curvas Catmull-Rom em tubos afinados), partículas DNA → árvore, nós de energia, poeira e solo. |
| `src/components/tree/treeShaders.ts` | Shaders: linhas de luz com fluxo de energia, partículas que vão do DNA à árvore e frutos luminosos. |
| `src/components/tree/treeState.ts` | Progresso da formação (0 → 1) e as faixas de cada fase. |
| `src/motion/TreeAnimations.ts` | GSAP ScrollTrigger: formação pelo scroll. No desktop o palco fica fixo por 2,2 telas. |
| `src/styles/tree.css` | Estilos (apenas tokens Gazin). |
| `tests/tree.spec.ts` | Testes da seção. |

Também foram alterados:
- `App.tsx`: posição da seção.
- `brandContent.ts`: menu Essência.
- `createBrandMotion.ts`: ordem dos pins e cor da barra de progresso.
- Testes antigos que contavam seções e pins.

## Linguagem visual

- **Mesmo idioma do DNA:** Three.js puro com shaders próprios e luz aditiva azul sobre o marinho, usando as cores lidas dos tokens CSS.
- **Raízes e galhos:** tubos translúcidos que se afinam até a ponta, com borda luminosa e pulsos de energia. A energia sobe das raízes para o tronco e sai do tronco para os galhos.
- **Tronco:** feixe de fios torcidos em volta de um núcleo translúcido. Os 7 conceitos do tronco são pontos de energia empilhados.
- **Partículas:** as mesmas partículas formam primeiro o DNA da abertura e depois a árvore: o contorno das raízes, do tronco e dos galhos, e a copa. São milhares, com menos em aparelhos modestos. Depois de pousar, a copa respira com o vento e reage ao mouse.
- **Frutos:** esferas com núcleo e halo. O azul predomina, com 2 frutos verdes e 2 laranja como destaques.

## Formação pelo scroll

A árvore nasce do DNA da abertura. Cada partícula tem duas posições: um lugar na dupla hélice, igual à do DNA inicial, e um lugar na árvore. As mais baixas da árvore ocupam a parte de baixo da hélice.

| Progresso | Fase |
|---|---|
| 0 – 12% | O DNA se forma de baixo para cima e gira; surgem os pontos de fundo |
| 10 – 24% | A hélice se solta |
| 16 – 86% | O DNA se desfaz de baixo para cima. As partículas voam em arco até o seu lugar: raízes, tronco, galhos e copa, nessa ordem. Cada linha de luz se desenha conforme as partículas chegam (raízes 24–46%, tronco 34–60%, galhos 46–78%). |
| 82 – 97% | Os frutos acendem um a um |
| 12 – 90% | A câmera recua do DNA até a árvore inteira |

- Tudo é `scrub`: rolar para cima desfaz a construção, sem estados irreversíveis.
- **Desktop:** o palco fica fixo durante a formação e libera o scroll em seguida.
- **Telas menores:** a árvore se forma enquanto o palco atravessa a tela, sem fixar.
- **Movimento reduzido:** a árvore já aparece completa e sem animações contínuas, mas continua explorável.

## Interações

- **Hover** em raiz, ponto do tronco, galho ou fruto:
  - o elemento acende e mostra o nome;
  - os demais escurecem levemente;
  - a câmera inclina de leve na direção dele.
  - O alvo é o próprio elemento 3D (o galho em toda a extensão) ou o rótulo. A paralaxe fica parada enquanto o elemento está sob o cursor.
- **Clique ou toque:** abre o painel lateral com a região, o nome, a descrição e anterior/próximo dentro da região. A árvore continua visível.
- **Barra de regiões** (Visão geral | Raízes | Tronco | Galhos | Frutos):
  - aproxima a câmera da região, destaca seus elementos e mostra a lista de conceitos no painel;
  - "Visão geral" restaura a câmera.
- **Teclado:** a barra e a lista do painel são botões. Escape volta do elemento para a região e da região para a visão geral.
- **Visão geral:** mostra só os nomes das 4 regiões. O nome de cada elemento aparece ao passar o mouse (ou ao selecionar), nunca dezenas de textos ao mesmo tempo.
- **Celular:** o painel fica abaixo do palco e a barra ocupa uma linha.
  - Na visão geral aparecem só os pontos principais.
  - Na região, os nomes ficam na lista do painel.
- **Reduzir animações:** usa o controle já existente do site.

## Desempenho

- Um contexto WebGL2, criado só quando a seção se aproxima. A renderização pausa fora da tela e com a aba oculta.
- Tudo é desenhado com poucas chamadas:
  - copa, nós, poeira e halos são um `Points` cada;
  - os frutos são um `InstancedMesh`.
- **Pixel ratio:** até 1,5. Em aparelhos modestos fica em 1, sem antialias e com menos partículas e sub-ramos. Cai para 1 sozinho se os quadros ficarem lentos.
- **Sem WebGL:** aparece uma árvore vetorial com as mesmas posições, e a barra e o painel continuam funcionando.
- Ao sair ou trocar a preferência de animação, geometrias, materiais, renderizador e listeners são liberados.

## Como atualizar os textos

Edite `src/data/successTree.ts`:
- **Texto de um elemento:** altere `title` e `description`.
- **Conceito ou nome de uma região:** altere `treeRegions`.
- **Introdução e encerramento:** altere `treeIntro`.
- **Novo elemento:** acrescente um objeto em `treeItems` com:
  - `id` único e `region`;
  - `title` e `description`;
  - `position` (x, y, z).
  - Raiz ou galho: a cena cria a curva até a posição.
  - Fruto: a cena cria a esfera.
  - Tronco: a cena cria o ponto de energia.
- **Cor de fruto em destaque:** `accent: 'green' | 'orange'`. Use pouco: o azul deve continuar dominante.
