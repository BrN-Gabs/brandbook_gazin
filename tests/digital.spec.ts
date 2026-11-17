import { test, expect, type Page } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import { banners, digitalAssets, digitalIntro, ecommerce, motion, social, web } from '../src/data/digitalCommunication'
import { skipOpening } from './helpers'

const shots = 'docs/screenshots/comunicacao-digital'
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
  await page.waitForTimeout(900)
}
const section = (page: Page, n: number) => page.locator(`#comunicacao-digital-${n}`)

test.beforeAll(async () => { await mkdir(shots, { recursive: true }) })

test.describe('Desktop com movimento', () => {
  test.use({ reducedMotion: 'no-preference', viewport: { width: 1440, height: 900 } })

  test('introdução, cinco subtópicos preenchidos e índice', async ({ page }) => {
    const errors = errorsOf(page)
    await page.goto('/')
    await skipOpening(page)
    await ready(page)
    const chapter = page.locator('#comunicacao-digital')
    await expect(chapter.locator('.vb-lead-title')).toHaveText(digitalIntro.title)
    await expect(chapter.locator('.pos-lead')).toHaveText(digitalIntro.text)
    await expect(chapter.locator('.content-placeholder')).toHaveCount(0)
    for (const [index, title] of ['Redes Sociais', 'Sites e Landing Pages', 'Banners Digitais', 'E-commerce', 'Animações e Experiências Interativas'].entries()) {
      await expect(section(page, index + 1).locator('h3')).toHaveText(title)
    }
    for (const text of [social.text, web.text, banners.text, ecommerce.text, motion.text]) await expect(chapter).toContainText(text)
    // In-chapter index still leads to each subtopic.
    await chapter.locator('.chapter-nav a[href="#comunicacao-digital-3"]').click()
    await expect(section(page, 3)).toBeInViewport()
    await show(page, '#comunicacao-digital')
    await page.screenshot({ path: `${shots}/introducao.png` })
    expect(errors).toEqual([])
  })

  test('06.1 redes sociais: formatos, hierarquia e galeria', async ({ page }) => {
    const errors = errorsOf(page)
    await page.goto('/')
    await skipOpening(page)
    await ready(page)
    await show(page, '#comunicacao-digital-1')
    const s1 = section(page, 1)
    const art = s1.locator('.dg-phone .dg-phone-art')
    // Feed 4:5 → Story 9:16 → Quadrado 1:1: the artwork changes its proportion.
    const ratio = () => art.evaluate(element => { const r = element.getBoundingClientRect(); return r.width / r.height })
    await expect.poll(ratio).toBeCloseTo(4 / 5, 1)
    await s1.getByRole('radio', { name: /Story/ }).click()
    await expect.poll(ratio).toBeCloseTo(9 / 16, 1)
    await expect(s1.locator('.dg-safe')).toHaveCount(2)
    await expect(s1.locator('.dg-note')).toHaveText(social.formats[1].note)
    await s1.getByRole('radio', { name: /Quadrado/ }).click()
    await expect.poll(ratio).toBeCloseTo(1, 1)
    // Keyboard: arrows move the selection inside the group.
    await s1.getByRole('radio', { name: /Quadrado/ }).press('ArrowRight')
    await expect(s1.getByRole('radio', { name: /Vídeo/ })).toHaveAttribute('aria-checked', 'true')
    await expect(s1.getByRole('radio', { name: /Vídeo/ })).toBeFocused()
    await expect(s1.getByRole('button', { name: 'Reproduzir de novo' })).toBeVisible()
    // Hierarchy markers and the gallery (same state).
    await s1.getByText('Mostrar hierarquia').click()
    await expect(s1.locator('.dg-phone .dg-post')).toHaveClass(/show-steps/)
    await s1.getByRole('button', { name: /Ver formato Feed vertical/ }).click()
    await expect(s1.getByRole('radio', { name: /Feed/ })).toHaveAttribute('aria-checked', 'true')
    // Official Gazin logo, untouched proportions; no fake metrics.
    const logo = s1.locator('.dg-phone .dg-post-logo img')
    await expect(logo).toHaveAttribute('src', new RegExp(`${digitalAssets.logo.src}$`))
    const box = (await logo.boundingBox())!
    expect(Math.abs(box.width / box.height - digitalAssets.logo.width / digitalAssets.logo.height)).toBeLessThan(.05)
    await expect(s1.locator('.dg-phone')).not.toContainText(/curtid|seguidor|coment/i)
    await expect(s1).toContainText('Exemplo didático')
    await page.waitForTimeout(500)
    await page.screenshot({ path: `${shots}/06-1.png` })
    expect(errors).toEqual([])
  })

  test('06.2 sites: a prévia se reorganiza conforme a largura', async ({ page }) => {
    await page.goto('/')
    await skipOpening(page)
    await ready(page)
    await show(page, '#comunicacao-digital-2')
    const s2 = section(page, 2)
    const columns = () => s2.locator('.dg-site-grid').evaluate(element => getComputedStyle(element).gridTemplateColumns.split(' ').length)
    const width = () => s2.locator('.dg-device-screen').evaluate(element => (element as HTMLElement).offsetWidth)
    await expect.poll(columns).toBe(3)
    await expect(s2.locator('.dg-site-burger')).toBeHidden()
    await s2.getByRole('radio', { name: 'Tablet' }).click()
    await expect.poll(width).toBe(768)
    await expect.poll(columns).toBe(2)
    await s2.getByRole('radio', { name: 'Mobile' }).click()
    await expect.poll(width).toBe(375)
    await expect.poll(columns).toBe(1)
    await expect(s2.locator('.dg-site-burger')).toBeVisible()
    await expect(s2.locator('.dg-changes')).toContainText(web.devices[2].changes[0])
    await page.waitForTimeout(600)
    await page.screenshot({ path: `${shots}/06-2.png` })
  })

  test('06.3 banners: formatos e comparador adequado × inadequado', async ({ page }) => {
    await page.goto('/')
    await skipOpening(page)
    await ready(page)
    await show(page, '#comunicacao-digital-3')
    const s3 = section(page, 3)
    const banner = s3.locator('.dg-banner')
    for (const format of banners.formats) {
      await s3.getByRole('radio', { name: format.label, exact: true }).click()
      await expect(banner).toHaveClass(new RegExp(`is-${format.id}`))
    }
    // Official campaign logo with the Gazin logo; adequate keeps the original proportion.
    const campaignLogo = banner.locator('.dg-banner-campaign')
    await expect(campaignLogo).toHaveAttribute('src', /black-friday-show\.webp$/)
    await expect(banner.locator('.dg-banner-gazin')).toHaveAttribute('src', new RegExp(`${digitalAssets.logo.src}$`))
    const proportion = () => campaignLogo.evaluate(element => { const img = element as HTMLImageElement; const r = img.getBoundingClientRect(); return Math.abs(img.naturalWidth / img.naturalHeight - r.width / r.height) })
    await expect.poll(proportion).toBeLessThan(.05)
    await s3.getByRole('radio', { name: 'Inadequado', exact: true }).click()
    await expect(banner).toHaveClass(/is-inadequado/)
    await expect(s3.locator('.dg-criteria')).toContainText(banners.criteria[2].bad)
    await expect(s3.locator('.vi-wrong-stamp')).toBeVisible()
    await expect.poll(proportion).toBeGreaterThan(.5)
    // Hierarchy markers can be hidden.
    await s3.getByText('Mostrar hierarquia').click()
    await expect(banner).not.toHaveClass(/show-steps/)
    await page.waitForTimeout(500)
    await page.screenshot({ path: `${shots}/06-3.png` })
  })

  test('06.4 e-commerce: vitrine → página de produto → vitrine', async ({ page }) => {
    await page.goto('/')
    await skipOpening(page)
    await ready(page)
    await show(page, '#comunicacao-digital-4')
    const s4 = section(page, 4)
    await expect(s4.locator('.dg-shop-grid > li')).toHaveCount(ecommerce.products.length)
    await s4.getByRole('button', { name: /Ver produto: Sofá/ }).click()
    await expect(s4.getByRole('radio', { name: 'Página de produto' })).toHaveAttribute('aria-checked', 'true')
    await expect(s4.locator('.dg-shop-details h4')).toContainText('Sofá')
    await expect(s4.locator('.dg-shop-details h4')).toBeFocused()
    await expect(s4.locator('.dg-shop-specs')).toContainText(ecommerce.specs[0])
    await s4.getByRole('radio', { name: 'Detalhe' }).click()
    await expect(s4.locator('.dg-shop-main')).toHaveClass(/is-detail/)
    await expect(s4.locator('.dg-steps')).toContainText(ecommerce.hierarchy.produto[4])
    await page.waitForTimeout(400)
    await page.screenshot({ path: `${shots}/06-4.png` })
    await s4.getByRole('button', { name: 'Voltar à vitrine' }).click()
    await expect(s4.locator('.dg-shop-grid')).toBeVisible()
    await expect(s4).toContainText('fictícios')
    // A design guide, not a store: no form, no real buy control.
    await expect(s4.locator('form, input')).toHaveCount(0)
  })

  test('06.5 animações: três demonstrações funcionais e referência ao DNA', async ({ page }) => {
    const errors = errorsOf(page)
    await page.goto('/')
    await skipOpening(page)
    await ready(page)
    await show(page, '#comunicacao-digital-5')
    const s5 = section(page, 5)
    await expect(s5.locator('.dg-mo-text')).toHaveAttribute('aria-label', motion.revealText)
    // Plays once and ends still (the last word becomes fully visible).
    await expect.poll(() => s5.locator('.dg-mo-text span').last().evaluate(element => getComputedStyle(element).opacity)).toBe('1')
    await s5.getByRole('button', { name: 'Reproduzir de novo' }).click()
    await s5.getByRole('radio', { name: /Animação de elementos/ }).click()
    await expect(s5.locator('.dg-mo-logo')).toHaveAttribute('src', new RegExp(`${digitalAssets.logo.src}$`))
    await expect.poll(() => s5.locator('.dg-mo-logo').evaluate(element => getComputedStyle(element).opacity)).toBe('1')
    await s5.getByRole('radio', { name: /Interação/ }).click()
    const card = s5.getByRole('button', { name: /Clareza/ })
    await expect(card).toHaveAttribute('aria-pressed', 'false')
    await card.click()
    await expect(card).toHaveAttribute('aria-pressed', 'true')
    await card.press('Enter')
    await expect(card).toHaveAttribute('aria-pressed', 'false')
    await expect(s5.locator('.dg-reduced')).toBeHidden()
    await expect(s5.locator('video')).toHaveCount(0)
    await expect(s5.getByRole('link', { name: motion.dna.label })).toHaveAttribute('href', '#inicio')
    await page.screenshot({ path: `${shots}/06-5.png` })
    expect(errors).toEqual([])
  })

  test('F5 dentro do capítulo recomeça pela introdução', async ({ page }) => {
    await page.goto('/#comunicacao-digital-3')
    await skipOpening(page)
    await page.reload()
    await expect.poll(() => page.evaluate(() => [scrollY, location.hash])).toEqual([0, ''])
  })
})

