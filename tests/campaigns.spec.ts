import { test, expect, type Page } from '@playwright/test'
import { mkdir, readFile, stat } from 'node:fs/promises'
import { calendar, campaigns, campaignsIntro, creative, gazinLogo, hierarchy, institutional, logoOf, logosZip, promotional, standardization, supplierCampaign } from '../src/data/campaigns'
import campaignFiles from '../src/data/campaignFiles.json' with { type: 'json' }
import { skipOpening } from './helpers'

/** id → original file name, as imported by scripts/import-campaigns.mjs. */
const logoCatalog = Object.fromEntries(Object.entries(campaignFiles.logos).map(([id, logo]) => [id, logo.file]))
const shots = 'docs/screenshots/campanhas'
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
const library = (page: Page) => page.locator('.cp-library')

test.beforeAll(async () => { await mkdir(shots, { recursive: true }) })

test('dados: todas as logos da pasta associadas, sem campanhas inventadas', async () => {
  const withLogo = campaigns.filter(campaign => logoOf(campaign.id))
  expect(withLogo).toHaveLength(29)
  expect(Object.keys(logoCatalog).sort()).toEqual(withLogo.map(campaign => campaign.id).sort())
  expect(logoCatalog['61-anos']).toBe('Logo 61 anos.png')
  expect(campaigns.filter(campaign => !logoOf(campaign.id))).toEqual([])
  // Hoje é Dia D is supplier-only: kept out of the consumer list (library and downloads).
  expect(campaigns.some(campaign => campaign.id === supplierCampaign.id)).toBe(false)
  // Each published logo is byte-identical to the original in the Desktop folder.
  for (const [id, file] of Object.entries(logoCatalog)) {
    const published = await readFile(`public/${logoOf(id)!.path}`)
    expect(published.equals(await readFile(`C:/Users/bruno.silva/Desktop/Logos Campanhas/${file}`)), id).toBe(true)
  }
})

