import { test, expect, type Page } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import { applications, keyMessages, language, signatures, verbalIntro, voice } from '../src/data/verbalIdentity'
import { placeholderCopy } from '../src/data/brandChapters'
import { skipOpening } from './helpers'

const shots = 'docs/screenshots/identidade-verbal'
const errorsOf = (page: Page) => {
  const errors: string[] = []
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
  page.on('pageerror', error => errors.push(error.message))
  return errors
}
/** Pins (history, tree) change the page height: scroll only once motion is set up. */
const ready = async (page: Page) => {
  if (await page.evaluate(() => matchMedia('(prefers-reduced-motion: no-preference)').matches)) await expect(page.locator('html')).toHaveClass(/motion-enabled/)
  if (await page.evaluate(() => matchMedia('(min-width: 1100px) and (hover: hover) and (pointer: fine)').matches)) await expect(page.locator('#historia')).toHaveAttribute('data-pin-start', /[0-9]+/)
}
const show = async (page: Page, selector: string) => {
  await page.locator(selector).first().evaluate(element => element.scrollIntoView({ block: 'start', behavior: 'instant' }))
  await page.waitForTimeout(1100)
}

test.beforeAll(async () => { await mkdir(shots, { recursive: true }) })

test('introdução e cinco subtópicos completos, sem espaços reservados, com IDs preservados', async ({ page }) => {
  const errors = errorsOf(page)
  await page.goto('/')
  await skipOpening(page)
  const chapter = page.locator('#identidade-verbal')
  await expect(chapter.locator('.vb-lead-title')).toHaveText(verbalIntro.title)
  await expect(chapter.locator('.chapter-intro .pos-lead')).toHaveText(verbalIntro.text)
  for (const [index, title] of ['Tom de Voz da Marca', 'Linguagem e Estilo de Comunicação', 'Slogans e Assinaturas', 'Expressões e Mensagens-chave', 'Exemplos de Aplicação'].entries()) {
    await expect(page.locator(`#identidade-verbal-${index + 1} h3`)).toHaveText(title)
    await expect(page.locator(`#identidade-verbal-${index + 1} .subsection-number`)).toHaveText(`05.${index + 1}`)
  }
  await expect(chapter.locator('.content-placeholder')).toHaveCount(0)
  await expect(chapter).not.toContainText(placeholderCopy.description)
  for (const text of [voice.text, language.text, signatures.text, keyMessages.text, applications.text]) await expect(chapter).toContainText(text)
  // Slogan identified as documented; the editorial title identified as such.
  await expect(chapter.locator('.vb-slogan')).toContainText(signatures.slogan.status)
  await expect(chapter.locator('.vb-slogan-quote')).toHaveText(new RegExp(signatures.slogan.text.replace(/[!?]/g, '\\$&')))
  await expect(chapter.locator('.vb-editorial-title')).toContainText(signatures.editorialTitle.status)
  // Official logo file (lazy): loads once the slogan is on screen.
  await chapter.locator('.vb-slogan-logo img').scrollIntoViewIfNeeded()
  await expect.poll(() => chapter.locator('.vb-slogan-logo img').evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
  // Menu navigation to a subtopic still works.
  await page.getByRole('button', { name: /Capítulos/ }).click()
  const dialog = page.getByRole('dialog', { name: 'Navegação do Manual da Marca' })
  // The current chapter opens already expanded in the menu: expand only when needed.
  const expander = dialog.getByRole('button', { name: /assuntos de Identidade Verbal/ })
  await expect(dialog).toBeVisible()
  await page.waitForTimeout(500)
  if (await expander.getAttribute('aria-expanded') !== 'true') await expander.click()
  await dialog.getByRole('link', { name: '05.4 Expressões e Mensagens-chave' }).click()
  await expect(page.locator('#identidade-verbal-4')).toBeInViewport()
  expect(errors).toEqual([])
})

test.describe('Desktop com movimento', () => {
  test.use({ reducedMotion: 'no-preference', viewport: { width: 1440, height: 900 } })

  test('tom de voz: atributos selecionáveis com descrição, prática e exemplo', async ({ page }) => {
    const errors = errorsOf(page)
    await page.goto('/')
    await skipOpening(page)
    await ready(page)
    await show(page, '#identidade-verbal')
    await page.screenshot({ path: `${shots}/introducao.png` })
    await show(page, '#identidade-verbal-1')
    const words = page.locator('.vb-voice-word')
    await expect(words).toHaveCount(5)
    await words.filter({ hasText: 'Claro' }).click()
    await expect(words.filter({ hasText: 'Claro' })).toHaveAttribute('aria-pressed', 'true')
    const detail = page.locator('#vb-voice-detail')
    await expect(detail).toContainText(voice.attributes[2].description)
    await expect(detail).toContainText(voice.attributes[2].practice)
    await expect(detail).toContainText(voice.attributes[2].example)
    await words.filter({ hasText: 'Humano' }).hover()
    await expect(detail).toContainText(voice.attributes[1].description)
    await page.waitForTimeout(500)
    await page.screenshot({ path: `${shots}/03-1-tom-de-voz.png` })
    expect(errors).toEqual([])
  })

  test('linguagem: listas e comparador EVITAR | PREFERIR, também pelo teclado', async ({ page }) => {
    await page.goto('/')
    await skipOpening(page)
    await ready(page)
    await show(page, '#identidade-verbal-2 .vb-language')
    await expect(page.locator('.vb-rule.is-prefer li')).toHaveCount(language.prefer.length)
    await expect(page.locator('.vb-rule.is-avoid li')).toHaveCount(language.avoid.length)
    const card = page.locator('.vb-compare-card')
    await expect(card).toContainText(language.examples[0].avoid)
    await expect(card).toContainText('Evitar')
    await page.getByRole('radio', { name: /Preferir/ }).click()
    await expect(card).toContainText(language.examples[0].prefer)
    await expect(card).toContainText('Preferir')
    await page.locator('#identidade-verbal').getByRole('radio', { name: /Atendimento/ }).click()
    await expect(card).toContainText(language.examples[1].prefer)
    // Keyboard: arrows move between situations.
    await page.locator('#identidade-verbal').getByRole('radio', { name: /Atendimento/ }).focus()
    await page.keyboard.press('ArrowRight')
    await expect(card).toContainText(language.examples[2].prefer)
    await page.waitForTimeout(500)
    await page.screenshot({ path: `${shots}/03-2-linguagem.png` })
  })

  test('slogans, mensagens-chave e exemplos de aplicação', async ({ page }) => {
    const errors = errorsOf(page)
    await page.goto('/')
    await skipOpening(page)
    await ready(page)
    await show(page, '#identidade-verbal-3 .vb-signatures')
    await page.screenshot({ path: `${shots}/03-3-slogans.png` })

    await show(page, '#identidade-verbal-4 .vb-messages')
    const words = page.locator('.vb-message-word')
    await expect(words).toHaveCount(6)
    await words.filter({ hasText: 'Simplicidade' }).click()
    const detail = page.locator('#vb-message-detail')
    await expect(detail).toContainText(keyMessages.messages[3].axis)
    await expect(detail).toContainText(keyMessages.messages[3].phrase)
    await expect(detail).toContainText('não é slogan oficial')
    await page.getByRole('button', { name: 'Próximo conceito' }).click()
    await expect(detail).toContainText(keyMessages.messages[4].phrase)
    await page.waitForTimeout(500)
    await page.screenshot({ path: `${shots}/03-4-mensagens.png` })

    await show(page, '#identidade-verbal-5 .vb-apps')
    const apps = page.locator('.vb-apps')
    const tabs = apps.getByRole('tab')
    await expect(tabs).toHaveCount(applications.examples.length)
    for (const [index, example] of applications.examples.entries()) {
      await tabs.nth(index).click()
      const panel = apps.getByRole('tabpanel')
      await expect(panel).toContainText(example.context)
      await expect(panel).toContainText(example.message)
      await expect(panel).toContainText(example.guideline)
      await expect(panel).toContainText('Demonstração editorial')
      await page.waitForTimeout(450)
      await page.screenshot({ path: `${shots}/03-5-${example.id}.png` })
    }
    await tabs.nth(0).focus()
    await page.keyboard.press('ArrowLeft')
    await expect(tabs.last()).toHaveAttribute('aria-selected', 'true')
    expect(errors).toEqual([])
  })

  test('F5 dentro do capítulo recomeça pela introdução', async ({ page }) => {
    await page.goto('/#identidade-verbal-2')
    await skipOpening(page)
    await page.reload()
    await expect.poll(() => page.evaluate(() => [scrollY, location.hash])).toEqual([0, ''])
  })
})

test('Celular: coluna única, sem rolagem lateral, comparador e exemplos ao toque', async ({ page }) => {
  const errors = errorsOf(page)
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await skipOpening(page)
  for (const id of ['identidade-verbal', 'identidade-verbal-1', 'identidade-verbal-2', 'identidade-verbal-3', 'identidade-verbal-4', 'identidade-verbal-5']) {
    await show(page, `#${id}`)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), id).toBe(true)
    await page.screenshot({ path: `${shots}/mobile-${id}.png` })
  }
  const overflow = await page.locator('#identidade-verbal').evaluate(chapter => Array.from(chapter.querySelectorAll<HTMLElement>('.vb-visual *')).filter(node => {
    if (node.closest('.vb-apps-tabs')) return false // scrollable tab strip
    const r = node.getBoundingClientRect(); return r.width && (r.right > innerWidth + 1 || r.left < -1)
  }).map(node => node.className))
  expect(overflow).toEqual([])
  await page.getByRole('radio', { name: /Preferir/ }).click()
  await expect(page.locator('.vb-compare-card')).toContainText(language.examples[0].prefer)
  await page.locator('.vb-apps').getByRole('tab', { name: /E-commerce/ }).click()
  await expect(page.locator('.vb-apps').getByRole('tabpanel')).toContainText(applications.examples[4].message)
  expect(errors).toEqual([])
})
