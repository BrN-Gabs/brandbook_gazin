import { test, expect, type Page } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import { audiovisual, framing, lighting, motionEditing, photoVideoIntro, style } from '../src/data/photoVideo'
import { skipOpening } from './helpers'

const shots = 'docs/screenshots/fotografia-video'
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
const stage = (page: Page) => page.locator('#pv-stage')
const open = async (page: Page, index: number) => {
  await page.locator(`#fotografia-video-${index} .pv-card-open`).click()
  await expect(page.locator(`#fotografia-video-${index}`)).toHaveClass(/is-active/)
  await page.waitForTimeout(900)
}
const loaded = async (page: Page, scope: string) => {
  const images = page.locator(`${scope} img`)
  for (let i = 0; i < await images.count(); i++) {
    // Direct scroll: the camera-movement simulations never stop moving (no 'stable' wait).
    await images.nth(i).evaluate(image => image.scrollIntoView({ block: 'center', behavior: 'instant' }))
    await expect.poll(() => images.nth(i).evaluate(image => (image as HTMLImageElement).naturalWidth), { message: await images.nth(i).getAttribute('src') ?? '' }).toBeGreaterThan(0)
  }
}

test.beforeAll(async () => { await mkdir(shots, { recursive: true }) })

test.describe('Desktop com movimento', () => {
  test.use({ reducedMotion: 'no-preference', viewport: { width: 1440, height: 900 } })

  test('introdução, cinco cards e as cinco demonstrações com fotografias carregadas', async ({ page }) => {
    const errors = errorsOf(page)
    await page.goto('/')
    await skipOpening(page)
    await ready(page)
    const chapter = page.locator('#fotografia-video')
    await expect(chapter.locator('.vb-lead-title')).toHaveText(photoVideoIntro.title)
    await expect(chapter.locator('.pos-lead')).toHaveText(photoVideoIntro.text)
    await expect(chapter.locator('.content-placeholder')).toHaveCount(0)
    for (const [index, title] of ['Estilo Fotográfico', 'Enquadramentos e Composição', 'Iluminação e Tratamento de Imagens', 'Direção de Arte Audiovisual', 'Movimento e Edição de Vídeo'].entries()) {
      await expect(page.locator(`#fotografia-video-${index + 1} h3`)).toHaveText(title)
    }
    await loaded(page, '.pv-rail')
    await chapter.locator('.pv-rail').evaluate(element => element.scrollIntoView({ block: 'start', behavior: 'instant' }))
    await page.waitForTimeout(800)
    await page.screenshot({ path: `${shots}/trilho.png` })
    for (const [index, data] of [style, framing, lighting, audiovisual, motionEditing].entries()) {
      await open(page, index + 1)
      await expect(stage(page)).toContainText(data.text)
      await loaded(page, '#pv-stage')
      await stage(page).evaluate(element => element.scrollIntoView({ block: 'start', behavior: 'instant' }))
      await page.waitForTimeout(500)
      await page.screenshot({ path: `${shots}/04-${index + 1}.png` })
    }
    expect(errors).toEqual([])
  })

  test('interações: características, enquadramentos, composição, comparador, storyboard e simulações', async ({ page }) => {
    const errors = errorsOf(page)
    await page.goto('/')
    await skipOpening(page)
    await ready(page)
    await page.locator('#fotografia-video').scrollIntoViewIfNeeded()
    // 04.1
    await open(page, 1)
    await stage(page).getByRole('button', { name: 'Autenticidade' }).click()
    await expect(page.locator('#pv-trait-detail')).toContainText(style.traits[3].text)
    // 04.2
    await open(page, 2)
    for (const shot of framing.shots) {
      await stage(page).getByRole('radio', { name: shot.label }).click()
      await expect(stage(page).locator('.pv-viewer-info')).toContainText(shot.text)
      await expect(stage(page).locator('.pv-viewer-photo img')).toHaveAttribute('src', new RegExp(shot.photo.src.split('/').pop()!))
    }
    await stage(page).getByRole('radio', { name: /Inadequada/ }).click()
    await expect(stage(page).locator('.pv-composition-frame')).toHaveClass(/is-bad/)
    await expect(stage(page)).toContainText(framing.composition.bad.points[0])
    await expect(stage(page)).toContainText('Demonstração didática')
    await page.waitForTimeout(700)
    await page.screenshot({ path: `${shots}/04-2-inadequada.png` })
    // 04.3: same source file, range divider moves the clip.
    await open(page, 3)
    const [before, after] = await stage(page).locator('.pv-compare-stage img').evaluateAll(images => images.map(image => image.getAttribute('src')!))
    expect(before).toMatch(/tratamento-depois/)
    expect(after).toMatch(/tratamento-antes/)
    const range = stage(page).locator('.pv-compare-stage input[type=range]')
    const box = (await stage(page).locator('.pv-compare-stage').boundingBox())!
    await page.mouse.click(box.x + box.width * .2, box.y + box.height / 2)
    await expect.poll(() => range.inputValue().then(Number)).toBeLessThan(35)
    await range.focus()
    await page.keyboard.press('End')
    await expect(range).toHaveValue('100')
    await range.fill('60')
    await expect(stage(page).locator('.pv-compare')).toHaveAttribute('style', /--split: 60%/)
    // 04.4: no video yet → no player, no play button.
    await open(page, 4)
    await expect(stage(page).locator('video')).toHaveCount(audiovisual.video.src ? 1 : 0)
    await expect(stage(page).locator('.pv-storyboard li')).toHaveCount(audiovisual.storyboard.length)
    // Lightbox
    await stage(page).locator('.pv-frame').first().click()
    const dialog = page.getByRole('dialog', { name: 'Fotografia ampliada' })
    await expect(dialog).toBeVisible()
    await page.screenshot({ path: `${shots}/lightbox.png` })
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(stage(page).locator('.pv-frame').first()).toBeFocused()
    // 04.5: simulations animate and can be paused.
    await open(page, 5)
    const pan = stage(page).locator('.pv-simulation.is-pan img')
    await expect.poll(() => pan.evaluate(image => getComputedStyle(image).animationName)).toBe('pv-pan')
    await stage(page).getByRole('button', { name: /Pausar simulações/ }).click()
    await expect.poll(() => pan.evaluate(image => getComputedStyle(image).animationPlayState)).toBe('paused')
    await expect(stage(page)).toContainText('não é um vídeo')
    expect(errors).toEqual([])
  })

  test('link do menu seleciona o subtópico; F5 recomeça pela introdução', async ({ page }) => {
    await page.goto('/')
    await skipOpening(page)
    await ready(page)
    await page.getByRole('button', { name: /Capítulos/ }).click()
    const dialog = page.getByRole('dialog', { name: 'Navegação do Manual da Marca' })
    await expect(dialog).toBeVisible()
    await page.waitForTimeout(400)
    const expander = dialog.getByRole('button', { name: /assuntos de Fotografia e Vídeo/ })
    if (await expander.getAttribute('aria-expanded') !== 'true') await expander.click()
    await dialog.getByRole('link', { name: '06.3 Iluminação e Tratamento de Imagens' }).click()
    await expect(page.locator('#fotografia-video-3')).toHaveClass(/is-active/)
    await expect(stage(page)).toContainText(lighting.text)
    await page.reload()
    await expect.poll(() => page.evaluate(() => [scrollY, location.hash])).toEqual([0, ''])
  })
})

