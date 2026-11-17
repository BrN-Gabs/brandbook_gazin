# Capítulo 06 · Comunicação Digital

**Status:** proposta editorial de boas práticas, ainda **em validação interna**. O site diz isso logo no início do capítulo. Nada aqui foi apresentado como norma corporativa aprovada.

## Materiais usados

Não há materiais digitais oficiais da Gazin no projeto: nem posts, banners digitais ou capturas de site. Nas pastas de trabalho só existem banners **impressos** de eventos internos (VEX26, ADIBE, Consórcio), que não são comunicação digital.

Por isso, as demonstrações são **didáticas** e vêm identificadas no site ("Exemplo didático · não é uma peça oficial"). Elas reutilizam apenas materiais oficiais já presentes no projeto:

| Material | Onde aparece | Origem |
|---|---|---|
| Logo Gazin, versão fundo escuro (`assets/logos/gazin-fundo-escuro.png`) | post, prévia do site, banner, loja e animação | capítulo 02 |
| Logo da campanha Black Friday Show | banner | capítulo 05 (arquivo original) |
| Fotografia demonstrativa `retrato-camiseta-verde` | post de redes sociais | capítulo 04 |
| Mensagem "Tem novidade boa chegando na Gazin!…" | post de redes sociais | proposta do capítulo 03.5 |
| Descrição de produto "Mais praticidade para o seu dia a dia…" | página de produto | proposta do capítulo 03.5 |
| Slogan "Sempre fazendo o melhor pra Você!" | revelação de texto (06.5) | manual da logomarca |
| Títulos reais dos capítulos 01–06 | prévia responsiva (06.2) | o próprio Manual |

Não há métricas, curtidas ou comentários. Os produtos, preços (R$ 0.000,00) e condições são fictícios e sinalizados como tal. Também não há player de vídeo sem arquivo.

## Conteúdo e interações

| Subtópico | Demonstração | Interações |
|---|---|---|
| 06.1 Redes Sociais | Smartphone com a mesma peça em Feed 4:5, Story 9:16, Quadrado 1:1 e Vídeo 9:16, mais uma galeria. | Seletor de formato (mouse, toque e setas do teclado); botão "Mostrar hierarquia" (1 imagem, 2 mensagem, 3 marca, 4 chamada); faixas da interface da plataforma no Story e no Vídeo; o Vídeo roda uma sequência curta, com o botão "Reproduzir de novo"; a galeria também muda o formato. |
| 06.2 Sites e Landing Pages | Monitor, tablet ou celular com uma prévia simplificada deste Manual. | Desktop, Tablet ou Mobile: a prévia é montada na largura real (1200, 768 ou 375 px) e se reorganiza por *container queries*. O menu completo vira menu compacto e depois botão; os capítulos passam de 3 para 2 e 1 coluna. A lista "o que muda" acompanha a seleção. |
| 06.3 Banners Digitais | Banner com a logo da campanha e a logo Gazin (sobreposta à borda inferior, regra do capítulo 05). | Formato horizontal, quadrado, vertical ou mobile; comparador adequado × inadequado (a versão inadequada mostra logo distorcida, textos sobrepostos, excesso de selos, preço ilegível e baixo contraste, só na tela); marcadores de hierarquia de 1 a 5. |
| 06.4 E-commerce | Janela de loja (demonstração) com vitrine de 6 produtos ilustrados e página de produto. | Vitrine ou Página de produto; os cards abrem a página do produto; a galeria troca a vista (frontal, lateral, detalhe); "Voltar à vitrine". O botão "Comprar" é só ilustração: não há compra, formulário nem campo. A hierarquia de cada tela é listada ao lado. |
| 06.5 Animações | Três demonstrações no espaço antes reservado ao vídeo. | 01 revelação do slogan, palavra por palavra; 02 linhas e formas que se organizam até a logo; 03 cards que respondem ao mouse (luz que acompanha o cursor), ao teclado e ao toque (seleção). "Reproduzir de novo" nas duas primeiras; link para a abertura com o DNA 3D (`#inicio`), sem duplicar o renderizador. |

Cada subtópico também tem:
- o texto principal;
- as diretrizes, em lista compacta;
- links discretos de "Veja também" para os capítulos 02, 03, 04 e 05.

## Movimento e acessibilidade

- As animações usam CSS, sem dependências novas, e só rodam com `html.motion-enabled`. Com o movimento reduzido, elas mostram o estado final, e o botão "Reproduzir de novo" some.
- A entrada das demonstrações usa o `reveal` já existente (`[data-dg-reveal]`).
- Os seletores são grupos de rádio:
  - só a opção ativa entra na ordem do Tab;
  - setas, Home e End mudam a seleção.
- As peças desenhadas têm `role="img"` com uma descrição em texto.
- No celular, cada bloco fica em coluna única, nesta ordem: título, texto, demonstração e diretrizes. Não há rolagem lateral.

## Pontos para validação institucional

1. Todo o conteúdo é proposta editorial de boas práticas: diretrizes, princípios e hierarquias.
2. As proporções de formato (4:5, 9:16, 1:1 e as dos banners) são exemplos comuns, não especificações oficiais das plataformas.
3. Os exemplos são didáticos. Recomenda-se substituí-los por peças reais aprovadas (posts, banners, capturas do site ou do e-commerce Gazin) quando forem disponibilizadas.
4. A mensagem do post e a descrição do produto vêm da proposta do capítulo 03.5, que também aguarda validação.
5. Não há vídeos institucionais ou de campanha no projeto. Quando houver, eles podem entrar no 06.5.

## Arquivos

- Dados: `src/data/digitalCommunication.ts`
- Componentes em `src/components/digital/`:
  - `DigitalBody`
  - `DigitalShared` (Segmented, Guidelines, Related)
  - `SocialShowcase`
  - `ResponsiveWebsitePreview`
  - `DigitalBannerComparison`
  - `EcommerceShowcase`
  - `MotionDesignExamples`
- Estilos: `src/styles/digital.css` (prefixo `dg-`)
- Testes: `tests/digital.spec.ts`. As capturas ficam em `docs/screenshots/comunicacao-digital/`.
- Integração:
  - `brandChapters.ts` (layout `digital`, introdução);
  - `BrandbookChapter.tsx`;
  - `VerbalAnimations.ts`;
  - `tests/chapters.spec.ts`.
