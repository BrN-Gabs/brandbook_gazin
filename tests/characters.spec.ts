import { test, expect, type Page } from '@playwright/test'
import { mkdir, readFile } from 'node:fs/promises'
import { brandChapters } from '../src/data/brandChapters'
import { characterFiles, charactersIntro, gia, teo } from '../src/data/characters'
import { skipOpening } from './helpers'

const shots = 'docs/screenshots/personagens'
const section = (page: Page, n: number) => page.locator(`#personagens-${n}`)
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
/** Rendered ratio equals the file's ratio (no stretching). */
const sameRatio = (page: Page, selector: string) => page.locator(selector).first().evaluate(element => {
  const image = element as HTMLImageElement
  const box = image.getBoundingClientRect()
  return image.naturalWidth > 0 && Math.abs(image.naturalWidth / image.naturalHeight - box.width / box.height) < .03
})

test.beforeAll(async () => { await mkdir(shots, { recursive: true }) })

test('dados: capítulo após Nossas Marcas, numeração por posição e sem duplicatas', async () => {
  const ids = brandChapters.map(chapter => chapter.id)
  expect(ids.indexOf('personagens')).toBe(ids.indexOf('nossas-marcas') + 1)
  expect(ids.indexOf('nossas-marcas')).toBe(ids.indexOf('identidade-visual') + 1)
  expect(brandChapters.map(chapter => chapter.number)).toEqual(brandChapters.map((_, index) => String(index + 1).padStart(2, '0')))
  const chapter = brandChapters.find(item => item.id === 'personagens')!
  expect(chapter.subsections.map(item => item.title)).toEqual(['Conheça os Personagens', 'Téo: Atendimento e Relacionamento', 'GI.A: Inteligência Artificial Gazin', 'Diretrizes de Aplicação', 'Biblioteca de Personagens'])
  // The four GI.A functions are exactly the ones shown in the platform screenshot.
  expect(gia.features.map(item => item.label)).toEqual(['Pesquisar', 'Criar', 'Analisar', 'Aprender'])
  // Téo original published unchanged.
  const original = characterFiles.teo.find(file => file.id === 'teo-joinha')!
  expect((await readFile(`public/${original.path}`)).equals(await readFile('C:/Users/bruno.silva/Desktop/Personagens/TEO/TEO JOINHA FINAL 2026.png'))).toBe(true)
})

