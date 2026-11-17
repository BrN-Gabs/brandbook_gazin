// Importa os materiais do capítulo 09 · Patrocínios e Eventos.
//   · peças REAIS produzidas pela Gazin para o VEX26 e para o Instituto Mário Gazin (pasta de
//     trabalhos de agosto/2026): só redimensiona e recomprime para a web (sem alterar a arte);
//   · copia a planilha "FEIRAS 2027 - OFICIAL" sem alteração (download);
//   · grava src/data/sponsorshipFiles.json com dimensões e tamanhos.
// Não usa imagens de sites externos (escudos, fotos de clubes ou do Instituto): esses campos
// ficam preparados para material oficial autorizado.
// Uso: node scripts/import-sponsorships.mjs "<TRABALHOS 2026/AGOSTO>" "<FEIRAS 2027 - OFICIAL (1).xlsx>"
import { copyFile, mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { chromium } from '@playwright/test'

const [august, sheet] = process.argv.slice(2)
if (!august || !sheet) throw new Error('Uso: node scripts/import-sponsorships.mjs "<pasta AGOSTO>" "<planilha de feiras>"')

/** id → arquivo de origem (relativo à pasta AGOSTO) e largura máxima. `pdf` = renderizar a página 1. */
const sources = {
  'vex-identidade': ['VEX26/TELAS VEX26/TELAS VEX ESTÁTICA/15x5.jpg', 2000],
  'vex-palco': ['VEX26/BANNERS VEX26/MARCAS LATERAL PALCO/SIMULAÇÃO MARCAS LATERAL VEX.jpg', 1600],
  'vex-fornecedores': ['VEX26/TELAS VEX26/ENCONTRO COM FORNECEDORES/15x5.jpg', 2000],
  'vex-livro': ['VEX26/TELAS VEX26/NOVO LIVRO DO MÁRIO GAZIN/NOVO LIVRO DO MÁRIO GAZIN - 15x5.jpg', 2000],
  'vex-pintando7': ['VEX26/TELAS VEX26/PINTANDO O 7/15x5.jpg', 2000],
  'vex-credencial': ['VEX26/BANNERS VEX26/PONTO RETIRADA CREDENCIAL/PONTO RETIRADA CREDENCIAL - AxL 1,30x0,90m.jpg', 900],
  'vex-totem': ['TOTENS VEX26 SERVIÇOS/TOTENS VEX26 SERVIÇOS - GAZINBANK.jpg', 800],
  'vex-restaurante': ['VEX26/BANNERS VEX26/RESTAURANTES/BANNER RESTAURANTE VEX - AxL 6,72x3,36m.jpg', 900],
  'vex-fotos-qr': ['VEX26/TELAS VEX26/FOTOGRAFIAS/FOTOS 1° DIA VEX26.jpg', 800],
  'vex-cracha': ['CRACHÁ POSSO AJUDAR OFICINAS VEX26/CRACHÁ POSSO AJUDAR OFICINAS VEX26.pdf', 700],
  'instituto-bandeira': ['BANDEIRAS INSTITUTO MÁRIO GAZIN/BANDEIRAS INSTITUTO MÁRIO GAZIN - MODELO 01.jpg', 1800],
  'instituto-bandeira-simulacao': ['BANDEIRAS INSTITUTO MÁRIO GAZIN/SIMULAÇÃO 01.png', 900],
}

const root = fileURLToPath(new URL('..', import.meta.url))
const out = join(root, 'public', 'assets', 'patrocinios-eventos')
await mkdir(out, { recursive: true })
const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage()
const meta = { images: {}, sheet: {} }

const shrink = (url, max) => page.evaluate(async ({ url, max }) => {
  const image = new Image(); image.src = url; await image.decode()
  const scale = Math.min(1, max / image.naturalWidth)
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(image.naturalWidth * scale); canvas.height = Math.round(image.naturalHeight * scale)
  const context = canvas.getContext('2d'); context.imageSmoothingQuality = 'high'
  context.drawImage(image, 0, 0, canvas.width, canvas.height)
  return { url: canvas.toDataURL('image/jpeg', .85), width: canvas.width, height: canvas.height }
}, { url, max })

for (const [id, [file, max]] of Object.entries(sources)) {
  const path = join(august, file)
  let dataUrl
  if (file.endsWith('.pdf')) dataUrl = await renderPdf(path) // vector art: rendered, then reduced
  else {
    dataUrl = `data:image/${file.endsWith('.png') ? 'png' : 'jpeg'};base64,${(await readFile(path)).toString('base64')}`
  }
  const result = await shrink(dataUrl, max)
  await writeFile(join(out, `${id}.jpg`), Buffer.from(result.url.split(',')[1], 'base64'))
  meta.images[id] = { path: `assets/patrocinios-eventos/${id}.jpg`, width: result.width, height: result.height, source: file }
  console.log('✓', id, `${result.width}×${result.height}`)
}
await browser.close()

/**
 * Renders page 1 of a PDF (scale 4) with an external pdf.js renderer (render.mjs: node render.mjs
 * <pdf> <outDir> <scale> <pages>), given in PDF_RENDERER. The temporary PNG stays outside public/.
 */
async function renderPdf(path) {
  const { execFileSync } = await import('node:child_process')
  const { tmpdir } = await import('node:os')
  const tmp = join(tmpdir(), 'brandbook-sponsorship-pdf')
  await mkdir(tmp, { recursive: true })
  const renderer = process.env.PDF_RENDERER
  if (!renderer) throw new Error('Defina PDF_RENDERER com o caminho de render.mjs (pdf.js) para converter PDFs.')
  execFileSync(process.execPath, [renderer, path, tmp, '4', '1'])
  return `data:image/png;base64,${(await readFile(join(tmp, 'p001.png'))).toString('base64')}`
}

// Trade-fair spreadsheet: published unchanged (download).
const target = join(out, 'feiras-2027-gazin.xlsx')
await copyFile(sheet, target)
const [a, b] = await Promise.all([stat(sheet), stat(target)])
if (a.size !== b.size) throw new Error('A cópia da planilha não confere com o original')
meta.sheet = { path: 'assets/patrocinios-eventos/feiras-2027-gazin.xlsx', bytes: b.size, source: 'FEIRAS 2027 - OFICIAL (1).xlsx' }
await writeFile(join(root, 'src', 'data', 'sponsorshipFiles.json'), JSON.stringify(meta, null, 2) + '\n')
console.log('✓ src/data/sponsorshipFiles.json')
