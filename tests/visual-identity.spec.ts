import { test, expect, type Page } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import { brandChapters } from '../src/data/brandChapters'
import { digitalBlue, logoArchive, logoAsset, logoFile, misuses, variants } from '../src/data/visualIdentity'
import { readFileSync } from 'node:fs'
import { architecture, otherBrands } from '../src/data/brandArchitecture'

const groupLogos: { slug: string; name: string; bytes: number }[] = JSON.parse(readFileSync(new URL('../src/data/groupLogos.json', import.meta.url), 'utf8'))
import { skipOpening } from './helpers'

const chapter = brandChapters.find(item => item.id === 'identidade-visual')!
const section = (page: Page, index: number) => page.locator(`#${chapter.subsections[index].id}`)
const goTo = async (page: Page, index: number) => {
  // On desktop the Nossa História pin (wheel-driven, with or without motion) changes the page
  // height when it is created: jump only once it exists.
  if (await page.evaluate(() => matchMedia('(min-width: 1100px) and (hover: hover) and (pointer: fine)').matches)) await expect(page.locator('#historia')).toHaveAttribute('data-pin-start', /[0-9]+/)
  await page.evaluate(id => document.getElementById(id)!.scrollIntoView({ block: 'start', behavior: 'instant' }), chapter.subsections[index].id)
  await page.waitForTimeout(300)
}

function collectErrors(page: Page) {
  const errors: string[] = []
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
  page.on('pageerror', error => errors.push(error.message))
  return errors
}

