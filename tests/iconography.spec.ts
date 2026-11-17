import { test, expect, type Page } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { iconCategories, icons, kebab, lucide } from '../src/data/iconography'
import { skipOpening } from './helpers'

const require = createRequire(import.meta.url)
const shots = 'docs/screenshots/identity'
const id = 'identidade-visual-iconografia'
const errorsOf = (page: Page) => {
  const errors: string[] = []
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
  page.on('pageerror', error => errors.push(error.message))
  return errors
}
const library = (page: Page) => page.locator(`#${id} .ic-library`)
const panel = (page: Page) => page.locator(`#${id} .ic-panel`)
const open = async (page: Page) => {
  await page.goto('/')
  await skipOpening(page)
  await page.locator(`#${id}`).evaluate(element => element.scrollIntoView({ behavior: 'instant' }))
  await expect(library(page).locator('.ic-grid > li').first()).toBeVisible()
}
/** Entry names of a ZIP (central directory). */
const zipNames = (zip: Buffer) => {
  const names: string[] = []
  for (let i = zip.indexOf('PK\x01\x02', 0, 'latin1'); i >= 0; i = zip.indexOf('PK\x01\x02', i + 4, 'latin1')) names.push(zip.subarray(i + 46, i + 46 + zip.readUInt16LE(i + 28)).toString('utf8'))
  return names
}
const save = async (page: Page, click: () => Promise<void>) => {
  const [download] = await Promise.all([page.waitForEvent('download'), click()])
  return { name: download.suggestedFilename(), body: await readFile((await download.path())!) }
}

test('catálogo: só ícones reais do Lucide instalado, sem duplicatas, em 10 categorias', async () => {
  const installed = require('../node_modules/lucide-react/dist/cjs/lucide-react.js')
  expect(require('../node_modules/lucide-react/package.json').version).toBe(lucide.version)
  expect(icons.filter(item => !installed[item.name]).map(item => item.name)).toEqual([])
  expect(new Set(icons.map(item => item.name)).size).toBe(icons.length)
  expect(icons.length).toBeGreaterThanOrEqual(100)
  expect(iconCategories).toHaveLength(10)
  for (const category of iconCategories) expect(icons.filter(item => item.categories.includes(category.id)).length, category.id).toBeGreaterThanOrEqual(9)
  // The import map lists exactly the catalog (no stray or missing component).
  const map = await readFile('src/components/identity/iconography/icons.ts', 'utf8')
  expect([...map.matchAll(/^ {2}([A-Za-z0-9]+),$/gm)].map(match => match[1]).slice(0, icons.length).sort()).toEqual(icons.map(item => item.name).sort())
})

