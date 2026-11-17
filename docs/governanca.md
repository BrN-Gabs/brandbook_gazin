# Capítulo 10 · Governança da Marca

O capítulo combina dois tipos de conteúdo, sempre identificados no site por um selo:

- **Regra documentada:** sustentada pelo manual da logomarca ou pelo Manual de Merchandising, com a página de referência.
- **Modelo de referência · sujeito à validação interna:** proposta editorial que não é política vigente. Inclui as responsabilidades, o fluxo de aprovação e os princípios de manutenção.

O capítulo está marcado como `status: 'draft'` em `brandChapters.ts`; esse status não aparece no site.

## Estrutura (preservada)

- **Cards na linha:** os cinco cards continuam ligados pela linha horizontal.
  - A linha se desenha com o scroll e se ilumina até o card selecionado.
  - Os cards entram em sequência.
  - Os IDs `#governanca-1` a `-5` e o menu foram mantidos.
- **Área de detalhes:** cada card tem um resumo e o botão "Explorar". O conteúdo completo abre numa área de detalhes abaixo, para os cards não ficarem estreitos demais. Os links do menu também selecionam o card.
- **Introdução:** o texto institucional aparece palavra por palavra, com a frase "Cuidar da nossa marca é preservar tudo o que ela representa." em destaque. A frase tem o rótulo "Síntese editorial do capítulo" e não é slogan.
- **Tablet:** cards em duas colunas.
- **Celular:** sequência vertical com linha vertical; o fluxo vira lista vertical. Tudo funciona por toque e não há conteúdo cortado.

| Subtópico | Componente | Interação |
|---|---|---|
| 10.1 Responsabilidades | Cinco grupos ao redor de "Gestão da marca". Não é um organograma. | Selecionar um grupo ilumina a conexão e mostra as atribuições de referência. Setas do teclado funcionam. |
| 10.2 Fluxos de Aprovação | Solicitação → Criação → Conferência → Validação → Publicação, com número, ícone, nome e descrição. | A linha avança até a etapa selecionada. Há botões anterior/próxima e setas do teclado. Na validação aparece a ramificação "Aprovado?": Sim → publicação; Não → volta para ajustes. |
| 10.3 Diretrizes de Utilização | Três grupos: Identidade visual, Identidade verbal e Aplicações. | Regras essenciais com a página do manual e links para os capítulos 02, 03, 06 e 07. |
| 10.4 Usos Incorretos | Comparador Correto × Incorreto (proporção, cores, área de segurança, composição e legibilidade) e as sete restrições, cada uma com a página do manual. | Reaproveita as demonstrações do capítulo 02: o "correto" é o arquivo oficial intacto e o "incorreto" é o mesmo arquivo alterado só na tela, com o selo "Não utilizar". Nada disso é oferecido para download. |
| 10.5 Manutenção | Seis princípios propostos, controle documental e histórico de atualizações. | O controle documental mostra só o que está documentado. O histórico está vazio, com o aviso "ainda será disponibilizado" e os campos previstos, sem registros fictícios. |
| Documentos e Diretrizes da Marca | Manual da logomarca Gazin (PDF, 16 páginas, 2,4 MB, edição 2024) e Manual de Merchandising Gazin (PDF, 118 páginas, 75,9 MB). | Download real com nome de arquivo definido. O Manual de Merchandising usa **o mesmo arquivo** do capítulo 07, sem duplicar. |

## Fundamentação das regras

- **Variações gráficas:** "A logomarca aqui apresentada não deverá sofrer variações gráficas em nenhum tipo de aplicação institucional, comercial ou interna" (manual da logomarca, pág. 06–07). Sustenta a "integridade da marca" e os "efeitos não autorizados".
- **Tipografia:** Renfrew no nome GAZIN e Gotham Bold inclinada no slogan (pág. 10–11). Sustenta a "modificação tipográfica".
- **Usos NÃO recomendados (pág. 20–21):** distorção, cores e composição.
- **Área de segurança e reduções:** pág. 15 e pág. 17.
- **Materiais oficiais no PDV:** Manual de Merchandising, pág. 70.

## Pendências de validação institucional

1. **Responsabilidades (10.1):** os cinco grupos e suas atribuições são de referência. Não atribuem autoridade formal de aprovação nem representam a estrutura administrativa.
2. **Fluxo (10.2):** é um modelo de boas práticas. Não define quem aprova, prazos, sistemas, níveis de autorização nem assinaturas.
3. **Princípios de manutenção (10.5):** são propostas. O histórico de atualizações deve ser preenchido pelas áreas responsáveis em `maintenance.history` (`src/data/governance.ts`).
4. **Ano do manual da logomarca:** aparece só como "edição 2024", que é como o próprio arquivo se identifica, e não como "versão vigente".
5. **Divergência já registrada no capítulo 07:** o Manual de Merchandising cita fontes e valores de cor diferentes do manual da logomarca. As regras de governança seguem o manual da logomarca.

## Arquivos

- **Textos e dados:** `src/data/governance.ts`.
- **Componentes:** `src/components/governance/`
  - `GovernanceBody`: linha, cards e área de detalhes.
  - `GovernanceDemos`: `GovernanceResponsibilities`, `ApprovalWorkflow`, `BrandUsageGuidelines`, `BrandUsageComparison`, `BrandManualMaintenance` e `BrandDocumentsLibrary`.
- **Estilos:** `src/styles/governance.css`.
- **Testes:** `tests/governance.spec.ts`.
- **Documento:** `public/assets/documentos/manual-da-logomarca-gazin.pdf`, cópia idêntica do `Manual da Logomarca Gazin 2024.pdf`.
- **Também alterados:**
  - `brandChapters.ts`: layout `governance` e introdução.
  - `BrandbookChapter.tsx`.
  - `IncorrectUsageGallery.tsx`: as demonstrações correta e incorreta passaram a ser exportadas para reuso.
  - `VerbalAnimations.ts`: entrada da introdução e do destaque.
  - `tests/chapters.spec.ts`.