test.describe('Identidade Visual', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('nove subtópicos, com conteúdo do manual e integração ao índice global', async ({ page }) => {
    const errors = collectErrors(page)
    await page.goto('/')
    await skipOpening(page)
    expect(chapter.subsections.map(item => item.title)).toEqual([
      'A Logomarca', 'Cores Institucionais', 'Tipografia', 'Versões e Aplicações',
      'Área de Segurança', 'Reduções e Legibilidade', 'Usos Incorretos', 'Elementos Gráficos', 'Iconografia', 'Arquitetura de Marcas do Grupo Gazin',
    ])
    for (const [index, subsection] of chapter.subsections.entries()) {
      await expect(section(page, index).getByRole('heading', { level: 3, name: subsection.title })).toBeVisible()
      await expect(page.locator(`.vi-subnav a[href="#${subsection.id}"]`)).toContainText(subsection.number)
    }
    // Facts from the manual.
    const body = page.locator('#identidade-visual')
    for (const text of ['Blue 072 C', 'C100 M100 Y0 K0', digitalBlue.hex, 'Process Black C', 'Renfrew', 'Gotham Bold', 'Sempre fazendo o melhor pra Você!', 'largura da letra “i”'])
      await expect(body).toContainText(text)
    await expect(section(page, 5).locator('.vi-size-value').first()).toHaveText(/3×1cm/)
    await expect(section(page, 5).locator('.vi-size-value').nth(1)).toHaveText(/6×2cm/)
    // The interface blue is never presented as the manual blue.
    // Print blue and digital blue are presented side by side; no year and no provenance noise.
    await expect(section(page, 1).locator('.vi-blue-card').first()).toContainText('Impressão')
    await expect(section(page, 1).locator('.vi-blue-card.is-digital')).toContainText(digitalBlue.hex)
    await expect(body).not.toContainText('Documentado no manual')
    await expect(body).not.toContainText('2024')
    await expect(body).not.toContainText('ESQUEMA DE COR')
    // 02.1: logo with slogan and the fifth element numbered.
    await expect(section(page, 0).locator('.vi-hero-logo')).toHaveAttribute('src', new RegExp(logoAsset('cores-originais', true)))
    await expect(section(page, 0).locator('.vi-anatomy button')).toHaveCount(5)
    await expect(section(page, 0).locator('.vi-anatomy button').nth(4)).toContainText('5')

    // Global menu lists the eight subtopics.
    await page.getByRole('button', { name: /Capítulos/ }).click()
    const dialog = page.getByRole('dialog', { name: 'Navegação do Manual da Marca' })
    await dialog.getByRole('button', { name: 'Mostrar assuntos de Identidade Visual' }).click()
    await expect(dialog.locator('#nav-identidade-visual a')).toHaveCount(10)
    await page.keyboard.press('Escape')
    expect(errors).toEqual([])
  })

  test('a logomarca vem do arquivo original ou das versões geradas dele, sem deformação fora dos exemplos incorretos', async ({ page }) => {
    await page.goto('/')
    await skipOpening(page)
    await page.locator('#identidade-visual').scrollIntoViewIfNeeded()
    // Images may still be lazy; wait until every one has decoded.
    await page.locator('#identidade-visual img.vi-logo').evaluateAll(images => Promise.all(images.map(image => (image as HTMLImageElement).decode().catch(() => {}))))
    const ratios = await page.locator('#identidade-visual img.vi-logo').evaluateAll(images => images
      .filter(image => !image.closest('.vi-compare-item.is-wrong'))
      .map(image => {
        const img = image as HTMLImageElement, box = img.getBoundingClientRect()
        return { src: img.getAttribute('src')!, rendered: box.height ? box.width / box.height : 0, natural: img.naturalWidth / img.naturalHeight }
      }))
    expect(ratios.length).toBeGreaterThanOrEqual(10)
    for (const { src, rendered, natural } of ratios) {
      expect(src.includes(logoFile.src) || src.includes('assets/logos/gazin-'), src).toBe(true)
      if (rendered) expect(Math.abs(rendered - natural), src).toBeLessThan(.05)
    }
    // No CSS filter is ever applied to the logo.
    const filters = await page.locator('#identidade-visual img.vi-logo').evaluateAll(images => images.map(image => getComputedStyle(image).filter))
    expect(filters.every(filter => filter === 'none')).toBe(true)
  })

  test('demonstrações interativas funcionam pelo mouse e pelo teclado', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.goto('/')
    await skipOpening(page)

    // 02.1 construction stepper.
    await goTo(page, 0)
    await page.getByRole('button', { name: /Composição final/ }).click()
    await expect(page.locator('.vi-construction-stage')).toHaveAttribute('data-step', '3')
    await page.getByRole('button', { name: /Forma geométrica/ }).click()
    await expect(page.locator('.vi-construction-caption strong')).toHaveText('Forma geométrica')

    // 02.2 copy and palette selection with arrows.
    await goTo(page, 1)
    await page.getByRole('button', { name: `Copiar HEX ${digitalBlue.hex}` }).first().click()
    await expect(section(page, 1).locator('[aria-live]').last()).toHaveText('Código copiado')
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(digitalBlue.hex)
    const radios = page.getByRole('radiogroup', { name: 'Cores da interface do Manual da Marca' }).getByRole('radio')
    await radios.first().focus()
    await page.keyboard.press('ArrowRight')
    await expect(radios.nth(1)).toHaveAttribute('aria-checked', 'true')
    await expect(page.locator('.vi-palette-detail h4')).toHaveText('Azul vibrante')

    // 02.4 variants tabs.
    await goTo(page, 3)
    const tabs = page.getByRole('tablist', { name: 'Versões da logomarca' }).getByRole('tab')
    await tabs.first().focus()
    await page.keyboard.press('ArrowDown')
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true')
    await expect(page.locator('.vi-variant-info')).toContainText('contorno branco')
    await tabs.nth(2).click()
    await expect(page.locator('.vi-variant-logo')).toHaveAttribute('src', new RegExp(logoAsset(variants[2].id, true)))
    await page.getByRole('radio', { name: 'Sem slogan' }).click()
    await expect(page.locator('.vi-variant-logo')).toHaveAttribute('src', new RegExp(logoAsset(variants[2].id, false)))
    expect(variants).toHaveLength(5)

    // 02.5 clear space.
    await goTo(page, 4)
    await page.getByRole('radio', { name: 'Invasão' }).click()
    await expect(page.locator('.vi-clear-verdict')).toContainText('Incorreto')
    const guides = page.getByRole('button', { name: /área de segurança/ })
    await guides.click()
    await expect(guides).toHaveAttribute('aria-pressed', 'false')
    await expect(page.locator('.vi-readout dd').first()).not.toHaveText('0 px')

    // 02.6 slider below the minimum.
    await goTo(page, 5)
    const slider = section(page, 5).getByRole('slider')
    await slider.focus()
    for (let i = 0; i < 10; i++) await page.keyboard.press('ArrowLeft')
    await expect(page.locator('.vi-ruler-verdict')).toContainText('Uso indevido')

    // 02.7 misuse gallery.
    await goTo(page, 6)
    const misuseTabs = page.getByRole('tablist', { name: 'Usos incorretos da logomarca' }).getByRole('tab')
    await expect(misuseTabs).toHaveCount(misuses.length)
    await misuseTabs.nth(3).click()
    await expect(page.locator('.vi-compare-item.is-wrong [role="img"]')).toHaveAttribute('aria-label', /não utilizar/)

    // 02.8 digital layer toggle.
    await goTo(page, 7)
    const layer = page.getByRole('button', { name: /camada digital/ })
    await layer.click()
    await expect(layer).toHaveAttribute('aria-pressed', 'false')
  })

  test('downloads: todas as versões, com e sem slogan, e o pacote .zip', async ({ page, request }) => {
    await page.goto('/')
    await skipOpening(page)
    const links = page.locator('#downloads-logomarca a[download]')
    await expect(links).toHaveCount(variants.length * 2 + 1)
    const expected = [logoArchive, ...variants.flatMap(variant => [logoAsset(variant.id, true), logoAsset(variant.id, false)])]
    const hrefs = await links.evaluateAll(anchors => anchors.map(anchor => anchor.getAttribute('href')!))
    for (const file of expected) expect(hrefs.some(href => href.endsWith(file))).toBe(true)
    for (const href of hrefs) {
      const response = await request.get(href)
      expect(response.status(), href).toBe(200)
      const body = await response.body()
      // PNG or ZIP signature.
      expect(body.subarray(0, 4).toString('hex'), href).toMatch(href.endsWith('.zip') ? /^504b0304$/ : /^89504e47$/)
    }
    // A real browser download from the "baixar todas" button.
    const [download] = await Promise.all([page.waitForEvent('download'), page.locator('#downloads-logomarca').getByRole('link', { name: /Baixar todas/ }).click()])
    expect(download.suggestedFilename()).toBe('gazin-logos.zip')
  })

  test('02.9: arquitetura do manual com as marcas clicáveis e baixáveis', async ({ page, request }) => {
    await page.goto('/')
    await skipOpening(page)
    await goTo(page, 9)
    const s = section(page, 9)
    // Manual págs. 30–31: Gazin Holding at the centre, five clusters (14 brands + the main Gazin).
    await expect(s.locator('.ba-hub')).toContainText('Uma Gazin para todos!')
    await expect(s.locator('.ba-cluster')).toHaveCount(architecture.clusters.length)
    await expect(s.locator('.ba-cluster .ba-brand')).toHaveCount(architecture.clusters.flatMap(cluster => cluster.brands).length)
    await expect(s.locator('.ba-others .ba-brand')).toHaveCount(otherBrands.length)
    // Holding + clusters + others = every file in the logo folder + the main Gazin logo.
    expect(1 + architecture.clusters.flatMap(cluster => cluster.brands).length + otherBrands.length).toBe(groupLogos.length + 1)
    // The Holding (centre) uses its official file and can be downloaded.
    await s.getByRole('button', { name: 'Gazin Holding: ver e baixar' }).click()
    await expect(s.locator('.ba-detail h4')).toHaveText('Gazin Holding')
    await expect(s.getByRole('link', { name: 'Baixar Gazin Holding, arquivo original (PNG)' })).toHaveAttribute('href', /originais\/gazin-holding\.png$/)
    // No source citations in this block.
    await expect(s).not.toContainText(/Manual da Logomarca|págs?\./)
    // Selecting a brand shows it with its original file to download.
    await s.getByRole('button', { name: 'Gazin Log: ver e baixar' }).click()
    await expect(s.getByRole('button', { name: 'Gazin Log: ver e baixar' })).toHaveAttribute('aria-pressed', 'true')
    await expect(s.locator('.ba-detail h4')).toHaveText('Gazin Log')
    await expect(s.locator('.ba-detail')).toContainText('Conjunto 3')
    const detailHref = await s.getByRole('link', { name: 'Baixar Gazin Log, arquivo original (PNG)' }).getAttribute('href')
    expect((await (await request.get(detailHref!)).body()).length).toBe(groupLogos.find(logo => logo.slug === 'gazin-log')!.bytes)
    await expect(s.locator('.ba-cluster.is-c3')).toHaveClass(/is-active/)
    await page.screenshot({ path: 'docs/screenshots/identity/02-9-arquitetura.png' })
  })

  test('02.9: biblioteca das marcas com busca e download dos arquivos originais', async ({ page, request }) => {
    await page.goto('/')
    await skipOpening(page)
    await goTo(page, 9)
    const cards = section(page, 9).locator('.vi-group-card')
    await expect(cards).toHaveCount(groupLogos.length)
    for (const logo of groupLogos) await expect(section(page, 9).getByRole('heading', { level: 4, name: logo.name, exact: true })).toBeVisible()
    // Every download is the untouched original from the Logos folder.
    for (const logo of groupLogos) {
      const href = await section(page, 9).getByRole('link', { name: `Baixar logomarca ${logo.name} (PNG)`, exact: true }).getAttribute('href')
      const response = await request.get(href!)
      expect(response.status(), logo.name).toBe(200)
      expect((await response.body()).length, logo.name).toBe(logo.bytes)
    }
    const zip = await request.get(await section(page, 9).getByRole('link', { name: /Baixar todas/ }).getAttribute('href') as string)
    expect((await zip.body()).subarray(0, 4).toString('hex')).toBe('504b0304')
    // Search ignores accents and case.
    await section(page, 9).getByRole('searchbox').fill('colchoes')
    await expect(cards).toHaveCount(2)
    await section(page, 9).getByRole('searchbox').fill('xyz')
    await expect(section(page, 9).locator('.vi-group-empty')).toBeVisible()
  })

  test('a navegação contextual acompanha o scroll e leva ao subtópico', async ({ page }) => {
    await page.goto('/')
    await skipOpening(page)
    await goTo(page, 4)
    await expect(page.locator(`.vi-subnav a[href="#${chapter.subsections[4].id}"]`)).toHaveAttribute('aria-current', 'true')
    await page.locator(`.vi-subnav a[href="#${chapter.subsections[1].id}"]`).click()
    await expect(section(page, 1)).toBeInViewport()
    await expect(page.locator(`.vi-subnav a[href="#${chapter.subsections[1].id}"]`)).toHaveAttribute('aria-current', 'true')
    await expect(page.locator('.nav-current')).toContainText('Identidade Visual')
  })

  test('F5 dentro do capítulo reinicia pela introdução', async ({ page }) => {
    await page.goto(`/#${chapter.subsections[2].id}`)
    await skipOpening(page)
    await page.reload()
    await expect.poll(() => page.evaluate(() => location.hash)).toBe('')
    expect(await page.evaluate(() => scrollY)).toBeLessThan(10)
  })
})

