import { test, expect } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import { brandChapters, placeholderCopy } from '../src/data/brandChapters'
import { skipOpening } from './helpers'

test.use({ reducedMotion: 'no-preference', viewport: { width: 1440, height: 900 } })

test('11 capítulos, na ordem, logo após os Pilares, só com estrutura e espaços reservados', async ({ page }) => {
  await page.goto('/')
  await skipOpening(page)
  const order = await page.locator('main > section').evaluateAll(sections => sections.map(section => section.id))
  const pillars = order.indexOf('pilares')
  // Nossa História and the Árvore da Jornada (Essência) sit between the pillars and chapter 01.
  expect(order.slice(pillars + 1, pillars + 3)).toEqual(['historia', 'arvore'])
  expect(order.slice(pillars + 3)).toEqual(brandChapters.map(chapter => chapter.id))
  for (const chapter of brandChapters) {
    const section = page.locator(`#${chapter.id}`)
    await expect(section.getByRole('heading', { level: 2 })).toHaveText(chapter.title)
    await expect(section.locator('.chapter-nav a')).toHaveCount(chapter.subsections.length)
    // Chapters with content (Posicionamento, Identidade Visual e Verbal) are covered by their own specs.
    if (chapter.layout === 'identity' || chapter.layout === 'positioning' || chapter.layout === 'verbal' || chapter.layout === 'physical' || chapter.layout === 'photo' || chapter.layout === 'governance' || chapter.layout === 'campaigns' || chapter.layout === 'digital' || chapter.layout === 'internal' || chapter.layout === 'sponsorships' || chapter.layout === 'characters' || chapter.layout === 'our-brands') continue
    await expect(section.locator('.subsection')).toHaveCount(chapter.subsections.length)
    for (const subsection of chapter.subsections) {
      await expect(page.locator(`#${subsection.id} h3`)).toHaveText(subsection.title)
      // Nothing official was written: every block shows the provisional copy.
      await expect(page.locator(`#${subsection.id} .subsection-text`)).toContainText(placeholderCopy.description)
    }
  }
  // No status badges and no DNA icon next to chapter titles.
  await expect(page.locator('.status-badge, .helix-mark')).toHaveCount(0)
  await expect(page.locator('main')).not.toContainText(placeholderCopy.status.planned)
  await expect(page.locator('main')).not.toContainText(placeholderCopy.status.ready)
  expect(brandChapters.reduce((sum, chapter) => sum + chapter.subsections.length, 0)).toBe(60)
})

test('Todos os capítulos: título, subtítulo em uma linha e descrição', async ({ page }) => {
  await page.goto('/')
  await skipOpening(page)
  for (const chapter of brandChapters) {
    const intro = page.locator(`#${chapter.id} .chapter-intro`)
    await expect(page.locator(`#${chapter.id} .chapter-title`)).toHaveText(chapter.title)
    if (chapter.leadTitle) await expect(intro.locator('.vb-lead-title')).toHaveText(chapter.leadTitle)
    else await expect(intro).toContainText(placeholderCopy.chapterSubtitle)
    if (chapter.description?.length) await expect(intro.locator('p:not(.vb-lead-title)').first()).toBeVisible()
    else await expect(intro).toContainText(placeholderCopy.chapterDescription)
  }
  // Desktop and tablet: every subtitle on one line, inside the page, clear of the chapter index.
  for (const width of [1440, 1101, 768]) {
    await page.setViewportSize({ width, height: 900 })
    const problems = await page.evaluate(() => [...document.querySelectorAll<HTMLElement>('.chapter .vb-lead-title')].flatMap(title => {
      const box = title.getBoundingClientRect()
      const range = document.createRange()
      range.selectNodeContents(title)
      const text = range.getBoundingClientRect()
      const nav = title.closest('.chapter')!.querySelector('.chapter-nav')!.getBoundingClientRect()
      const lines = Math.round(box.height / parseFloat(getComputedStyle(title).lineHeight))
      const hitsNav = text.right > nav.left - 8 && nav.left > text.left && nav.bottom > box.top && nav.top < box.bottom
      return lines !== 1 || text.right > innerWidth || hitsNav ? [`${innerWidth}px · ${title.textContent} (${lines} linhas)`] : []
    }))
    expect(problems).toEqual([])
  }
})

test('Capturas de cada capítulo (desktop)', async ({ page }) => {
  await mkdir('docs/screenshots/chapters', { recursive: true })
  await page.goto('/')
  await skipOpening(page)
  for (const chapter of brandChapters) {
    await page.locator(`#${chapter.id}`).scrollIntoViewIfNeeded()
    await page.evaluate(id => document.getElementById(id)!.scrollIntoView({ block: 'start', behavior: 'instant' }), chapter.id)
    await page.waitForTimeout(900)
    await page.screenshot({ path: `docs/screenshots/chapters/${chapter.number}-${chapter.id}.png` })
    await page.evaluate(id => scrollBy({ top: Math.min(document.getElementById(id)!.offsetHeight - innerHeight, innerHeight * .9), behavior: 'instant' }), chapter.id)
    await page.waitForTimeout(900)
    await page.screenshot({ path: `docs/screenshots/chapters/${chapter.number}-${chapter.id}-b.png` })
  }
})

