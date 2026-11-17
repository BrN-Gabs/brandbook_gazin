# Sistema de cores Gazin

Fonte única: o bloco `:root` no início de `src/styles/globals.css`. CSS, utilitários Tailwind, SVG e a cena 3D leem as cores dali. A cena 3D lê os tokens com `getComputedStyle` em `DNACanvas.ts`. Fora desse bloco não deve haver HEX. A única exceção é o `#fff` da máscara SVG da revelação da logo, que é funcional (significa "100% visível") e não pinta nada.

## Paleta oficial

| Token | HEX | Uso |
|---|---|---|
| `--gazin-blue` | `#080EA0` | Cor institucional prioritária |
| `--gazin-blue-bright` | `#4169FE` | Luz, destaques, interação, degradês |
| `--gazin-gray` | `#494E64` | Superfícies secundárias e neutros |
| `--gazin-green` | `#5DAF02` | Acentos específicos (`--color-highlight`) |
| `--gazin-orange` | `#FD9C0F` | Destaques pontuais (`--color-special`) |
| `--gazin-white` | `#FFFFFF` | Texto, contraste, respiro |

Variações derivadas da mesma família: `--gazin-navy`, `--gazin-navy-deep`, `--gazin-navy-soft`, `--gazin-blue-deep`, `--gazin-blue-glow`, `--gazin-blue-mid`, `--gazin-blue-text`, `--gazin-blue-tint`, `--gazin-blue-light`, `--gazin-blue-50`, `--gazin-gray-light`, `--gazin-gray-dark`. Para transparências, use os canais RGB: `rgb(var(--gazin-blue-bright-rgb) / .4)`.

## Regras

- Hierarquia: cerca de 75% azuis, 15% branco e cinza azulado, 10% verde e laranja (só quando necessário).
- Abertura, introdução e DNA 3D usam apenas azuis e branco. Nada de verde, laranja ou degradês multicoloridos.
- Use primeiro as variáveis semânticas: `--color-primary`, `--color-accent`, `--color-text-on-dark`, `--color-text-muted-on-dark`, `--color-text-accent-on-dark`, `--color-text-on-light`, `--color-border-on-dark`, `--color-surface-*`.
- Degradês: `--gradient-primary`, `--gradient-dark`, `--gradient-tech`, `--gradient-night`, `--gradient-institutional`. Brilhos: `--glow-primary`, `--glow-deep`, `--glow-white`.
- Tailwind: `bg-gazin-blue`, `text-gazin-blue-bright`, `from-gazin-navy`, `text-primary`, `border-accent` e equivalentes.
- Logos, fotos e peças institucionais mantêm as cores originais. Não se aplicam filtros azuis sobre eles.

## Contraste (WCAG)

| Texto / fundo | Razão |
|---|---|
| Branco / marinho | 19,2 |
| `--gazin-gray-light` / marinho | 10,3 |
| `--gazin-blue-text` / marinho | 8,1 |
| `--gazin-blue-tint` / Azul Gazin | 8,1 |
| Branco / Azul Gazin | 13,3 |
| Branco / `--gazin-blue-mid` | 7,3 |
| Azul vibrante / marinho | 4,3: só para luz, bordas e ícones, nunca para texto pequeno |
| Branco / Azul vibrante | 4,5: só em textos grandes ou em negrito |