test.describe('Desktop', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('subtópico 02.9 no índice, navegação, diretrizes e comparador', async ({ page }) => {
    const errors = errorsOf(page)
    await page.goto('/')
    await skipOpening(page)
    const subnav = page.locator(`.vi-subnav a[href="#${id}"]`)
    await expect(subnav).toContainText('02.9')
    await expect(page.locator('.vi-subnav a[href="#identidade-visual-9"]')).toContainText('02.10')
    await page.getByRole('button', { name: /Capítulos/ }).click()
    const menu = page.getByRole('dialog', { name: 'Navegação do Manual da Marca' })
    await menu.getByRole('button', { name: 'Mostrar assuntos de Identidade Visual' }).click()
    await menu.getByRole('link', { name: /02\.9 Iconografia/ }).click()
    await expect(page.locator(`#${id}`)).toBeInViewport()
    const section = page.locator(`#${id}`)
    await expect(section.locator('h3')).toHaveText('Iconografia')
    await expect(section.locator('.ic-lead-title')).toHaveText('Padrões e Biblioteca de Ícones')
    await expect(section).not.toContainText('Proposta para o sistema digital')
    await expect(section).toContainText('Uma linguagem visual simples, consistente e reconhecível.')
    for (const text of ['1,5', '2,0', '2,5', '16 px', '64 px', '#080EA0', '#4169FE', '#494E64', '#5DAF02', '#FD9C0F', '#FFFFFF']) await expect(section.locator('.ic-guidelines')).toContainText(text)
    await section.getByRole('radio', { name: 'Incorreto' }).click()
    await expect(section.locator('.ic-compare-stage')).toHaveClass(/is-wrong/)
    await expect(section.locator('.ic-compare')).toContainText('Ícones deformados')
    await expect(section.locator('.ic-credit')).toContainText('Ícones baseados na biblioteca open-source Lucide Icons.')
    const license = await page.request.get(await section.getByRole('link', { name: /ver licença/ }).getAttribute('href') as string)
    expect(await license.text()).toContain('ISC License')
    await section.locator('.ic-guidelines').scrollIntoViewIfNeeded()
    await page.screenshot({ path: `${shots}/02-9-iconografia-diretrizes.png` })
    expect(errors).toEqual([])
  })

  test('biblioteca: grid, filtros, pesquisa em português e personalização', async ({ page }) => {
    const errors = errorsOf(page)
    await open(page)
    const grid = library(page).locator('.ic-grid > li')
    await expect(grid).toHaveCount(icons.length)
    await expect(library(page).locator('.ic-grid svg.lucide')).toHaveCount(icons.length)
    // Category filter.
    await library(page).getByRole('radio', { name: 'Consórcio' }).click()
    await expect(grid).toHaveCount(icons.filter(item => item.categories.includes('consorcio')).length)
    await expect(library(page).getByRole('button', { name: 'Baixar categoria Consórcio' })).toBeVisible()
    await library(page).getByRole('radio', { name: 'Todas' }).click()
    // Portuguese search (accent-insensitive).
    const search = library(page).getByRole('searchbox')
    await search.fill('casa')
    await expect(library(page).getByRole('button', { name: /^Casa \(House\)/ })).toBeVisible()
    await expect(grid.filter({ hasText: 'Seguro residencial' })).toHaveCount(1)
    await search.fill('seguro')
    for (const name of ['Proteção', 'Garantia estendida', 'Apólice']) await expect(grid.filter({ hasText: name }).first()).toBeVisible()
    await search.fill('caminhao')
    await expect(library(page).getByRole('button', { name: /^Caminhão \(Truck\)/ })).toBeVisible()
    await search.fill('zzz')
    await expect(library(page).locator('.ic-empty')).toBeVisible()
    await search.fill('')
    // Customise: colour, stroke, size, background update the preview at once.
    await grid.filter({ hasText: 'Caminhão' }).getByRole('button').click()
    await expect(panel(page).locator('h4')).toHaveText('Caminhão')
    const preview = panel(page).locator('.ic-preview svg')
    await panel(page).getByRole('radiogroup', { name: 'Cor' }).getByRole('radio', { name: 'Azul vibrante' }).click()
    await expect(preview).toHaveAttribute('stroke', '#4169FE')
    await panel(page).getByRole('radiogroup', { name: 'Espessura' }).getByRole('radio', { name: /2,5/ }).click()
    await expect(preview).toHaveAttribute('stroke-width', '2.5')
    await panel(page).getByRole('radiogroup', { name: 'Tamanho' }).getByRole('radio', { name: '128' }).click()
    await expect(preview).toHaveAttribute('width', '128')
    await panel(page).getByRole('radiogroup', { name: 'Fundo' }).getByRole('radio', { name: 'Azul-marinho' }).click()
    await expect(panel(page).locator('.ic-preview')).toHaveClass(/is-marinho/)
    // Keyboard: arrows move inside a group.
    await panel(page).getByRole('radiogroup', { name: 'Tamanho' }).getByRole('radio', { name: '128' }).press('ArrowRight')
    await expect(preview).toHaveAttribute('width', '256')
    await page.screenshot({ path: `${shots}/02-9-iconografia-biblioteca.png` })
    expect(errors).toEqual([])
  })

  test('downloads: SVG válido, PNG com transparência, copiar SVG e nome', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await open(page)
    await library(page).getByRole('searchbox').fill('protecao garantida')
    await library(page).locator('.ic-grid button').first().click()
    await panel(page).getByRole('radiogroup', { name: 'Cor' }).getByRole('radio', { name: 'Verde' }).click()
    await panel(page).getByRole('radiogroup', { name: 'Espessura' }).getByRole('radio', { name: /1,5/ }).click()
    // SVG: original viewBox, chosen colour and stroke, parses as XML.
    const svg = await save(page, () => panel(page).getByRole('button', { name: 'Baixar ícone · SVG' }).click())
    expect(svg.name).toBe('shield-check-5daf02.svg')
    const text = svg.body.toString('utf8')
    expect(text).toContain('viewBox="0 0 24 24"')
    expect(text).toContain('stroke="#5DAF02"')
    expect(text).toContain('stroke-width="1.5"')
    expect(text).not.toContain('currentColor')
    expect(await page.evaluate(markup => new DOMParser().parseFromString(markup, 'image/svg+xml').querySelector('parsererror') === null, text)).toBe(true)
    // PNG 256 × 256, transparent background (RGBA, corner pixel alpha 0).
    await panel(page).getByRole('combobox', { name: 'Resolução do PNG' }).selectOption('256')
    const png = await save(page, () => panel(page).getByRole('button', { name: 'Baixar PNG' }).click())
    expect(png.name).toBe('shield-check-5daf02-256.png')
    expect(png.body.subarray(1, 4).toString()).toBe('PNG')
    expect([png.body.readUInt32BE(16), png.body.readUInt32BE(20), png.body[25]]).toEqual([256, 256, 6])
    const pixels = await page.evaluate(async base64 => {
      const image = new Image(); image.src = `data:image/png;base64,${base64}`; await image.decode()
      const canvas = Object.assign(document.createElement('canvas'), { width: image.width, height: image.height })
      const context = canvas.getContext('2d')!; context.drawImage(image, 0, 0)
      const data = context.getImageData(0, 0, image.width, image.height).data
      let drawn = 0; for (let i = 3; i < data.length; i += 4) if (data[i] > 0) drawn++
      return { corner: data[3], drawn }
    }, png.body.toString('base64'))
    expect(pixels.corner).toBe(0)
    expect(pixels.drawn).toBeGreaterThan(500)
    // Background option fills the PNG.
    await panel(page).getByRole('radiogroup', { name: 'Fundo' }).getByRole('radio', { name: 'Branco' }).click()
    const filled = await save(page, () => panel(page).getByRole('button', { name: 'Baixar PNG' }).click())
    const corner = await page.evaluate(async base64 => { const image = new Image(); image.src = `data:image/png;base64,${base64}`; await image.decode(); const c = Object.assign(document.createElement('canvas'), { width: 4, height: 4 }).getContext('2d')!; c.drawImage(image, 0, 0); return [...c.getImageData(0, 0, 1, 1).data] }, filled.body.toString('base64'))
    expect(corner).toEqual([255, 255, 255, 255])
    // Copy SVG and copy name.
    await panel(page).getByRole('button', { name: 'Copiar SVG' }).click()
    await expect(panel(page).locator('.ic-status')).toHaveText('Código SVG copiado.')
    expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('<svg')
    await panel(page).getByRole('button', { name: 'Copiar nome' }).click()
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('ShieldCheck')
  })

  test('pacotes: ZIP por categoria e biblioteca completa, com LICENSE', async ({ page }) => {
    await open(page)
    await library(page).getByRole('radio', { name: 'Seguros' }).click()
    const category = await save(page, () => library(page).getByRole('button', { name: 'Baixar categoria Seguros' }).click())
    expect(category.name).toBe('Icones-Gazin-Seguros.zip')
    const insurance = icons.filter(item => item.categories.includes('seguros'))
    expect(zipNames(category.body).sort()).toEqual([...insurance.map(item => `Icones-Gazin-Seguros/${kebab(item.name)}.svg`), 'Icones-Gazin-Seguros/LICENSE.txt'].sort())
    expect(category.body.toString('utf8')).toContain('ISC License')
    const full = await save(page, () => library(page).getByRole('button', { name: 'Baixar biblioteca completa (.zip)' }).click())
    expect(full.name).toBe('Biblioteca-Icones-Gazin.zip')
    const names = zipNames(full.body)
    expect(names).toHaveLength(icons.length + 1)
    expect(new Set(names).size).toBe(names.length)
    expect(names).toContain('Biblioteca-Icones-Gazin/LICENSE.txt')
    for (const item of icons) expect(names).toContain(`Biblioteca-Icones-Gazin/${iconCategories.find(c => c.id === item.categories[0])!.folder}/${kebab(item.name)}.svg`)
    expect(new Set(names.filter(name => name.endsWith('.svg')).map(name => name.split('/')[1]))).toEqual(new Set(iconCategories.map(c => c.folder)))
  })

  test('F5 dentro da Iconografia recomeça pela introdução', async ({ page }) => {
    await page.goto(`/#${id}`)
    await skipOpening(page)
    await page.reload()
    await expect.poll(() => page.evaluate(() => [scrollY, location.hash])).toEqual([0, ''])
  })
})

test.describe('Celular', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })

  test('grid adaptado, painel em área expansível e sem rolagem lateral', async ({ page }) => {
    const errors = errorsOf(page)
    await open(page)
    await expect(panel(page)).toBeHidden()
    await library(page).getByRole('radio', { name: 'Logística' }).tap()
    await library(page).locator('.ic-grid button').first().tap()
    await expect(panel(page)).toBeVisible()
    await expect(panel(page).getByRole('button', { name: 'Baixar ícone · SVG' })).toBeVisible()
    await expect(panel(page)).toBeInViewport()
    await page.screenshot({ path: `${shots}/02-9-iconografia-mobile.png` })
    await panel(page).getByRole('button', { name: 'Fechar personalização' }).tap()
    await expect(panel(page)).toBeHidden()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    expect(errors).toEqual([])
  })
})
