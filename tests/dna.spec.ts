import { test, expect } from '@playwright/test'
import { brandContent } from '../src/data/brandContent'

for (const width of [1440, 768, 390, 320]) {
  test(`DNA integrado, conteúdo e navegação em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
    await page.goto('/')
    await expect(page.locator('.dna-experience')).toHaveClass(/has-webgl/)
    await expect(page.locator('.dna-loader')).toHaveCount(0)
    await expect(page.getByRole('heading', { name: 'DNA GAZIN', exact: true })).toBeVisible()
    // Scoped to the opening: chapter 06 previews this Manual and repeats the subtitle.
    await expect(page.locator('.dna-experience').getByText('Nossa marca, nosso jeito!', { exact: true })).toBeVisible()
    await expect(page.locator('canvas.dna-canvas')).toHaveCount(1)
    await expect(page.locator('.site-header')).toHaveCount(0)
    await expect(page.locator('#hero-title .dna-hero-logo')).toBeVisible()
    await page.screenshot({ path: `docs/screenshots/dna/hero-${width}.png` })
    for (const item of brandContent.introduction.items) {
      const panel = page.locator(`#dna-${item.number}`)
      await panel.scrollIntoViewIfNeeded()
      await expect(panel.locator('.dna-lead')).toHaveText(item.text)
      await expect(panel.locator('.dna-lead')).toHaveCSS('opacity', '1')
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
      await page.screenshot({ path: `docs/screenshots/dna/story-${item.number}-${width}.png` })
    }
    await page.locator('#dna-bridge').scrollIntoViewIfNeeded()
    await page.getByRole('link', { name: 'Nosso propósito', exact: true }).click()
    await expect(page.locator('.mission')).toBeInViewport()
    await page.screenshot({ path: `docs/screenshots/dna/mission-${width}.png` })
    await page.getByRole('link', { name: 'Voltar ao início', exact: true }).click()
    await expect(page.locator('.dna-experience')).toHaveAttribute('data-scroll-progress', '0.0000')
    await expect(page.locator('.dna-loader')).toHaveCount(0)
    expect(errors).toEqual([])
  })
}

test('Links diretos e movimento reduzido mantêm todo o conteúdo acessível', async ({ page }) => {
  await page.goto('/#dna-02')
  await expect(page.locator('#dna-02')).toBeInViewport()
  await expect(page.locator('.dna-loader')).toHaveCount(0)
  await expect(page.locator('.dna-experience')).toHaveClass(/is-reduced/)
  await expect(page.locator('#dna-02 .dna-lead')).toHaveCSS('opacity', '1')
  await page.getByRole('button', { name: 'Ativar animações', exact: true }).click()
  await expect(page.locator('.dna-experience')).not.toHaveClass(/is-reduced/)
  await expect(page.locator('canvas.dna-canvas')).toHaveCount(1)
  await page.getByRole('button', { name: 'Reduzir animações', exact: true }).click()
  await expect(page.locator('#dna-02 .dna-lead')).toHaveCSS('opacity', '1')
})

test('Falha no carregamento 3D mantém fallback e leitura', async ({ page }) => {
  await page.route('**/DNACanvas*', route => route.abort())
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/')
  await expect(page.locator('.dna-loader')).toHaveCount(0)
  await expect(page.locator('.dna-fallback')).toBeVisible()
  await expect(page.locator('#hero-title')).toBeVisible()
  await page.getByRole('link', { name: 'Explore nossa marca' }).click()
  await expect(page.locator('#introducao')).toBeInViewport()
})

test('Perda do contexto WebGL libera fallback sem bloquear navegação', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.dna-experience')).toHaveClass(/has-webgl/)
  await page.locator('canvas.dna-canvas').evaluate((canvas: HTMLCanvasElement) => canvas.dispatchEvent(new Event('webglcontextlost', { cancelable: true })))
  await expect(page.locator('.dna-experience')).not.toHaveClass(/has-webgl/)
  await expect(page.locator('.dna-fallback')).toBeVisible()
})

test('Ausência de WebGL usa fallback sem erros de console', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (...args: Parameters<typeof original>) {
      if (String(args[0]).includes('webgl')) return null
      return original.apply(this, args)
    } as typeof original
  })
  await page.goto('/')
  await expect(page.locator('.dna-fallback')).toBeVisible()
  await expect(page.locator('#hero-title')).toBeVisible()
  await page.getByRole('link', { name: 'Explore nossa marca' }).click()
  await expect(page.locator('#introducao')).toBeInViewport()
  expect(errors).toEqual([])
})
