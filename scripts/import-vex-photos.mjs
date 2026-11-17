// Importa as fotografias e escudos fornecidos na pasta "Patrocínios e Eventos" (área de trabalho)
// para o capítulo 09: VEX, Instituto Mário Gazin, clubes patrocinados e estandes em feiras.
// Só redimensiona e recomprime (fotos em JPEG; escudos em PNG, preservando a transparência):
// nenhuma imagem é recortada, recolorida ou alterada. Atualiza `images` em
// src/data/sponsorshipFiles.json.
// Uso: node scripts/import-vex-photos.mjs "<pasta Patrocínios e Eventos>"
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { chromium } from '@playwright/test'

const folder = process.argv[2]
if (!folder) throw new Error('Uso: node scripts/import-vex-photos.mjs "<pasta Patrocínios e Eventos>"')

/** id → [arquivo relativo à pasta, largura máxima, png?]. */
export const photos = {
  'vex-foto-plenaria': ['VEX/CORTELLA-28.jpg', 1600],
  'vex-foto-fornecedores-palco': ['VEX/ENCONTRO DE FORNECEDORES-68.jpg', 1600],
  'vex-foto-fornecedores-salao': ['VEX/ENCONTRO DE FORNECEDORES-100.jpg', 1600],
  'vex-foto-convencao': ['VEX/CONVENÇÃO INTERNA-143.jpg', 1600],
  'vex-foto-show': ['VEX/CLÁUDIO DUARTE-02 (41).jpg', 1600],
  'instituto-capa': ['INSTITUTO MÁRIO GAZIN/CAPA.jpg', 1800],
  'instituto-pintando7': ['INSTITUTO MÁRIO GAZIN/PINTANDO O 7.jpg', 1600],
  'instituto-cine': ['INSTITUTO MÁRIO GAZIN/CINE GAZIN.jfif', 1600],
  'instituto-orquestra': ['INSTITUTO MÁRIO GAZIN/ORQUESTRA ALFREDO GAZIN.jpg', 1600],
  'instituto-natal': ['INSTITUTO MÁRIO GAZIN/ERA UMA VEZ O NATAL.jpg', 1800],
  'clube-porto-velho-escudo': ['ESPORTIVOS/PORTO VELHO/PortoVelhoEC.png', 500, true],
  'clube-porto-velho-foto': ['ESPORTIVOS/PORTO VELHO/obrigado-meu-deus-.avif', 1400],
  'clube-remo-escudo': ['ESPORTIVOS/REMO/Clube_do_Remo.svg.webp', 500, true],
  'clube-remo-foto': ['ESPORTIVOS/REMO/confederacao-brasileira-de-futebol-detalha-tabela-e-remo-1794066371152.jpg', 1600],
  'clube-paysandu-escudo': ['ESPORTIVOS/PAYSANDU/PaysanduSC.png', 500, true],
  'clube-paysandu-foto': ['ESPORTIVOS/PAYSANDU/55389456279_9dded0e7c0_k.jpg', 1600],
  'feira-estande-colchoes': ['FEIRAS/Gazin 04 - Expo-63.jpg', 1600],
  'feira-estande-01': ['FEIRAS/Gazin 125254 lucca maresca.jpg', 1600],
  'feira-estande-02': ['FEIRAS/PERA4183.jpg', 1600],
}
const types = { png: 'png', jpg: 'jpeg', jpeg: 'jpeg', jfif: 'jpeg', webp: 'webp', avif: 'avif' }

const root = fileURLToPath(new URL('..', import.meta.url))
const json = join(root, 'src', 'data', 'sponsorshipFiles.json')
const meta = JSON.parse(await readFile(json, 'utf8'))
const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage()
for (const [id, [file, max, png]] of Object.entries(photos)) {
  const type = types[file.split('.').pop().toLowerCase()]
  const data = (await readFile(join(folder, file))).toString('base64')
  const result = await page.evaluate(async ({ data, type, max, png }) => {
    const image = new Image(); image.src = `data:image/${type};base64,${data}`; await image.decode()
    const scale = Math.min(1, max / image.naturalWidth)
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(image.naturalWidth * scale); canvas.height = Math.round(image.naturalHeight * scale)
    const context = canvas.getContext('2d'); context.imageSmoothingQuality = 'high'
    context.drawImage(image, 0, 0, canvas.width, canvas.height)
    return { url: png ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', .86), width: canvas.width, height: canvas.height }
  }, { data, type, max, png: !!png })
  const name = `${id}.${png ? 'png' : 'jpg'}`
  await writeFile(join(root, 'public', 'assets', 'patrocinios-eventos', name), Buffer.from(result.url.split(',')[1], 'base64'))
  meta.images[id] = { path: `assets/patrocinios-eventos/${name}`, width: result.width, height: result.height, source: `Patrocínios e Eventos/${file}` }
  console.log('✓', id, `${result.width}×${result.height}`)
}
await browser.close()
await writeFile(json, JSON.stringify(meta, null, 2) + '\n')
