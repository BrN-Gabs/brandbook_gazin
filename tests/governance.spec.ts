import { test, expect, type Page } from '@playwright/test'
import { mkdir, stat } from 'node:fs/promises'
import { documents, governanceIntro, maintenance, misuse, responsibilities, usage, workflow } from '../src/data/governance'
import { skipOpening } from './helpers'

const shots = 'docs/screenshots/governanca'
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
const details = (page: Page) => page.locator('#gv-details')
const open = async (page: Page, index: number) => {
  await page.locator(`#governanca-${index} .gv-card-open`).click()
  await expect(page.locator(`#governanca-${index}`)).toHaveClass(/is-active/)
  await page.waitForTimeout(800)
}

test.beforeAll(async () => { await mkdir(shots, { recursive: true }) })

test.describe('Desktop com movimento', () => {
  test.use({ reducedMotion: 'no-preference', viewport: { width: 1440, height: 900 } })

  test('introdução, destaque, cinco cards na linha e conteúdo de cada um', async ({ page }) => {
    const errors = errorsOf(page)
    await page.goto('/')
    await skipOpening(page)
    await ready(page)
    const chapter = page.locator('#governanca')
    await expect(chapter.locator('.pos-lead')).toHaveText(governanceIntro.text)
    await expect(chapter.locator('.gv-highlight')).toContainText(governanceIntro.highlight)
    await expect(chapter.locator('.gv-highlight')).toContainText('Síntese editorial')
    await expect(chapter.locator('.content-placeholder')).toHaveCount(0)
    for (const [index, title] of ['Responsabilidades e Gestão da Marca', 'Fluxos de Aprovação', 'Diretrizes de Utilização', 'Usos Incorretos e Restrições', 'Atualizações e Manutenção do Manual da Marca'].entries()) {
      await expect(page.locator(`#governanca-${index + 1} h3`)).toHaveText(title)
    }
    await chapter.locator('.gv-line').evaluate(element => element.scrollIntoView({ block: 'center', behavior: 'instant' }))
    await page.waitForTimeout(900)
    await page.screenshot({ path: `${shots}/linha.png` })
    for (const [index, data] of [responsibilities, workflow, usage, misuse, maintenance].entries()) {
      await open(page, index + 1)
      await expect(details(page)).toContainText(data.text)
      await details(page).evaluate(element => element.scrollIntoView({ block: 'start', behavior: 'instant' }))
      await page.waitForTimeout(600)
      await page.screenshot({ path: `${shots}/11-${index + 1}.png` })
    }
    expect(errors).toEqual([])
  })

  test('interações: responsabilidades, fluxo com ramificação, links, comparador e histórico vazio', async ({ page }) => {
    const errors = errorsOf(page)
    await page.goto('/')
    await skipOpening(page)
    await ready(page)
    await page.locator('#governanca').scrollIntoViewIfNeeded()
    // 10.1
    await open(page, 1)
    await details(page).getByRole('radio', { name: /Trade Marketing/ }).click()
    await expect(details(page).locator('.gv-roles-detail')).toContainText(responsibilities.roles[1].duties[0])
    await expect(details(page).locator('.gv-hub-lines line.is-lit')).toHaveCount(1)
    await expect(details(page)).toContainText('Modelo de referência')
    // 10.2
    await open(page, 2)
    await details(page).getByRole('button', { name: /Próxima etapa/ }).click()
    await expect(details(page).locator('.gv-flow-body')).toContainText(workflow.steps[1].text)
    await details(page).getByRole('button', { name: /Validação/ }).click()
    await expect(details(page).locator('.gv-decision')).toContainText(workflow.decision.no)
    await details(page).getByRole('button', { name: /Etapa anterior/ }).click()
    await expect(details(page).locator('.gv-flow-body')).toContainText(workflow.steps[2].text)
    await details(page).getByRole('button', { name: /Validação/ }).focus()
    await page.keyboard.press('ArrowRight')
    await expect(details(page).locator('.gv-flow-body')).toContainText(workflow.steps[4].text)
    // 10.3: contextual links lead to the chapters.
    await open(page, 3)
    for (const href of ['#identidade-visual', '#identidade-verbal', '#comunicacao-digital', '#comunicacao-fisica']) await expect(details(page).locator(`a[href="${href}"]`)).toHaveCount(1)
    // 10.4: the correct art is the official file, the wrong one is marked.
    await open(page, 4)
    for (const entry of misuse.comparisons) {
      await details(page).getByRole('radio', { name: entry.label }).click()
      await expect(details(page).locator('.vi-compare-item.is-right figcaption')).toContainText('Correto')
      await expect(details(page).locator('.vi-wrong-stamp')).toHaveText('Não utilizar')
    }
    await page.waitForTimeout(1100)
    await page.screenshot({ path: `${shots}/11-4-comparador.png` })
    // 10.5: no fictitious records.
    await open(page, 5)
    await expect(details(page).locator('.gv-empty')).toContainText(maintenance.emptyHistory)
    await expect(details(page).locator('.gv-records tbody tr')).toHaveCount(maintenance.records.length)
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
    const expander = dialog.getByRole('button', { name: /assuntos de Governança da Marca/ })
    if (await expander.getAttribute('aria-expanded') !== 'true') await expander.click()
    await dialog.getByRole('link', { name: '12.2 Fluxos de Aprovação' }).click()
    await expect(page.locator('#governanca-2')).toHaveClass(/is-active/)
    await expect(details(page)).toContainText(workflow.text)
    await page.reload()
    await expect.poll(() => page.evaluate(() => [scrollY, location.hash])).toEqual([0, ''])
  })
})

