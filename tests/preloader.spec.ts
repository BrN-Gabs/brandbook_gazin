import { test, expect } from '@playwright/test'
import { mkdir } from 'node:fs/promises'

test.use({ reducedMotion: 'no-preference' })

for (const width of [1440, 390]) {
  test(`Fim da abertura não volta a cobrir a introdução em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 })
    await page.goto('/')
    await expect(page.locator('.brandbook-preloader')).toHaveAttribute('data-stage', 'composition')
    const result = await page.evaluate(() => new Promise<{ samples: number; rebounds: number }>(resolve => {
      const overlay = document.querySelector<HTMLElement>('.brandbook-preloader')!
      const backdrop = overlay.querySelector<HTMLElement>('.preloader-backdrop')!
      let uncovered = false
      let samples = 0
      let rebounds = 0
      const sample = () => {
        if (!overlay.isConnected) return
        const style = getComputedStyle(overlay)
        const coverage = style.display === 'none' || style.visibility === 'hidden'
          ? 0 : Number(style.opacity) * Number(getComputedStyle(backdrop).opacity)
        if (coverage < 0.03) uncovered = true
        if (uncovered && coverage > 0.1) rebounds++
        samples++
      }
      // Observe both painted frames and the moment keyboard focus returns to the page.
      document.addEventListener('focusin', sample)
      const tick = () => {
        sample()
        if (overlay.isConnected) requestAnimationFrame(tick)
        else {
          document.removeEventListener('focusin', sample)
          resolve({ samples, rebounds })
        }
      }
      requestAnimationFrame(tick)
    }))
    expect(result.samples).toBeGreaterThan(5)
    expect(result.rebounds).toBe(0)
    await expect(page.locator('.hero-logo')).toHaveCSS('opacity', '1')
    await expect(page.locator('#brandbook-page')).toHaveJSProperty('inert', false)
  })
}

for (const width of [1920, 1440, 768, 390, 320]) {
  test(`Abertura contínua e introdução em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width >= 768 ? Math.round(width * 9 / 16) : 844 })
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
    await page.goto('/')
    const opening = page.locator('.brandbook-preloader')
    await expect(opening).toHaveCount(1)
    await expect(page.locator('#brandbook-page')).toHaveJSProperty('inert', true)
    await page.mouse.wheel(0, 300)
    expect(await page.evaluate(() => scrollY)).toBe(0)
    await expect(opening).toHaveAttribute('data-stage', 'composition')
    await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
    for (const selector of ['.preloader-brand', '.preloader-book', '.preloader-logo']) {
      const rect = await page.locator(selector).boundingBox()
      expect(rect!.x).toBeGreaterThanOrEqual(0)
      expect(rect!.x + rect!.width).toBeLessThanOrEqual(width)
      expect(rect!.y).toBeGreaterThanOrEqual(0)
    }
    await mkdir('docs/screenshots/preloader', { recursive: true })
    await page.screenshot({ path: `docs/screenshots/preloader/composition-${width}.png` })
    await expect(opening).toHaveCount(0)
    await expect(page.locator('#brandbook-page')).toHaveJSProperty('inert', false)
    await expect(page.locator('.hero-logo')).toHaveCSS('opacity', '1')
    await expect(page.locator('.introduction-column')).toHaveCount(3)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.screenshot({ path: `docs/screenshots/preloader/introduction-${width}.png` })
    await page.keyboard.press('Tab')
    await expect(page.locator('.skip-link')).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page.locator('main')).toBeFocused()
    await page.locator('#pilares').scrollIntoViewIfNeeded()
    await page.getByRole('link', { name: 'Voltar ao início', exact: true }).click()
    await expect(page.locator('#hero-title')).toBeInViewport()
    await expect(opening).toHaveCount(0)
    expect(errors).toEqual([])
  })
}

test('100% aguarda a logo real; teclado permanece no overlay', async ({ page }) => {
  let release!: () => void
  const pending = new Promise<void>(resolve => { release = resolve })
  await page.route('**/assets/logo-gazin.png', async route => { await pending; await route.continue() })
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.brandbook-preloader')).toBeVisible()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: 'Pular abertura' })).toBeFocused()
  await page.waitForTimeout(1100)
  expect(Number(await page.getByRole('progressbar').getAttribute('aria-valuenow'))).toBeLessThan(100)
  await expect(page.locator('.brandbook-preloader')).toHaveAttribute('data-stage', 'loading')
  await page.screenshot({ path: 'docs/screenshots/preloader/loading.png' })
  release()
  await expect(page.locator('.brandbook-preloader')).toHaveCount(0)
  await expect(page.locator('#brandbook-page')).toHaveJSProperty('inert', false)
})

test('Recurso travado libera a leitura sem afirmar 100%', async ({ page }) => {
  let release!: () => void
  const pending = new Promise<void>(resolve => { release = resolve })
  await page.route('**/*.woff2', async route => { await pending; await route.continue() })
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.brandbook-preloader')).toBeVisible()
  await page.waitForTimeout(1200)
  expect(Number(await page.getByRole('progressbar').getAttribute('aria-valuenow'))).toBeLessThan(100)
  await expect(page.locator('.brandbook-preloader')).toHaveCount(0, { timeout: 7500 })
  await expect(page.locator('#brandbook-page')).toHaveJSProperty('inert', false)
  await expect(page.locator('.introduction-column').first()).toHaveCSS('opacity', '1')
  release()
})

test('Escape encerra a abertura e mudanças de preferência não repetem a sequência', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.brandbook-preloader')).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(page.locator('.brandbook-preloader')).toHaveCount(0)
  await expect(page.locator('#brandbook-page')).toHaveJSProperty('inert', false)
  await page.getByRole('button', { name: 'Reduzir animações', exact: true }).click()
  await page.getByRole('button', { name: 'Ativar animações', exact: true }).click()
  await expect(page.locator('.brandbook-preloader')).toHaveCount(0)
  await expect(page.locator('.introduction-column').first()).toHaveCSS('opacity', '1')
})

test('Falha da imagem encerra a abertura e mantém os textos acessíveis', async ({ page }) => {
  await page.route('**/assets/logo-gazin.png', route => route.abort())
  await page.goto('/')
  await expect(page.locator('.brandbook-preloader')).toHaveCount(0)
  await expect(page.locator('#brandbook-page')).toHaveJSProperty('inert', false)
  await expect(page.locator('.introduction-column').first()).toHaveCSS('opacity', '1')
  await page.keyboard.press('Tab')
  await expect(page.locator('.skip-link')).toBeFocused()
})

test('Movimento reduzido e links diretos preservam acesso imediato', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.locator('.brandbook-preloader')).toHaveCount(0, { timeout: 2000 })
  await expect(page.locator('#introduction-title')).toBeVisible()
  await page.goto('/#pilares')
  await expect(page.locator('.brandbook-preloader')).toHaveCount(0)
  await expect(page.locator('#pilares')).toBeInViewport()
})

test('Mudança de orientação durante a transição restaura a página', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await expect(page.locator('.brandbook-preloader')).toHaveAttribute('data-stage', 'transition')
  await page.setViewportSize({ width: 844, height: 390 })
  await expect(page.locator('.brandbook-preloader')).toHaveCount(0)
  await expect(page.locator('#brandbook-page')).toHaveJSProperty('inert', false)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})
