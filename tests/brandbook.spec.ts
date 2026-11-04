import { test, expect } from '@playwright/test'
import { mkdir } from 'node:fs/promises'

const sizes = [1920, 1440, 768, 390, 320]

for (const width of sizes) {
  test(`Leitura, assets e navegação em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width >= 768 ? 1000 : 844 })
    const errors: string[] = []
    const forbiddenRequests: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', message => { if (message.type() === 'error') errors.push(`${message.text()} ${message.location().url}`) })
    page.on('request', request => { if (/magazineluiza|mlcdn/.test(request.url())) forbiddenRequests.push(request.url()) })
    await page.goto('/')
    await page.evaluate(() => document.fonts.ready)
    await expect(page).toHaveTitle('Brandbook Gazin — Guia da Marca')
    await expect(page.locator('h1')).toHaveText('Brandbook')
    await expect(page.locator('main > section')).toHaveCount(5)
    await expect(page.locator('.pillar')).toHaveCount(4)
    await expect(page.locator('#valores li')).toHaveCount(5)
    await expect(page.locator('.pillars-note')).toContainText('Sujeitos à validação institucional.')
    await expect(page.getByRole('region', { name: 'Missão e Visão', exact: true })).toHaveAttribute('id', 'missao-visao')
    expect(await page.locator('.brand-logo').first().evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth === 2974)).toBe(true)
    const logo = await page.locator('.brand-logo').first().boundingBox()
    expect(logo!.width / logo!.height).toBeCloseTo(2974 / 835, 1)
    await mkdir('docs/screenshots', { recursive: true })
    await page.screenshot({ path: `docs/screenshots/hero-${width}.png` })

    // Check every section after reveals, including mobile reflow and all hash targets.
    for (const id of ['introducao', 'missao-visao', 'valores', 'pilares']) {
      await page.goto('/#' + id)
      await expect(page.locator('#' + id)).toBeInViewport()
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    }
    const columns = await page.locator('.pillars-grid').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length)
    expect(columns).toBe(width >= 1280 ? 4 : width >= 768 ? 2 : 1)
    await page.locator('.pillar').last().scrollIntoViewIfNeeded()
    await page.screenshot({ path: `docs/screenshots/pilares-${width}.png` })
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }))
    await page.screenshot({ path: `docs/screenshots/pagina-${width}.png`, fullPage: true })
    await page.getByRole('link', { name: 'Voltar ao início', exact: true }).click()
    await expect(page.locator('#hero-title')).toBeInViewport()
    expect(errors).toEqual([])
    expect(forbiddenRequests).toEqual([])
  })
}

test('Movimento reduzido e link direto preservam a leitura', async ({ page }) => {
  await page.goto('/#missao-visao')
  await expect(page.locator('#missao-visao')).toBeInViewport()
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto')
  await expect(page.locator('.mission blockquote')).toHaveText('Estabelecer vínculos duradouros com nossos clientes, promovendo as melhores condições para a venda de produtos e serviços.')
  await expect(page.locator('.vision blockquote')).toHaveText('Ser um grupo econômico centenário, comprometido com a felicidade das pessoas.')
})
