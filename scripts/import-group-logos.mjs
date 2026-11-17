// Importa as logomarcas das marcas do Grupo Gazin para o Brandbook.
//   · copia cada arquivo ORIGINAL, sem alteração, para public/assets/marcas/originais/<slug>.png (download);
//   · gera uma prévia leve para a página (public/assets/marcas/previa/<slug>.png): apenas recorta a
//     margem vazia (transparente ou branca) e reduz a largura máxima — o desenho não é alterado;
//   · cria public/assets/marcas/marcas-grupo-gazin.zip com todos os originais;
//   · grava src/data/groupLogos.json com nomes, arquivos e dimensões.
// Uso: node scripts/import-group-logos.mjs "<pasta com os PNG>"
import { copyFile, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { chromium } from '@playwright/test'

const source = process.argv[2]
if (!source) throw new Error('Informe a pasta das logomarcas: node scripts/import-group-logos.mjs "C:/…/Logos"')

/** Arquivo de origem → nome exibido e slug do arquivo publicado. */
const catalog = [
  ['GAZIN HOLDING.png', 'Gazin Holding', 'gazin-holding'],
  ['Logo Gazin Atacado.png', 'Gazin Atacado', 'gazin-atacado'],
  ['GAZIN AGRONEGÓCIO.png', 'Gazin Agronegócio', 'gazin-agronegocio'],
  ['Auto Posto.png', 'Gazin Auto Posto', 'gazin-auto-posto'],
  ['GAZIN BANK.png', 'GazinBank', 'gazin-bank'],
  ['Logo Gazin Colchões.png', 'Gazin Colchões', 'gazin-colchoes'],
  ['GAZIN.COM.png', 'Gazin.com.br', 'gazin-com-br'],
  ['CONSÓRCIO GAZIN OFICIAL 2025 - AZUL.png', 'Consórcio Gazin', 'consorcio-gazin'],
  ['Fundo de Investimentos - Azul.png', 'Gazin Fundos de Investimento', 'gazin-fundos-de-investimento'],
  ['Logo Gazin Licitações.png', 'Gazin Licitações', 'gazin-licitacoes'],
  ['Gazin Log 02.png', 'Gazin Log', 'gazin-log'],
  ['Gazin Seguros.png', 'Gazin Seguros', 'gazin-seguros'],
  ['GazinTech.png', 'Gazin Tech', 'gazin-tech'],
  ['Logo Gazin Viagens Avião.png', 'Gazin Viagens', 'gazin-viagens'],
  ['Logo Instituto Mario Gazin com Frase.png', 'Instituto Mário Gazin', 'instituto-mario-gazin'],
  ['Jeito Gazin - OFICIAL.png', 'Jeito Gazin', 'jeito-gazin'],
  ['PARANATEC NOVA_1.png', 'Paranatec', 'paranatec'],
  ['Portal Logo.png', 'Portal Colchões', 'portal-colchoes'],
  ['Nova Logo TV Gazin.png', 'TV Gazin', 'tv-gazin'],
]

const root = new URL('../', import.meta.url)
const base = fileURLToPath(new URL('public/assets/marcas/', root))
const originals = join(base, 'originais'), previews = join(base, 'previa')
await rm(base, { recursive: true, force: true })
await mkdir(originals, { recursive: true })
await mkdir(previews, { recursive: true })

const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome' })
const page = await browser.newPage()
const entries = []
for (const [file, name, slug] of catalog) {
  const from = join(source, file)
  const bytes = (await stat(from)).size
  await copyFile(from, join(originals, `${slug}.png`))
  const png = await readFile(from)
  const result = await page.evaluate(async src => {
    const image = new Image(); image.src = src; await image.decode()
    const { naturalWidth: width, naturalHeight: height } = image
    const canvas = new OffscreenCanvas(width, height), context = canvas.getContext('2d', { willReadFrequently: true })
    context.drawImage(image, 0, 0)
    const data = context.getImageData(0, 0, width, height).data
    // Content = not transparent and not (near) white.
    let top = height, left = width, right = -1, bottom = -1, transparent = false
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4
      if (data[i + 3] < 250) transparent = true
      if (data[i + 3] < 16 || (data[i] > 244 && data[i + 1] > 244 && data[i + 2] > 244)) continue
      if (x < left) left = x; if (x > right) right = x; if (y < top) top = y; if (y > bottom) bottom = y
    }
    const pad = Math.round(Math.max(right - left, bottom - top) * .02)
    left = Math.max(0, left - pad); top = Math.max(0, top - pad)
    right = Math.min(width - 1, right + pad); bottom = Math.min(height - 1, bottom + pad)
    const cropW = right - left + 1, cropH = bottom - top + 1
    const scale = Math.min(1, 1200 / cropW)
    const out = new OffscreenCanvas(Math.round(cropW * scale), Math.round(cropH * scale))
    const outContext = out.getContext('2d')
    outContext.imageSmoothingQuality = 'high'
    outContext.drawImage(image, left, top, cropW, cropH, 0, 0, out.width, out.height)
    const blob = await out.convertToBlob({ type: 'image/png' })
    const buffer = new Uint8Array(await blob.arrayBuffer())
    let binary = ''; for (let i = 0; i < buffer.length; i += 0x8000) binary += String.fromCharCode(...buffer.subarray(i, i + 0x8000))
    return { width, height, transparent, preview: { width: out.width, height: out.height, base64: btoa(binary) } }
  }, `data:image/png;base64,${png.toString('base64')}`)
  await writeFile(join(previews, `${slug}.png`), Buffer.from(result.preview.base64, 'base64'))
  entries.push({ slug, name, source: file, width: result.width, height: result.height, bytes, transparent: result.transparent, preview: { width: result.preview.width, height: result.preview.height } })
  console.log('✓', name, `${result.width}×${result.height}`, result.transparent ? 'transparente' : 'fundo opaco')
}
await browser.close()

const files = catalog.map(([, , slug]) => join(originals, `${slug}.png`))
const zip = join(base, 'marcas-grupo-gazin.zip')
if (process.platform === 'win32') execFileSync('powershell', ['-NoProfile', '-Command', `Compress-Archive -Path ${files.map(file => `'${file}'`).join(',')} -DestinationPath '${zip}' -Force`])
else execFileSync('zip', ['-j', zip, ...files])
await writeFile(fileURLToPath(new URL('src/data/groupLogos.json', root)), JSON.stringify(entries, null, 2) + '\n')
console.log('✓ marcas-grupo-gazin.zip e src/data/groupLogos.json')
