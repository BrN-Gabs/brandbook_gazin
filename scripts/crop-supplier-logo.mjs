// Recorta só a logo "Hoje é Dia D · Gazin + sua marca aqui!" da arte da pág. 8 do calendário 2027
// (sem o quadro de texto, que já aparece ao lado no site). Usa a imagem em alta resolução
// extraída do PDF (3900 × 3150); nada é redesenhado, só recortado e reduzido.
// Uso: node scripts/crop-supplier-logo.mjs "<p008-0-3900x3150.png>"
// Também é chamado por scripts/import-campaigns.mjs.
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { join } from 'node:path'
import { chromium } from '@playwright/test'

/** Área da logo na arte original (frações da largura/altura, com folga ao redor). */
const CROP = { x: .19, y: .1, width: .685, height: .435 }
const MAX = 1400

export async function cropSupplierLogo(source) {
  const root = fileURLToPath(new URL('..', import.meta.url))
  const browser = await chromium.launch({ channel: 'chrome' })
  const page = await browser.newPage()
  const data = (await readFile(source)).toString('base64')
  const result = await page.evaluate(async ({ data, crop, max }) => {
    const image = new Image()
    image.src = `data:image/png;base64,${data}`
    await image.decode()
    const sx = Math.round(image.naturalWidth * crop.x), sy = Math.round(image.naturalHeight * crop.y)
    const sw = Math.round(image.naturalWidth * crop.width), sh = Math.round(image.naturalHeight * crop.height)
    const scale = Math.min(1, max / sw)
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(sw * scale); canvas.height = Math.round(sh * scale)
    const context = canvas.getContext('2d')
    context.imageSmoothingQuality = 'high'
    context.drawImage(image, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height)
    return { url: canvas.toDataURL('image/webp', .9), width: canvas.width, height: canvas.height }
  }, { data, crop: CROP, max: MAX })
  await browser.close()
  const path = 'assets/campanhas/2027/previas/hoje-e-dia-d-logo.webp'
  await writeFile(join(root, 'public', path), Buffer.from(result.url.split(',')[1], 'base64'))
  return { path, width: result.width, height: result.height }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [source] = process.argv.slice(2)
  if (!source) throw new Error('Uso: node scripts/crop-supplier-logo.mjs "<p008-0-3900x3150.png>"')
  const root = fileURLToPath(new URL('..', import.meta.url))
  const json = join(root, 'src', 'data', 'campaignFiles.json')
  const meta = JSON.parse(await readFile(json, 'utf8'))
  meta.pages['hoje-e-dia-d-logo'] = await cropSupplierLogo(source)
  await writeFile(json, JSON.stringify(meta, null, 2) + '\n')
  console.log('✓ hoje-e-dia-d-logo', meta.pages['hoje-e-dia-d-logo'])
}
