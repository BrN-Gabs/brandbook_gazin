import { test, expect, type Page } from '@playwright/test'
import { mkdir, readFile } from 'node:fs/promises'
import { brandChapters } from '../src/data/brandChapters'
import { institute, sponsorshipsIntro, sports, tradeFairs, vex } from '../src/data/sponsorships'
import { skipOpening } from './helpers'

const shots = 'docs/screenshots/patrocinios-eventos'
const chapter = brandChapters.find(item => item.id === 'patrocinios-eventos')!
const section = (page: Page, n: number) => page.locator(`#patrocinios-eventos-${n}`)
const errorsOf = (page: Page) => {
  const errors: string[] = []
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
  page.on('pageerror', error => errors.push(error.message))
  return errors
}
const open = async (page: Page, n: number) => {
  await page.goto('/')
  await skipOpening(page)
  await section(page, n).evaluate(element => element.scrollIntoView({ behavior: 'instant' }))
  await page.waitForTimeout(500)
}

test.beforeAll(async () => { await mkdir(shots, { recursive: true }) })

test('dados: quatro subtópicos, 13 feiras da planilha, sem mistura 2026 × 2027', async () => {
  expect(chapter.subsections.map(item => `${item.number} ${item.title}`)).toEqual(['11.1 Patrocínios Institucionais', '11.2 Patrocínios Esportivos', '11.3 Materiais e Comunicação de Eventos', '11.4 Participação em Feiras'])
  const { fairs } = tradeFairs
  expect(fairs).toHaveLength(13)
  expect(fairs.every(item => item.year === 2027 && item.start.startsWith('2027-') && item.end >= item.start)).toBe(true)
  expect(fairs.map(item => item.start)).toEqual([...fairs.map(item => item.start)].sort())
  // Exactly the records of the spreadsheet (original text preserved).
  expect(fairs.find(item => item.id === 'femur')!.original).toEqual({ name: 'FEMUR', city: 'UBÁ - MG', uf: 'MG', period: '25 JAN a 28 JAN' })
  expect(fairs.find(item => item.id === 'vex-2027')).toMatchObject({ start: '2027-08-18', end: '2027-08-20', city: 'Foz do Iguaçu', uf: 'PR' })
  const movinter = fairs.find(item => item.id === 'movinter')!
  expect(movinter.confirmation).toBe('a-conferir')
  expect(movinter.warning).toMatch(/a conferir/i)
  // Fields for official material stay empty (no fictitious data).
  expect(fairs.some(item => item.booth || item.pavilion || item.address || item.photo || item.logo)).toBe(false)
  // 2026 (held) and 2027 (planned) are kept apart.
  expect(vex.editions.current.text).toContain('2026')
  expect(vex.editions.next.text).toContain('2027')
  expect(vex.editions.next.source).toMatch(/confirmar/)
  // No sponsorship stated as confirmed for 2027.
  for (const club of sports.clubs) expect(club.seasons.find(season => season.year === 2027)?.status).toBe('a-confirmar')
})

