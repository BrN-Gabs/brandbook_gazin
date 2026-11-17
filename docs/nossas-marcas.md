# Capítulo 03 · Nossas Marcas

**Fonte:** `Portfolio_Marcas_Grupo_Gazin.pdf`, a versão original de 90 páginas. A versão `_compressed` tem o mesmo conteúdo, mas a original foi usada para tirar as logos com mais qualidade.

O capítulo mostra só as dez marcas: logo, nome, segmento (como aparece no sumário do PDF) e uma síntese curta. Ficam de fora aplicações, embalagens, estratégias, registros, acompanhamentos, datas, vendas e status comercial. Uma nota avisa que o conteúdo segue o portfólio de referência e que as informações podem ter evoluído desde então.

## Posição

- O capítulo fica logo depois de 02 · Identidade Visual, cujo último tópico é o 02.10 Arquitetura de Marcas do Grupo Gazin. Assim, Nossas Marcas vira o capítulo 03.
- A numeração é calculada pela posição na lista, então os capítulos seguintes passaram a ser:

| Nº | Capítulo |
|---|---|
| 04 | Personagens da Marca |
| 05 | Identidade Verbal |
| 06 | Fotografia e Vídeo |
| 07 | Campanhas |
| 08 | Comunicação Digital |
| 09 | Comunicação Física |
| 10 | Comunicação Interna |
| 11 | Patrocínios e Eventos |
| 12 | Governança |

- As citações entre capítulos visíveis na página passaram a usar o **nome** do capítulo, e não o número. Assim elas não ficam desatualizadas quando um capítulo novo é inserido.

## Logomarcas (`public/assets/nossas-marcas/`)

| Marca | Página | Como foi obtida |
|---|---|---|
| Gazin A–Z | 7 | Imagem PNG embutida no PDF (485 × 102) |
| GamerZone | 16 | Imagem PNG embutida (reduzida de 1882 para 1200 px) |
| DONE | 28 | Imagem PNG embutida (885 × 236) |
| Ecoflash | 40 | Imagem PNG embutida (452 × 147) |
| Gold Confort | 52 | Vetor da página, renderizado em escala 6 e recortado |
| Sleep On | 61 | Vetor da página, renderizado em escala 6 e recortado |
| Mark Blank | 68 | Imagem PNG embutida (reduzida para 1200 px) |
| Grock | 73 | Imagem PNG embutida (512 × 160) |
| Fitmotion | 78 | Imagem PNG embutida (reduzida para 1200 px) |
| Colorvision | 85 | Imagem PNG embutida (reduzida para 1200 px) |

Nenhuma logo foi redesenhada, recolorida ou deformada. Elas aparecem sobre placas brancas, porque várias têm elementos pretos. Na tela, nenhuma passa do tamanho original do arquivo.

**Arquivos originais recomendados:** Gazin A–Z, Ecoflash e Grock vieram em baixa resolução (cerca de 500 px de largura), e Gold Confort e Sleep On foram recortadas da página. Para essas cinco, convém obter o SVG ou o PNG em alta resolução.

## Interface

- **03.1 Galeria de Marcas:** as 10 placas com tamanho óptico definido pela proporção de cada logo. O hover destaca a placa (a logo não se move) e mostra o nome e o segmento. Clicar seleciona a marca e leva ao visualizador. As placas entram em sequência.
- **03.2 Conheça Cada Marca:** a logo fica grande, com contador (`04 / 10`), segmento, nome e descrição. Dá para navegar pelas setas, pelo teclado (← →) ou pelos pontos. A altura não muda entre marcas.

## Arquivos

- Importação: `scripts/import-our-brands.mjs`. Ele recebe as imagens extraídas do PDF e as páginas 52 e 61 renderizadas, ambas geradas com pdf.js.
- Dados: `src/data/ourBrands.ts` e `src/data/ourBrandsFiles.json`.
- Componente: `src/components/brands/OurBrandsBody.tsx`.
- Estilos: `src/styles/our-brands.css`.
- Testes: `tests/our-brands.spec.ts`.
