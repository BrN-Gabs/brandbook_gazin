# 02.9 · Iconografia

**Status:** proposta para o sistema digital, em validação interna.

- **O que é proposta:** estilo, espessuras (1,5 / 2,0 / 2,5), escala de tamanhos e regras de uso. Esses valores não vêm de um manual anterior.
- **De onde vêm os ícones:** são da biblioteca open-source **Lucide** (`lucide-react` **0.468.0**, já instalada no projeto, licença ISC). A geometria não foi alterada.
- **O que a Gazin define:** a seleção, as cores e a padronização de uso.

Nenhum ícone foi desenhado ou gerado por IA, e não há logotipos na biblioteca.

## Posição e navegação

- O subtópico fica no capítulo **02 · Identidade Visual**, logo depois de Elementos Gráficos.
- Ele é o **02.9**, com o ID `identidade-visual-iconografia`.
- **IDs mantidos:** a Arquitetura de Marcas do Grupo Gazin passou a ser o **02.10**, mas manteve o ID `identidade-visual-9`. Para isso, o `brandChapters.ts` aceita um sufixo de ID fixo por subtópico.
- **Navegação atualizada:** o índice do capítulo, a navegação contextual (subnav), o menu global e o mobile mostram o novo tópico automaticamente.

## Catálogo

- **152 ícones únicos** em **10 categorias**:
  - Varejo
  - Consórcio
  - Seguros
  - GazinBank e serviços financeiros
  - Logística e distribuição
  - Indústria e produção
  - Tecnologia e e-commerce
  - Pessoas e atendimento
  - Marketing e comunicação
  - Institucional e sustentabilidade
- **Nomes conferidos:** todos foram verificados na versão instalada.
  - Não existem no 0.468: `Motorbike` (não há ícone de motocicleta, e a bicicleta não foi usada no lugar) e `SolarPanel` (a energia solar usa `Sun`).
  - Foram usados os nomes atuais em vez dos antigos: `FilePenLine` no lugar de `FileSignature` e `Earth` no lugar de `Globe2`.
- **Registro de cada ícone:** nome original do Lucide (não traduzido), nome em português, palavras-chave para a busca e categorias.
  - A primeira categoria define a pasta do ícone no ZIP completo.
  - Um ícone pode aparecer em mais de uma categoria, sem arquivo duplicado no pacote completo.
- **Busca em português:** ignora acentos e procura no nome, nas palavras-chave, na categoria e no nome original. Por exemplo, "casa", "seguro" e "caminhão" encontram os ícones esperados.

## Interface

- **Abertura:** título "Iconografia", subtítulo "Padrões e Biblioteca de Ícones", a frase "Uma linguagem visual simples, consistente e reconhecível." e o texto institucional, com uma faixa discreta de 8 ícones. O status de proposta fica só nesta documentação, não na página.
- **Diretrizes:**
  - 01 Estilo outline (características e o que evitar);
  - 02 Espessura (1,5, 2,0 e 2,5);
  - 03 Escala de tamanhos (16 a 64 px);
  - 04 Espaçamento;
  - 05 Consistência;
  - 06 Cores (as seis cores da paleta, com a função de cada uma).
- **Comparador correto × incorreto:** usa ícones reais. Os erros (deformação, sombra, cores aleatórias, espessuras diferentes) existem só na tela.
- **Biblioteca de Ícones:**
  - pesquisa, filtro por categoria e contador;
  - grid de cards compactos com o ícone, o nome em português e a categoria.
- **Painel de personalização:** fica ao lado no desktop e abre como painel inferior no celular, com botão de fechar.
  - Cor: as 6 cores da paleta.
  - Tamanho: 16, 24, 32, 48, 64, 128 e 256 px.
  - Espessura: 1,5, 2,0 e 2,5.
  - Fundo: transparente (exibido como xadrez), branco, azul institucional ou azul-marinho.
- **Rodapé:** "Ícones baseados na biblioteca open-source Lucide Icons.", com o link da licença ISC (`public/assets/iconografia/LICENSE-lucide.txt`, cópia do arquivo do pacote) e do site lucide.dev.

## Exportação (gerada no navegador, sob demanda)

| Ação | Resultado |
|---|---|
| **Baixar ícone · SVG** | `<nome-lucide>-<cor>.svg`. Mantém o viewBox `0 0 24 24`, a geometria original do componente Lucide, a cor, a espessura e o tamanho escolhidos. O fundo é transparente. |
| **Baixar PNG** | `<nome>-<cor>-<px>.png` em 64, 128, 256, 512 ou 1024 px. É transparente se o fundo for "Transparente"; senão, preenche com a cor do fundo. |
| **Copiar SVG** / **Copiar nome** | Copia o código SVG ou o nome original (por exemplo, `ShieldCheck`) para a área de transferência. Mostra uma mensagem de sucesso ou de erro. |
| **Baixar categoria** | `Icones-Gazin-<Categoria>.zip`: os SVGs da categoria, mais o `LICENSE.txt`. |
| **Baixar biblioteca completa** | `Biblioteca-Icones-Gazin.zip`: uma pasta por categoria (`Varejo/`, `Consorcio/`, `Seguros/`, `GazinBank/`, `Logistica/`, `Industria/`, `Tecnologia/`, `Pessoas/`, `Marketing/`, `Institucional/`), cada ícone uma única vez, mais o `LICENSE.txt` com a licença ISC do Lucide. |

Os pacotes usam a cor e a espessura escolhidas no painel. O ZIP é gerado por um escritor próprio (arquivos armazenados, nomes em UTF-8), sem dependência nova.

## Performance

- Só os ícones do catálogo são importados, por importação nomeada, nunca o pacote inteiro.
- A biblioteca e as ferramentas de exportação ficam num chunk separado (`React.lazy`), carregado quando a seção é exibida.

## Arquivos

- **Dados:** `src/data/iconography.ts`.
- **Componentes:** `src/components/identity/iconography/`.
  - `IconographySection`: abertura, `IconGuidelines` e `IconUsageComparison`.
  - `IconLibrary`: pesquisa, filtros, grid, personalização e downloads.
  - `iconExport.ts`: SVG, PNG, ZIP e cópia.
  - `icons.ts`: mapa de importações, gerado a partir do catálogo.
- **Estilos:** `src/styles/iconography.css` (prefixo `ic-`).
- **Testes:** `tests/iconography.spec.ts`. As capturas ficam em `docs/screenshots/identity/02-9-iconografia-*.png`.

## Ampliar o catálogo

1. Confirme o nome do ícone em https://lucide.dev/icons para a versão instalada.
2. Acrescente uma linha `icon('Nome', 'Nome em português', 'palavras, chave', 'categoria')` em `src/data/iconography.ts`.
3. Acrescente o mesmo nome em `src/components/identity/iconography/icons.ts`. O TypeScript recusa nomes inexistentes, e o teste confere se o mapa e o catálogo batem.

## Pontos para validação institucional

1. Estilo, espessuras, escala de tamanhos e regras de uso são propostas.
2. Seleção de ícones por área de negócio: confirmar se representam bem os serviços reais. Por exemplo, os ícones do GazinBank são genéricos (conta, cartão, transferência, QR Code) e não afirmam funcionalidades.
3. Não há ícone de motocicleta no Lucide 0.468. Se o consórcio de motos precisar de um ícone, ele terá de vir de uma versão futura do Lucide.
4. Verde e laranja aparecem como cores complementares, de uso restrito.
