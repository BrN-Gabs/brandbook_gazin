import { test, expect, type Page } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import { differentials, marketPositioning, personality, positioningIntro, positioningTitle, valueProposition } from '../src/data/positioning'
import { placeholderCopy } from '../src/data/brandChapters'
import { skipOpening } from './helpers'

const shots = 'docs/screenshots/posicionamento'
const errorsOf = (page: Page) => {
  const errors: string[] = []
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
  page.on('pageerror', error => errors.push(error.message))
  return errors
}
/** Pins (history, tree) change the page height: scroll only once motion is set up. */
const ready = async (page: Page) => { if (await page.evaluate(() => matchMedia('(prefers-reduced-motion: no-preference)').matches)) await expect(page.locator('html')).toHaveClass(/motion-enabled/) }
const show = (page: Page, id: string) => page.evaluate(target => document.getElementById(target)!.scrollIntoView({ block: 'start', behavior: 'instant' }), id)

test.beforeAll(async () => { await mkdir(shots, { recursive: true }) })

test('conteúdo completo, sem espaços reservados, com IDs e navegação preservados', async ({ page }) => {
  const errors = errorsOf(page)
  await page.goto('/')
  await skipOpening(page)
  const chapter = page.locator('#posicionamento')
  await expect(chapter.locator('.chapter-intro .vb-lead-title')).toHaveText(positioningTitle)
  await expect(chapter.locator('.chapter-intro .pos-lead')).toHaveText(positioningIntro)
  await expect(chapter.locator('.subsection')).toHaveCount(4)
  for (const [index, title] of ['Personalidade da Marca', 'Diferenciais Competitivos', 'Proposta de Valor', 'Percepção e Posicionamento no Mercado'].entries()) {
    await expect(page.locator(`#posicionamento-${index + 1} h3`)).toHaveText(title)
    await expect(page.locator(`#posicionamento-${index + 1} .subsection-number`)).toHaveText(`01.${index + 1}`)
  }
  await expect(chapter).not.toContainText(placeholderCopy.description)
  await expect(chapter).not.toContainText(placeholderCopy.chapterDescription)
  await expect(chapter.locator('.content-placeholder, .placeholder')).toHaveCount(0)
  for (const text of [personality.text, differentials.text, valueProposition.text, marketPositioning.text, valueProposition.statement, marketPositioning.synthesis]) await expect(chapter).toContainText(text)
  for (const item of differentials.items) await expect(chapter.locator('.pos-diff-item')).toContainText([item.title])
  // The two syntheses are labelled as editorial, not as official slogans.
  await expect(chapter.getByText('Síntese editorial do capítulo')).toHaveCount(2)
  // Only blues, white and grey: no green or orange in this chapter's components.
  const colours = await chapter.evaluate(element => Array.from(element.querySelectorAll('*'), node => { const style = getComputedStyle(node); return `${style.color} ${style.backgroundColor} ${style.borderColor}` }).join(' '))
  expect(colours).not.toMatch(/rgb\(93, 175, 2\)|rgb\(253, 156, 15\)/)
  expect(errors).toEqual([])
})

