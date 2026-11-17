// Importa as campanhas Gazin 2027 para o capítulo 05 · Campanhas.
//   · copia cada logo ORIGINAL (sem alterações) para public/assets/campanhas/2027/logos/<id>/;
//   · gera prévias leves (WebP com transparência, máx. 720 px) só para exibição;
//   · empacota os originais em downloads/logos-campanhas-gazin-2027.zip (uma pasta por campanha);
//   · copia o PDF integral do calendário e gera prévias de páginas (capa, 61 anos, Hoje é Dia D);
//   · grava src/data/campaignFiles.json (tamanhos, dimensões) para a interface.
//   · recorta só a logo do Hoje é Dia D (pág. 8) a partir da arte em alta resolução extraída do PDF.
// Uso: node scripts/import-campaigns.mjs "<pasta Logos Campanhas>" "<CALENDÁRIO 2027 - V2.pdf>" "<pasta das páginas renderizadas>" "<p008-0-3900x3150.png>"
import { copyFile, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { chromium } from '@playwright/test'
import { cropSupplierLogo } from './crop-supplier-logo.mjs'

const [logos, pdf, renders, supplierArt] = process.argv.slice(2)
if (!logos || !pdf || !renders || !supplierArt) throw new Error('Uso: node scripts/import-campaigns.mjs "<pasta das logos>" "<calendário PDF>" "<páginas renderizadas>" "<arte da pág. 8 em alta resolução>"')

/** id da campanha (src/data/campaigns.ts) → arquivo original na pasta "Logos Campanhas". */
export const logoCatalog = {
  '61-anos': 'Logo 61 anos.png',
  'queima-total-nacional': 'QUEIMA TOTAL GAZIN.png',
  'verao-e-na-gazin': 'VERÃO É NA GAZIN.png',
  'os-precos-cairam-na-folia': 'OS PREÇOS CAÍRAM NA FOLIA.png',
  'semana-do-esportista': 'SEMANA DO ESPORTISTA.png',
  'tudo-que-ela-quer': 'TUDO O QUE ELA QUER.png',
  'quinzena-do-consumidor': 'QUINZENA DO CONSUMIDOR.png',
  'parece-mentira-mas-e-verdade': 'PARECE MENTIRA, MAS É VERDADE.png',
  'o-melhor-pra-mamae': 'O MELHOR PRA MAMÃE DE A a Z.png',
  'par-perfeito': 'PAR PERFEITO.png',
  'festanca-do-preco-baixo': 'FESTANÇA DO PREÇO BAIXO GAZIN.png',
  'pintando-7-apae': 'PT7.png',
  'o-melhor-pro-paizao': 'O MELHOR PRO PAIZÃO.png',
  '13-da-sorte': '13 DA SORTE.png',
  'semana-da-tv-e-informatica': 'SEMANA DA TV E INFORMÁTICA.png',
  'o-gerente-viajou': 'O GERENTE VIAJOU.png',
  'semana-do-brasil': 'SEMANA DO BRASIL.png',
  'quinzena-do-cliente': 'QUINZENA DO CLIENTE.png',
  'outubro-e-10': 'OUTUBRO É 10.png',
  'o-melhor-pra-criancada': 'O MELHOR PRA CRIANÇADA.png',
  'black-friday-show': 'BLACK FRIDAY SHOW.png',
  'natal-mais-azul-do-brasil': 'NATAL MAIS AZUL DO BRASIL.png',
  'aniversario-gazin': 'ANIVERSÁRIO GAZIN.png',
  'colchao-da-virada': 'COLCHÃO DA VIRADA.png',
  'selfie-da-virada': 'SELFIE DA VIRADA.png',
  'dia-unico': 'DIA ÚNICO.png',
  'dia-d': 'DIA D.png',
  'alerta-de-ofertas': 'ALERTA DE OFERTAS.png',
  'fecha-mes': 'FECHA MÊS.png',
}
/** Prévias de páginas do calendário (renderizadas do PDF): capa, campanhas sem arquivo de logo e páginas dos meses. */
const pagePreviews = { 'calendario-capa': 'p001.png', '61-anos': 'p001.png', 'hoje-e-dia-d': 'p008.png' }
// Month pages (and the recurring-campaign page) show where each campaign appears in the calendar.
for (const number of [9, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32]) pagePreviews[`pagina-${number}`] = `p${String(number).padStart(3, '0')}.png`
const PREVIEW = 720

const root = fileURLToPath(new URL('..', import.meta.url))
const base = join(root, 'public', 'assets', 'campanhas', '2027')
const logoDir = join(base, 'logos'), previewDir = join(base, 'previas'), downloadDir = join(base, 'downloads'), calendarDir = join(base, 'calendario')
await rm(base, { recursive: true, force: true })
for (const dir of [logoDir, previewDir, downloadDir, calendarDir]) await mkdir(dir, { recursive: true })

const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage()
const resize = async (file, max, type) => {
  const data = (await readFile(file)).toString('base64')
  return page.evaluate(async ({ data, max, type }) => {
    const image = new Image()
    image.src = `data:image/png;base64,${data}`
    await image.decode()
    const scale = Math.min(1, max / Math.max(image.naturalWidth, image.naturalHeight))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(image.naturalWidth * scale); canvas.height = Math.round(image.naturalHeight * scale)
    const context = canvas.getContext('2d')
    context.imageSmoothingQuality = 'high'
    context.drawImage(image, 0, 0, canvas.width, canvas.height) // transparency preserved (no fill)
    return { url: canvas.toDataURL(type, .9), width: canvas.width, height: canvas.height, natural: [image.naturalWidth, image.naturalHeight] }
  }, { data, max, type })
}
const save = (path, url) => writeFile(path, Buffer.from(url.split(',')[1], 'base64'))

const meta = { logos: {}, pages: {}, calendar: {}, zip: {} }
for (const [id, file] of Object.entries(logoCatalog)) {
  await mkdir(join(logoDir, id), { recursive: true })
  const target = join(logoDir, id, file)
  await copyFile(join(logos, file), target)
  const preview = await resize(target, PREVIEW, 'image/webp')
  await save(join(previewDir, `${id}.webp`), preview.url)
  meta.logos[id] = { file, path: `assets/campanhas/2027/logos/${id}/${file}`, preview: `assets/campanhas/2027/previas/${id}.webp`, bytes: (await stat(target)).size, width: preview.natural[0], height: preview.natural[1], previewWidth: preview.width, previewHeight: preview.height }
  console.log('✓', id, `${preview.natural[0]}×${preview.natural[1]}`)
}
for (const [id, file] of Object.entries(pagePreviews)) {
  const preview = await resize(join(renders, file), 1200, 'image/jpeg')
  await save(join(previewDir, `${id}.jpg`), preview.url)
  meta.pages[id] = { path: `assets/campanhas/2027/previas/${id}.jpg`, width: preview.width, height: preview.height }
}
await browser.close()
meta.pages['hoje-e-dia-d-logo'] = await cropSupplierLogo(supplierArt)

// Calendar: the complete original PDF.
const calendar = join(calendarDir, 'calendario-gazin-2027.pdf')
await copyFile(pdf, calendar)
const [a, b] = await Promise.all([stat(pdf), stat(calendar)])
if (a.size !== b.size) throw new Error('A cópia do calendário não confere com o original')
meta.calendar = { path: 'assets/campanhas/2027/calendario/calendario-gazin-2027.pdf', bytes: b.size, pages: 37 }

// ZIP with one folder per campaign (originals only).
const zip = join(downloadDir, 'logos-campanhas-gazin-2027.zip')
// Entries use '/' (ZIP standard): Compress-Archive on Windows PowerShell 5.1 writes '\', which other systems
// extract as flat files named 'folder\file.png'. .NET ZipFile with explicit entry names avoids it.
if (process.platform === 'win32') {
  const entries = Object.entries(logoCatalog).map(([id, file]) => `[System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($z, '${join(logoDir, id, file).replace(/'/g, "''")}', '${id}/${file.replace(/'/g, "''")}') | Out-Null`)
  execFileSync('powershell', ['-NoProfile', '-Command', [
    'Add-Type -AssemblyName System.IO.Compression, System.IO.Compression.FileSystem',
    `$z = [System.IO.Compression.ZipFile]::Open('${zip}', 'Create')`, ...entries, '$z.Dispose()',
  ].join('; ')])
}
else execFileSync('zip', ['-r', zip, '.'], { cwd: logoDir })
meta.zip = { path: 'assets/campanhas/2027/downloads/logos-campanhas-gazin-2027.zip', bytes: (await stat(zip)).size, files: Object.keys(logoCatalog).length }
await writeFile(join(root, 'src', 'data', 'campaignFiles.json'), JSON.stringify(meta, null, 2) + '\n')
console.log('✓ calendário', (b.size / 1048576).toFixed(1), 'MB · ZIP', (meta.zip.bytes / 1048576).toFixed(1), 'MB')
