# Capítulo 02 · Identidade Visual

Manual técnico da logomarca em versão interativa, baseado no **Manual da Logomarca Gazin** (PDF de 16 páginas digitais, quase todas com duas páginas impressas lado a lado). As referências na interface citam só a página impressa (`Manual · pág. 12–13`).

> Na estrutura do Brandbook, Identidade Visual é o capítulo **02** (01 é Posicionamento e 03 é Identidade Verbal). Os subtópicos são numerados de 02.1 a 02.8. A numeração vem de `src/data/brandChapters.ts`.

## Arquivos

| Arquivo | Papel |
|---|---|
| `src/data/visualIdentity.ts` | **Fonte única** de textos, especificações, páginas do manual, versões, tamanhos, usos incorretos e procedências |
| `src/data/brandChapters.ts` | Títulos e IDs dos oito subtópicos (`identidade-visual-1` … `-8`), `layout: 'identity'`, status |
| `src/components/identity/VisualIdentityChapter.tsx` | Corpo do capítulo, navegação contextual (`IdentitySubnav`) e bloco “Também no manual” |
| `src/components/identity/shared.tsx` | `IdentitySection`, `ProvenanceTag`, `OfficialLogo`, `LogoLetters`, `LogoWithContour`, `LogoSilhouette`, `RadioSegmented`, hooks |
| `LogoSection.tsx` | 02.1: abertura, anatomia, construção em 4 etapas, simbologia e slogan |
| `BrandColors.tsx` | 02.2: especificação do manual, paleta da interface, degradês, cópia de códigos |
| `TypographyShowcase.tsx` | 02.3: Renfrew, Gotham Bold, tipografia da interface com teste ao vivo |
| `LogoVariants.tsx` | 02.4: seletor de versões e fundos |
| `ClearSpaceDemo.tsx` | 02.5: área de segurança com guias, modos correto/invasão/moldura e X ao vivo |
| `MinimumSizeDemo.tsx` | 02.6: 3 × 1 cm, 6 × 2 cm, silkscreen e régua interativa |
| `IncorrectUsageGallery.tsx` | 02.7: comparação correto × incorreto |
| `GraphicLanguage.tsx` | 02.8: elementos documentados e camada digital (canvas) |
| `src/styles/identity.css` | Estilos do capítulo (apenas tokens) |
| `src/motion/IdentityAnimations.ts` | Entradas GSAP do capítulo, chamadas por `createBrandMotion` |
| `tests/visual-identity.spec.ts` | Conteúdo, integridade da logo, interações, subnav, F5, larguras 1440–320 e movimento |

`BrandbookChapter` usa o corpo próprio quando `chapter.layout === 'identity'`; cabeçalho, índice interno e menu global continuam os mesmos.

## Procedência

O que vem do manual é apresentado sem etiqueta. Só são sinalizados: **medido no arquivo original**, **Paleta digital / recurso digital** e **interpretação didática**.

## Cor: impressão × digital

- **Impressão**: azul do manual, Pantone Blue 072 C · C100 M100 Y0 K0 (preto P&B: Process Black C · K100). Na tela é só simulação (`--manual-blue`).
- **Digital**: #080EA0 (`--gazin-blue`), o azul principal da paleta, inclusive no slogan. Decisão da equipe de marca; o HEX #2E3192 citado no manual não é usado.

## Versões para download

`node scripts/export-logo-versions.mjs` gera `public/assets/logos/gazin-<versão>.png` e `gazin-<versão>-slogan.png` (cores-originais, fundo-escuro, preto-branco, uma-cor, negativo) e `gazin-logos.zip`. Tudo parte do arquivo original:

- versões monocromáticas pintam a área azul do próprio arquivo, com o nome vazado (transparente);
- fundo escuro e negativo usam o contorno extraído do arquivo (espessura ilustrativa: o manual não a define);
- o slogan é composto em **Montserrat Bold Italic** (OFL), substituta da Gotham Bold, abaixo do retângulo e com cerca de 79% da largura, como na pág. 07.

O site exibe esses mesmos arquivos (`LogoVersion`), então o que se vê é o que se baixa. Rode o script de novo se o arquivo original mudar.

## 02.9 Arquitetura de Marcas do Grupo Gazin

Este subtópico absorveu o antigo capítulo **09 · Arquitetura de Marcas**, que foi removido. Com isso, Patrocínios e Eventos passou a ser o 09 e Governança da Marca o 10.

- **Arquitetura** (`src/data/brandArchitecture.ts`, componente `BrandArchitecture`): segue o diagrama do manual da logomarca (págs. 30–31). A fonte é registrada só aqui e no código; a página não mostra citações.
  - A **Gazin Holding** fica no centro, com a assinatura "Uma Gazin para todos!". Ela usa o arquivo oficial `GAZIN HOLDING.png` da pasta Logos e tem download.
  - Ao redor ficam os **cinco conjuntos**. O manual não dá nome a eles, então aqui são só numerados, cada um com a cor do seu arco.
  - Toda marca é clicável e mostra o nome, o conjunto e o botão de baixar o PNG original.
