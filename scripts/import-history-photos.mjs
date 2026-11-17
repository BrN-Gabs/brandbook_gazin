// Importa as fotografias da Linha do Tempo para o Brandbook (seção "Nossa História").
//   · associação foto → acontecimento feita pela comparação com o PDF "Linha do Tempo Gazin.pdf";
//   · gera duas versões web de cada original: <id>-900.jpg (molduras) e <id>-1800.jpg (visualizador);
//   · apenas redimensiona e recomprime: sem filtros, recortes ou ajustes de cor;
//   · grava src/data/historyPhotos.json com as dimensões (evita layout shift).
// Uso: node scripts/import-history-photos.mjs "C:/Users/<usuário>/Desktop/Imagens Linha do Tempo"
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { chromium } from '@playwright/test'

const source = process.argv[2]
if (!source) throw new Error('Informe a pasta das fotografias: node scripts/import-history-photos.mjs "C:/…/Imagens Linha do Tempo"')

/** Acontecimento (id em src/data/history.ts) → arquivo original na pasta. */
export const photoCatalog = {
  '1966-primeira-loja': 'Jair 1970 - Douradina.jpg',
  '1974-primeira-filial': 'Loja Gazin - Mundo Novo2.jpg',
  '1995-rondonia': 'digitalizar0001.jpg',
  '1996-centro-distribuicao': 'digitalizar0000.jpg',
  '1998-primeira-industria': 'digitalizar0008.jpg',
  '2000-acre': 'digitalizar0027.jpg',
  '2002-paranatec-auto-posto': 'Auto Posto Gazin.jpg',
  '2004-consorcio': 'digitalizar0002.jpg',
  '2005-filial-100': 'digitalizar1229.jpg',
  '2006-amazonas': 'digitalizar0036.jpg',
  '2009-daniel': '_D3J1464.jpg',
  '2010-gazincred': 'gazin Cred 1.jpg',
  '2011-gazin-viagens': 'Gazin viagens - 002.jpg',
  '2013-filial-200': 'FOTOS LOJA 005.jpg',
  '2014-osmar': 'Osmar - 004.jpg',
  '2016-ipameri': 'Centro de Distribuição de Ipameri GO.jpg',
  '2017-tlg': 'Transporte - 001.jpg',
  '2018-daniel-na-minha-casa': 'VERONI - ALTA RESOLUCAO.jpg',
  '2019-mato-grosso': 'FL 328.jpg',
  '2020-55-anos': 'IMG_1155.jpg',
  '2021-filial-300': 'IMG_9502.jpg',
  '2022-gilmar': 'FOTO-GIL-WHATS.jpg',
  '2023-encontro-fornecedores': 'IMG_8195.jpg',
}

const root = new URL('../', import.meta.url)
const out = fileURLToPath(new URL('public/assets/historia/', root))
await rm(out, { recursive: true, force: true })
await mkdir(out, { recursive: true })

const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome' })
const page = await browser.newPage()
const photos = {}
for (const [id, file] of Object.entries(photoCatalog)) {
  const original = await readFile(join(source, file))
  const result = await page.evaluate(async src => {
    const image = new Image(); image.src = src; await image.decode()
    const { naturalWidth: width, naturalHeight: height } = image
    const encode = async longEdge => {
      const scale = Math.min(1, longEdge / Math.max(width, height))
      const canvas = new OffscreenCanvas(Math.round(width * scale), Math.round(height * scale))
      const context = canvas.getContext('2d')
      context.imageSmoothingQuality = 'high'
      context.drawImage(image, 0, 0, canvas.width, canvas.height)
      const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality: .84 })
      const buffer = new Uint8Array(await blob.arrayBuffer())
      let binary = ''; for (let i = 0; i < buffer.length; i += 0x8000) binary += String.fromCharCode(...buffer.subarray(i, i + 0x8000))
      return { width: canvas.width, height: canvas.height, base64: btoa(binary) }
    }
    return { width, height, small: await encode(900), large: await encode(1800) }
  }, `data:image/jpeg;base64,${original.toString('base64')}`)
  await writeFile(join(out, `${id}-900.jpg`), Buffer.from(result.small.base64, 'base64'))
  await writeFile(join(out, `${id}-1800.jpg`), Buffer.from(result.large.base64, 'base64'))
  photos[id] = { source: file, original: { width: result.width, height: result.height }, width: result.small.width, height: result.small.height }
  console.log('✓', id, '←', file)
}
await browser.close()
await writeFile(fileURLToPath(new URL('src/data/historyPhotos.json', root)), JSON.stringify(photos, null, 2) + '\n')
console.log('✓ src/data/historyPhotos.json')