test.describe('Desktop', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('introdução, menu global e seletor Téo | GI.A', async ({ page }) => {
    const errors = errorsOf(page)
    await page.goto('/')
    await skipOpening(page)
    const root = page.locator('#personagens')
    await expect(root.locator('.vb-lead-title')).toHaveText(charactersIntro.title)
    await expect(root.locator('.pos-lead')).toHaveText(charactersIntro.text)
    await page.getByRole('button', { name: /Capítulos/ }).click()
    await page.getByRole('dialog', { name: 'Navegação do Manual da Marca' }).getByRole('link', { name: '04 Personagens da Marca' }).click()
    await expect(root).toBeInViewport()
    const s = section(page, 1)
    await s.evaluate(element => element.scrollIntoView({ behavior: 'instant' }))
    await expect(s.locator('.ch-meet-detail')).toContainText(teo.short)
    await s.getByRole('radio', { name: 'GI.A' }).click()
    await expect(s.locator('.ch-meet-detail')).toContainText(gia.short)
    await expect(s.locator('.ch-duo-gia')).toHaveAttribute('aria-pressed', 'true')
    expect(await sameRatio(page, '#personagens-1 .ch-teo-img')).toBe(true)
    await page.screenshot({ path: `${shots}/conheca.png` })
    expect(errors).toEqual([])
  })

  test('Téo: imagem oficial sem distorção e "Téo em ação" por contexto', async ({ page }) => {
    await open(page, 2)
    const s = section(page, 2)
    expect(await sameRatio(page, '#personagens-2 .ch-teo-stage .ch-teo-img')).toBe(true)
    // All official poses in the gallery; files published unchanged.
    await expect(s.getByRole('radiogroup', { name: 'Poses do Téo' }).getByRole('radio')).toHaveCount(characterFiles.teo.length)
    for (const file of characterFiles.teo) expect((await readFile(`public/${file.path}`)).length, file.id).toBe(file.bytes)
    for (const scene of teo.scenes) {
      await s.getByRole('radio', { name: scene.label }).click()
      await expect(s.locator('.ch-bubble')).toHaveText(scene.message)
      await expect(s.locator('.ch-scene-tip')).toContainText(scene.tip)
    }
    await expect(s).toContainText('não é um canal de atendimento')
    await page.screenshot({ path: `${shots}/teo.png` })
  })

  test('GI.A: funções da captura, ilustração identificada e link da plataforma', async ({ page }) => {
    await open(page, 3)
    const s = section(page, 3)
    await expect(s.getByRole('link', { name: /Acessar GI.A/ })).toHaveAttribute('href', gia.url)
    await expect(s.getByRole('link', { name: /Acessar GI.A/ })).toHaveAttribute('target', '_blank')
    for (const feature of gia.features) {
      await s.getByRole('radio', { name: new RegExp(feature.label) }).click()
      await expect(s.locator('.ch-feature-demo')).toContainText(`${feature.label} · ilustração`)
      await expect(s.locator('.ch-feature-demo')).toContainText(feature.demo)
    }
    await s.getByRole('radio', { name: /Aprender/ }).press('ArrowRight')
    await expect(s.getByRole('radio', { name: /Pesquisar/ })).toBeFocused()
    // The published capture has no user data (header/sidebar cropped out).
    expect(characterFiles.interface.width).toBeLessThan(1000)
    // GI.A as a character: official poses, chosen in the gallery.
    await s.getByRole('radiogroup', { name: 'Poses da GI.A' }).getByRole('radio', { name: 'Comemorando' }).click()
    await expect(s.locator('.ch-pose-stage figcaption')).toHaveText('Comemorando')
    expect(await sameRatio(page, '#personagens-3 .ch-pose-stage img')).toBe(true)
    await expect(s).not.toContainText('Bruno')
    await page.screenshot({ path: `${shots}/gia.png` })
  })

  test('diretrizes: comparador Téo | GI.A × correto | incorreto', async ({ page }) => {
    await open(page, 4)
    const s = section(page, 4)
    const stage = s.locator('.ch-compare-stage')
    await expect(stage).toHaveClass(/is-teo/)
    await s.getByRole('radio', { name: 'Incorreto' }).click()
    await expect(stage).toHaveClass(/is-wrong/)
    await expect(s.locator('.vi-wrong-stamp')).toBeVisible()
    await s.getByRole('radiogroup', { name: 'Personagem do comparador' }).getByRole('radio', { name: 'GI.A' }).click()
    await expect(stage).toHaveClass(/is-gia/)
    await expect(s.locator('.ch-verdict')).toContainText('Promessa de resultados garantidos')
    await page.screenshot({ path: `${shots}/diretrizes.png` })
  })

  test('biblioteca: arquivos reais, downloads individuais e ZIPs', async ({ page, request }) => {
    await open(page, 5)
    const s = section(page, 5)
    for (const who of ['teo', 'gia'] as const) {
      await s.getByRole('radio', { name: who === 'teo' ? 'Téo' : 'GI.A' }).click()
      const files = characterFiles[who]
      await expect(s.locator('.ch-assets')).not.toContainText('Interface')
      await expect(s.locator('.ch-asset')).toHaveCount(files.length)
      for (const file of files) {
        const body = await (await request.get((await s.locator(`a[download="${file.file}"]`).getAttribute('href'))!)).body()
        expect(body.length, file.file).toBe(file.bytes)
        expect(body.subarray(1, 4).toString(), file.file).toBe('PNG')
      }
      const zip = s.getByRole('link', { name: new RegExp(`Baixar materiais d${who === 'teo' ? 'o Téo' : 'a GI.A'}`) })
      const zipBody = await (await request.get((await zip.getAttribute('href'))!)).body()
      expect(zipBody.subarray(0, 2).toString()).toBe('PK')
      expect(zipBody.length).toBe(characterFiles.zips[who].bytes)
    }
    const [download] = await Promise.all([page.waitForEvent('download'), s.getByRole('link', { name: /Baixar materiais da GI.A/ }).click()])
    expect(download.suggestedFilename()).toBe('materiais-gia-gazin.zip')
    await page.screenshot({ path: `${shots}/biblioteca.png` })
  })

  test('F5 dentro do capítulo recomeça pela introdução', async ({ page }) => {
    await page.goto('/#personagens-3')
    await skipOpening(page)
    await page.reload()
    await expect.poll(() => page.evaluate(() => [scrollY, location.hash])).toEqual([0, ''])
  })
})

test.describe('Celular', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })

  test('vertical, personagens inteiros, toque e sem rolagem lateral', async ({ page }) => {
    const errors = errorsOf(page)
    await page.goto('/')
    await skipOpening(page)
    for (const n of [1, 2, 3, 5]) {
      await section(page, n).evaluate(element => element.scrollIntoView({ behavior: 'instant' }))
      await page.waitForTimeout(500)
      await page.screenshot({ path: `${shots}/mobile-${n}.png` })
    }
    await section(page, 2).getByRole('radio', { name: 'Varejo' }).tap()
    await expect(section(page, 2).locator('.ch-bubble')).toHaveText(teo.scenes[2].message)
    expect(await sameRatio(page, '#personagens-2 .ch-teo-stage .ch-teo-img')).toBe(true)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    expect(errors).toEqual([])
  })
})
