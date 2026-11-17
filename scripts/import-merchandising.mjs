// Importa o Manual de Merchandising para o capítulo 07 · Comunicação Física.
//   · copia o PDF original, sem alterações, para public/assets/merchandising/ (download);
//   · converte as imagens escolhidas (extraídas do PDF na resolução nativa) para JPEG web:
//     apenas redimensiona e recomprime, sem recortes, filtros ou ajustes de cor;
//   · grava src/data/merchandisingPhotos.json com as dimensões (evita layout shift).
// Uso: node scripts/import-merchandising.mjs "<caminho do PDF>" "<pasta das imagens extraídas>"
// As imagens são extraídas do PDF com pdf.js (objetos de imagem de cada página); os nomes
// seguem o padrão p<página>-<índice>-<largura>x<altura>.png.
import { copyFile, mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { chromium } from '@playwright/test'

const [pdf, images] = process.argv.slice(2)
if (!pdf || !images) throw new Error('Uso: node scripts/import-merchandising.mjs "<PDF>" "<pasta das imagens>"')

/** id usado em src/data/physicalCommunication.ts → imagem extraída (página do manual). */
export const imageCatalog = {
  'fachada-noite': 'p012-3-1689x799.png',
  'fachada-dia': 'p012-2-1400x632.png',
  'layout-loja': 'p010-1-4480x6333.png',
  'caixa-comunicacao': 'p064-1-2446x1140.png',
  'cartaz-frente-loja': 'p084-4-1956x2722.png',
  'cartaz-ofertas': 'p086-2-900x1260.png',
  'cartazes-entrada': 'p013-1-1329x907.png',
  'calcada-inadequada': 'p014-1-1253x810.png',
  'calcada-adequada': 'p014-2-1534x1004.png',
  'uniforme': 'p096-2-427x320.png',
  'placas-sinalizacao': 'p065-2-2785x486.png',
  'ambientacao-cozinha': 'p046-2-1470x1210.png',
}
const MAX = 1600

const root = fileURLToPath(new URL('..', import.meta.url))
const out = join(root, 'public', 'assets', 'merchandising')
await mkdir(out, { recursive: true })
const target = join(out, 'manual-merchandising-gazin.pdf')
await copyFile(pdf, target)
const [a, b] = await Promise.all([stat(pdf), stat(target)])
if (a.size !== b.size) throw new Error('A cópia do PDF não confere com o original')
console.log(`PDF copiado: ${(b.size / 1048576).toFixed(1)} MB`)

const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage()
const meta = {}
for (const [id, file] of Object.entries(imageCatalog)) {
  const data = (await readFile(join(images, file))).toString('base64')
  const result = await page.evaluate(async ({ data, max }) => {
    const image = new Image()
    image.src = `data:image/png;base64,${data}`
    await image.decode()
    const scale = Math.min(1, max / Math.max(image.naturalWidth, image.naturalHeight))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(image.naturalWidth * scale); canvas.height = Math.round(image.naturalHeight * scale)
    const context = canvas.getContext('2d')
    context.fillStyle = '#FFFFFF' // PNG transparency → white (documents and posters)
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.imageSmoothingQuality = 'high'
    context.drawImage(image, 0, 0, canvas.width, canvas.height)
    return { url: canvas.toDataURL('image/jpeg', .86), width: canvas.width, height: canvas.height, natural: image.naturalWidth }
  }, { data, max: MAX })
  await writeFile(join(out, `${id}.jpg`), Buffer.from(result.url.split(',')[1], 'base64'))
  meta[id] = { width: result.width, height: result.height, source: Number(file.slice(1, 4)) }
  console.log(id, `${result.width}x${result.height}`, `(original ${result.natural}px)`)
}
await browser.close()
await writeFile(join(root, 'src', 'data', 'merchandisingPhotos.json'), JSON.stringify(meta, null, 2) + '\n')
