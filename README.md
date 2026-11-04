# Brandbook digital Gazin

Brandbook institucional em React, Vite, TypeScript e Tailwind CSS, com GSAP/ScrollTrigger e Lenis para a narrativa de movimento. Sem backend. Abertura e introdução formam um bloco visual, seguido de missão, visão, valores e pilares.

## Executar

Requer Node.js 22.12 ou superior e npm.

```sh
npm install
npm run dev
```

Abra o endereço informado pelo Vite (normalmente http://127.0.0.1:5173).

Nesta máquina, também há um Node.js portátil na pasta ignorada `.tools/node-v22.23.4-win-x64`. Para usá-lo no PowerShell, sem instalar globalmente:

```powershell
$env:PATH = (Join-Path (Get-Location) '.tools/node-v22.23.4-win-x64') + ';' + $env:PATH
npm.cmd run dev
```

## Build e publicação posterior

```sh
npm run build
npm run preview
```

O build gera `dist/`, que pode ser publicado em qualquer hospedagem estática. A base relativa permite hospedagem em subpastas. Não abra o HTML diretamente pelo protocolo `file://`; use um servidor HTTP. Não é necessário serviço de API, configuração de banco ou segredo de ambiente.

## Organização

- `src/data/brandContent.ts`: textos, navegação, etiquetas, textos acessíveis, pilares e fontes institucionais.
- `src/sections/`: as cinco seções, independentes e reutilizáveis.
- `src/components/`: header, menu mobile, footer, revelações, progresso e símbolos geométricos próprios.
- `src/styles/globals.css`: cores, tipografia, escala fluida e ajustes responsivos.
- `src/motion/`: configuração compartilhada, gerenciamento de scroll e animações independentes das cinco seções. Consulte [Motion Design](docs/MOTION.md).
- `public/assets/logo-gazin.png`: arquivo original, sem processamento ou alteração.
- `tests/brandbook.spec.ts`: testes de navegação, conteúdo, responsividade, assets e teclado.
- `docs/screenshots/`: capturas locais de revisão.

Para adicionar uma seção, crie o componente em `src/sections`, acrescente seus textos e link em `brandContent.ts`, e inclua-o em `App.tsx`. Os IDs das se??es permitem acesso por links diretos.

## Identidade e conteúdo

O azul atual do layout é `#080b70`, definido em `--color-brand`, e os detalhes usam `--color-brand-light: #b8c7ff`. O arquivo original da logo é preservado com proporção 2974 × 835, `height: auto` e `object-fit: contain`; nenhuma versão reconstruída ou recolorida é utilizada. As fontes Plus Jakarta Sans e Inter são servidas localmente pelo próprio build, com suas licenças OFL nos respectivos pacotes.

Missão, visão e os cinco valores foram conferidos na [página institucional da Gazin](https://www.grupogazin.com.br/empresa). A [página do varejo](https://grupogazin.com.br/negocio/varejo) foi consultada para contexto. Não foram acrescentados números corporativos ou métricas.

Os quatro pilares são uma **proposta editorial em validação**, não uma classificação oficialmente aprovada. Seus nomes, atributos e descrições, bem como os textos editoriais de apresentação, devem passar pela revisão institucional antes da publicação definitiva. O aviso está visível na própria seção.

## Direção visual

Referência: [Brandbook Magalu](https://especiais.magazineluiza.com.br/brandbookmagalu/brandbook/). A análise orientou títulos grandes, fundos sólidos, introdução em três colunas com divisórias, missão tipográfica com etiqueta contornada e pilares em quatro colunas numeradas. A implementação é própria: nenhum código ou arquivo visual da referência é usado no site final. Material local de análise está em `docs/references/`, fora do build e ignorado pelo Git.

## Verificação

```sh
npm run test:e2e
```

Os testes utilizam o Chrome instalado no computador. Para usar Edge, defina `PLAYWRIGHT_CHANNEL=msedge`. Não há download automático de navegador. São cobertas larguras de 1920, 1440, 768, 390 e 320 px, âncoras, movimento reduzido, erros de console e ausência de requisições a arquivos da Magalu.

`tests/motion.spec.ts` acrescenta scroll nos dois sentidos, 1024 px, revelação progressiva, pin condicional, mudanças de preferência e tamanho em tempo real, wheel, foco por teclado, histórico e falha de carregamento do módulo de movimento. Capturas com animação ficam em `docs/screenshots/motion/`.

A capa usa o fundo azul liso, com o t?tulo Brandbook e a logo original centralizados, sem navbar. As animações respeitam `prefers-reduced-motion`. Ícones e geometrias decorativas são ocultos de leitores de tela.
