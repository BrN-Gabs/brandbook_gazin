// Gera as versões da logomarca para download (PNG transparente) a partir do arquivo
// original public/assets/logo-gazin.png, sem redesenhar a marca:
//   · a geometria do retângulo e das letras vem sempre dos pixels do arquivo original;
//   · as versões monocromáticas pintam a área azul do arquivo (letras vazadas);
//   · o contorno branco segue o contorno extraído do arquivo (src/components/dna/logoOutline.ts);
//   · o slogan é composto em Montserrat Bold Italic, substituta livre (OFL) da Gotham Bold,
//     na posição da pág. 07 do manual (abaixo do retângulo, ~79% da largura).
// Saída: public/assets/logos/*.png e public/assets/logos/gazin-logos.zip
// Uso: node scripts/export-logo-versions.mjs
import { mkdir, readFile, rm } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { chromium } from '@playwright/test'

const root = new URL('../', import.meta.url)
const out = new URL('public/assets/logos/', root)
const png = await readFile(new URL('public/assets/logo-gazin.png', root))
const outlineSource = await readFile(new URL('src/components/dna/logoOutline.ts', root), 'utf8')
const outline = outlineSource.match(/logoOutline = '([^']+)'/)[1]
const font = await readFile(new URL('node_modules/@fontsource/montserrat/files/montserrat-latin-700-italic.woff2', root))

const W = 2974, H = 835
const BLUE = '#080EA0'     // azul digital da marca
const BLACK = '#231F20'    // preto da versão P&B (manual, pág. 18)
const WHITE = '#FFFFFF'
const CONTOUR = 30         // contorno branco em fundo escuro (espessura não especificada no manual)
const SLOGAN = 'Sempre fazendo o melhor pra Você!'
const slogan = { x: W * .035, gap: 81, width: W * .79 }

const logo = `data:image/png;base64,${png.toString('base64')}`

/** Each version: how the mark is painted and the slogan colour. */
const versions = [
  { id: 'cores-originais', label: 'Cores originais', mark: 'original', sloganColor: BLUE },
  { id: 'fundo-escuro', label: 'Fundo escuro', mark: 'contour', sloganColor: WHITE },
  { id: 'preto-branco', label: 'Preto e branco', mark: 'solid', color: BLACK, sloganColor: BLACK },
  { id: 'uma-cor', label: 'Uma cor', mark: 'solid', color: BLUE, sloganColor: BLUE },
  { id: 'negativo', label: 'Negativo', mark: 'negative', sloganColor: WHITE },
]

function markSvg(version) {
  const defs = `
    <filter id="blue-area" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="-.8 -.8 -.8 0 1.6  -.8 -.8 -.8 0 1.6  -.8 -.8 -.8 0 1.6  0 0 0 1 0"/></filter>
    <filter id="letters" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values=".8 .8 .8 0 -1.4  .8 .8 .8 0 -1.4  .8 .8 .8 0 -1.4  0 0 0 1 0"/></filter>
    <mask id="m-blue" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><image href="${logo}" width="${W}" height="${H}" filter="url(#blue-area)"/></mask>
    <mask id="m-letters" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><image href="${logo}" width="${W}" height="${H}" filter="url(#letters)"/></mask>`
  switch (version.mark) {
    case 'original': return { defs, body: `<image href="${logo}" width="${W}" height="${H}"/>`, pad: 0 }
    case 'contour': return { defs, pad: CONTOUR, body: `<path d="${outline}" fill="${WHITE}" stroke="${WHITE}" stroke-width="${CONTOUR * 2}" stroke-linejoin="round"/><image href="${logo}" width="${W}" height="${H}"/>` }
    case 'solid': return { defs, pad: 0, body: `<rect width="${W}" height="${H}" fill="${version.color}" mask="url(#m-blue)"/>` }
    case 'negative': return { defs, pad: 14, body: `<path d="${outline}" fill="none" stroke="${WHITE}" stroke-width="24" stroke-linejoin="round"/><rect width="${W}" height="${H}" fill="${WHITE}" mask="url(#m-letters)"/>` }
  }
}

function documentFor(version, withSlogan) {
  const { defs, body, pad } = markSvg(version)
  const sloganHeight = withSlogan ? slogan.gap + 132 : 0
  const width = W + pad * 2, height = H + pad * 2 + sloganHeight
  const text = withSlogan
    ? `<text id="slogan" x="${slogan.x}" y="${H + slogan.gap + 82}" fill="${version.sloganColor}" font-family="Slogan" font-style="italic" font-weight="700" font-size="114">${SLOGAN}</text>`
    : ''
  return `<!doctype html><html><head><style>
    @font-face { font-family: Slogan; font-style: italic; font-weight: 700; src: url(data:font/woff2;base64,${font.toString('base64')}) format('woff2'); }
    html, body { margin: 0; background: transparent; }
  </style></head><body>
    <svg id="art" xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${-pad} ${-pad} ${width} ${height}"><defs>${defs}</defs>${body}${text}</svg>
  </body></html>`
}

await rm(out, { recursive: true, force: true })
await mkdir(out, { recursive: true })
const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome' })
const page = await browser.newPage({ deviceScaleFactor: 1, viewport: { width: 3200, height: 1400 } })
const files = []
for (const version of versions) {
  for (const withSlogan of [false, true]) {
    await page.setContent(documentFor(version, withSlogan))
    await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(image => image.decode?.())) })
    if (withSlogan) {
      // Fit the slogan to the documented width without distorting the glyphs.
      await page.evaluate(target => {
        const text = document.getElementById('slogan')
        const size = Number(text.getAttribute('font-size'))
        text.setAttribute('font-size', String(size * target / text.getComputedTextLength()))
      }, slogan.width)
    }
    await page.waitForTimeout(150)
    const name = `gazin-${version.id}${withSlogan ? '-slogan' : ''}.png`
    await page.locator('#art').screenshot({ path: join(fileURLToPath(out), name), omitBackground: true })
    files.push(name)
    console.log('✓', name)
  }
}
await browser.close()

// One archive with every version.
const dir = fileURLToPath(out)
const zip = 'gazin-logos.zip'
if (process.platform === 'win32') {
  execFileSync('powershell', ['-NoProfile', '-Command', `Compress-Archive -Path ${files.map(file => `'${dir}${file}'`).join(',')} -DestinationPath '${dir}${zip}' -Force`])
} else {
  execFileSync('zip', ['-j', `${dir}${zip}`, ...files.map(file => `${dir}${file}`)])
}
console.log('✓', zip)
