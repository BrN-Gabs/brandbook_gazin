# Capítulos 01–11: como inserir conteúdo

A estrutura dos capítulos vem de um único arquivo: `src/data/brandChapters.ts`. Não é preciso mexer em componentes, estilos ou navegação para publicar conteúdo. Menu, índice interno, links diretos e indicador de seção ativa são gerados a partir desses dados.

> **Exceção:** o capítulo 02 · Identidade Visual já tem conteúdo completo e interativo (`layout: 'identity'`), renderizado por `src/components/identity/` com dados em `src/data/visualIdentity.ts`. Veja [identidade-visual.md](identidade-visual.md). O exemplo abaixo é apenas ilustrativo.

## Publicar um subtópico

Localize o subtópico pelo título e acrescente `content` e `status`:

```ts
// dentro de brandChapters, no capítulo 'identidade-visual'
['Logotipo e suas Versões', ['logo', 'text']],
```

Para dar conteúdo a um item, transforme a entrada em objeto no `chapter(...)` ou edite o resultado após a criação. O formato final de cada subtópico é:

```ts
{
  id: 'identidade-visual-1',          // gerado: link direto #identidade-visual-1
  number: '02.1',
  title: 'Logotipo e suas Versões',
  kinds: ['logo', 'text'],            // formato dos espaços reservados enquanto não há mídia
  status: 'ready',                    // 'planned' | 'draft' (em revisão) | 'ready' (publicado)
  content: {
    text: ['Primeiro parágrafo oficial…', 'Segundo parágrafo…'],
    media: [
      { type: 'image', src: 'assets/capitulos/logo-versoes.png', alt: 'Versões do logotipo Gazin', caption: 'Opcional' },
      { type: 'video', src: 'assets/capitulos/tv-gazin.mp4', poster: 'assets/capitulos/tv-gazin.jpg', alt: 'Vinheta da TV Gazin' },
    ],
  },
}
```

- `content.text` substitui o espaço "Espaço reservado para descrição".
- `content.media` substitui os espaços visuais. Coloque os arquivos em `public/assets/…` e use o caminho sem a barra inicial.
- `status` muda o selo: neutro e tracejado (`planned`), laranja (`draft`) ou verde (`ready`).
- A descrição do capítulo fica em `description: ['…']` no próprio `chapter({ … })`.

## Novos subtópicos ou capítulos

- Para incluir um subtópico, adicione uma linha `['Título', [tipos]]` ao capítulo. Número, link, menu e índice são criados automaticamente.
- Para incluir um capítulo, adicione outro `chapter({ id, number, title, layout, theme, subsections })`.
- Composições disponíveis: `split`, `bento`, `rows`, `rail`, `mosaic`, `devices`, `tree` e `flow`.
- Temas disponíveis: `night`, `deep`, `brand` e `light`, todos da família de azuis (veja `docs/cores.md`).

## Componentes

`src/components/chapters/`:

- `BrandbookChapter`: capítulo, `ChapterHeader`, `ChapterNavigation` e `BrandbookSubsection`.
- `MediaShowcase`: mídia real ou espaços reservados.
- `ContentPlaceholder`: espaço reservado por tipo de material.

A navegação geral fica em `src/components/BrandbookNav.tsx`, as animações em `src/motion/ChapterAnimations.ts` e os estilos em `src/styles/chapters.css`.

Os textos dos espaços reservados ("Conteúdo em desenvolvimento", "Adicionar imagem ou material visual"…) estão em `placeholderCopy` e são provisórios: não são diretrizes da marca.
