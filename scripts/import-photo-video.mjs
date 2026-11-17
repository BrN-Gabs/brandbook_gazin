// Importa as fotografias demonstrativas do capítulo 04 · Fotografia e Vídeo.
//   · preserva os arquivos originais, sem alterações, em assets-source/fotografia-video/;
//   · gera versões web (JPEG) em public/images/brandbook/fotografia-video/ — apenas
//     redimensiona e recomprime;
//   · gera o recorte do close-up (reenquadramento da mesma foto, sem ampliar além do original);
//   · gera o par do comparador Antes / Depois a partir do MESMO arquivo: "antes" é a foto
//     convertida, "depois" recebe ajustes sutis de luminosidade, contraste e cor;
//   · grava src/data/photoVideoPhotos.json com as dimensões (evita layout shift).
// As fotografias foram geradas por IA e são DEMONSTRATIVAS: não são registros reais de lojas
// ou colaboradores Gazin e devem ser substituídas por fotografias oficiais quando houver.
// Uso: node scripts/import-photo-video.mjs "<pasta com as fotos enviadas>"
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { chromium } from '@playwright/test'

const source = process.argv[2]
if (!source) throw new Error('Uso: node scripts/import-photo-video.mjs "<pasta com as fotos>"')

/** Arquivo enviado → nome descritivo no projeto. */
// Desde 16/11/2026: 4, 5 e 6 vêm da pasta "Pessoas" (Vendedora sorridente em boutique de moda,
// Retrato Corporativo em Frente à GAZIN, Retrato Promocional em Frente à Gazin). O antigo 7.png
// não é mais usado (o antes/depois do 04.3 passou a usar o retrato corporativo).
export const sourceFiles = {
  'retrato-camiseta-verde': '4.png',
  'retrato-camiseta-azul': '5.png',
  'retrato-camiseta-branca': '6.png',
}
/** Saídas web: id → origem, recorte opcional (px do original) e filtro opcional. */
const outputs = {
  'retrato-camiseta-verde': { from: 'retrato-camiseta-verde' },
  'retrato-camiseta-azul': { from: 'retrato-camiseta-azul' },
  'retrato-camiseta-branca': { from: 'retrato-camiseta-branca' },
  // 04.2: os três planos com a MESMA pessoa (cena inteira, meio corpo, rosto).
  'plano-medio': { from: 'retrato-camiseta-branca', crop: [110, 130, 880, 1100] },
  'close-up-retrato': { from: 'retrato-camiseta-branca', crop: [250, 160, 520, 650] },
  'tratamento-antes': { from: 'retrato-camiseta-azul' },
  'tratamento-depois': { from: 'retrato-camiseta-azul', filter: 'brightness(1.06) contrast(1.08) saturate(1.08)' },
}
const MAX = 1400

const root = fileURLToPath(new URL('..', import.meta.url))
const originals = join(root, 'assets-source', 'fotografia-video')
const out = join(root, 'public', 'images', 'brandbook', 'fotografia-video')
await mkdir(originals, { recursive: true })
await mkdir(out, { recursive: true })
for (const [id, file] of Object.entries(sourceFiles)) await copyFile(join(source, file), join(originals, `${id}.png`))

const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage()
const meta = {}
for (const [id, spec] of Object.entries(outputs)) {
  const data = (await readFile(join(originals, `${spec.from}.png`))).toString('base64')
  const result = await page.evaluate(async ({ data, max, crop, filter }) => {
    const image = new Image()
    image.src = `data:image/png;base64,${data}`
    await image.decode()
    const [sx, sy, sw, sh] = crop ?? [0, 0, image.naturalWidth, image.naturalHeight]
    const scale = Math.min(1, max / Math.max(sw, sh)) // never enlarged
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(sw * scale); canvas.height = Math.round(sh * scale)
    const context = canvas.getContext('2d')
    context.imageSmoothingQuality = 'high'
    if (filter) context.filter = filter
    context.drawImage(image, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height)
    return { url: canvas.toDataURL('image/jpeg', .86), width: canvas.width, height: canvas.height }
  }, { data, max: MAX, crop: spec.crop, filter: spec.filter })
  await writeFile(join(out, `${id}.jpg`), Buffer.from(result.url.split(',')[1], 'base64'))
  meta[id] = { width: result.width, height: result.height, source: spec.from }
  console.log(id, `${result.width}x${result.height}`)
}
await browser.close()
await writeFile(join(root, 'src', 'data', 'photoVideoPhotos.json'), JSON.stringify(meta, null, 2) + '\n')
