import { test, expect, type Page } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import { historyEvents } from '../src/data/history'
import { skipOpening } from './helpers'

const shots = 'docs/screenshots/history'
const errorsOf = (page: Page) => {
  const errors: string[] = []
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
  page.on('pageerror', error => errors.push(error.message))
  return errors
}
/** Scroll position inside the pinned timeline: 0 = start, 1 = end. */
const pinScroll = (page: Page, fraction: number) => page.evaluate(value => {
  const section = document.getElementById('historia')!
  const rail = section.querySelector<HTMLElement>('.history-rail')!
  const viewport = section.querySelector<HTMLElement>('.history-viewport')!
  const start = Number(section.dataset.pinStart)
  scrollTo({ top: start + (rail.scrollWidth - viewport.clientWidth) * value, behavior: 'instant' })
}, fraction)
const currentYear = (page: Page) => page.locator('.history-current b').textContent()

test.beforeAll(async () => { await mkdir(shots, { recursive: true }) })

test('Nossa História: após os Pilares, antes do Posicionamento, no menu Essência e com 23 marcos', async ({ page }) => {
  const errors = errorsOf(page)
  await page.goto('/')
  await skipOpening(page)
  const order = await page.locator('main > section').evaluateAll(sections => sections.map(section => section.id))
  expect(order.slice(order.indexOf('pilares'), order.indexOf('pilares') + 4)).toEqual(['pilares', 'historia', 'arvore', 'posicionamento'])
  await expect(page.locator('#historia .history-item')).toHaveCount(historyEvents.length)
  expect(historyEvents.map(event => event.year)).toEqual([1966, 1974, 1995, 1996, 1998, 2000, 2002, 2004, 2005, 2006, 2009, 2010, 2011, 2013, 2014, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023])
  for (const event of historyEvents) await expect(page.locator('#historia').getByRole('heading', { level: 3, name: event.title, exact: true })).toHaveCount(1)
  await expect(page.locator('#historia .history-closing')).toContainText('Nossa história continua')

  await page.getByRole('button', { name: /Capítulos/ }).click()
  const dialog = page.getByRole('dialog', { name: 'Navegação do Manual da Marca' })
  await dialog.getByRole('link', { name: 'Nossa História' }).click()
  await expect(page.locator('#history-title')).toBeInViewport()
  expect(errors).toEqual([])
})

test('Todas as fotografias existem e carregam', async ({ page, request }) => {
  await page.goto('/')
  await skipOpening(page)
  const sources = await page.locator('#historia .history-frame img').evaluateAll(images => images.map(image => image.getAttribute('src')!))
  expect(sources).toHaveLength(historyEvents.length)
  for (const source of sources) {
    expect((await request.get(source)).status(), source).toBe(200)
    expect((await request.get(source.replace('-900.jpg', '-1800.jpg'))).status(), source).toBe(200)
  }
})

test.describe('Desktop com movimento', () => {
  test.use({ reducedMotion: 'no-preference', viewport: { width: 1440, height: 900 } })

  test('scroll vertical move a linha do tempo na horizontal, nos dois sentidos, e segue para a Árvore', async ({ page }) => {
    const errors = errorsOf(page)
    await page.goto('/')
    await skipOpening(page)
    await expect(page.locator('#historia')).toHaveClass(/is-pinned/)
    await page.locator('#historia').scrollIntoViewIfNeeded()
    await page.waitForTimeout(600)
    await pinScroll(page, 0)
    await page.waitForTimeout(1200)
    await page.screenshot({ path: `${shots}/desktop-inicio.png` })
    expect(await currentYear(page)).toBe('1966')

    const railX = () => page.locator('.history-rail').evaluate(rail => new DOMMatrix(getComputedStyle(rail).transform).m41)
    await pinScroll(page, .45)
    await page.waitForTimeout(1400)
    await page.screenshot({ path: `${shots}/desktop-meio.png` })
    const middleYear = Number(await currentYear(page))
    expect(middleYear).toBeGreaterThan(2000)
    expect(await railX()).toBeLessThan(-1000)
    // The section stays pinned on screen.
    expect(await page.locator('.history-pin').evaluate(pin => Math.round(pin.getBoundingClientRect().top))).toBe(0)

    await pinScroll(page, .1)
    await page.waitForTimeout(1400)
    expect(Number(await currentYear(page))).toBeLessThan(middleYear)

    await pinScroll(page, 1)
    await page.waitForTimeout(1400)
    await page.screenshot({ path: `${shots}/desktop-fim.png` })
    expect(await currentYear(page)).toBe('2023')
    await page.mouse.wheel(0, 1600)
    await page.waitForTimeout(1500)
    await expect(page.locator('#arvore')).toBeInViewport()
    expect(errors).toEqual([])
  })

  test('hover destaca a moldura; clique abre o visualizador sem mover a página', async ({ page }) => {
    await page.goto('/')
    await skipOpening(page)
    await page.locator('#historia').scrollIntoViewIfNeeded()
    await pinScroll(page, .2)
    await page.waitForTimeout(1400)
    const frame = page.locator('.history-item.is-active .history-frame')
    const before = await frame.evaluate(element => getComputedStyle(element).scale)
    await frame.hover({ force: true })
    await page.waitForTimeout(700)
    expect(await frame.evaluate(element => getComputedStyle(element).scale)).not.toBe(before)
    await page.screenshot({ path: `${shots}/desktop-hover.png` })

    const year = await page.locator('.history-item.is-active .history-year').textContent()
    await frame.click({ force: true })
    const viewer = page.getByRole('dialog')
    await expect(viewer).toBeVisible()
    // From here on, nothing may move the page behind the viewer.
    const scrollBefore = await page.evaluate(() => scrollY)
    await expect(viewer.locator('.history-year')).toHaveText(year!)
    await page.waitForTimeout(600)
    await page.screenshot({ path: `${shots}/visualizador.png` })
    await viewer.getByRole('button', { name: 'Próximo acontecimento' }).click()
    const next = historyEvents[historyEvents.findIndex(event => String(event.year) === year) + 1]
    await expect(viewer.locator('h3')).toHaveText(next.title)
    await page.keyboard.press('ArrowLeft')
    await expect(viewer.locator('.history-year')).toHaveText(year!)
    await page.mouse.wheel(0, 800)
    await page.keyboard.press('Escape')
    await expect(viewer).toHaveCount(0)
    expect(await page.evaluate(() => scrollY)).toBe(scrollBefore)
    await expect(frame).toBeFocused()
  })

  test('teclado: focar uma moldura leva a linha do tempo até ela', async ({ page }) => {
    await page.goto('/')
    await skipOpening(page)
    await page.locator('#historia').scrollIntoViewIfNeeded()
    await page.locator('.history-frame').nth(12).focus()
    await page.waitForTimeout(1400)
    const box = await page.locator('.history-frame').nth(12).boundingBox()
    expect(box!.x).toBeGreaterThan(0)
    expect(box!.x + box!.width).toBeLessThan(1440)
  })

  test('F5 dentro da história recomeça pela introdução', async ({ page }) => {
    await page.goto('/#historia')
    await skipOpening(page)
    await pinScroll(page, .5)
    await page.waitForTimeout(500)
    await page.reload()
    await expect.poll(() => page.evaluate(() => [scrollY, location.hash])).toEqual([0, ''])
  })
})

