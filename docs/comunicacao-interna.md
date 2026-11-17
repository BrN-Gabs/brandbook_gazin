# Capítulo 08 · Comunicação Interna

**Status:** proposta editorial, em validação interna. Textos, diretrizes e exemplos não são políticas aprovadas.

## Layout

- **Faixa de cards:** continua a faixa horizontal de cards verticais (`.layout-rail`, rolagem nativa com snap e swipe no celular).
  - Os IDs `#comunicacao-interna-1` a `-5` e a numeração 08.1 a 08.5 não mudaram.
  - Cada card mostra o número, o título, uma prévia visual, um resumo curto e o botão "Ver detalhes".
- **Navegação da faixa:** setas para avançar e voltar, e uma **barra de progresso** que acompanha a rolagem real.
- **Painel de detalhes:** um único painel abaixo da faixa traz o conteúdo completo do card selecionado.
  - Os links do índice do capítulo e do menu lateral também selecionam o card.
  - O F5 continua recomeçando pela abertura.

## Materiais

Encontrei materiais internos reais nas pastas de trabalho (`TRABALHOS 2026`). Eles **não foram publicados**, porque são comunicados e materiais internos sem autorização confirmada para o Manual e podem conter informações restritas:

- `JUNHO/COMUNICADO INFRAESTRUTURAS MATRIZ` (JPG/PSD);
- `MAIO/COMUNICADO - NORMAS DE TRABALHO E CONDUTA`;
- `MAIO/VÍDEO COPA TV GAZIN`;
- `MAIO/FAIXAS TV GAZIN PORTA`;
- `AGOSTO/PADRÃO PALESTRAS OFICINA/PADRÃO PALESTRAS OFICINA.pptx`;
- `AGOSTO/VEX26/TELAS VEX26/CONVENÇÃO INTERNA`.

**Materiais oficiais usados:** a logo Gazin e a logo TV Gazin (pasta oficial de logos) e as fotografias demonstrativas do capítulo 04.

Todas as demonstrações estão identificadas como exemplos.

## Subtópicos

| Subtópico | Demonstração | Interações |
|---|---|---|
| 08.1 TV Gazin | Monitor 16:9 com uma tela interna animada: logo TV Gazin, chamada, título, linha de apoio e logo Gazin. **Não há player**, porque não existe vídeo autorizado. | Seletor por tipo de conteúdo (Informativos, Reconhecimento, Cultura, Treinamentos, Eventos). As cenas avançam sozinhas só com movimento ativo e com a tela visível. O botão "Pausar sequência" para o avanço. |
| 08.2 Comunicados | Comunicado **fictício** ("Novo agendamento da sala de reuniões") em duas versões. | Comparador inadequado × recomendado e "Mostrar estrutura", que marca as partes de 01 a 06. Os modelos oficiais aparecem como "Pendente de disponibilização". |
| 08.3 Campanhas | Três peças editoriais neutras (reconhecimento, integração e cultura), com fotografias demonstrativas e a logo Gazin. Nenhum nome de campanha real. | Galeria com visualização ampliada (`<dialog>`: Esc, foco devolvido ao card). |
| 08.4 Materiais | Mockups de estrutura: apresentação 16:9, documento A4 e relatório. | Seletor de tipo e uma biblioteca com 5 **modelos propostos para download**, um botão por formato, com o tamanho do arquivo. |
| 08.5 Linguagem | Atributos, preferir/evitar e os 4 exemplos do briefing, como propostas didáticas. | Seletor de exemplo e Evitar × Preferir, com explicação da melhoria. A diferença é indicada por ícone e rótulo, não só pela cor. |

**Movimento:** entradas suaves da introdução, transição curta ao trocar o conteúdo do painel, hover discreto nos cards e cenas da TV. Tudo respeita a redução de movimento.

## Arquivos

- **Dados:** `src/data/internalCommunication.ts`.
- **Componentes:** `src/components/internal/`.
  - `InternalCommunicationBody`: faixa, progresso e painel.
  - `InternalDemos`: `InternalTvShowcase`, `CorporateNoticeComparison`, `EmployeeCampaignGallery`, `InternalMaterialsLibrary` e `InternalLanguageGuide`.
- **Estilos:** `src/styles/internal.css` (prefixo `in-`).
- **Testes:** `tests/internal.spec.ts`. As capturas ficam em `docs/screenshots/comunicacao-interna/`.

## Pendências

1. **Autorização** para usar os materiais internos reais listados acima, ou indicação de outros materiais próprios para divulgação.
2. **Validação dos modelos propostos** (ver abaixo), ou substituição pelos modelos oficiais da empresa.
3. **Vídeo institucional da TV Gazin** autorizado para comunicação interna. Ele substituiria a demonstração animada por um player com legendas.
4. **Validação** dos textos, das diretrizes, das categorias e dos exemplos de linguagem.

## Modelos propostos (08.4)

Gerados por `scripts/generate-internal-templates.mjs`. Eles usam a logomarca oficial (arquivos do capítulo 02, sem alteração), a paleta e as fontes Plus Jakarta Sans e Inter. Os textos são campos entre colchetes, sem conteúdo nem dados reais. O rodapé de cada arquivo traz "Modelo proposto pelo Manual da Marca DNA Gazin · versão 1 · em validação".

| Modelo | Arquivos (`public/assets/comunicacao-interna/modelos/`) |
|---|---|
| Apresentação corporativa | `modelo-apresentacao-corporativa-gazin.pptx` (16:9, 6 slides: capa, divisória, conteúdo, conteúdo com imagem, pontos-chave e encerramento) |
| Documento institucional | `modelo-documento-institucional-gazin.docx` (A4, cabeçalho com a logomarca, numeração de páginas) |
| Comunicado interno | `modelo-comunicado-interno-gazin.docx` e `.pdf` (as seis partes do 08.2) |
| Relatório | `modelo-relatorio-gazin.pptx` (indicadores, gráfico editável com dados de exemplo e conclusões) e `modelo-relatorio-gazin.xlsx` (atingimento e status calculados por fórmula, mais uma aba "Como usar") |
| Kit de eventos | `kit-materiais-eventos-gazin.pdf` e `kit-materiais-eventos-gazin-png.zip` (tela de abertura 1920 × 1080, sinalização direcional A4 e crachá, mais LEIA-ME) |

Conferência: os arquivos Office abrem no PowerPoint, no Word e no Excel. Os testes confirmam o tipo de cada arquivo e o tamanho declarado.

Para gerar de novo: `npm install pptxgenjs@3.12.0 docx@9.5.1 exceljs@4.4.0` numa pasta fora do projeto e depois `node scripts/generate-internal-templates.mjs "<essa pasta>"`. Essas bibliotecas não entram no site.