test('documentos: arquivos reais, PDF, download funcional', async ({ page, request }) => {
  await page.goto('/')
  await skipOpening(page)
  const library = page.locator('.gv-docs')
  await expect(library.locator('li')).toHaveCount(documents.items.length)
  for (const doc of documents.items) {
    const link = library.getByRole('link', { name: `Baixar ${doc.name} (PDF)` })
    await expect(link).toHaveAttribute('download', doc.fileName)
    const response = await request.get((await link.getAttribute('href'))!)
    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toContain('application/pdf')
    const body = await response.body()
    expect(body.length).toBe((await stat(`public/${doc.href}`)).size)
    expect(body.subarray(0, 5).toString()).toBe('%PDF-')
  }
  // The merchandising manual is the same file as chapter 07 (no duplicate).
  expect(documents.items[1].href).toBe('assets/merchandising/manual-merchandising-gazin.pdf')
  const link = library.getByRole('link', { name: /Baixar Manual da logomarca/ })
  await link.scrollIntoViewIfNeeded()
  const download = page.waitForEvent('download')
  await link.click()
  expect((await download).suggestedFilename()).toBe('Manual-da-Logomarca-Gazin.pdf')
})

test.describe('Celular', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })

  test('sequência vertical, fluxo e comparador ao toque, sem rolagem lateral', async ({ page }) => {
    const errors = errorsOf(page)
    await page.goto('/')
    await skipOpening(page)
    await page.locator('#governanca .gv-line').evaluate(element => element.scrollIntoView({ block: 'start', behavior: 'instant' }))
    await page.waitForTimeout(600)
    await page.screenshot({ path: `${shots}/mobile-linha.png` })
    await page.locator('#governanca-2 .gv-card-open').tap()
    await page.waitForTimeout(900)
    await details(page).getByRole('button', { name: /Próxima etapa/ }).tap()
    await expect(details(page).locator('.gv-flow-body')).toContainText(workflow.steps[1].text)
    await page.screenshot({ path: `${shots}/mobile-fluxo.png` })
    await page.locator('#governanca-4 .gv-card-open').tap()
    await page.waitForTimeout(900)
    await details(page).getByRole('radio', { name: 'Cores' }).tap()
    await expect(details(page).locator('.vi-compare-item.is-wrong figcaption')).toContainText('Incorreto')
    await page.screenshot({ path: `${shots}/mobile-comparador.png` })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    // Nothing is clipped at the right edge, in any card or the documents area.
    for (const index of [1, 2, 3, 4, 5]) {
      await page.locator(`#governanca-${index} .gv-card-open`).tap()
      await page.waitForTimeout(500)
      const overflow = await page.locator('#governanca').evaluate(chapter => Array.from(chapter.querySelectorAll<HTMLElement>('#gv-details *, .gv-docs *')).filter(node => {
        if (node.closest('.gv-table-wrap')) return false // scrollable table
        const r = node.getBoundingClientRect(); return r.width && r.right > innerWidth + 1
      }).map(node => `${node.tagName}.${node.className}`))
      expect(overflow, `11.${index}`).toEqual([])
    }
    expect(errors).toEqual([])
  })
})