test('Movimento reduzido: simulações paradas e sem botão de pausa', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await skipOpening(page)
  await page.locator('#fotografia-video').scrollIntoViewIfNeeded()
  await open(page, 5)
  expect(await stage(page).locator('.pv-simulation.is-pan img').evaluate(image => getComputedStyle(image).animationName)).toBe('none')
  await expect(stage(page).locator('.pv-play')).toBeHidden()
})

test.describe('Celular', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })

  test('swipe no trilho, sem rolagem lateral da página, comparador ao toque', async ({ page }) => {
    const errors = errorsOf(page)
    await page.goto('/')
    await skipOpening(page)
    const rail = page.locator('.pv-rail')
    await rail.evaluate(element => element.scrollIntoView({ block: 'start', behavior: 'instant' }))
    expect(await rail.evaluate(element => element.scrollWidth > element.clientWidth)).toBe(true)
    await rail.evaluate(element => element.scrollBy({ left: 600, behavior: 'instant' }))
    await page.waitForTimeout(400)
    expect(await rail.evaluate(element => element.scrollLeft)).toBeGreaterThan(200)
    await page.screenshot({ path: `${shots}/mobile-trilho.png` })
    await page.locator('#fotografia-video-3 .pv-card-open').tap()
    await expect(page.locator('#fotografia-video-3')).toHaveClass(/is-active/)
    await page.waitForTimeout(900)
    const compare = stage(page).locator('.pv-compare-stage')
    await compare.scrollIntoViewIfNeeded()
    const box = (await compare.boundingBox())!
    await page.touchscreen.tap(box.x + box.width * .8, box.y + box.height / 2)
    await expect.poll(() => compare.locator('input').inputValue().then(Number)).toBeGreaterThan(65)
    await page.screenshot({ path: `${shots}/mobile-comparador.png` })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    expect(errors).toEqual([])
  })
})