test.describe('Desktop', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('introdução e índice com os quatro subtópicos (sem os antigos)', async ({ page }) => {
    const errors = errorsOf(page)
    await page.goto('/')
    await skipOpening(page)
    const root = page.locator('#patrocinios-eventos')
    await expect(root.locator('.vb-lead-title')).toHaveText(sponsorshipsIntro.title)
    await expect(root.locator('.pos-lead')).toHaveText(sponsorshipsIntro.text)
    await expect(root.locator('.chapter-nav a')).toHaveCount(4)
    for (const old of ['Parcerias Estratégicas', 'Co-branding', 'Aplicação da Marca em Eventos']) await expect(root).not.toContainText(old)
    await root.locator('.chapter-nav a[href="#patrocinios-eventos-4"]').click()
    await expect(section(page, 4)).toBeInViewport()
    await root.locator('.chapter-top').scrollIntoViewIfNeeded()
    await page.screenshot({ path: `${shots}/introducao.png` })
    expect(errors).toEqual([])
  })

  test('09.1 Instituto: logo, frase, projetos selecionáveis e links oficiais', async ({ page, request }) => {
    await open(page, 1)
    const s = section(page, 1)
    await expect(s).toContainText(institute.quote)
    await expect(s.getByRole('link', { name: /Conhecer o Instituto/ })).toHaveAttribute('href', institute.url)
    expect((await request.get((await s.locator('.sp-institute-logo img').getAttribute('src'))!)).status()).toBe(200)
    await s.getByRole('radio', { name: /Cine Gazin/ }).click()
    await expect(s.locator('.sp-project-detail h5')).toHaveText('Cine Gazin')
    await expect(s.locator('.sp-project-detail').getByRole('link', { name: /Página oficial/ })).toHaveAttribute('href', /institutomariogazin\.com\.br\/projetos\/cine-gazin/)
    await s.getByRole('radio', { name: /Pintando 7/ }).press('ArrowRight')
    await expect(s.locator('.sp-project-detail h5')).toHaveText('Cine Gazin')
    await s.getByRole('radio', { name: /Pintando 7/ }).click()
    await s.locator('.sp-project-visual button').click()
    await expect(page.getByRole('dialog', { name: 'Pintando 7 com a APAE' })).toBeVisible()
    await page.keyboard.press('Escape')
    for (const project of institute.projects) expect(project.url.startsWith('https://institutomariogazin.com.br/projetos/')).toBe(true)
    await s.scrollIntoViewIfNeeded()
    await page.screenshot({ path: `${shots}/09-1.png`, fullPage: false })
  })

  test('09.2 clubes: seletor dos três clubes, status por temporada, sem escudos alterados', async ({ page }) => {
    await open(page, 2)
    const s = section(page, 2)
    for (const club of sports.clubs) {
      await s.getByRole('radio', { name: club.short }).click()
      await expect(s.locator('.sp-club h4')).toHaveText(club.name)
      await expect(s.locator('.sp-seasons li')).toHaveCount(club.seasons.length)
      await expect(s.locator('.sp-seasons')).toContainText('2027')
      await expect(s.locator('.sp-seasons')).toContainText('A confirmar')
      await expect(s.getByRole('link', { name: /Site oficial do clube/ })).toHaveAttribute('href', club.site)
    }
    // Official crest and team photo supplied by the marketing team, crest with its original proportion.
    const crest = s.locator('.sp-crest img')
    await expect(crest).toHaveAttribute('alt', 'Escudo do Paysandu Sport Club')
    await expect.poll(() => crest.evaluate(i => { const im = i as HTMLImageElement; const r = im.getBoundingClientRect(); return im.naturalWidth > 0 && Math.abs(im.naturalWidth / im.naturalHeight - r.width / r.height) < .03 || getComputedStyle(im).objectFit === 'contain' })).toBe(true)
    await expect(s.locator('.sp-club-photo img')).toBeVisible()
    await page.screenshot({ path: `${shots}/09-2.png` })
  })

  test('09.3 VEX: capa preservada, galeria com as fotos oficiais, link e ampliação', async ({ page, request }) => {
    const errors = errorsOf(page)
    await open(page, 3)
    const s = section(page, 3)
    await expect(s.getByRole('link', { name: /Conhecer o VEX/ })).toHaveAttribute('href', vex.url)
    await expect(s.locator('.sp-vex-hero img')).toHaveAttribute('src', /vex-identidade\.jpg$/)
    // No tabs any more: only the official photos of the event.
    await expect(s.getByRole('radio')).toHaveCount(0)
    const items = s.locator('.sp-vex-gallery > li')
    await expect(items).toHaveCount(vex.photos.length)
    for (const img of await items.locator('img').all()) expect((await request.get((await img.getAttribute('src'))!)).status()).toBe(200)
    await s.getByRole('button', { name: 'Ampliar: Plenária principal' }).click()
    const dialog = page.getByRole('dialog', { name: 'Plenária principal' })
    await expect(dialog).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(s.getByRole('button', { name: 'Ampliar: Plenária principal' })).toBeFocused()
    await expect(s.locator('.sp-editions')).toContainText('18 a 20 de agosto de 2027')
    await expect(s.locator('.sp-editions')).toContainText('a confirmar com a organização')
    await s.locator('.sp-vex-hero').scrollIntoViewIfNeeded()
    await page.screenshot({ path: `${shots}/09-3.png` })
    expect(errors).toEqual([])
  })

  test('09.4 feiras: linha do tempo, filtros, lista, alerta MOVINTER e download original', async ({ page, request }) => {
    await open(page, 4)
    const s = section(page, 4)
    const cards = s.locator('.sp-fair-list > li')
    // Timeline: January → FEMUR; March → 2 fairs, in date order.
    await expect(cards).toHaveCount(1)
    await expect(cards.first()).toContainText('FEMUR')
    await s.getByRole('button', { name: /^Março/ }).click()
    await expect(cards).toHaveCount(2)
    await expect(cards.first()).toContainText('EXPOMÓVEL SÃO LUÍS')
    await expect(s.getByRole('button', { name: /^Julho/ })).toBeDisabled()
    // List of all fairs + filters.
    await s.getByRole('radio', { name: /Lista de feiras/ }).click()
    await expect(cards).toHaveCount(13)
    await s.getByRole('combobox', { name: 'Estado' }).selectOption('GO')
    await expect(cards).toHaveCount(2)
    await s.getByRole('combobox', { name: 'Estado' }).selectOption('')
    await s.getByRole('searchbox').fill('expomovel')
    await expect(cards).toHaveCount(4)
    await s.getByRole('searchbox').fill('')
    await s.getByRole('combobox', { name: 'Cidade' }).selectOption('São Paulo')
    await expect(cards).toHaveCount(2)
    await s.getByRole('combobox', { name: 'Cidade' }).selectOption('')
    await s.getByRole('combobox', { name: 'Mês' }).selectOption('6')
    await expect(cards).toHaveCount(1)
    await expect(cards.first()).toContainText('MOVINTER')
    await expect(cards.first().locator('.sp-fair-warning')).toContainText('a conferir')
    // Download = the original spreadsheet, byte for byte.
    const link = s.getByRole('link', { name: /Baixar calendário de feiras/ })
    await expect(link).toHaveAttribute('download', tradeFairs.download.fileName)
    const body = await (await request.get((await link.getAttribute('href'))!)).body()
    expect(body.equals(await readFile('C:/Users/bruno.silva/Downloads/FEIRAS 2027 - OFICIAL (1).xlsx'))).toBe(true)
    const [download] = await Promise.all([page.waitForEvent('download'), link.click()])
    expect(download.suggestedFilename()).toBe(tradeFairs.download.fileName)
    await s.locator('.sp-fair-filters').scrollIntoViewIfNeeded()
    await page.screenshot({ path: `${shots}/09-4.png` })
  })

  test('F5 dentro do capítulo recomeça pela introdução', async ({ page }) => {
    await page.goto('/#patrocinios-eventos-3')
    await skipOpening(page)
    await page.reload()
    await expect.poll(() => page.evaluate(() => [scrollY, location.hash])).toEqual([0, ''])
  })
})

test.describe('Celular', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })

  test('coluna única, toque nos seletores e sem rolagem lateral', async ({ page }) => {
    const errors = errorsOf(page)
    await page.goto('/')
    await skipOpening(page)
    await expect(page.locator('.sp-booth-gallery > li')).toHaveCount(3)
    for (const n of [1, 2, 3, 4]) {
      await section(page, n).evaluate(element => element.scrollIntoView({ behavior: 'instant' }))
      await page.waitForTimeout(500)
      await page.screenshot({ path: `${shots}/mobile-09-${n}.png` })
    }
    await section(page, 2).getByRole('radio', { name: 'Remo' }).tap()
    await expect(section(page, 2).locator('.sp-club h4')).toHaveText('Clube do Remo')
    await section(page, 4).getByRole('button', { name: /^Agosto/ }).tap()
    await expect(section(page, 4).locator('.sp-fair-list > li')).toHaveCount(2)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    expect(errors).toEqual([])
  })
})
