import { test, expect } from '@playwright/test'
import { mkdir } from 'node:fs/promises'

test.use({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' })

test('Recortes reagem ao movimento, preservam o layout e assentam com o mouse parado', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
  await page.goto('/')
  await expect(page.locator('html')).toHaveClass(/motion-enabled/)
  const title = page.locator('#introduction-title')
  const map = page.locator('.brandbook-distortion-definitions feImage')
  const displacement = page.locator('.brandbook-distortion-definitions feDisplacementMap')
  const original = await title.boundingBox()
  await mkdir('docs/screenshots/distortion', { recursive: true })
  await title.screenshot({ path: 'docs/screenshots/distortion/rest.png' })
  const rect = original!
  await page.mouse.move(rect.x + rect.width * 0.2, rect.y + rect.height * 0.45)
  await page.mouse.move(rect.x + rect.width * 0.4, rect.y + rect.height * 0.65, { steps: 12 })
  await expect(title).toHaveCSS('filter', /brandbook-distortion-/)
  await expect.poll(async () => Number(await displacement.getAttribute('scale'))).toBeGreaterThan(60)
  await title.screenshot({ path: 'docs/screenshots/distortion/hover.png' })
  const firstTexture = await map.getAttribute('href')
  await page.mouse.move(rect.x + rect.width * 0.7, rect.y + rect.height * 0.4, { steps: 12 })
  await expect.poll(() => map.getAttribute('href')).not.toBe(firstTexture)
  await expect(page.locator('.intro-hover-effect')).toHaveCSS('opacity', '0')
  await expect(page.locator('.hero-logo')).toHaveCSS('filter', 'none')
  expect(await title.boundingBox()).toEqual(original)
  await expect(title).toHaveCSS('cursor', 'default')
  // No perpetual distortion on hover: stored impulses relax even without pointerleave.
  await expect(title).toHaveCSS('filter', 'none')
  await expect(displacement).toHaveAttribute('scale', '0')
  await page.mouse.move(rect.x + rect.width * 0.5, rect.y + rect.height * 0.7, { steps: 6 })
  await expect(title).toHaveCSS('filter', /brandbook-distortion-/)
  await page.mouse.move(20, 20)
  await expect(title).toHaveCSS('filter', 'none')
  await expect(page.getByRole('heading', { name: 'Brandbook', exact: true })).toHaveCount(1)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  expect(errors).toEqual([])
})

test('Scroll, resize e movimento reduzido limpam a distorção sem duplicação', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('html')).toHaveClass(/motion-enabled/)
  const title = page.locator('#introduction-title')
  const definitions = page.locator('.brandbook-distortion-definitions')
  const moveOver = async (selector: string) => {
    const rect = (await page.locator(selector).boundingBox())!
    await page.mouse.move(rect.x + rect.width / 2, rect.y + rect.height / 2)
  }
  await moveOver('.intro-word-brand')
  await expect(title).toHaveCSS('filter', /brandbook-distortion-/)
  await page.mouse.wheel(0, 100)
  await expect(title).toHaveCSS('filter', 'none')
  // Lenis continues emitting scroll events until its wheel interpolation settles.
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(100)
  // Move to the visible word without locator.hover() automatically scrolling it again.
  await moveOver('.intro-word-book')
  await expect(title).toHaveCSS('filter', /brandbook-distortion-/)
  await page.setViewportSize({ width: 1100, height: 800 })
  await expect(title).toHaveCSS('filter', 'none')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(definitions).toHaveCount(0)
  await moveOver('.intro-word-brand')
  await expect(title).toHaveCSS('filter', 'none')
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await expect(definitions).toHaveCount(1)
  await moveOver('.intro-word-book')
  await expect(title).toHaveCSS('filter', /brandbook-distortion-/)
})

test.describe('Touch', () => {
  test.use({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } })
  test('Mantém o título estático e legível', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('html')).toHaveClass(/motion-enabled/)
    await expect(page.locator('.brandbook-distortion-definitions')).toHaveCount(0)
    await page.locator('.intro-word-brand').tap()
    await expect(page.locator('#introduction-title')).toHaveCSS('filter', 'none')
  })
})