test.describe('Desktop com movimento', () => {
  test.use({ reducedMotion: 'no-preference', viewport: { width: 1440, height: 900 } })

  test('introdução, cinco subtópicos e demonstrações', async ({ page }) => {
    const errors = errorsOf(page)
    await page.goto('/')
    await skipOpening(page)
    await ready(page)
    const chapter = page.locator('#campanhas')
    await expect(chapter.locator('.vb-lead-title')).toHaveText(campaignsIntro.title)
    await expect(chapter.locator('.pos-lead')).toHaveText(campaignsIntro.text)
    await expect(chapter.locator('.content-placeholder')).toHaveCount(0)
    for (const [index, title] of ['Campanhas Institucionais', 'Campanhas Promocionais', 'Diretrizes Criativas', 'Hierarquia das Informações', 'Padronização Visual das Peças'].entries()) {
      await expect(page.locator(`#campanhas-${index + 1} h3`)).toHaveText(title)
    }
    for (const text of [institutional.text, promotional.text, creative.text, hierarchy.text, standardization.text]) await expect(chapter).toContainText(text)
    await show(page, '#campanhas')
    await page.screenshot({ path: `${shots}/introducao.png` })
    await show(page, '#campanhas-1')
    await page.screenshot({ path: `${shots}/05-1-2.png` })
    // Hoje é Dia D: own block, exclusive to suppliers, out of 05.2 and the library.
    const supplier = page.locator('.cp-supplier')
    await expect(supplier.locator('h3')).toHaveText(supplierCampaign.name)
    await expect(supplier).toContainText('Exclusiva para fornecedores')
    // Only the logo (cropped from the calendar art), not the whole page with its text box.
    await expect(supplier.locator('.cp-supplier-art')).toHaveAttribute('src', /hoje-e-dia-d-logo\.webp$/)
    await expect(page.locator('#campanhas-2')).not.toContainText(supplierCampaign.name)
    await expect(page.locator('.cp-library')).not.toContainText(supplierCampaign.name)
    await show(page, '.cp-supplier')
    await page.screenshot({ path: `${shots}/fornecedores.png` })
    // Every demo piece carries the official Gazin logo, below the campaign logo, overlapping
    // at most its lower edge (the campaign name stays visible), with the original proportions.
    const pieces = page.locator('#campanhas .cp-piece:not(.has-sem-gazin)')
    for (const piece of await pieces.all()) {
      const gazin = piece.locator('.cp-piece-gazin')
      await expect(gazin).toHaveAttribute('src', new RegExp(`${gazinLogo.src}$`))
      if (!await piece.isVisible()) continue
      const [campaignBox, gazinBox] = [await piece.locator('.cp-piece-logo').boundingBox(), await gazin.boundingBox()]
      expect(gazinBox!.y).toBeGreaterThan(campaignBox!.y + campaignBox!.height * .75)
      expect(Math.abs(gazinBox!.width / gazinBox!.height - gazinLogo.width / gazinLogo.height)).toBeLessThan(.05)
    }
    // 05.4: selecting a level explains it and highlights the region of the piece.
    await show(page, '#campanhas-3')
    await page.locator('#campanhas-4').getByRole('button', { name: /Informação comercial/ }).click()
    await expect(page.locator('#cp-level-detail')).toContainText(hierarchy.levels[3].text)
    await expect(page.locator('#campanhas-4 .cp-piece-price')).toHaveClass(/is-lit/)
    await page.screenshot({ path: `${shots}/05-3-4.png` })
    // 05.5: formats and correct / incorrect.
    await show(page, '#campanhas-5')
    await page.locator('#campanhas-5').getByRole('radio', { name: /Story/ }).click()
    await page.locator('#campanhas-5').getByRole('radio', { name: 'Cores alteradas' }).click()
    await expect(page.locator('#campanhas-5 .cp-compare .is-wrong figcaption')).toContainText(standardization.errors[1].text)
    await page.waitForTimeout(700)
    await page.screenshot({ path: `${shots}/05-5.png` })
    expect(errors).toEqual([])
  })

  test('biblioteca: pesquisa, filtros, visualizador e logos sem distorção', async ({ page }) => {
    const errors = errorsOf(page)
    await page.goto('/')
    await skipOpening(page)
    await ready(page)
    await show(page, '.cp-library')
    const grid = library(page).locator('.cp-grid > li')
    await expect(grid).toHaveCount(campaigns.length)
    await page.screenshot({ path: `${shots}/biblioteca.png` })
    // Logos keep their proportions (rendered ratio = original ratio).
    for (const item of await grid.locator('.cp-logo').all()) {
      await item.evaluate(image => image.scrollIntoView({ block: 'center', behavior: 'instant' }))
      await expect.poll(() => item.evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
      const [natural, rendered] = await item.evaluate(image => { const img = image as HTMLImageElement; const r = img.getBoundingClientRect(); return [img.naturalWidth / img.naturalHeight, r.width / r.height] })
      expect(Math.abs(natural - rendered)).toBeLessThan(.03)
    }
    // Search (accent-insensitive)
    await library(page).getByRole('searchbox').fill('verao')
    await expect(grid).toHaveCount(1)
    await expect(grid.first()).toContainText('Verão é na Gazin')
    await library(page).getByRole('searchbox').fill('')
    // Filters
    await library(page).getByRole('radio', { name: 'Recorrentes' }).click()
    await expect(grid).toHaveCount(campaigns.filter(campaign => campaign.kind === 'recorrente').length)
    await library(page).getByRole('radio', { name: 'Institucionais' }).click()
    await expect(grid).toHaveCount(1)
    await library(page).getByRole('radio', { name: 'Todas' }).click()
    await library(page).getByRole('combobox', { name: 'Mês' }).selectOption('8')
    await expect(grid).toHaveCount(4)
    await library(page).getByRole('combobox', { name: 'Mês' }).selectOption('')
    // Every campaign now has its file: "Sem arquivo" shows the empty state, which resets the filters.
    await library(page).getByRole('combobox', { name: 'Formato' }).selectOption('none')
    await expect(grid).toHaveCount(0)
    await library(page).getByRole('button', { name: 'Limpar filtros' }).click()
    await expect(grid).toHaveCount(campaigns.length)
    // Viewer opens, shows period and download, closes with Escape and returns focus.
    const card = grid.filter({ hasText: 'Black Friday Show' })
    await card.getByRole('button', { name: 'Visualizar' }).click()
    const viewer = page.getByRole('dialog', { name: 'Black Friday Show' })
    await expect(viewer).toBeVisible()
    // Centred on screen on both axes (after the short opening animation).
    // (equal free space left/right and top/bottom; the page keeps its scrollbar gutter reserved).
    await expect.poll(() => viewer.evaluate(element => {
      const style = getComputedStyle(element)
      const [top, right, bottom, left] = [style.marginTop, style.marginRight, style.marginBottom, style.marginLeft].map(parseFloat)
      return Math.max(Math.abs(left - right), Math.abs(top - bottom))
    })).toBeLessThan(1)
    await expect(viewer).toContainText('Novembro · De 01 a 30')
    await expect(viewer.getByRole('link', { name: /Baixar logo Black Friday Show/ })).toBeVisible()
    await page.waitForTimeout(500)
    await page.screenshot({ path: `${shots}/visualizador.png` })
    await page.keyboard.press('Escape')
    await expect(viewer).toBeHidden()
    await expect(card.getByRole('button', { name: 'Visualizar' })).toBeFocused()
    // 05.1 shows the official 61 anos logo with its download; details open the panel.
    await expect(page.locator('#campanhas-1').getByRole('link', { name: /Baixar logo 61 anos Gazin/ })).toHaveAttribute('download', 'Logo 61 anos.png')
    await page.locator('#campanhas-1').getByRole('button', { name: 'Ver detalhes', exact: true }).click()
    const anniversary = page.getByRole('dialog', { name: '61 anos Gazin' })
    await expect(anniversary.getByRole('link', { name: /Baixar logo 61 anos Gazin/ })).toBeVisible()
    await page.keyboard.press('Escape')
    expect(errors).toEqual([])
  })

  test('F5 dentro do capítulo recomeça pela introdução', async ({ page }) => {
    await page.goto('/#campanhas-2')
    await skipOpening(page)
    await page.reload()
    await expect.poll(() => page.evaluate(() => [scrollY, location.hash])).toEqual([0, ''])
  })
})

test('downloads: logos individuais, ZIP e calendário integral', async ({ page, request }) => {
  await page.goto('/')
  await skipOpening(page)
  // Every individual download link points to an existing original PNG.
  const links = page.locator('.cp-library a[download][type="image/png"]')
  await expect(links).toHaveCount(29)
  for (const link of await links.all()) {
    const response = await request.get((await link.getAttribute('href'))!)
    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toContain('image/png')
  }
  // ZIP: every logo, one folder per campaign.
  const zipLink = page.getByRole('link', { name: /Baixar todas as logos 2027/ })
  await expect(zipLink).toHaveAttribute('download', logosZip.fileName)
  const zip = await request.get((await zipLink.getAttribute('href'))!)
  expect(zip.status()).toBe(200)
  const zipBody = await zip.body()
  expect(zipBody.subarray(0, 2).toString()).toBe('PK')
  // Entry names (central directory) are UTF-8 with '/' separators: one folder per campaign.
  const names: string[] = []
  for (let i = zipBody.indexOf('PK\x01\x02', 0, 'latin1'); i >= 0; i = zipBody.indexOf('PK\x01\x02', i + 4, 'latin1')) {
    names.push(zipBody.subarray(i + 46, i + 46 + zipBody.readUInt16LE(i + 28)).toString('utf8'))
  }
  expect(names.sort()).toEqual(Object.entries(logoCatalog).map(([id, file]) => `${id}/${file}`).sort())
  // Calendar: complete original file, PDF, download + view.
  const download = page.getByRole('link', { name: /Baixar calendário 2027/ })
  const href = (await download.getAttribute('href'))!
  const pdf = await request.get(href)
  expect(pdf.headers()['content-type']).toContain('application/pdf')
  const body = await pdf.body()
  expect(body.length).toBe((await stat('C:/Users/bruno.silva/gazin.com.br/Ana Karoline Torres - BRUNO/TRABALHOS 2026/OUTUBRO/CALENDÁRIO 2027/CALENDÁRIO 2027 - V2.pdf')).size)
  expect(body.subarray(0, 5).toString()).toBe('%PDF-')
  await expect(download).toHaveAttribute('download', calendar.fileName)
  const view = page.getByRole('link', { name: /Visualizar calendário/ })
  await expect(view).toHaveAttribute('target', '_blank')
  await expect(view).toHaveAttribute('href', href)
  await download.scrollIntoViewIfNeeded()
  const file = page.waitForEvent('download')
  await download.click()
  expect((await file).suggestedFilename()).toBe(calendar.fileName)
})

test.describe('Celular', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })

  test('biblioteca em duas colunas, filtros e visualizador ao toque, sem rolagem lateral', async ({ page }) => {
    const errors = errorsOf(page)
    await page.goto('/')
    await skipOpening(page)
    for (const id of ['campanhas-1', 'campanhas-2', 'campanhas-5']) {
      await show(page, `#${id}`)
      await page.screenshot({ path: `${shots}/mobile-${id}.png` })
    }
    await show(page, '.cp-library')
    await page.screenshot({ path: `${shots}/mobile-biblioteca.png` })
    await library(page).getByRole('radio', { name: 'Recorrentes' }).tap()
    await library(page).locator('.cp-grid > li').first().getByRole('button', { name: 'Visualizar' }).tap()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.screenshot({ path: `${shots}/mobile-visualizador.png` })
    await page.getByRole('button', { name: 'Fechar detalhes da campanha' }).tap()
    await expect(page.getByRole('dialog')).toBeHidden()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    expect(errors).toEqual([])
  })
})