for (const width of [1440, 1024, 768, 390, 320]) {
  test(`Identidade Visual sem rolagem horizontal e capturas em ${width}px`, async ({ page }) => {
    const errors = collectErrors(page)
    await page.setViewportSize({ width, height: 900 })
    await mkdir('docs/screenshots/identity', { recursive: true })
    await page.goto('/')
    await skipOpening(page)
    for (const [index, subsection] of chapter.subsections.entries()) {
      await goTo(page, index)
      await page.waitForTimeout(1200)
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), `${subsection.title} @${width}`).toBeLessThanOrEqual(0)
      // The chapter clips overflow, so also check that no content is cut at the right edge
      // (horizontal scrollers and their contents excluded; transformed misuse demos are clipped on purpose).
      const clipped = await page.evaluate(id => Array.from(document.getElementById(id)!.querySelectorAll<HTMLElement>('*'))
        .filter(element => !(element instanceof SVGElement) && !element.closest('.vi-compare-art, .vi-ruler-stage'))
        .filter(element => {
          for (let parent = element.parentElement; parent; parent = parent.parentElement) {
            const overflow = getComputedStyle(parent).overflowX
            if (overflow === 'auto' || overflow === 'scroll') return false
          }
          return element.getBoundingClientRect().right > innerWidth + 1 && getComputedStyle(element).position !== 'absolute'
        })
        .map(element => `${element.tagName.toLowerCase()}.${element.className}`).slice(0, 5), subsection.id)
      expect(clipped, `${subsection.title} @${width}`).toEqual([])
      if (width !== 1024) await page.screenshot({ path: `docs/screenshots/identity/${width}-${subsection.number}.png` })
      if (width === 1440) {
        await page.evaluate(() => scrollBy({ top: innerHeight * .85, behavior: 'instant' }))
        await page.waitForTimeout(1000)
        await page.screenshot({ path: `docs/screenshots/identity/${width}-${subsection.number}-b.png` })
      }
    }
    expect(errors).toEqual([])
  })
}