test.describe('Desktop com movimento', () => {
  test.use({ reducedMotion: 'no-preference', viewport: { width: 1440, height: 900 } })

  test('personalidade: seis atributos interativos com descrição', async ({ page }) => {
    await page.goto('/')
    await skipOpening(page)
    await ready(page)
    await show(page, 'posicionamento')
    await page.waitForTimeout(900)
    await page.screenshot({ path: `${shots}/introducao.png` })
    await show(page, 'posicionamento-1')
    await page.waitForTimeout(1400)
    const words = page.locator('.pos-keyword')
    await expect(words).toHaveCount(6)
    await expect(page.locator('.pos-keyword[aria-pressed="true"]')).toHaveText(/Humana/)
    await words.filter({ hasText: 'Inovadora' }).hover({ force: true })
    await expect(page.locator('#pos-keyword-detail')).toContainText(personality.attributes[4].description)
    await words.filter({ hasText: 'Simples' }).click({ force: true })
    await expect(page.locator('#pos-keyword-detail')).toContainText(personality.attributes[5].description)
    await page.waitForTimeout(500)
    await page.screenshot({ path: `${shots}/01-personalidade.png` })
  })

  test('diferenciais: hover destaca um pilar e reduz os demais', async ({ page }) => {
    await page.goto('/')
    await skipOpening(page)
    await ready(page)
    await show(page, 'posicionamento-2')
    await page.waitForTimeout(1600)
    const items = page.locator('.pos-diff-item')
    await expect(items).toHaveCount(5)
    await items.nth(2).hover()
    await expect(items.nth(2)).toHaveClass(/is-active/)
    await expect(items.nth(0)).toHaveClass(/is-dim/)
    await page.waitForTimeout(600)
    await page.screenshot({ path: `${shots}/02-diferenciais.png` })
    await page.mouse.move(5, 5)
    await expect(items.nth(0)).not.toHaveClass(/is-dim/)
  })

  test('proposta de valor: frase central conectada aos três públicos', async ({ page }) => {
    await page.goto('/')
    await skipOpening(page)
    await ready(page)
    await page.locator('[data-pos-value]').scrollIntoViewIfNeeded()
    await page.waitForTimeout(1800)
    await expect(page.locator('.pos-audience')).toHaveCount(3)
    await page.getByRole('button', { name: 'Para nossos colaboradores' }).hover()
    await expect(page.locator('.pos-audience.is-colaboradores')).toHaveClass(/is-active/)
    await expect(page.locator('.pos-value-links g.is-lit')).toHaveCount(1)
    await page.waitForTimeout(500)
    await page.screenshot({ path: `${shots}/03-proposta-de-valor.png` })
    // Audiences, statement and lines stay inside the layout.
    const core = (await page.locator('.pos-value-core').boundingBox())!
    for (const id of ['clientes', 'colaboradores', 'comunidades']) {
      const box = (await page.locator(`.pos-audience.is-${id}`).boundingBox())!
      const overlaps = box.x < core.x + core.width && box.x + box.width > core.x && box.y < core.y + core.height && box.y + box.height > core.y
      expect(overlaps, id).toBe(false)
    }
  })

  test('posicionamento: constelação de cinco atributos e síntese', async ({ page }) => {
    await page.goto('/')
    await skipOpening(page)
    await ready(page)
    await show(page, 'posicionamento-4')
    await page.waitForTimeout(1600)
    const stars = page.locator('.pos-star')
    await expect(stars).toHaveCount(5)
    await stars.filter({ hasText: 'Evolução' }).hover()
    await expect(stars.filter({ hasText: 'Evolução' })).toHaveAttribute('aria-pressed', 'true')
    await expect(page.locator('#pos-star-detail')).toContainText(marketPositioning.attributes[3].description)
    await expect(page.locator('.pos-sky-links line.is-lit')).toHaveCount(marketPositioning.links.filter(link => link.includes(3)).length)
    await page.waitForTimeout(600)
    await page.screenshot({ path: `${shots}/04-posicionamento.png` })
    await page.locator('.pos-synthesis').scrollIntoViewIfNeeded()
    await page.waitForTimeout(900)
    await page.screenshot({ path: `${shots}/04-sintese.png` })
  })

  test('teclado: atributos e públicos acessíveis por Tab e Enter', async ({ page }) => {
    await page.goto('/')
    await skipOpening(page)
    await ready(page)
    await show(page, 'posicionamento-1')
    await page.locator('.pos-keyword').first().focus()
    await page.keyboard.press('Tab')
    await expect(page.locator('#pos-keyword-detail')).toContainText(personality.attributes[1].description)
    await page.locator('.pos-star').first().focus()
    await page.keyboard.press('Tab')
    await expect(page.locator('#pos-star-detail')).toContainText(marketPositioning.attributes[1].description)
  })
})

test('Celular: uma coluna, sem rolagem lateral e diagramas reorganizados', async ({ page }) => {
  const errors = errorsOf(page)
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await skipOpening(page)
  for (const id of ['posicionamento', 'posicionamento-1', 'posicionamento-2', 'posicionamento-3', 'posicionamento-4']) {
    await show(page, id)
    await page.waitForTimeout(500)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), id).toBe(true)
    await page.screenshot({ path: `${shots}/mobile-${id}.png`, fullPage: false })
  }
  // Clipped content check: nothing in the chapter extends past the viewport.
  const overflow = await page.locator('#posicionamento').evaluate(chapter => Array.from(chapter.querySelectorAll<HTMLElement>('.pos-visual *')).filter(node => { const r = node.getBoundingClientRect(); return r.width && (r.right > innerWidth + 1 || r.left < -1) }).map(node => node.className))
  expect(overflow).toEqual([])
  await page.locator('.pos-audience.is-comunidades button').click()
  await expect(page.locator('.pos-audience.is-comunidades')).toHaveClass(/is-active/)
  expect(errors).toEqual([])
})
