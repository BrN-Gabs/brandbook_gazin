import { test, expect, type Page } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import { campaigns, internalIntro, language, materials, notices, tv } from '../src/data/internalCommunication'
import { skipOpening } from './helpers'

const shots = 'docs/screenshots/comunicacao-interna'
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
const card = (page: Page, n: number) => page.locator(`#comunicacao-interna-${n}`)
const detail = (page: Page) => page.locator('#in-detail')
const openCard = async (page: Page, n: number) => {
  await card(page, n).getByRole('button', { name: /Ver detalhes|Detalhes abertos/ }).click()
  await expect(detail(page).locator('#in-detail-title')).toHaveText(await card(page, n).locator('h3').innerText())
}

test.beforeAll(async () => { await mkdir(shots, { recursive: true }) })

test.describe('Desktop com movimento', () => {
  test.use({ reducedMotion: 'no-preference', viewport: { width: 1440, height: 900 } })

  test('introdução, cinco cards na faixa horizontal e progresso real', async ({ page }) => {
    const errors = errorsOf(page)
    await page.goto('/')
    await skipOpening(page)
    await ready(page)
    const chapter = page.locator('#comunicacao-interna')
    await expect(chapter.locator('.vb-lead-title')).toHaveText(internalIntro.title)
    await expect(chapter.locator('.pos-lead')).toHaveText(internalIntro.text)
    await expect(chapter.locator('.content-placeholder')).toHaveCount(0)
    for (const [index, title] of ['TV Gazin', 'Comunicados Corporativos', 'Campanhas para Colaboradores', 'Materiais Institucionais Internos', 'Padronização da Linguagem Interna'].entries()) {
      await expect(card(page, index + 1).locator('h3')).toHaveText(title)
      await expect(card(page, index + 1).locator('.subsection-number')).toHaveText(`10.${index + 1}`)
    }
    for (const summary of [tv.summary, notices.summary, campaigns.summary, materials.summary, language.summary]) await expect(chapter).toContainText(summary)
    // Same scrolling as chapter 04: native horizontal scroll inside the strip, thin blue scrollbar,
    // same card widths, no edge fade and no extra arrows.
    const rail = chapter.locator('.in-rail')
    const photoRail = page.locator('#fotografia-video .pv-rail')
    const style = (element: Element) => { const s = getComputedStyle(element); return [s.overflowX, s.scrollbarWidth, s.scrollbarColor, s.scrollSnapType, s.maskImage] }
    expect(await rail.evaluate(style)).toEqual(await photoRail.evaluate(style))
    expect(await rail.evaluate(element => element.scrollWidth > element.clientWidth)).toBe(true)
    const width = (selector: string) => page.locator(selector).first().evaluate(element => Math.round(element.getBoundingClientRect().width))
    expect(Math.abs(await width('#comunicacao-interna .in-card') - await width('#fotografia-video .pv-card'))).toBeLessThan(3)
    await expect(chapter.getByRole('button', { name: /cards/ })).toHaveCount(0)
    await rail.evaluate(element => element.scrollTo({ left: element.scrollWidth, behavior: 'instant' }))
    await expect.poll(() => rail.evaluate(element => Math.ceil(element.scrollLeft + element.clientWidth) >= element.scrollWidth - 2)).toBe(true)
    await rail.evaluate(element => element.scrollTo({ left: 0, behavior: 'instant' }))
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await chapter.locator('.in-strip').scrollIntoViewIfNeeded()
    await page.screenshot({ path: `${shots}/faixa.png` })
    expect(errors).toEqual([])
  })

  test('cards abrem o painel de detalhes; o índice também seleciona o card', async ({ page }) => {
    await page.goto('/')
    await skipOpening(page)
    await ready(page)
    await expect(detail(page).locator('#in-detail-title')).toHaveText('TV Gazin')
    await openCard(page, 3)
    await expect(card(page, 3).getByRole('button', { name: 'Detalhes abertos' })).toHaveAttribute('aria-expanded', 'true')
    await expect(detail(page)).toBeInViewport()
    await expect(detail(page).locator('#in-detail-title')).toBeFocused()
    // Chapter index link → selects the card.
    await page.locator('#comunicacao-interna .chapter-nav a[href="#comunicacao-interna-5"]').click()
    await expect(detail(page).locator('#in-detail-title')).toHaveText('Padronização da Linguagem Interna')
    await expect(card(page, 5)).toHaveClass(/is-active/)
  })

  test('08.1 TV Gazin: demonstração animada por tipo de conteúdo, sem player falso', async ({ page }) => {
    const errors = errorsOf(page)
    await page.goto('/')
    await skipOpening(page)
    await ready(page)
    await openCard(page, 1)
    const screen = detail(page).locator('.in-screen')
    await expect(screen).toContainText(tv.types[0].screen.title)
    await detail(page).getByRole('radio', { name: 'Reconhecimento' }).click()
    await expect(screen).toContainText(tv.types[1].screen.title)
    await expect(detail(page).locator('video')).toHaveCount(0)
    await expect(detail(page)).toContainText('Não é um vídeo da TV Gazin')
    await expect(detail(page)).toContainText(tv.scope)
    // Advances on its own while visible; pausing stops it.
    await screen.scrollIntoViewIfNeeded()
    await expect(screen).toContainText(tv.types[2].screen.title, { timeout: 9000 })
    await detail(page).getByRole('button', { name: 'Pausar sequência' }).click()
    await page.waitForTimeout(6000)
    await expect(screen).toContainText(tv.types[2].screen.title)
    await expect(detail(page).locator('.in-scene-tv')).toHaveAttribute('src', /tv-gazin\.png$/)
    await page.waitForTimeout(1200)
    await page.screenshot({ path: `${shots}/08-1.png` })
    expect(errors).toEqual([])
  })

  test('08.2 comunicados: comparador inadequado × recomendado e estrutura 01–06', async ({ page }) => {
    await page.goto('/')
    await skipOpening(page)
    await ready(page)
    await openCard(page, 2)
    const paper = detail(page).locator('.in-paper')
    await expect(paper).toContainText(notices.example.title)
    await expect(paper.locator('[data-step]')).toHaveCount(6)
    await detail(page).getByRole('radio', { name: 'Inadequado' }).click()
    await expect(paper).toHaveClass(/is-bad/)
    await expect(detail(page).locator('.in-verdict')).toContainText('Título pouco claro')
    await detail(page).getByRole('radio', { name: 'Recomendado' }).click()
    await detail(page).getByText('Mostrar estrutura').click()
    await expect(paper).not.toHaveClass(/in-steps-on/)
    await expect(detail(page)).toContainText('Exemplo didático · conteúdo fictício')
    // The proposed notice template is offered here too (DOCX + PDF).
    await expect(detail(page).locator('.in-templates a')).toHaveCount(2)
    await page.waitForTimeout(600)
    await page.screenshot({ path: `${shots}/08-2.png` })
  })

  test('08.3 campanhas: galeria com visualização ampliada', async ({ page }) => {
    await page.goto('/')
    await skipOpening(page)
    await ready(page)
    await openCard(page, 3)
    await expect(detail(page).locator('.in-gallery > li')).toHaveCount(campaigns.gallery.length)
    const trigger = detail(page).getByRole('button', { name: /Ampliar: Peça de integração/ })
    await trigger.click()
    const viewer = page.getByRole('dialog', { name: 'Peça de integração ampliada' })
    await expect(viewer).toBeVisible()
    await expect(viewer).toContainText(campaigns.gallery[1].headline)
    await page.waitForTimeout(500)
    await page.screenshot({ path: `${shots}/08-3-ampliada.png` })
    await page.keyboard.press('Escape')
    await expect(viewer).toBeHidden()
    await expect(trigger).toBeFocused()
    await expect(detail(page)).toContainText('Não representam campanhas realizadas')
  })

  test('08.4 materiais: mockups e biblioteca sem links quebrados', async ({ page, request }) => {
    await page.goto('/')
    await skipOpening(page)
    await ready(page)
    await openCard(page, 4)
    for (const item of materials.mockups) {
      await detail(page).getByRole('radio', { name: item.label }).click()
      await expect(detail(page).locator(`.in-mock.is-${item.id === 'apresentacao' ? 'slide' : item.id === 'documento' ? 'doc' : 'report'}`)).toBeVisible()
    }
    const rows = detail(page).locator('.in-library li')
    await expect(rows).toHaveCount(materials.library.length)
    // Every format is a real, valid file of the expected type (magic bytes), same size as declared.
    const magic: Record<string, string> = { PPTX: '504b0304', DOCX: '504b0304', XLSX: '504b0304', PNG: '504b0304', PDF: '25504446' }
    const links = detail(page).locator('.in-library a')
    await expect(links).toHaveCount(materials.library.flatMap(item => item.files).length)
    for (const file of materials.library.flatMap(item => item.files)) {
      const link = detail(page).locator(`.in-library a[download="${file.name}"]`)
      const response = await request.get((await link.getAttribute('href'))!)
      expect(response.status(), file.name).toBe(200)
      const body = await response.body()
      expect(body.length, file.name).toBe(file.bytes)
      expect(body.subarray(0, 4).toString('hex'), file.name).toBe(magic[file.format])
    }
    await expect(detail(page).locator('.in-library .in-pending')).toHaveCount(0)
    const [download] = await Promise.all([page.waitForEvent('download'), links.first().click()])
    expect(download.suggestedFilename()).toBe(materials.library[0].files[0].name)
    await page.screenshot({ path: `${shots}/08-4.png` })
  })

  test('08.5 linguagem: comparador evitar × preferir com explicação', async ({ page }) => {
    await page.goto('/')
    await skipOpening(page)
    await ready(page)
    await openCard(page, 5)
    const quote = detail(page).locator('.in-message blockquote')
    await expect(quote).toContainText(language.examples[0].avoid)
    await expect(quote).toContainText('Evitar')
    await detail(page).getByRole('radio', { name: 'Preferir' }).click()
    await expect(quote).toContainText(language.examples[0].prefer)
    await expect(quote).toContainText(language.examples[0].why)
    await detail(page).getByRole('radio', { name: /Reconhecimento/ }).click()
    await expect(quote).toContainText(language.examples[2].avoid)
    // Keyboard inside the group.
    await detail(page).getByRole('radio', { name: 'Evitar' }).press('ArrowRight')
    await expect(quote).toContainText(language.examples[2].prefer)
    await page.waitForTimeout(500)
    await page.screenshot({ path: `${shots}/08-5.png` })
  })

  test('F5 dentro do capítulo recomeça pela introdução', async ({ page }) => {
    await page.goto('/#comunicacao-interna-2')
    await skipOpening(page)
    await page.reload()
    await expect.poll(() => page.evaluate(() => [scrollY, location.hash])).toEqual([0, ''])
  })
})

