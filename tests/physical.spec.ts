import { test, expect, type Page } from '@playwright/test'
import { mkdir, stat } from 'node:fs/promises'
import { facades, internal, manualDownload, pdv, physicalIntro, signage, uniforms } from '../src/data/physicalCommunication'
import { skipOpening } from './helpers'

const shots = 'docs/screenshots/comunicacao-fisica'
const errorsOf = (page: Page) => {
  const errors: string[] = []
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
  page.on('pageerror', error => errors.push(error.message))
  return errors
}
const ready = async (page: Page) => {
  if (await page.evaluate(() => matchMedia('(prefers-reduced-motion: no-preference)').matches)) await expect(page.locator('html')).toHaveClass(/motion-enabled/)
  if (await page.evaluate(() => matchMedia('(min-width: 1100px) and (hover: hover) and (pointer: fine)').matches)) await expect(page.locator('#historia')).toHaveAttribute('data-pin-start', /[0-9]+/)
}
const show = async (page: Page, selector: string) => {
  await page.locator(selector).first().evaluate(element => element.scrollIntoView({ block: 'start', behavior: 'instant' }))
  await page.waitForTimeout(1100)
}

test.beforeAll(async () => { await mkdir(shots, { recursive: true }) })

test('introdução, cinco subtópicos completos, imagens carregadas e IDs preservados', async ({ page }) => {
  const errors = errorsOf(page)
  await page.goto('/')
  await skipOpening(page)
  const chapter = page.locator('#comunicacao-fisica')
  await expect(chapter.locator('.chapter-intro .pos-lead')).toHaveText(physicalIntro)
  for (const [index, title] of ['Fachadas e Identificação das Lojas', 'Comunicação Visual Interna', 'Materiais de PDV', 'Uniformes e Identificação', 'Sinalização e Ambientação'].entries()) {
    await expect(page.locator(`#comunicacao-fisica-${index + 1} h3`)).toHaveText(title)
    await expect(page.locator(`#comunicacao-fisica-${index + 1} .subsection-number`)).toHaveText(`09.${index + 1}`)
  }
  await expect(chapter.locator('.subsection')).toHaveCount(5)
  await expect(chapter.locator('.content-placeholder')).toHaveCount(0)
  for (const text of [facades.text, internal.text, pdv.text, uniforms.text, signage.text]) await expect(chapter).toContainText(text)
  await expect(chapter).toContainText('46 × 64 cm')
  // Every image exists and decodes.
  const images = chapter.locator('img')
  for (let i = 0; i < await images.count(); i++) {
    await images.nth(i).scrollIntoViewIfNeeded()
    await expect.poll(() => images.nth(i).evaluate(image => (image as HTMLImageElement).naturalWidth), { message: await images.nth(i).getAttribute('src') ?? '' }).toBeGreaterThan(0)
  }
  expect(errors).toEqual([])
})

test('download do manual completo: arquivo original, PDF, sem modal', async ({ page, request }) => {
  await page.goto('/')
  await skipOpening(page)
  const link = page.getByRole('link', { name: /Baixar manual completo/i })
  await expect(link).toHaveAttribute('download', manualDownload.fileName)
  const href = (await link.getAttribute('href'))!
  const response = await request.get(href)
  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('application/pdf')
  const body = await response.body()
  expect(body.length).toBe((await stat('public/assets/merchandising/manual-merchandising-gazin.pdf')).size)
  expect(body.subarray(0, 5).toString()).toBe('%PDF-')
  await link.scrollIntoViewIfNeeded()
  const download = page.waitForEvent('download')
  await link.click()
  expect((await download).suggestedFilename()).toBe(manualDownload.fileName)
  await expect(page.getByRole('dialog')).toHaveCount(0)
})

test.describe('Desktop com movimento', () => {
  test.use({ reducedMotion: 'no-preference', viewport: { width: 1440, height: 900 } })

  test('pontos interativos, comparação e capturas', async ({ page }) => {
    const errors = errorsOf(page)
    await page.goto('/')
    await skipOpening(page)
    await ready(page)
    await show(page, '#comunicacao-fisica')
    await page.screenshot({ path: `${shots}/introducao.png` })
    await show(page, '#comunicacao-fisica-1')
    const facade = page.locator('#comunicacao-fisica-1 .cf-guide')
    await facade.getByRole('button', { name: /Entrada e acessibilidade/ }).hover()
    await expect(facade.locator('.cf-guide-caption')).toContainText(facades.hotspots[2].text)
    await facade.getByRole('button', { name: /Iluminação/ }).click()
    await expect(facade.locator('.cf-guide-caption')).toContainText(facades.hotspots[1].text)
    await page.waitForTimeout(400)
    await page.screenshot({ path: `${shots}/07-1-fachadas.png` })

    await show(page, '#comunicacao-fisica-2')
    await page.screenshot({ path: `${shots}/07-2-interna.png` })
    await show(page, '#comunicacao-fisica-3 .cf-compare')
    const compare = page.locator('.cf-compare')
    await compare.getByRole('radio', { name: /Inadequado/ }).click()
    await expect(compare.locator('figcaption')).toContainText(pdv.comparison.wrong.text)
    await expect(compare.locator('.cf-photo.is-wrong')).toHaveClass(/is-shown/)
    await page.waitForTimeout(600)
    await page.screenshot({ path: `${shots}/07-3-pdv.png` })
    await show(page, '#comunicacao-fisica-4')
    await page.screenshot({ path: `${shots}/07-4-5.png` })
    await show(page, '#comunicacao-fisica-5 .cf-guide')
    await page.locator('#comunicacao-fisica-5 .cf-hotspot').nth(2).focus()
    await expect(page.locator('#comunicacao-fisica-5 .cf-guide-caption')).toContainText(signage.ambience.hotspots[2].text)
    await show(page, '.cf-download')
    await page.screenshot({ path: `${shots}/download.png` })
    expect(errors).toEqual([])
  })

  test('F5 dentro do capítulo recomeça pela introdução', async ({ page }) => {
    await page.goto('/#comunicacao-fisica-3')
    await skipOpening(page)
    await page.reload()
    await expect.poll(() => page.evaluate(() => [scrollY, location.hash])).toEqual([0, ''])
  })
})

test('Celular: uma coluna, sem rolagem lateral, pontos por toque e download acessível', async ({ page }) => {
  const errors = errorsOf(page)
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await skipOpening(page)
  for (const id of ['comunicacao-fisica-1', 'comunicacao-fisica-2', 'comunicacao-fisica-3', 'comunicacao-fisica-4', 'comunicacao-fisica-5']) {
    await show(page, `#${id}`)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), id).toBe(true)
    await page.screenshot({ path: `${shots}/mobile-${id}.png` })
  }
  const facade = page.locator('#comunicacao-fisica-1 .cf-guide')
  await facade.getByRole('button', { name: /Vitrine/ }).click()
  await expect(facade.locator('.cf-guide-caption')).toContainText(facades.hotspots[3].text)
  await show(page, '.cf-download')
  await expect(page.getByRole('link', { name: /Baixar manual completo/i })).toBeInViewport()
  await page.screenshot({ path: `${shots}/mobile-download.png` })
  expect(errors).toEqual([])
})
