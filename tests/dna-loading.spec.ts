import { test, expect, type Page } from '@playwright/test'
import { mkdir } from 'node:fs/promises'

test.use({ reducedMotion: 'no-preference', viewport: { width: 1440, height: 900 } })

const phase = (page: Page) => page.locator('.dna-experience')
const settled = async (page: Page) => {
  await expect(page.locator('.dna-loader')).toHaveCount(0, { timeout: 20000 })
  await expect(phase(page)).toHaveAttribute('data-phase', 'ready')
}
function collectErrors(page: Page) {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
  return errors
}

test('Abertura: luz no contorno, 50% desacelera, logo revelada, energia vira o DNA existente', async ({ page }) => {
  const errors = collectErrors(page)
  await mkdir('docs/screenshots/opening', { recursive: true })
  await page.goto('/')
  await expect(page.locator('.dna-loader')).toBeVisible()
  // Nothing of the home appears before its cue.
  await expect(page.locator('.dna-hero-detail').first()).toHaveCSS('opacity', '0')
  await expect(page.locator('.motion-control')).toBeHidden()
  await expect(page.locator('.dna-loading-number')).not.toHaveText('0')
  await page.screenshot({ path: 'docs/screenshots/opening/01-luz.png' })
  await expect(phase(page)).toHaveAttribute('data-phase', 'midpoint')
  const middle = Number(await page.locator('.dna-loading-number').textContent())
  expect(middle).toBeGreaterThanOrEqual(49)
  expect(middle).toBeLessThanOrEqual(53)
  await page.screenshot({ path: 'docs/screenshots/opening/02-meio.png' })
  await expect(phase(page)).toHaveAttribute('data-phase', 'accelerating')
  await page.waitForTimeout(500)
  await page.screenshot({ path: 'docs/screenshots/opening/03-acelera.png' })
  await expect(phase(page)).toHaveAttribute('data-phase', 'logoReveal')
  await page.waitForTimeout(550)
  await page.screenshot({ path: 'docs/screenshots/opening/04-logo.png' })
  await expect(phase(page)).toHaveAttribute('data-phase', 'dnaMorph')
  await page.waitForTimeout(250)
  await page.screenshot({ path: 'docs/screenshots/opening/05-energia.png' })
  await page.waitForTimeout(550)
  await page.screenshot({ path: 'docs/screenshots/opening/06-helice.png' })
  await expect(phase(page)).toHaveAttribute('data-phase', 'introReveal')
  await page.waitForTimeout(500)
  await page.screenshot({ path: 'docs/screenshots/opening/07-fragmenta.png' })
  await settled(page)
  await page.waitForTimeout(400)
  await page.screenshot({ path: 'docs/screenshots/opening/08-home.png' })
  // The same canvas and the original logo element end exactly in the layout slot.
  await expect(page.locator('canvas.dna-canvas')).toHaveCount(1)
  await expect(page.locator('.dna-canvas')).toHaveAttribute('data-formation', '1.000')
  await expect(page.locator('.dna-hero-logo')).toHaveCSS('opacity', '1')
  expect(await page.locator('.dna-logo-mask').evaluate(el => getComputedStyle(el).transform)).toBe('none')
  await expect(page.locator('.dna-logo-light')).toHaveCount(0)
  await expect(page.locator('.motion-control')).toBeVisible()
  expect(errors).toEqual([])
})

test('Progresso aguarda recurso real e Escape libera leitura imediatamente', async ({ page }) => {
  let release!: () => void
  const pending = new Promise<void>(resolve => { release = resolve })
  await page.route('**/assets/logo-gazin.png', async route => { await pending; await route.continue() })
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.dna-loader')).toBeVisible()
  await page.waitForTimeout(2600)
  // Without the logo the counter may not claim completion.
  expect(Number(await page.locator('.dna-loading-number').textContent())).toBeLessThan(100)
  await page.keyboard.press('Escape')
  await expect(page.locator('.dna-loader')).toHaveCount(0)
  await expect(page.locator('#hero-title')).toBeVisible()
  release()
  await page.getByRole('button', { name: 'Reduzir animações', exact: true }).click()
  await page.getByRole('button', { name: 'Ativar animações', exact: true }).click()
  await expect(page.locator('.dna-loader')).toHaveCount(0)
})

test('Recurso travado nunca bloqueia a página', async ({ page }) => {
  let release!: () => void
  const pending = new Promise<void>(resolve => { release = resolve })
  await page.route('**/*.woff2', async route => { await pending; await route.continue() })
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.dna-loader')).toBeVisible()
  await settled(page)
  await expect(page.locator('#hero-title')).toBeVisible()
  release()
})