test('movimento reduzido: TV sem avanço automático e sem botão de pausa', async ({ page }) => {
  await page.goto('/')
  await skipOpening(page)
  await openCard(page, 1)
  await expect(page.locator('html')).not.toHaveClass(/motion-enabled/)
  await expect(detail(page).getByRole('button', { name: /sequência/ })).toBeHidden()
  await detail(page).locator('.in-screen').scrollIntoViewIfNeeded()
  await page.waitForTimeout(6000)
  await expect(detail(page).locator('.in-screen')).toContainText(tv.types[0].screen.title)
})

test.describe('Celular', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })

  test('faixa com swipe, painel adaptado e sem rolagem lateral', async ({ page }) => {
    const errors = errorsOf(page)
    await page.goto('/')
    await skipOpening(page)
    await page.locator('#comunicacao-interna .in-strip').evaluate(element => element.scrollIntoView({ block: 'start', behavior: 'instant' }))
    await page.waitForTimeout(700)
    await page.screenshot({ path: `${shots}/mobile-faixa.png` })
    // Swipe = native horizontal scroll of the strip.
    const rail = page.locator('#comunicacao-interna .in-rail')
    await rail.evaluate(element => element.scrollBy({ left: element.clientWidth, behavior: 'instant' }))
    await expect.poll(() => rail.evaluate(element => element.scrollLeft)).toBeGreaterThan(200)
    await card(page, 2).getByRole('button', { name: 'Ver detalhes' }).tap()
    await expect(detail(page).locator('#in-detail-title')).toHaveText('Comunicados Corporativos')
    await page.waitForTimeout(700)
    await page.screenshot({ path: `${shots}/mobile-detalhe.png` })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    expect(errors).toEqual([])
  })
})