test('Sem setas: a rolagem do mouse passa os anos, inclusive com movimento reduzido', async ({ page }) => {
  const errors = errorsOf(page)
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await skipOpening(page)
  await expect(page.locator('#historia .history-steps, #historia .history-progress button')).toHaveCount(0)
  await expect(page.locator('html')).not.toHaveClass(/motion-enabled/)
  await expect(page.locator('#historia')).toHaveClass(/is-pinned/)
  await page.locator('#historia').scrollIntoViewIfNeeded()
  await pinScroll(page, 0)
  await page.waitForTimeout(300)
  expect(await currentYear(page)).toBe('1966')
  await page.mouse.move(720, 450)
  for (let i = 0; i < 12; i++) { await page.mouse.wheel(0, 250); await page.waitForTimeout(60) }
  await expect.poll(async () => Number(await currentYear(page))).toBeGreaterThan(1995)
  const forward = Number(await currentYear(page))
  for (let i = 0; i < 6; i++) { await page.mouse.wheel(0, -250); await page.waitForTimeout(60) }
  await expect.poll(async () => Number(await currentYear(page))).toBeLessThan(forward)
  await page.screenshot({ path: `${shots}/reduzido.png` })
  expect(errors).toEqual([])
})

test('Celular: carrossel com snap, sem rolagem lateral da página, visualizador em tela cheia', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await skipOpening(page)
  await page.locator('#history-title').scrollIntoViewIfNeeded()
  await page.screenshot({ path: `${shots}/mobile-titulo.png` })
  await page.locator('.history-viewport').scrollIntoViewIfNeeded()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  const scroller = page.locator('.history-viewport')
  expect(await scroller.evaluate(element => getComputedStyle(element).scrollSnapType)).toContain('x')
  await scroller.evaluate(element => element.scrollBy({ left: 700, behavior: 'instant' }))
  await page.waitForTimeout(400)
  await expect(page.locator('.history-current b')).not.toHaveText('1966')
  await page.screenshot({ path: `${shots}/mobile-carrossel.png` })
  await page.locator('.history-item.is-active .history-frame').click({ force: true })
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.screenshot({ path: `${shots}/mobile-visualizador.png` })
  await page.getByRole('button', { name: 'Fechar fotografia' }).click()
  await expect(page.getByRole('dialog')).toHaveCount(0)
})

test('Fotografia ausente mostra moldura de aviso, sem quebrar a página', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.route('**/assets/historia/1974-primeira-filial-900.jpg', route => route.fulfill({ status: 404, body: '' }))
  await page.goto('/')
  await skipOpening(page)
  await page.locator('#historia').scrollIntoViewIfNeeded()
  await expect(page.locator('.history-item').nth(1).locator('.history-photo-missing')).toBeVisible()
  await expect(page.locator('.history-item').nth(0).locator('img')).toBeVisible()
  expect(errors).toEqual([])
})
