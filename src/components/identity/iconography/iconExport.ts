import { createElement } from 'react'
import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'
import { iconCategories, icons, kebab, lucide, type CatalogIcon } from '../../../data/iconography'
import { iconComponents } from './icons'

export type IconSettings = { color: string; stroke: number; size: number }

const inner = new Map<string, string>()
/**
 * The original Lucide geometry of an icon (the children of its <svg>), rendered once by the real
 * component and cached. Nothing is redrawn: colour and stroke only change the root attributes.
 */
export function iconGeometry(name: string) {
  const cached = inner.get(name)
  if (cached) return cached
  const Icon = iconComponents[name]
  if (!Icon) throw new Error(`Ícone inexistente: ${name}`)
  const host = document.createElement('div')
  const root = createRoot(host)
  flushSync(() => root.render(createElement(Icon)))
  const markup = host.querySelector('svg')!.innerHTML.replace(/currentColor/g, '__COLOR__')
  root.unmount()
  inner.set(name, markup)
  return markup
}

/** Standalone, valid SVG (24 × 24 viewBox, as in Lucide), with the chosen colour and stroke. */
export function buildSvg(name: string, { color, stroke, size }: IconSettings) {
  const body = iconGeometry(name).replace(/__COLOR__/g, color)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round">\n  <!-- Lucide "${kebab(name)}" · ISC License · https://lucide.dev -->\n  ${body}\n</svg>\n`
}

/** Raster export: square PNG of `px`, transparent unless a background colour is given. */
export async function svgToPng(svg: string, px: number, background: string | null) {
  const image = new Image()
  image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.replace(/width="\d+" height="\d+"/, `width="${px}" height="${px}"`))}`
  await image.decode()
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = px
  const context = canvas.getContext('2d')!
  if (background) { context.fillStyle = background; context.fillRect(0, 0, px, px) }
  context.drawImage(image, 0, 0, px, px)
  return new Promise<Blob>((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Falha ao gerar o PNG')), 'image/png'))
}

// ── Minimal ZIP writer (stored, UTF-8 names): no extra dependency for a few hundred KB. ──
const crcTable = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; return c >>> 0 })
const crc32 = (data: Uint8Array) => { let c = 0xFFFFFFFF; for (const byte of data) c = crcTable[(c ^ byte) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0 }
export function createZip(files: { path: string; content: string }[]) {
  const encoder = new TextEncoder()
  const chunks: Uint8Array[] = [], central: Uint8Array[] = []
  let offset = 0
  for (const file of files) {
    const name = encoder.encode(file.path), data = encoder.encode(file.content), crc = crc32(data)
    const local = new DataView(new ArrayBuffer(30))
    local.setUint32(0, 0x04034B50, true); local.setUint16(4, 20, true); local.setUint16(6, 0x0800, true)
    local.setUint32(14, crc, true); local.setUint32(18, data.length, true); local.setUint32(22, data.length, true); local.setUint16(26, name.length, true)
    const entry = new DataView(new ArrayBuffer(46))
    entry.setUint32(0, 0x02014B50, true); entry.setUint16(4, 20, true); entry.setUint16(6, 20, true); entry.setUint16(8, 0x0800, true)
    entry.setUint32(16, crc, true); entry.setUint32(20, data.length, true); entry.setUint32(24, data.length, true); entry.setUint16(28, name.length, true); entry.setUint32(42, offset, true)
    chunks.push(new Uint8Array(local.buffer), name, data)
    central.push(new Uint8Array(entry.buffer), name)
    offset += 30 + name.length + data.length
  }
  const size = central.reduce((sum, part) => sum + part.length, 0)
  const end = new DataView(new ArrayBuffer(22))
  end.setUint32(0, 0x06054B50, true); end.setUint16(8, files.length, true); end.setUint16(10, files.length, true); end.setUint32(12, size, true); end.setUint32(16, offset, true)
  return new Blob([...chunks, ...central, new Uint8Array(end.buffer)] as BlobPart[], { type: 'application/zip' })
}

const licenseFile = () => `Biblioteca de Ícones Gazin · Manual da Marca DNA Gazin
Ícones da biblioteca open-source Lucide Icons (${lucide.site}), versão ${lucide.version}.
Os desenhos são do projeto Lucide e não foram criados pela Gazin. A seleção, as cores e a
padronização de uso fazem parte da proposta visual do Manual da Marca Gazin.

${lucide.license}`

/** Package of SVGs: one folder per category (full library) or a single category. */
export function iconPackage(settings: IconSettings, categoryId?: string) {
  const root = categoryId ? `Icones-Gazin-${iconCategories.find(category => category.id === categoryId)!.folder}` : 'Biblioteca-Icones-Gazin'
  const files = icons
    .filter(item => !categoryId || item.categories.includes(categoryId))
    .map((item: CatalogIcon) => {
      // Full library: each icon once, in the folder of its main category (no duplicates).
      const folder = categoryId ? '' : `${iconCategories.find(category => category.id === item.categories[0])!.folder}/`
      return { path: `${root}/${folder}${kebab(item.name)}.svg`, content: buildSvg(item.name, settings) }
    })
  files.push({ path: `${root}/LICENSE.txt`, content: licenseFile() })
  return { blob: createZip(files), name: `${root}.zip`, count: files.length - 1 }
}

export function saveBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob)
  const link = Object.assign(document.createElement('a'), { href: url, download: name })
  document.body.append(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 4000)
}

export async function copyText(text: string) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text)
  const area = Object.assign(document.createElement('textarea'), { value: text })
  area.style.position = 'fixed'; area.style.opacity = '0'
  document.body.append(area); area.select()
  const ok = document.execCommand('copy')
  area.remove()
  if (!ok) throw new Error('Cópia não permitida pelo navegador')
}
