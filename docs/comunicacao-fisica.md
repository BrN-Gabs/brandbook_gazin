# Capítulo 07 · Comunicação Física

O capítulo resume o **Manual de Merchandising Gazin** (`MANUAL MERCHANDISIGN - A4.pdf`, 118 páginas) nos cinco subtópicos existentes. Cada diretriz, ponto interativo e imagem indica a página de origem no manual. Detalhes por departamento e medidas técnicas não foram reproduzidos: ficam no PDF completo, disponível para download no fim do capítulo.

## Estrutura (preservada)

- A numeração (07.1 a 07.5), os IDs (`#comunicacao-fisica-1` a `-5`), o índice e o menu global foram mantidos.
- **Desktop:** o layout continua em cards assimétricos sobre o azul profundo.
  - 07.1 ocupa a largura toda;
  - 07.2 e 07.3 ficam lado a lado;
  - 07.4 é estreito e 07.5 é largo;
  - o download do manual encerra o capítulo.
- **Tablet e celular:** uma coluna.
- **Introdução:** o texto institucional aparece palavra por palavra.

| Subtópico | Conteúdo | Interação |
|---|---|---|
| 07.1 Fachadas | Texto, 5 diretrizes e a foto da fachada (pág. 12). | 5 pontos: marca (ACM), iluminação, entrada e acessibilidade, vitrine e conservação. |
| 07.2 Comunicação interna | Planta da loja com os 13 setores (pág. 10), comunicação visual do caixa (pág. 64) e 5 diretrizes. | 4 pontos na foto do caixa. |
| 07.3 Materiais de PDV | Cartaz de frente de loja (pág. 84), cartaz de ofertas (pág. 86), aplicação na loja (pág. 13), 5 diretrizes e as responsabilidades (pág. 70). | Comparação Inadequado/Adequado com as fotos da pág. 14. |
| 07.4 Uniformes | Foto do uniforme (pág. 96) e as orientações do manual. | — |
| 07.5 Sinalização e ambientação | Placas de sinalização (pág. 65), ambientação de cozinha (pág. 46), 5 diretrizes e a nota de padronização técnica. | 4 pontos na ambientação. |

- **Pontos interativos:**
  - funcionam com mouse, toque e teclado;
  - o texto aparece abaixo da foto, sem cobrir a imagem;
  - cada ponto indica a página do manual.
- **Animações:** discretas. Com animações reduzidas, nada se move.

## Download do manual

- O arquivo é **o PDF original, sem alterações**, salvo em `public/assets/merchandising/manual-merchandising-gazin.pdf`. A cópia foi conferida byte a byte, e o teste confere o tamanho e a assinatura `%PDF-`.
- **Botão:** um link comum com `download="Manual-de-Merchandising-Gazin.pdf"`. Não abre modal.
- **Publicação:** o Vite copia `public/` para o build. O servidor de desenvolvimento e o `vite preview` servem o arquivo como `application/pdf`; na hospedagem final, confirme se o servidor também usa esse tipo.
- **Tamanho:** o PDF tem 75,9 MB. Ele fica abaixo do limite de 100 MB por arquivo do GitHub, mas aumenta o repositório e o build. Se possível, peça à área responsável uma versão otimizada para web.

## Imagens

- **Origem:** as imagens foram extraídas do próprio PDF, na resolução nativa, com pdf.js (objetos de imagem de cada página).
- **Tratamento:** `scripts/import-merchandising.mjs` só redimensiona e recomprime, com limite de 1600 px. Não há recortes, filtros nem ajustes de cor.
- **Dimensões:** ficam registradas em `src/data/merchandisingPhotos.json`, para não haver salto de layout.
- **Capa do download:** `capa-manual.jpg` é a renderização da página 1.
- **Planta da loja (pág. 10):** a imagem tem muito espaço vazio acima da planta. A moldura mostra só a parte de baixo, por CSS, sem cortar o arquivo.
- **Uniforme (pág. 96):** o arquivo do manual tem só **427 px** de largura, por isso aparece pequeno e com margem. Para um destaque maior, é preciso uma foto ou mockup oficial em alta resolução.

## Pontos para validação

1. **Fontes da logomarca:** o Manual de Merchandising (pág. 11) cita **Renfrew** para "GAZIN" e **Trebuchet MS** para o slogan. O manual da logomarca, usado no capítulo 02, indica **Gotham** para o slogan. A divergência não foi resolvida no site: o capítulo 07 remete aos "padrões oficiais".
2. **Cor da marca:** a pág. 97 informa CMYK C100 M97 Y3 K3 e RGB #000F9F. O manual da logomarca informa Pantone Blue 072 C, CMYK C100 M100 Y0 K0, e o site usa o azul digital #080EA0. Também não foi resolvido.
3. **Cartaz de preço:** a pág. 13 define o Cartaz Oficial de Preço de 46 × 64 cm (KIT 1, 2 e 3). A imagem usada é o "Cartaz frente de loja" da pág. 84 (Kit 1, 2 e 3, códigos 65332–65334), mas o manual não diz nessa página que se trata do formato 46 × 64. Por isso o card mostra só a identificação da pág. 84; vale confirmar que é o mesmo cartaz. A pág. 74 cita outro formato (44 × 64 cm) para a face principal de pilhas, que não foi generalizado.
4. **Altura da comunicação visual:** a pág. 65 cita 1 m e 1,20 m conforme o pé-direito, com análise da Expansão. O site não mostra as medidas e remete ao manual.
5. **Fotos de terceiros:** algumas fotos do manual mostram marcas de produtos (por exemplo, nas embalagens). Elas foram mantidas como estão no manual.

## Como atualizar

- **Textos:** `src/data/physicalCommunication.ts`. A posição dos pontos é dada em % da largura e da altura da imagem.
- **Imagens:** troque o arquivo em `imageCatalog`, dentro de `scripts/import-merchandising.mjs`, e rode:

  ```
  node scripts/import-merchandising.mjs "<PDF>" "<pasta das imagens extraídas>"
  ```

- **Arquivos:** `src/components/physical/` (`PhysicalBody`, `InteractiveImageGuide`, `MerchandisingManualDownload`), `src/styles/physical.css` e `tests/physical.spec.ts`.
