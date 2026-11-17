// Substitui logos do capítulo "Nossas Marcas" por arquivos OFICIAIS fornecidos pela equipe
// (em vez dos extraídos do PDF). Só redimensiona (máx. 1200 px), preservando a transparência;
// atualiza src/data/ourBrandsFiles.json.
// Uso: node scripts/import-official-brand-logos.mjs id=<arquivo.png> [id=<arquivo.png> …]
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { chromium } from '@playwright/test'

const pairs = process.argv.slice(2).map(arg => arg.split(/=(.*)/s).slice(0, 2))
if (!pairs.length) throw new Error('Uso: node scripts/import-official-brand-logos.mjs done="<DONE.png>" …')
const root = fileURLToPath(new URL('..', import.meta.url))
const json = join(root, 'src', 'data', 'ourBrandsFiles.json')
const meta = JSON.parse(await readFile(json, 'utf8'))
const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage()
for (const [id, file] of pairs) {
  if (!meta[id]) throw new Error(`Marca desconhecida: ${id}`)
  const data = (await readFile(file)).toString('base64')
  const result = await page.evaluate(async data => {
    const image = new Image(); image.src = `data:image/png;base64,${data}`; await image.decode()
    const scale = Math.min(1, 1200 / image.naturalWidth)
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(image.naturalWidth * scale); canvas.height = Math.round(image.naturalHeight * scale)
    const context = canvas.getContext('2d'); context.imageSmoothingQuality = 'high'
    context.drawImage(image, 0, 0, canvas.width, canvas.height)
    return { url: canvas.toDataURL('image/png'), width: canvas.width, height: canvas.height }
  }, data)
  await writeFile(join(root, 'public', 'assets', 'nossas-marcas', `${id}.png`), Buffer.from(result.url.split(',')[1], 'base64'))
  meta[id] = { ...meta[id], width: result.width, height: result.height, method: 'arquivo oficial fornecido pela equipe' }
  console.log('✓', id, `${result.width}×${result.height}`)
}
await browser.close()
await writeFile(json, JSON.stringify(meta, null, 2) + '\n')
