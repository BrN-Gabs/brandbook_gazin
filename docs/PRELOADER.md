# Abertura cinematográfica Gazin

Implementação integrada ao React/Vite existente. Nenhuma dependência adicionada: utiliza GSAP e CustomEase do pacote já instalado. A logo original `public/assets/logo-gazin.png` (2974 × 835, transparência preservada) não foi modificada.

## Sequência e referência

Os cinco JPEGs fornecidos representam 0%, 50%, 100%, revelação e composição final. Fundo amostrado: `#4068FD`; azul da logo: `#0B109F`. O destino mantém o azul existente da introdução, `#080B70`.

O contorno SVG ocupa 37,2% da largura no desktop e acompanha a proporção da logo. Dois segmentos azuis percorrem seu traçado branco. Inter Variable 200 compõe o percentual e Inter Variable 900 compõe as palavras, reaproveitando as fontes locais. A referência não inclui o arquivo/nome da fonte: a composição utiliza essa aproximação tipográfica, sem reconstruir a logo.

A composição permanente agora apresenta a logo na posição original e um único título grande “brandbook” centralizado logo abaixo. Na transição, as palavras da abertura se deslocam e se unem nesse título. Foram removidos “INTRODUÇÃO”, o título pequeno acima da logo e os números das três colunas. Consulta, Apoio e Coerência usam uma largura máxima de 1080 px, tipografia menor e divisórias discretas; os textos foram mantidos integralmente. O espaço entre a área da logo e o título é de 22 px no desktop e 24 px no mobile, além das métricas internas da fonte.

Após prontidão, há confirmação de 100% por 0,24 s, entrada tipográfica de 0,82 s com revelação sobreposta da logo de 0,64 s, leitura de 0,55 s (0,42 s após carregamentos mais demorados) e transição coordenada. A logo desloca-se e reduz sua escala até o destino real na página; o fundo escurece e revela título e colunas. A introdução conserva integralmente os textos de Consulta, Apoio e Coerência.

## Prontidão e proteção contra bloqueio

`usePreloader` monitora decodificação da logo (40%) e quatro cargas de fontes essenciais (20% + 20% + 10% + 10%). Trata-se de progresso ponderado de recursos essenciais, não medição de bytes de toda a página. O contador suaviza esses marcos e só mostra 100% quando todos estão prontos. Recursos das demais seções não entram nessa espera.

Se uma carga falhar ou exceder 6,5 s, a abertura se dissolve rapidamente sem afirmar 100%. Escape e o botão de teclado “Pular abertura” também liberam o conteúdo. As fontes CSS possuem fallback. O véu inline inicial evita flash da página antes de React montar e tem sua própria proteção de 8 s.

## Ciclo de vida e acessibilidade

- Overlay montado uma vez por inicialização da página, fora das seções. Mudanças de preferência, hashes internos e rerenders não o recriam. Recarregar a página inicial reproduz a sequência.
- Links diretos para capítulos, como `/#pilares`, vão diretamente ao conteúdo.
- Scroll bloqueado e página `inert` enquanto a abertura existe; foco contido no botão de pular. Ao sair, foco e estilos anteriores são restaurados.
- `prefers-reduced-motion` e a preferência salva no controle do site usam a versão rápida, sem grandes deslocamentos. Alterações durante a animação também são respeitadas.
- Timeline, RAF e listeners são descartados, inclusive na montagem dupla de desenvolvimento do React StrictMode. O motor de scroll/Lenis inicia após o overlay sair e não repete as entradas.
- Mudança de orientação durante o deslocamento da logo encerra suavemente a abertura para evitar um destino de layout desatualizado.

## Arquivos

- `src/components/BrandbookPreloader.tsx`: overlay, `LoadingOutline`, percentual, composição e timeline.
- `src/motion/usePreloader.ts`: prontidão dos assets e fallback.
- `src/styles/preloader.css`: geometria responsiva, cores e tipografia da abertura.
- `src/App.tsx`, `src/motion/useBrandMotion.ts`: integração e início coordenado do scroll.
- `src/motion/IntroAnimations.ts`: mantém apenas os efeitos de saída, sem repetir a nova entrada.
- `src/sections/Introduction.tsx`, `src/styles/globals.css`: grid editorial, título e escala da logo na introdução.
- `index.html`: preload da logo e cor inicial antes da aplicação montar.
- `tests/preloader.spec.ts`: cobertura da abertura e condições de falha.

## Validar

```sh
npm run dev
npm run build
npm run test:e2e -- tests/preloader.spec.ts tests/brandbook.spec.ts
```

Abra `http://127.0.0.1:5173/` e recarregue para rever. Se o sistema estiver com movimento reduzido, use “Ativar animações” no controle existente e recarregue. Verifique também 320/390 px, orientação horizontal, Tab/Escape e `/#pilares`. Para simular rede lenta, use o Network do DevTools, desative o cache e recarregue: o percentual deve aguardar os assets.

Capturas de revisão são geradas em `docs/screenshots/preloader/`. A suíte utiliza Chrome instalado; homologação em Safari/iOS e aparelhos físicos permanece uma verificação separada.

Validação em 11/11/2026: build de produção aprovado. Os 42 testes foram verificados: 41 passaram na rodada completa; o teste da malha passou na reexecução após ajustar a amostragem à margem livre do novo título. Os seis testes de leitura/navegação também foram reexecutados e passaram. Foram inspecionadas capturas da composição, do loading e da introdução; o navegador integrado ao chat estava indisponível, mas os testes e capturas usaram o Chrome local.

Revisão posterior do título: os 13 testes da abertura passaram com a nova composição, antes do último ajuste de aproximação à logo. O build dessa revisão não foi executado porque a revisão automática de permissão atingiu o limite de uso da ferramenta.

Revisão da interação do título: build de produção aprovado após o restabelecimento da ferramenta, incluindo o ajuste de espaçamento. Distorção localizada em blocos adicionada ao “brandbook”; quatro verificações de hover, restauração, scroll/resize, preferências e touch aprovadas. Capturas de repouso e hover em `docs/screenshots/distortion/`.
