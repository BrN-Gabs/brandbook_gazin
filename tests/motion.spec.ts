import { test, expect, type Page } from '@playwright/test'
import { mkdir } from 'node:fs/promises'

async function settle(page: Page) {
  await page.waitForTimeout(1600)
}

async function scrollTo(page: Page, y: number) {
  await page.evaluate(top => window.scrollTo({ top, behavior: 'instant' }), y)
  await settle(page)
}

test.describe('Narrativa com movimento habilitado', () => {
  test.use({ reducedMotion: 'no-preference' })

  for (const width of [1920, 1440, 1024, 768, 390, 320]) {
    test(`Scroll completo, retorno e leitura em ${width}px`, async ({ page }) => {
      test.setTimeout(90000)
      await page.setViewportSize({ width, height: width >= 768 ? 1000 : 844 })
      const errors: string[] = []
      page.on('pageerror', error => errors.push(error.message))
      page.on('console', message => { if (message.type() === 'error' || /Motion indisponível/.test(message.text())) errors.push(message.text()) })
      await page.goto('/')
      await expect(page.locator('html')).toHaveClass(/motion-enabled/)
      await settle(page)
      await expect(page.locator('.hero-logo')).toHaveCSS('opacity', '1')
      await mkdir('docs/screenshots/motion', { recursive: true })
      await page.screenshot({ path: `docs/screenshots/motion/abertura-${width}.png` })
      const stops = await page.locator('.mission, .vision, #valores, #pilares').evaluateAll(elements => elements.map(el => el.getBoundingClientRect().top + scrollY))
      for (const [index, top] of stops.entries()) {
        await scrollTo(page, top)
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
        await page.screenshot({ path: `docs/screenshots/motion/secao-${index + 2}-${width}.png` })
      }
      await page.locator('.pillar-icon').last().scrollIntoViewIfNeeded()
      await settle(page)
      await expect(page.locator('.pillar-icon-stage').last()).toHaveCSS('opacity', '1')
      await expect(page.locator('.mission-word').last()).toHaveCSS('opacity', '1')
      await page.screenshot({ path: `docs/screenshots/motion/completa-${width}.png`, fullPage: true })

      // Reverse traversal restores scrubbed emphasis without hiding revealed sections.
      for (const top of [...stops].reverse()) await scrollTo(page, top)
      await scrollTo(page, 0)
      expect(Number(await page.locator('.mission-word').last().evaluate(el => getComputedStyle(el).opacity))).toBeLessThan(0.9)
      await expect(page.locator('.hero-logo')).toHaveCSS('opacity', '1')
      await page.getByRole('link', { name: 'Voltar ao início', exact: true }).click()
      await expect(page.locator('#hero-title')).toBeInViewport()
      await page.waitForTimeout(1000)
      expect(await page.evaluate(() => scrollY)).toBeLessThan(5)
      expect(errors).toEqual([])
    })
  }

  test('Scrub reversível, pin curto e mudança de preferência em tempo real', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 })
    await page.goto('/')
    await expect(page.locator('html')).toHaveClass(/motion-enabled/)
    await expect(page.locator('.pin-spacer')).toHaveCount(1)
    const top = await page.locator('.mission').evaluate(el => el.getBoundingClientRect().top + scrollY)
    await scrollTo(page, top + 310)
    const first = Number(await page.locator('.mission-word').first().evaluate(el => getComputedStyle(el).opacity))
    const last = Number(await page.locator('.mission-word').last().evaluate(el => getComputedStyle(el).opacity))
    expect(first).toBeGreaterThan(last)
    await scrollTo(page, top + 650)
    await expect(page.locator('.mission-word').last()).toHaveCSS('opacity', '1')
    await scrollTo(page, top)
    expect(Number(await page.locator('.mission-word').last().evaluate(el => getComputedStyle(el).opacity))).toBeLessThan(0.6)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await expect(page.locator('html')).not.toHaveClass(/motion-enabled|lenis/)
    await expect(page.locator('.pin-spacer')).toHaveCount(0)
    await expect(page.locator('.mission-word').last()).toHaveCSS('opacity', '1')
    await expect(page.locator('.vision .purpose-line-content').last()).toHaveCSS('opacity', '1')
    await expect(page.locator('.value-label').last()).toHaveCSS('opacity', '1')
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await expect(page.locator('.pin-spacer')).toHaveCount(1)
    await page.setViewportSize({ width: 390, height: 844 })
    await expect(page.locator('.pin-spacer')).toHaveCount(0)
    await expect(page.locator('html')).not.toHaveClass(/lenis/)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  })

  test('Âncoras diretas, histórico e teclado com Lenis', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 })
    await page.goto('/#pilares')
    await expect(page.locator('html')).toHaveClass(/lenis/)
    await expect(page.locator('#pilares')).toBeInViewport()
    await page.getByRole('link', { name: 'Voltar ao início', exact: true }).click()
    await expect(page.locator('#hero-title')).toBeInViewport()
    await page.waitForTimeout(1100)
    await expect(page.locator('#inicio')).toBeFocused()
    await page.goBack()
    await expect(page.locator('#pilares')).toBeInViewport()
    await page.goto('/')
    await expect(page.locator('html')).toHaveClass(/motion-enabled/)
    await page.keyboard.press('Tab')
    await expect(page.locator('.skip-link')).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page.locator('main')).toBeFocused()
    await page.keyboard.press('PageDown')
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(100)
  })

  test('Falha no módulo de animação mantém todo o conteúdo disponível', async ({ page }) => {
    await page.route('**/src/motion/createBrandMotion.ts*', route => route.abort())
    await page.goto('/#pilares')
    await expect(page.locator('#pilares')).toBeInViewport()
    await expect(page.locator('.mission-word').last()).toHaveCSS('opacity', '1')
    await expect(page.locator('.hero-logo')).toHaveCSS('opacity', '1')
    await expect(page.locator('.pillar-description')).toHaveCount(4)
    await expect(page.locator('html')).not.toHaveClass(/motion-enabled|lenis/)
  })

  test('Wheel integrado e transição branca/azul sem saltos', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 })
    await page.goto('/')
    await expect(page.locator('html')).toHaveClass(/lenis/)
    const missionTop = await page.locator('.mission').evaluate(el => el.getBoundingClientRect().top + scrollY)
    await scrollTo(page, missionTop)
    await page.mouse.wheel(0, 300)
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(missionTop + 250)
    expect(await page.locator('.mission').evaluate(el => Math.abs(el.getBoundingClientRect().top))).toBeLessThan(3)
    await settle(page)
    await page.screenshot({ path: 'docs/screenshots/motion/missao-leitura-parcial.png' })
    await page.mouse.wheel(0, 800)
    await settle(page)
    await page.screenshot({ path: 'docs/screenshots/motion/transicao-missao-visao.png' })
    await page.mouse.wheel(0, -1100)
    await settle(page)
    expect(Math.abs(await page.evaluate(() => scrollY) - missionTop)).toBeLessThan(5)
  })

  test('Capacidade limitada usa scroll nativo e mantém a narrativa legível', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 2 })
    })
    await page.setViewportSize({ width: 1440, height: 1000 })
    await page.goto('/')
    await expect(page.locator('html')).toHaveClass(/motion-enabled/)
    await expect(page.locator('html')).not.toHaveClass(/lenis/)
    await expect(page.locator('.pin-spacer')).toHaveCount(0)
    await page.locator('.vision').scrollIntoViewIfNeeded()
    await settle(page)
    await expect(page.locator('.mission-word').last()).toHaveCSS('opacity', '1')
    await expect(page.locator('.vision .purpose-line-content').last()).toHaveCSS('opacity', '1')
  })
})
