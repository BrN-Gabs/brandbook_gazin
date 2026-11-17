// Importa os arquivos do capítulo "Personagens da Marca".
//   · pasta "Personagens" da área de trabalho (TEO/ e GIA/): cada arquivo ORIGINAL é copiado sem
//     alteração (download) e ganha uma prévia WebP leve (exibição). As poses do Téo têm fundo
//     preto (sem transparência) e são mostradas assim; as da GI.A têm fundo transparente;
//   · GI.A: a captura da interface da plataforma é RECORTADA (sem o cabeçalho com o nome do
//     usuário e o histórico) e entra como "interface", separada das poses do personagem;
//   · gera os ZIPs por personagem e grava src/data/characterFiles.json.
// Uso: node scripts/import-characters.mjs "<pasta Personagens>" "<captura da interface GI.A.png>"
import { copyFile, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { chromium } from '@playwright/test'

const [folder, giaCapture] = process.argv.slice(2)
if (!folder || !giaCapture) throw new Error('Uso: node scripts/import-characters.mjs "<pasta Personagens>" "<captura GI.A.png>"')

/** id → [arquivo de origem, nome da pose]. A ordem é a da página. */
const poses = {
  teo: {
    'teo-joinha': ['TEO JOINHA FINAL 2026.png', 'Joinha'],
    'teo-acenando': ['teo-acenando.webp.png', 'Acenando'],
    'teo-apontando': ['teo-apontando.png', 'Apontando'],
    'teo-produto': ['teo-produto.png', 'Apresentando um produto'],
    'teo-tablet': ['teo-tablet.png', 'Segurando um dispositivo'],
    'teo-ideia': ['teo-ideia.png', 'Atenção'],
    'teo-orientando': ['teo-orientando.png', 'Orientando'],
    'teo-comemorando': ['teo-comemorando.png', 'Comemorando'],
    'teo-confiante': ['teo-confiante.png', 'Joinha · corpo inteiro'],
  },
  gia: {
    'gia-joinha': ['GIA.png', 'Joinha'],
    'gia-tablet': ['Assistente virtual Gazin em destaque.png', 'Com tablet'],
    'gia-ideia': ['GIA 2026.png', 'Ideia'],
    'gia-acenando': ['Mascote G.I.A. Gazin em 3D.png', 'Acenando'],
    'gia-apontando': ['Personagem G.I.A. Apontando com Confiança.png', 'Apontando'],
    'gia-apresentando': ['Mascote G.I.A. Apresentando Inovação.png', 'Apresentando'],
    'gia-explicando': ['Personagem G.I.A. em Pose de Apresentação.png', 'Explicando'],
    'gia-atencao': ['Personagem G.I.A. Apontando para o Futuro.png', 'Atenção'],
    'gia-comemorando': ['Mulher G.I.A. em Pose de Vitória.png', 'Comemorando'],
  },
}
const sub = { teo: 'TEO', gia: 'GIA' }

const root = fileURLToPath(new URL('..', import.meta.url))
const base = join(root, 'public', 'assets', 'brandbook', 'personagens')
const dirs = { teo: join(base, 'teo'), gia: join(base, 'gia'), previews: join(base, 'previas') }
await rm(base, { recursive: true, force: true })
for (const dir of Object.values(dirs)) await mkdir(dir, { recursive: true })

const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage()
/** Crop (px) and/or resize to a max width; never enlarges. */
const render = async (file, { crop, width, type = 'image/png', quality }) => {
  const data = (await readFile(file)).toString('base64')
  const result = await page.evaluate(async ({ data, crop, width, type, quality }) => {
    const image = new Image(); image.src = `data:image/png;base64,${data}`; await image.decode()
    const [sx, sy, sw, sh] = crop ?? [0, 0, image.naturalWidth, image.naturalHeight]
    const scale = Math.min(1, (width ?? sw) / sw)
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(sw * scale); canvas.height = Math.round(sh * scale)
    const context = canvas.getContext('2d'); context.imageSmoothingQuality = 'high'
    context.drawImage(image, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height)
    return { url: canvas.toDataURL(type, quality), width: canvas.width, height: canvas.height, alpha: (() => { const d = context.getImageData(2, 2, 1, 1).data; return d[3] < 250 })() }
  }, { data, crop, width, type, quality })
  return { buffer: Buffer.from(result.url.split(',')[1], 'base64'), width: result.width, height: result.height, alpha: result.alpha }
}

const meta = { teo: [], gia: [], interface: null, zips: {} }
for (const who of ['teo', 'gia']) {
  for (const [id, [file, name]] of Object.entries(poses[who])) {
    const source = join(folder, sub[who], file)
    const target = join(dirs[who], `${id}.png`)
    await copyFile(source, target)
    const info = await render(source, {})
    const preview = await render(source, { width: 760, type: 'image/webp', quality: .88 })
    await writeFile(join(dirs.previews, `${id}.webp`), preview.buffer)
    meta[who].push({
      id, name, file: `${id}.png`, path: `assets/brandbook/personagens/${who}/${id}.png`, format: 'PNG',
      width: info.width, height: info.height, bytes: (await stat(target)).size,
      background: info.alpha ? 'transparente' : 'preto',
      preview: { path: `assets/brandbook/personagens/previas/${id}.webp`, width: preview.width, height: preview.height },
    })
    console.log('✓', who, id, `${info.width}×${info.height}`, info.alpha ? 'transparente' : 'fundo preto')
  }
}

// GI.A platform interface (crop of the screenshot: x, y, w, h, without user data).
const ui = await render(giaCapture, { crop: [636, 70, 896, 536] })
await writeFile(join(dirs.gia, 'gia-interface-captura.png'), ui.buffer)
meta.interface = { id: 'gia-interface', name: 'Interface da plataforma', file: 'gia-interface-captura.png', path: 'assets/brandbook/personagens/gia/gia-interface-captura.png', format: 'PNG', width: ui.width, height: ui.height, bytes: (await stat(join(dirs.gia, 'gia-interface-captura.png'))).size, background: 'interface' }
await browser.close()

// ZIPs (one per character, '/' entry names).
for (const who of ['teo', 'gia']) {
  const zip = join(base, `materiais-${who}-gazin.zip`)
  const folderName = who === 'teo' ? 'Teo' : 'GIA'
  const items = meta[who] // the platform interface is shown on the page, not offered for download
  const entries = items.map(item => `[System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($z, '${join(dirs[who], item.file).replace(/'/g, "''")}', '${folderName}/${item.file}') | Out-Null`)
  execFileSync('powershell', ['-NoProfile', '-Command', ['Add-Type -AssemblyName System.IO.Compression, System.IO.Compression.FileSystem', `$z = [System.IO.Compression.ZipFile]::Open('${zip}', 'Create')`, ...entries, '$z.Dispose()'].join('; ')])
  meta.zips[who] = { path: `assets/brandbook/personagens/materiais-${who}-gazin.zip`, bytes: (await stat(zip)).size, files: items.length }
}
await writeFile(join(root, 'src', 'data', 'characterFiles.json'), JSON.stringify(meta, null, 2) + '\n')
console.log('✓ src/data/characterFiles.json')