for (const [label, prepare] of [
  ['na introdução', async (page: Page) => { await page.getByRole('link', { name: 'Explore nossa marca' }).click(); await expect(page.locator('#introducao')).toBeInViewport() }],
  ['nos pilares', async (page: Page) => { await page.goto('/#pilares'); await expect(page.locator('#pilares')).toBeInViewport() }],
  ['no final', async (page: Page) => { await page.evaluate(() => scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' })); await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(1000) }],
] as const) {
  test(`F5 ${label} reinicia pela home com a abertura`, async ({ page }) => {
    const errors = collectErrors(page)
    await page.goto('/')
    await settled(page)
    await prepare(page)
    await page.waitForTimeout(400)
    await page.reload()
    await expect(page.locator('.dna-loader')).toBeVisible()
    expect(await page.evaluate(() => [scrollY, location.hash])).toEqual([0, ''])
    await settled(page)
    expect(await page.evaluate(() => scrollY)).toBe(0)
    await expect(page.locator('#hero-title')).toBeInViewport()
    // Scroll-driven state starts from zero: hero copy fully visible, DNA in its first pose.
    await expect(page.locator('.dna-hero-copy')).toHaveCSS('opacity', '1')
    await expect(page.locator('.dna-canvas')).toHaveAttribute('data-turn', '0.0000')
    expect(errors).toEqual([])
  })
}

test('F5 durante a abertura e durante a formação do DNA recomeça limpo', async ({ page }) => {
  const errors = collectErrors(page)
  await page.goto('/')
  await expect(phase(page)).toHaveAttribute('data-phase', 'midpoint')
  await page.reload()
  await expect(page.locator('.dna-loader')).toBeVisible()
  await expect(phase(page)).toHaveAttribute('data-phase', 'dnaMorph', { timeout: 15000 })
  await page.reload()
  await expect(page.locator('.dna-loader')).toBeVisible()
  await expect(page.locator('.dna-loading-number')).not.toHaveText('100')
  await settled(page)
  await expect(page.locator('canvas.dna-canvas')).toHaveCount(1)
  expect(await page.evaluate(() => scrollY)).toBe(0)
  expect(errors).toEqual([])
})

test('Navegação interna não repete a abertura', async ({ page }) => {
  await page.goto('/')
  await settled(page)
  await page.getByRole('link', { name: 'Explore nossa marca' }).click()
  await expect(page.locator('#introducao')).toBeInViewport()
  await page.goBack()
  await page.getByRole('link', { name: 'Voltar ao início', exact: true }).click()
  await expect(page.locator('#hero-title')).toBeInViewport()
  await expect(page.locator('.dna-loader')).toHaveCount(0)
  await expect(phase(page)).toHaveAttribute('data-phase', 'ready')
})

test('Rolar durante a abertura libera a página imediatamente', async ({ page }) => {
  await page.goto('/')
  await expect(phase(page)).toHaveAttribute('data-phase', 'midpoint')
  await page.mouse.move(700, 450)
  await page.mouse.wheel(0, 900)
  await expect(page.locator('.dna-loader')).toHaveCount(0)
  await expect(page.locator('.dna-hero-logo')).toHaveCSS('opacity', '1')
  expect(await page.locator('.dna-logo-mask').evaluate(el => getComputedStyle(el).transform)).toBe('none')
})

test('Abertura se adapta ao redimensionamento e ao celular', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await expect(phase(page)).toHaveAttribute('data-phase', 'midpoint')
  await page.screenshot({ path: 'docs/screenshots/opening/mobile-meio.png' })
  await page.setViewportSize({ width: 844, height: 390 })
  await page.waitForTimeout(200)
  // The centred logo follows the new viewport while loading.
  const box = (await page.locator('.dna-logo-mask').boundingBox())!
  expect(Math.abs(box.x + box.width / 2 - 844 / 2)).toBeLessThan(12)
  await page.setViewportSize({ width: 390, height: 844 })
  await settled(page)
  await page.screenshot({ path: 'docs/screenshots/opening/mobile-home.png' })
  await expect(page.locator('#hero-title')).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

test('F5 depois de rolar com a roda: o navegador não restaura a posição e a abertura não é cancelada', async ({ page }) => {
  await page.goto('/')
  await settled(page)
  await page.mouse.move(700, 450)
  for (let i = 0; i < 40; i++) { await page.mouse.wheel(0, 1200); await page.waitForTimeout(40) }
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(3000)
  // ScrollTrigger re-applies its captured value on refresh: it must stay manual.
  await page.evaluate(() => (window as unknown as { dispatchEvent(e: Event): void }).dispatchEvent(new Event('resize')))
  await page.waitForTimeout(400)
  expect(await page.evaluate(() => history.scrollRestoration)).toBe('manual')
  await page.reload()
  await expect(page.locator('.dna-loader')).toBeVisible()
  // A late scroll from the browser (restoration) is undone, not treated as "skip".
  await page.evaluate(() => scrollTo(0, 6000))
  await page.waitForTimeout(300)
  expect(await page.evaluate(() => scrollY)).toBe(0)
  await expect(page.locator('.dna-loader')).toBeVisible()
  await settled(page)
  expect(await page.evaluate(() => scrollY)).toBe(0)
})

test('Pontos do DNA nascem um a um, da base para o topo', async ({ page }) => {
  await page.goto('/')
  const born = page.locator('.dna-hotspot[data-born="true"]')
  await expect(born).toHaveCount(0)
  await expect(phase(page)).toHaveAttribute('data-phase', 'introReveal')
  await expect.poll(() => born.count(), { timeout: 15000 }).toBeGreaterThan(0)
  const partial = await born.count()
  expect(partial).toBeLessThan(11)
  // The first to ignite is the lowest one on the helix (the last in the list).
  await expect(page.locator('.dna-hotspot').last()).toHaveAttribute('data-born', 'true')
  await page.waitForTimeout(250)
  await page.screenshot({ path: 'docs/screenshots/opening/09-pontos-nascendo.png' })
  await settled(page)
  await expect(born).toHaveCount(11)
})

for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  test(`Botão "Pular abertura" recebe o clique e encerra a abertura (${viewport.width}px)`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto('/')
    const skip = page.getByRole('button', { name: /Pular abertura/ })
    await expect(skip).toBeVisible()
    // Nothing covers the button (the hero used to swallow the click).
    const box = (await skip.boundingBox())!
    expect(await page.evaluate(([x, y]) => document.elementFromPoint(x, y)?.closest('.dna-skip') !== null, [box.x + box.width / 2, box.y + box.height / 2])).toBe(true)
    await skip.click({ trial: true })
    await skip.click()
    await expect(page.locator('.dna-loader')).toHaveCount(0, { timeout: 2000 })
    await expect(skip).toHaveCount(0)
  })
}