test('movimento reduzido: estado final, sem botão de repetir', async ({ page }) => {
  await page.goto('/')
  await skipOpening(page)
  await show(page, '#comunicacao-digital-5')
  const s5 = section(page, 5)
  await expect(page.locator('html')).not.toHaveClass(/motion-enabled/)
  await expect(s5.locator('.dg-reduced')).toBeVisible()
  await expect(s5.getByRole('button', { name: 'Reproduzir de novo' })).toBeHidden()
  expect(await s5.locator('.dg-mo-text span').first().evaluate(element => getComputedStyle(element).animationName)).toBe('none')
})

test.describe('Celular', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })

  test('coluna única, toque nos seletores e sem rolagem lateral', async ({ page }) => {
    const errors = errorsOf(page)
    await page.goto('/')
    await skipOpening(page)
    for (const n of [1, 2, 3, 4, 5]) {
      await show(page, `#comunicacao-digital-${n} .dg-demo`)
      await page.screenshot({ path: `${shots}/mobile-06-${n}.png` })
    }
    // Demonstration comes right after the text (guidelines below it).
    const order = await section(page, 1).evaluate(element => ['.subsection-text', '.dg-demo', '.dg-aside'].map(selector => element.querySelector(selector)!.getBoundingClientRect().top))
    expect(order[0]).toBeLessThan(order[1])
    expect(order[1]).toBeLessThan(order[2])
    await section(page, 1).getByRole('radio', { name: /Story/ }).tap()
    await expect(section(page, 1).locator('.dg-safe')).toHaveCount(2)
    await section(page, 4).getByRole('button', { name: /Ver produto: Televisor/ }).tap()
    await expect(section(page, 4).locator('.dg-shop-details h4')).toContainText('Televisor')
    await section(page, 5).getByRole('radio', { name: /Interação/ }).tap()
    await section(page, 5).getByRole('button', { name: /Movimento/ }).tap()
    await expect(section(page, 5).getByRole('button', { name: /Movimento/ })).toHaveAttribute('aria-pressed', 'true')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    expect(errors).toEqual([])
  })
})
