# Capítulo 01 · Posicionamento da Marca

O capítulo foi preenchido com os textos da proposta editorial. **Todos os textos aguardam validação institucional** antes da publicação definitiva. Por isso o capítulo está marcado como `status: 'draft'` em `brandChapters.ts`; esse status não aparece no site.

## Estrutura (preservada)

- A introdução abaixo do título fica em destaque editorial e aparece palavra por palavra.
- A numeração, os IDs (`#posicionamento-1` a `#posicionamento-4`), o índice do capítulo, o menu global e a "espinha" luminosa que liga os subtópicos foram mantidos.

| Subtópico | Composição | Interação |
|---|---|---|
| 01.1 Personalidade da Marca | Texto à esquerda. À direita, seis palavras em tamanhos diferentes. | Passar o mouse, clicar, tocar ou usar o Tab destaca a palavra em azul vibrante e mostra a descrição. Um atributo fica sempre visível. |
| 01.2 Diferenciais Competitivos | Texto ao lado do título. Embaixo, cinco pilares numerados com ícones, numa linha horizontal que vira vertical no celular. | O pilar em foco acende; a linha se ilumina até ele e os demais escurecem levemente. Todos os textos ficam sempre visíveis. |
| 01.3 Proposta de Valor | A frase central fica num círculo com duas órbitas, inspiradas na hélice do DNA. Linhas luminosas com fluxo de energia a ligam aos três públicos. | Selecionar um público acende a ligação dele e escurece os outros. |
| 01.4 Percepção e Posicionamento | Constelação com cinco atributos ligados entre si. A síntese do capítulo aparece em destaque ao final. | Selecionar uma estrela a aumenta, ilumina as ligações dela e revela a descrição. |

- **Animações** (GSAP + ScrollTrigger), todas reversíveis:
  - os títulos sobem de uma máscara e os parágrafos aparecem;
  - a linha dos diferenciais se desenha antes dos pilares;
  - as ligações da proposta de valor saem do centro;
  - as linhas da constelação aparecem antes das estrelas.
- **Sem animações** (preferência do sistema ou o botão "Reduzir animações"): tudo aparece pronto, sem flutuação nem fluxo.
- **Celular e tablet** (até 1100 px):
  - uma coluna;
  - os diagramas se reorganizam em listas com linha vertical;
  - não há rolagem lateral.
- **Cores:** só azuis, branco e cinza azulado. Não há verde nem laranja, e um teste confere isso.

## Arquivos

| Arquivo | Papel |
|---|---|
| `src/data/positioning.ts` | **Todos os textos** do capítulo: introdução, os quatro textos, os atributos, os diferenciais, as três dimensões e as duas sínteses. Também guarda as posições da constelação. |
| `src/components/positioning/PositioningBody.tsx` | Os quatro subtópicos, com a mesma anatomia dos outros capítulos. |
| `src/components/positioning/PersonalityKeywords.tsx` | 01.1: palavras interativas. |
| `src/components/positioning/DifferentialsDiagram.tsx` | 01.2: os cinco pilares. |
| `src/components/positioning/ValueConnections.tsx` | 01.3: centro e os três públicos. |
| `src/components/positioning/PositioningConstellation.tsx` | 01.4: constelação. |
| `src/components/positioning/useStageSize.ts` | Mede os diagramas para desenhar as linhas em pixels reais. |
| `src/motion/PositioningAnimations.ts` | Entradas animadas do capítulo. |
| `src/styles/positioning.css` | Estilos (apenas tokens Gazin). |
| `tests/positioning.spec.ts` | Testes do capítulo. |

Também foram alterados:
- `brandChapters.ts`: layout `positioning` e a introdução.
- `BrandbookChapter.tsx`: introdução editorial e o corpo do capítulo.
- `createBrandMotion.ts`: chama as animações.
- `tests/chapters.spec.ts`: o capítulo deixou de ter espaços reservados.

## Pontos para validação institucional

1. **Todos os textos** são propostas editoriais e devem ser aprovados pela área responsável.
2. As frases "Fazer sempre o melhor, construindo relações de confiança e criando oportunidades que transformam vidas." e "Uma marca que cresce com as pessoas, evolui com o mercado e preserva sua essência." aparecem com o rótulo "Síntese editorial do capítulo". **Não são slogans nem assinaturas oficiais.**
3. "Uma trajetória iniciada em 1966" (diferencial 01) é coerente com a fundação em Douradina (PR), registrada na Nossa História e na Árvore da Jornada.
4. O capítulo não traz números, rankings, participação de mercado, prêmios ou indicadores.
5. Os ícones dos diferenciais e dos públicos são ilustrativos (biblioteca Lucide) e podem ser trocados.

## Como revisar os textos

Edite somente `src/data/positioning.ts`. Os componentes leem tudo dali.
- **Mudar a ordem ou o peso de um atributo:** use a ordem da lista e o campo `scale` (`xl`, `l` ou `m`).
- **Mover uma estrela da constelação:** altere `point` (% da largura e da altura).
- **Mudar as ligações da constelação:** altere `links`.
