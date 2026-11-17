import { test, expect, type Page } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import { brandChapters } from '../src/data/brandChapters'
import { ourBrands, ourBrandsIntro } from '../src/data/ourBrands'
import { skipOpening } from './helpers'

const shots = 'docs/screenshots/nossas-marcas'
const chapter = brandChapters.find(item => item.id === 'nossas-marcas')!
const errorsOf = (page: Page) => {
  const errors: string[] = []
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
  page.on('pageerror', error => errors.push(error.message))
  return errors
}
/** Every logo keeps the proportion of its file. */
const allRatiosKept = (page: Page, selector: string) => page.locator(selector).evaluateAll(images => images.every(element => {
  const image = element as HTMLImageElement
  const box = image.getBoundingClientRect()
  return image.naturalWidth > 0 && Math.abs(image.naturalWidth / image.naturalHeight - box.width / box.height) < .03
}))

test.beforeAll(async () => { await mkdir(shots, { recursive: true }) })

test('dados: dez marcas do portfólio, logo após Identidade Visual (Arquitetura de Marcas)', () => {
  const ids = brandChapters.map(item => item.id)
  expect(ids.indexOf('nossas-marcas')).toBe(ids.indexOf('identidade-visual') + 1)
  expect(chapter.number).toBe('03')
  expect(ourBrands.map(item => `${item.name} · ${item.segment}`)).toEqual([
    'Gazin A–Z · Compras e serviços', 'GamerZone · Produtos gamers', 'DONE · Eletrodomésticos e utilidades', 'Ecoflash · Mobilidade urbana',
    'Gold Confort · Colchões e franquias', 'Sleep On · Colchões e e-commerce', 'Mark Blank · Moda, casa e acessórios', 'Grock · Pneus',
    'Fitmotion · Produtos fitness', 'Colorvision · Televisores e monitores',
  ])
})

test.describe('Desktop', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('menu, galeria sem distorção e visualizador com contador e navegação', async ({ page, request }) => {
    const errors = errorsOf(page)
    await page.goto('/')
    await skipOpening(page)
    await page.getByRole('button', { name: /Capítulos/ }).click()
    await page.getByRole('dialog', { name: 'Navegação do Manual da Marca' }).getByRole('link', { name: '03 Nossas Marcas' }).click()
    const root = page.locator('#nossas-marcas')
    await expect(root).toBeInViewport()
    await expect(root.locator('.vb-lead-title')).toHaveText(ourBrandsIntro.title)
    const tiles = root.locator('.ob-gallery button')
    await expect(tiles).toHaveCount(10)
    for (const img of await root.locator('.ob-gallery img').all()) expect((await request.get((await img.getAttribute('src'))!)).status()).toBe(200)
    await root.locator('.ob-gallery').scrollIntoViewIfNeeded()
    await expect.poll(() => allRatiosKept(page, '#nossas-marcas .ob-gallery img')).toBe(true)
    await page.screenshot({ path: `${shots}/galeria.png` })
    // Gallery → viewer.
    await tiles.filter({ hasText: 'Ecoflash' }).click()
    const viewer = root.locator('.ob-viewer')
    await expect(viewer.locator('h4')).toHaveText('Ecoflash')
    await expect(viewer.locator('.ob-counter')).toHaveText('04 / 10')
    await expect(viewer).toContainText(ourBrands[3].description)
    const height = await viewer.evaluate(element => element.getBoundingClientRect().height)
    await viewer.getByRole('button', { name: /Próxima marca/ }).click()
    await expect(viewer.locator('h4')).toHaveText('Gold Confort')
    expect(Math.abs(await viewer.evaluate(element => element.getBoundingClientRect().height) - height)).toBeLessThan(4)
    await viewer.focus()
    await page.keyboard.press('ArrowLeft')
    await page.keyboard.press('ArrowLeft')
    await expect(viewer.locator('.ob-counter')).toHaveText('03 / 10')
    await viewer.getByRole('button', { name: /Marca anterior/ }).click()
    await viewer.getByRole('button', { name: /Marca anterior/ }).click()
    await viewer.getByRole('button', { name: /Marca anterior/ }).click()
    await expect(viewer.locator('.ob-counter')).toHaveText('10 / 10')
    await root.getByRole('button', { name: 'Mark Blank', exact: true }).click()
    await expect(viewer.locator('h4')).toHaveText('Mark Blank')
    await expect.poll(() => allRatiosKept(page, '#nossas-marcas .ob-stage img')).toBe(true)
    await viewer.scrollIntoViewIfNeeded()
    await page.screenshot({ path: `${shots}/visualizador.png` })
    expect(errors).toEqual([])
  })

  test('F5 dentro do capítulo recomeça pela introdução', async ({ page }) => {
    await page.goto('/#nossas-marcas-2')
    await skipOpening(page)
    await page.reload()
    await expect.poll(() => page.evaluate(() => [scrollY, location.hash])).toEqual([0, ''])
  })
})

test.describe('Celular', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })

  test('duas colunas, toque e sem rolagem lateral', async ({ page }) => {
    const errors = errorsOf(page)
    await page.goto('/')
    await skipOpening(page)
    const root = page.locator('#nossas-marcas')
    await root.locator('.ob-gallery').evaluate(element => element.scrollIntoView({ behavior: 'instant' }))
    expect(await root.locator('.ob-gallery').evaluate(element => getComputedStyle(element).gridTemplateColumns.split(' ').length)).toBe(2)
    await page.waitForTimeout(800)
    await page.screenshot({ path: `${shots}/mobile-galeria.png` })
    await root.locator('.ob-gallery button').filter({ hasText: 'Grock' }).tap()
    await expect(root.locator('.ob-viewer h4')).toHaveText('Grock')
    await page.waitForTimeout(600)
    await page.screenshot({ path: `${shots}/mobile-visualizador.png` })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    expect(errors).toEqual([])
  })
})
