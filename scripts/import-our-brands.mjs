// Importa as logomarcas do capítulo "Nossas Marcas" a partir do "Portfolio_Marcas_Grupo_Gazin.pdf"
// (página "Sobre a marca" de cada marca).
//   · 8 logos estão EMBUTIDAS no PDF como PNG com transparência: usadas como estão (extração
//     da imagem original, sem redesenho), apenas reduzidas para a web quando muito grandes;
//   · Gold Confort e Sleep On são VETORES na página: a página é renderizada em alta resolução
//     (escala 6) e a logo é recortada da área "Sobre a marca", com o fundo branco da página.
// Nada é recolorido, deformado ou reconstruído. Grava src/data/ourBrandsFiles.json.
// Uso: node scripts/import-our-brands.mjs "<imagens extraídas do PDF>" "<páginas 52 e 61 renderizadas em escala 6>"
// (extração e renderização com pdf.js: ver docs/nossas-marcas.md)
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { chromium } from '@playwright/test'

const [extracted, rendered] = process.argv.slice(2)
if (!extracted || !rendered) throw new Error('Uso: node scripts/import-our-brands.mjs "<imagens extraídas>" "<páginas renderizadas>"')

/** id → embedded image (page-index-size) or [rendered page, crop window as fractions]. */
const sources = {
  'gazin-a-z': { file: 'p007-0-485x102.png', page: 7 },
  gamerzone: { file: 'p016-0-1882x622.png', page: 16 },
  done: { file: 'p028-0-885x236.png', page: 28 },
  ecoflash: { file: 'p040-0-452x147.png', page: 40 },
  'gold-confort': { render: 'p052.png', window: [.08, .32, .2, .2], page: 52 },
  'sleep-on': { render: 'p061.png', window: [.08, .32, .2, .2], page: 61 },
  'mark-blank': { file: 'p068-0-2048x707.png', page: 68 },
  grock: { file: 'p073-0-512x160.png', page: 73 },
  fitmotion: { file: 'p078-0-4188x1653.png', page: 78 },
  colorvision: { file: 'p085-0-2852x463.png', page: 85 },
}
const MAX = 1200

const root = fileURLToPath(new URL('..', import.meta.url))
const out = join(root, 'public', 'assets', 'nossas-marcas')
await rm(out, { recursive: true, force: true })
await mkdir(out, { recursive: true })
const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage()
const meta = {}
for (const [id, spec] of Object.entries(sources)) {
  const data = (await readFile(spec.file ? join(extracted, spec.file) : join(rendered, spec.render))).toString('base64')
  const result = await page.evaluate(async ({ data, window, max }) => {
    const image = new Image(); image.src = `data:image/png;base64,${data}`; await image.decode()
    let [sx, sy, sw, sh] = [0, 0, image.naturalWidth, image.naturalHeight]
    if (window) {
      // Crop the "Sobre a marca" logo area, then trim to the non-white content (+ small margin).
      const [fx, fy, fw, fh] = window
      const cx = Math.round(fx * sw), cy = Math.round(fy * sh), cw = Math.round(fw * sw), ch = Math.round(fh * sh)
      const probe = new OffscreenCanvas(cw, ch).getContext('2d', { willReadFrequently: true })
      probe.drawImage(image, cx, cy, cw, ch, 0, 0, cw, ch)
      const px = probe.getImageData(0, 0, cw, ch).data
      let l = cw, t = ch, r = -1, b = -1
      for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) { const i = (y * cw + x) * 4; if (px[i] < 235 || px[i + 1] < 235 || px[i + 2] < 235) { if (x < l) l = x; if (x > r) r = x; if (y < t) t = y; if (y > b) b = y } }
      const pad = Math.round(Math.max(r - l, b - t) * .04)
      sx = cx + Math.max(0, l - pad); sy = cy + Math.max(0, t - pad); sw = Math.min(cw, r + pad) - Math.max(0, l - pad); sh = Math.min(ch, b + pad) - Math.max(0, t - pad)
    }
    const scale = Math.min(1, max / sw)
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(sw * scale); canvas.height = Math.round(sh * scale)
    const context = canvas.getContext('2d'); context.imageSmoothingQuality = 'high'
    context.drawImage(image, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height)
    return { url: canvas.toDataURL('image/png'), width: canvas.width, height: canvas.height }
  }, { data, window: spec.window, max: MAX })
  await writeFile(join(out, `${id}.png`), Buffer.from(result.url.split(',')[1], 'base64'))
  meta[id] = { path: `assets/nossas-marcas/${id}.png`, width: result.width, height: result.height, page: spec.page, method: spec.file ? 'imagem embutida no PDF' : 'vetor renderizado da página' }
  console.log('✓', id, `${result.width}×${result.height}`, meta[id].method)
}
await browser.close()
await writeFile(join(root, 'src', 'data', 'ourBrandsFiles.json'), JSON.stringify(meta, null, 2) + '\n')