test.describe('Identidade Visual com movimento', () => {
  test.use({ reducedMotion: 'no-preference', viewport: { width: 1440, height: 900 } })
  test('animações de entrada não deixam conteúdo oculto', async ({ page }) => {
    const errors = collectErrors(page)
    await page.goto('/')
    await skipOpening(page)
    for (let index = 0; index < chapter.subsections.length; index++) {
      await goTo(page, index)
      await page.waitForTimeout(1400)
    }
    await page.evaluate(() => document.querySelector('.vi-construction-stage')!.scrollIntoView({ block: 'center', behavior: 'instant' }))
    await page.waitForTimeout(2200)
    await page.screenshot({ path: 'docs/screenshots/identity/motion-02.1.png' })
    // The construction plays on its own, up to the final composition.
    await expect(page.locator('.vi-construction-stage')).toHaveAttribute('data-step', '3', { timeout: 9000 })
    await page.screenshot({ path: 'docs/screenshots/identity/motion-02.1-final.png' })
    const hidden = await page.locator('#identidade-visual [data-vi-reveal]').evaluateAll(elements => elements.filter(element => {
      const box = element.getBoundingClientRect()
      return box.top > 0 && box.bottom < innerHeight && Number(getComputedStyle(element).opacity) < .5
    }).map(element => `${element.className} top=${Math.round(element.getBoundingClientRect().top)} vh=${innerHeight}`))
    expect(hidden).toEqual([])
    expect(errors).toEqual([])
  })
})