- **Outras marcas vinculadas:** Gazin Fundos de Investimento, Gazin Licitações, Instituto Mário Gazin, Jeito Gazin e Portal Colchões estão na pasta Logos, mas não aparecem no diagrama do manual. A posição delas na arquitetura precisa ser validada.
- **Biblioteca:** busca, ZIP com as 19 marcas (incluindo a Holding) e cards com download. Cada card indica o conjunto da marca.

### Atualizar as logomarcas

As 19 logomarcas vinculadas à Gazin vêm da pasta **Logos** da área de trabalho. Para atualizar (marca nova, arquivo trocado):

1. Ajuste a lista `catalog` em `scripts/import-group-logos.mjs` (arquivo de origem → nome exibido → slug).
2. Rode `node scripts/import-group-logos.mjs "C:/Users/<usuário>/Desktop/Logos"`.

O script copia os **originais sem alteração** para `public/assets/marcas/originais/` (é o que se baixa), gera prévias leves em `public/assets/marcas/previa/` (só recorta a margem vazia e reduz para até 1200 px de largura), cria `marcas-grupo-gazin.zip` e grava `src/data/groupLogos.json`, que alimenta a página.

## Regras extraídas do PDF

| Tema | Regra | Página impressa (PDF) |
|---|---|---|
| Apresentação | Padroniza o uso da marca; é vedada qualquer outra forma de utilização | 05 (3) |
| Logomarca | Elemento gráfico (desenho geométrico) + elemento tipográfico (nome); slogan em algumas aplicações; sem variações gráficas em nenhuma aplicação | 06–07 (5) |
| Composição | Retângulo inclinado, cantos arredondados, azul; GAZIN em tipologia branca | 08 (4) |
| Simbologia | Retângulo: autoridade, estabilidade, força, confiança, credibilidade, consistência. Inclinação e cantos: modernidade, ousadia. Azul: devoção, fé, aspiração, sinceridade, lealdade, confiança, tranquilidade. Branco: pureza, sinceridade, verdade | 08–09 (4) |
| Slogan | “Sempre fazendo o melhor pra Você!”, complementa os valores | 09 (4) |
| Tipografia | Renfrew no nome GAZIN; Gotham Bold com inclinação no slogan | 10–11 (6) |
| Cor | Retângulo e slogan: CMYK C100 M100 Y0 K0; Pantone Blue 072 C; HTML #2E3192 | 12–13 (7) |
| Aplicação | Preferencialmente em fundo branco e cores originais; fundo escuro: contorno branco em volta do retângulo | 14 (8) |
| Área de segurança | Proporcional à largura do “i” (X), em todos os lados; nunca invadida por objetos ou textos além do fundo; limites nunca usados como moldura | 15 (8) |
| Bordado | Mínimo 6 × 2 cm; senão, silkscreen; sempre na cor original | 16 (9) |
| Redução | Mínimo 3 × 1 cm | 17 (9) |
| Preto e branco | K100; Pantone Process Black C; HTML #231F20 | 18 (10) |
| Uma cor / negativo | Azul como base e restante vazado; negativo em alguns casos; C100 M100 Y0 K0, Blue 072 C | 19 (10) |
| Usos não recomendados | Exemplos: retângulo sem inclinação, esticado, comprimido, letras em outra cor, slogan em outra fonte/posição | 20–21 (11) |
| Papelaria, caminhões, fachadas | Não aparecem no capítulo 02 (o bloco “Também no manual” foi removido); unidades de negócio estão no 02.9 | 22–31 (12–16) |

## Inconsistências do PDF (mantidas visíveis, sem correção por suposição)

- **RGB**: o manual registra “R:40% – G:22% – B:111%”. A notação é inválida e não foi convertida; as telas usam o HEX documentado.
- **Bordado**: o texto define 6 × 2 cm; o diagrama da mesma página traz as cotas 5,5 × 1,78 cm. Prevalece o texto; a diferença deve ser validada.
- **Preto P&B**: as fichas mostram RGB 0/0/0 e HTML #231F20. O HEX documentado é exibido.

## Medidas tiradas do arquivo original

- `logo-gazin.png`: 2974 × 835 px, **sem slogan**.
- Azul predominante medido: **#0B109F**. Não é o #2E3192 do manual nem o #080EA0 da interface. O arquivo não foi recolorido; a correspondência deve ser validada com os arquivos oficiais.
- Haste do “i”: **183 px** de largura horizontal, constante entre as linhas 260 e 540. X = 183 / 2974 da largura da logo.
- Inclinação dos lados: cerca de **60°** em relação à base, calculada pelo contorno de `src/components/dna/logoOutline.ts`. O manual não especifica ângulo.

## Limitações conhecidas

- **Slogan**: não há arquivo oficial com slogan nem licença Gotham Bold no projeto. A Montserrat é uma aproximação; ao receber o arquivo oficial, substitua os PNG `-slogan`.
- **Azul do arquivo**: o PNG original mede #0B109F, muito próximo do #080EA0 digital. Não foi recolorido.
- **Contorno** (fundo escuro e negativo): espessura ilustrativa.
- **Negativo**: interpretado a partir do exemplo da pág. 19 (contorno e nome em branco sobre fundo de cor).
- **PDF**: o manual não está dentro do projeto; nenhuma imagem dele foi incorporada.
- **Escala física**: centímetros CSS não correspondem necessariamente a centímetros reais.