test('Menu: capítulos expansíveis levam ao subtópico, indicam a seção ativa e fecham', async ({ page }) => {
  await page.goto('/')
  await skipOpening(page)
  const trigger = page.getByRole('button', { name: /Capítulos/ })
  await trigger.click()
  const dialog = page.getByRole('dialog', { name: 'Navegação do Manual da Marca' })
  await expect(dialog).toBeVisible()
  await page.waitForTimeout(500)
  await page.screenshot({ path: 'docs/screenshots/chapters/menu.png' })
  await dialog.getByRole('button', { name: 'Mostrar assuntos de Identidade Visual' }).click()
  await dialog.getByRole('link', { name: '02.2 Cores Institucionais' }).click()
  await expect(dialog).toBeHidden()
  await expect(page.locator('#identidade-visual-2')).toBeInViewport()
  await expect.poll(() => page.evaluate(() => location.hash)).toBe('#identidade-visual-2')
  // Title is not hidden under the fixed bar.
  expect(await page.locator('#identidade-visual-2').evaluate(el => el.getBoundingClientRect().top)).toBeGreaterThan(60)
  await expect(page.locator('.nav-current')).toContainText('Identidade Visual')
  await trigger.click()
  await expect(dialog.locator('a[aria-current="true"]').first()).toHaveText(/Identidade Visual/)
  await expect(dialog.getByRole('link', { name: '02.2 Cores Institucionais' })).toHaveAttribute('aria-current', 'true')
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(trigger).toBeFocused()
  // Back to top.
  await page.getByRole('link', { name: 'Voltar ao topo' }).click()
  await expect(page.locator('#hero-title')).toBeInViewport()
})

test('Menu pelo teclado: abre, mantém o foco dentro e navega', async ({ page }) => {
  await page.goto('/')
  await skipOpening(page)
  await page.getByRole('button', { name: /Capítulos/ }).focus()
  await page.keyboard.press('Enter')
  const dialog = page.getByRole('dialog', { name: 'Navegação do Manual da Marca' })
  await expect(dialog).toBeVisible()
  for (let i = 0; i < 40; i++) await page.keyboard.press('Tab')
  expect(await dialog.evaluate(el => el.contains(document.activeElement))).toBe(true)
  await dialog.getByRole('link', { name: '12 Governança da Marca' }).focus()
  await page.keyboard.press('Enter')
  await expect(page.locator('#governanca')).toBeInViewport()
  await expect(page.locator('.dna-loader')).toHaveCount(0)
})

test('Navegação interna do capítulo, sem bloco de próximo capítulo', async ({ page }) => {
  await page.goto('/')
  await skipOpening(page)
  await page.locator('#posicionamento').scrollIntoViewIfNeeded()
  await page.locator('#posicionamento .chapter-nav').getByRole('link', { name: /Proposta de Valor/ }).click()
  await expect(page.locator('#posicionamento-3')).toBeInViewport()
  await expect(page.locator('.chapter-next')).toHaveCount(0)
})

test('F5 em um capítulo interno reinicia pela abertura no topo', async ({ page }) => {
  await page.goto('/')
  await skipOpening(page)
  await page.getByRole('button', { name: /Capítulos/ }).click()
  await page.getByRole('dialog', { name: 'Navegação do Manual da Marca' }).getByRole('link', { name: '11 Patrocínios e Eventos' }).click()
  await expect(page.locator('#patrocinios-eventos')).toBeInViewport()
  await page.reload()
  await expect(page.locator('.dna-loader')).toBeVisible()
  expect(await page.evaluate(() => [scrollY, location.hash])).toEqual([0, ''])
})

test('Celular: capítulos sem rolagem lateral e menu em tela cheia', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await skipOpening(page)
  for (const id of ['identidade-visual', 'comunicacao-digital', 'patrocinios-eventos', 'governanca']) {
    await page.evaluate(target => document.getElementById(target)!.scrollIntoView({ behavior: 'instant' }), id)
    await page.waitForTimeout(700)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.screenshot({ path: `docs/screenshots/chapters/mobile-${id}.png` })
  }
  await page.getByRole('button', { name: /Capítulos/ }).click()
  const box = (await page.getByRole('dialog', { name: 'Navegação do Manual da Marca' }).boundingBox())!
  expect(box.width).toBeGreaterThan(370)
  await page.screenshot({ path: 'docs/screenshots/chapters/mobile-menu.png' })
})
