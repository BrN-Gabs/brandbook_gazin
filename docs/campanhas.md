# Capítulo 05 · Campanhas — Campanhas Gazin 2027

## Fontes

- **Calendário:** `TRABALHOS 2026/OUTUBRO/CALENDÁRIO 2027/CALENDÁRIO 2027 - V2.pdf`.
  - O arquivo tem **38 páginas**: 37 de conteúdo e uma contracapa azul, sem texto.
  - Os nomes das campanhas aparecem só nas logos, que são imagens. Os períodos e as descrições vêm do texto de cada mês.
- **Logos:** `Área de Trabalho/Logos Campanhas`, com **29 PNG** originais (incluindo `Logo 61 anos.png`), todos com transparência. Não há SVG, AI, EPS ou PDF, então o único formato oferecido é PNG.

## Campanhas cadastradas (29 + 1 para fornecedores)

| Tipo | Campanhas |
|---|---|
| Institucional | **61 anos Gazin**: "Além do brilho, 61 anos iluminando caminhos." (capa e pág. 2) |
| Recorrentes (pág. 9) | Dia Único, Dia D, Alerta de Ofertas, Fecha Mês |
| Exclusiva para fornecedores (pág. 8) | **Hoje é Dia D** ("Gazin + sua marca aqui!"): terceira sexta e sábado de cada mês, em varejo, e-commerce e atacado. Fica em `supplierCampaign`, num bloco próprio logo após o 05.2, **fora da biblioteca e dos downloads**. |
| Sazonais (págs. 10–32) | Queima Total Nacional (02–10/jan) · Verão é na Gazin (18–24/jan) · Os Preços Caíram na Folia (01–09/fev) · Semana do Esportista (15–21/fev) · Quinzena do Consumidor (01–15/mar) · Tudo que Ela Quer (05–07/mar) · Parece Mentira, Mas é Verdade (01–03/abr) · O Melhor pra Mamãe de A a Z (01–09/mai) · Par Perfeito (01–13/jun) · Festança do Preço Baixo (14–20/jun) · Pintando 7 · APAE (01–31/jul) · O Melhor pro Paizão (01–08/ago) · Semana da TV e Informática (09–14/ago) · 13 da Sorte (13/ago) · O Gerente Viajou (15–22/ago) · Semana do Brasil (01–07/set) · Quinzena do Cliente (13–25/set) · Outubro é 10 (01–30/out) · O Melhor pra Criançada (01–12/out) · Black Friday Show (01–30/nov) · Natal Mais Azul do Brasil (01–25/dez) · Aniversário Gazin (13/dez) · Colchão da Virada (27–31/dez) · Selfie da Virada (27–31/dez) |

- **Logos:** as 29 foram associadas, e cada arquivo publicado é **idêntico ao original** (o teste compara byte a byte).
- **Casos especiais:**
  - **61 anos Gazin:** agora tem logo (`Logo 61 anos.png`, 4899 × 3100, feita para fundo escuro). Ela aparece no 05.1, com "Baixar logo", e na biblioteca.
  - **Hoje é Dia D:** o bloco de fornecedores mostra só a logo, recortada da arte da pág. 8 (`previas/hoje-e-dia-d-logo.webp`, feita por `scripts/crop-supplier-logo.mjs`). Não há download.

## Downloads

| O quê | Arquivo publicado |
|---|---|
| Logo individual (original) | `public/assets/campanhas/2027/logos/<campanha>/<nome original>.png` |
| Todas as logos | `public/assets/campanhas/2027/downloads/logos-campanhas-gazin-2027.zip` (29 arquivos, uma pasta por campanha, nomes UTF-8 com `/`, 67,1 MB) |
| Calendário integral | `public/assets/campanhas/2027/calendario/calendario-gazin-2027.pdf` (cópia idêntica, 36,4 MB). Há o botão "Baixar" e o "Visualizar", que abre em nova aba. |

As prévias leves (WebP com transparência, até 720 px) ficam separadas, em `previas/`, e são usadas só para exibição. Elas não são oferecidas para download.

## Interface

- **05.1:** a campanha de referência 61 anos, com a logo oficial, o conceito, um trecho do calendário e os botões "Ver detalhes" e "Baixar logo".
- **05.2:** as recorrentes e a programação mês a mês (Jan–Jun e Jul–Dez). Clicar abre o painel de detalhes.
- **Layout:** 05.1 ocupa 5 colunas e 05.2 ocupa 7, para os dois terminarem juntos. No 05.3 e no 05.4, a peça acompanha a rolagem (sticky). O 05.5 tem duas colunas: formatos e o comparador.
- **Hoje é Dia D · exclusiva para fornecedores:** o bloco tem a logo recortada (sem o quadro de texto da pág. 8, que já está ao lado), a assinatura, a chamada, o texto e os campos "Quando", "Canais" e "Objetivo".
- **05.3 e 05.4:** uma peça demonstrativa montada com a **logo oficial** de Semana da TV e Informática e a **logo Gazin oficial** (`assets/logos/gazin-fundo-escuro.png`, a versão para fundo escuro do capítulo 02).
  - **A logo Gazin é obrigatória.** Ela fica abaixo da logo da campanha, sobreposta só à borda inferior, para que o nome da campanha continue legível. Um teste confere a posição e a proporção.
  - O 05.3 tem o destaque "Logo Gazin obrigatória", e o nível 01 da hierarquia descreve essa regra.
  - Os textos, o produto e os valores são ilustrativos, e isso está identificado no site.
  - As camadas e a hierarquia (01–06) se destacam ao serem selecionadas.
- **05.5:** os formatos Story 9:16, Feed 4:5, Quadrado 1:1, Banner 16:9 e A4.
  - A peça é desenhada em tamanho fixo e escalada, como uma exportação real.
  - O comparador padronizada × incorreta mostra logo distorcida, cores alteradas, elementos sobrepostos, peça sem a logo Gazin e texto ilegível. Os erros existem só na tela.
- **Calendário Gazin 2027:** a capa, as 38 páginas e os dois botões (baixar e visualizar).
- **Biblioteca:**
  - pesquisa, que ignora acentos;
  - 29 campanhas, sem o Hoje é Dia D;
  - filtros por categoria (todas, institucionais, promocionais, recorrentes), mês e formato (PNG ou sem arquivo);
  - cards com a logo, o nome, o período, a categoria, a descrição, "Visualizar" e "Baixar logo";
  - o botão "Baixar todas as logos 2027".
- **Painel de detalhes:** um `<dialog>` centralizado na tela, com a logo, o período, o conceito, as observações, o download (com formato, dimensões e tamanho) e a página do calendário em que a campanha aparece.

**As logos nunca são recoloridas nem distorcidas.** Um teste confere que a proporção exibida é igual à do arquivo original.

## Pontos para validação

1. **Número de páginas:** o PDF tem 38 páginas, e não 37.
2. **Queima Total:** o arquivo `QUEIMA TOTAL GAZIN.png` mostra "Queima Total **Nacional**" e tem fundo próprio, não transparente.
3. **Natal Mais Azul do Brasil:** a logo tem resolução baixa (643 × 495 px).
4. **Aniversário Gazin (13/dez):** foi classificado como promocional, porque o calendário fala em "ofertas especiais". O 61 anos é a campanha institucional.
5. **Pintando 7 · APAE:** foi classificado como promocional, com apoio às APAEs. Confirmar se deve ser institucional.
6. **Outubro é 10:** o calendário diz "De 01 a 30", e outubro tem 31 dias.
7. **Recorrentes:** as datas de Dia D, Alerta de Ofertas e Fecha Mês variam e estão no calendário mês a mês; não foram reproduzidas uma a uma.
8. **Tamanho do site:** os arquivos somam cerca de 175 MB (logos originais 67 MB, ZIP 67 MB e calendário 36 MB).

## Como atualizar

- **Dados:** `src/data/campaigns.ts`.
- **Importação:** rode

  ```
  node scripts/import-campaigns.mjs "<Logos Campanhas>" "<CALENDÁRIO 2027 - V2.pdf>" "<pasta das páginas renderizadas>" "<arte da pág. 8 em alta resolução, p008-0-3900x3150.png>"
  ```

  O script copia os originais, gera as prévias e o ZIP e grava `src/data/campaignFiles.json`.
- **Nova campanha:** acrescente o objeto em `campaigns` e o arquivo em `logoCatalog`, no script.
- **Arquivos:**
  - componentes: `src/components/campaigns/` (`CampaignsBody`, `CampaignViewer`, `CampaignLibrary`);
  - estilos: `src/styles/campaigns.css`;
  - testes: `tests/campaigns.spec.ts`.
