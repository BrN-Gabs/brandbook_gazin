import { test, expect, type Page } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import { itemsOf, treeItems, treeRegions } from '../src/data/successTree'
import { skipOpening } from './helpers'

const shots = 'docs/screenshots/arvore'
const errorsOf = (page: Page) => {
  const errors: string[] = []
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
  page.on('pageerror', error => errors.push(error.message))
  return errors
}
/** Position inside the pinned formation: 0 = start, 1 = complete. */
const formation = (page: Page, fraction: number) => page.evaluate(value => {
  const section = document.getElementById('arvore')!
  const start = Number(section.dataset.pinStart), end = Number(section.dataset.pinEnd)
  scrollTo({ top: start + (end - start) * value, behavior: 'instant' })
}, fraction)
const progress = (page: Page) => page.locator('.tree-canvas').evaluate(canvas => Number((canvas as HTMLCanvasElement).dataset.progress))
const distance = (page: Page) => page.locator('.tree-canvas').evaluate(canvas => Number((canvas as HTMLCanvasElement).dataset.distance))
const label = (page: Page, id: string) => page.locator(`.tree-label[data-id="${id}"]`)
/** Opens the page with the tree complete and ready to explore (desktop, pinned). */
async function completeTree(page: Page) {
  await page.goto('/')
  await skipOpening(page)
  // Pins change the page height: scroll only once the motion system is in place.
  await expect(page.locator('html')).toHaveClass(/motion-enabled/)
  await page.locator('#arvore').scrollIntoViewIfNeeded()
  await expect(page.locator('#arvore')).toHaveAttribute('data-status', 'ready', { timeout: 30000 })
  await expect(page.locator('#arvore')).toHaveAttribute('data-pin-start', /[0-9]+/)
  await formation(page, 1)
  await expect.poll(() => progress(page)).toBeGreaterThan(.99)
  await expect(page.locator('.tree-nav')).toHaveAttribute('data-ready', 'true')
  await page.waitForTimeout(1200)
}
async function hoverDot(page: Page, id: string) {
  const box = (await label(page, id).locator('.tree-label-dot').boundingBox())!
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  return box
}

test.beforeAll(async () => { await mkdir(shots, { recursive: true }) })

test('Árvore após Nossa História, no menu Essência, com todos os conceitos da referência', async ({ page }) => {
  await page.goto('/')
  await skipOpening(page)
  const order = await page.locator('main > section').evaluateAll(sections => sections.map(section => section.id))
  expect(order.slice(order.indexOf('historia'), order.indexOf('historia') + 3)).toEqual(['historia', 'arvore', 'posicionamento'])
  expect(itemsOf('raizes')).toHaveLength(8)
  expect(itemsOf('tronco')).toHaveLength(7)
  expect(itemsOf('galhos').map(item => item.title)).toEqual(['Varejo Experience Brasil', 'Consórcio', 'GazinBank', 'TV Gazin', 'Atacado', 'Serviços', 'GazinTech', 'Varejo', 'Seguros', 'Indústrias', 'GazinLog', 'Expansão e novos mercados', 'Instituto Mário Gazin', 'E-commerce'])
  expect(itemsOf('frutos')).toHaveLength(11)
  await expect(page.locator('#arvore .tree-label')).toHaveCount(treeItems.length)
  await expect(page.locator('#arvore img')).toHaveCount(0)
  await page.getByRole('button', { name: /Capítulos/ }).click()
  await page.getByRole('dialog', { name: 'Navegação do Manual da Marca' }).getByRole('link', { name: 'Árvore da Jornada' }).click()
  await expect(page.locator('#tree-title')).toBeInViewport()
})

test.describe('Desktop com movimento', () => {
  test.use({ reducedMotion: 'no-preference', viewport: { width: 1440, height: 900 } })

  test('da linha do tempo para a árvore: formação progressiva, reversível, e saída para o Posicionamento', async ({ page }) => {
    const errors = errorsOf(page)
    await page.goto('/')
    await skipOpening(page)
    // End of the horizontal timeline, then the ordinary vertical scroll reaches the tree.
    await expect(page.locator('#historia')).toHaveAttribute('data-pin-start', /[0-9]+/)
    await expect(page.locator('#arvore')).toHaveAttribute('data-pin-start', /[0-9]+/)
    await page.evaluate(() => {
      const history = document.getElementById('historia')!
      const rail = history.querySelector<HTMLElement>('.history-rail')!, viewport = history.querySelector<HTMLElement>('.history-viewport')!
      scrollTo({ top: Number(history.dataset.pinStart) + rail.scrollWidth - viewport.clientWidth, behavior: 'instant' })
    })
    await page.waitForTimeout(800)
    await expect(page.locator('#arvore')).toHaveAttribute('data-status', 'ready', { timeout: 30000 })
    await page.mouse.move(720, 450)
    for (let i = 0; i < 12 && await page.locator('#arvore .tree-pin').evaluate(pin => pin.getBoundingClientRect().top > 2); i++) {
      await page.mouse.wheel(0, 300); await page.waitForTimeout(150)
    }
    await expect(page.locator('#arvore')).toHaveClass(/is-pinned/)
    expect(await progress(page)).toBeLessThan(.35)

    for (const [step, fraction] of [[1, .06], [2, .16], [3, .3], [4, .45], [5, .6], [6, .75], [7, .9], [8, 1]] as const) {
      await formation(page, fraction)
      await page.waitForTimeout(1500)
      await page.screenshot({ path: `${shots}/formacao-${step}.png` })
      // The section stays on screen while the tree is built.
      expect(await page.locator('#arvore .tree-pin').evaluate(pin => Math.round(pin.getBoundingClientRect().top))).toBe(0)
    }
    expect(await progress(page)).toBeGreaterThan(.98)
    await expect(label(page, 'unidades')).toHaveAttribute('data-visible', 'true')

    // Scrolling up takes the construction back.
    await formation(page, .25)
    await page.waitForTimeout(1500)
    expect(await progress(page)).toBeLessThan(.4)
    await expect(label(page, 'unidades')).toHaveAttribute('data-visible', 'false')

    await formation(page, 1)
    await page.waitForTimeout(1500)
    await page.mouse.wheel(0, 900)
    await expect(page.locator('.tree-closing-title')).toBeInViewport()
    await page.mouse.wheel(0, 1200)
    await page.waitForTimeout(900)
    await expect(page.locator('#posicionamento')).toBeInViewport()
    expect(errors).toEqual([])
  })

  test('hover e clique em raízes, tronco, galhos e frutos', async ({ page }) => {
    const errors = errorsOf(page)
    await completeTree(page)
    for (const id of ['fe-em-deus', 'lideranca-inspiradora', 'gazinbank', 'unidades']) {
      const item = treeItems.find(entry => entry.id === id)!
      await expect(label(page, id)).toHaveAttribute('data-visible', 'true')
      await hoverDot(page, id)
      await expect(label(page, id)).toHaveAttribute('data-state', 'focus')
      await expect(label(page, id).locator('.tree-label-text')).toHaveCSS('opacity', '1')
      await page.waitForTimeout(500)
      await page.screenshot({ path: `${shots}/hover-${item.region}.png` })
      await label(page, id).locator('.tree-label-dot').click({ force: true })
      const panel = page.locator('.tree-panel')
      await expect(panel.locator('h3')).toHaveText(item.title)
      await expect(panel).toContainText(item.description)
      await expect(panel.locator('.tree-panel-region')).toContainText(treeRegions.find(region => region.id === item.region)!.label)
      await expect(page.locator('#arvore')).toHaveAttribute('data-region', item.region)
      await page.mouse.move(10, 450)
      await page.waitForTimeout(1300)
      await page.screenshot({ path: `${shots}/clique-${item.region}.png` })
      await page.keyboard.press('Escape')
      await page.keyboard.press('Escape')
      await expect(page.locator('#arvore')).toHaveAttribute('data-region', 'overview')
      await page.waitForTimeout(2200) // camera glides back to the overview
    }
    // The 3D elements themselves are targets too (screen-space hit test), not only the labels.
    const dot = (await label(page, 'unidades').locator('.tree-label-dot').boundingBox())!
    await page.mouse.move(dot.x + dot.width / 2, dot.y + dot.height / 2 + 22)
    await expect(page.locator('#arvore')).toHaveAttribute('data-hovered', 'unidades')
    await expect(label(page, 'unidades')).toHaveAttribute('data-state', 'focus')
    await page.mouse.down(); await page.mouse.up()
    await expect(page.locator('.tree-panel h3')).toHaveText('Expansão')
    expect(errors).toEqual([])
  })

  test('navegação por regiões, painel contextual e restaurar câmera', async ({ page }) => {
    const errors = errorsOf(page)
    await completeTree(page)
    await page.mouse.move(10, 450)
    const overview = await distance(page)
    const nav = page.getByRole('navigation', { name: 'Regiões da árvore' })
    for (const region of treeRegions) {
      await nav.getByRole('button', { name: region.label, exact: true }).click()
      await expect(nav.getByRole('button', { name: region.label, exact: true })).toHaveAttribute('aria-pressed', 'true')
      const panel = page.locator('.tree-panel')
      await expect(panel.locator('h3')).toHaveText(region.label)
      await expect(panel).toContainText(region.concept)
      await expect(panel.locator('.tree-panel-list button')).toHaveCount(itemsOf(region.id).length)
      await page.waitForTimeout(1500)
      // Close-up: the camera moved, the region's labels are shown, the others are hidden.
      expect(Math.abs(await distance(page) - overview)).toBeGreaterThan(.5)
      for (const item of itemsOf(region.id)) await expect(label(page, item.id)).toHaveAttribute('data-show', 'true')
      const other = treeItems.find(item => item.region !== region.id)!
      await expect(label(page, other.id)).toHaveAttribute('data-visible', 'false')
      await page.screenshot({ path: `${shots}/regiao-${region.id}.png` })
    }
    // Inside a region: list → element → next → back to the list.
    const fruits = itemsOf('frutos')
    await page.locator('.tree-panel-list button').first().click()
    await expect(page.locator('.tree-panel h3')).toHaveText(fruits[0].title)
    await expect(page.locator('.tree-panel-note')).toBeVisible()
    await page.getByRole('button', { name: 'Próximo elemento' }).click()
    await expect(page.locator('.tree-panel h3')).toHaveText(fruits[1].title)
    await page.getByRole('button', { name: 'Todos de Frutos' }).click()
    await expect(page.locator('.tree-panel h3')).toHaveText('Frutos')
    // Visão geral restores the camera.
    await nav.getByRole('button', { name: /Visão geral/ }).click()
    await expect(page.locator('.tree-panel')).toHaveCount(0)
    await expect.poll(async () => Math.abs(await distance(page) - overview), { timeout: 6000 }).toBeLessThan(.15)
    await expect(page.locator('.tree-region-label[data-visible="true"]')).toHaveCount(4)
    expect(errors).toEqual([])
  })

  test('teclado: regiões, lista de conceitos e Escape', async ({ page }) => {
    await completeTree(page)
    const nav = page.getByRole('navigation', { name: 'Regiões da árvore' })
    await nav.getByRole('button', { name: 'Tronco', exact: true }).focus()
    await page.keyboard.press('Enter')
    await expect(page.locator('.tree-panel h3')).toHaveText('Tronco')
    await page.locator('.tree-panel-list button').nth(2).focus()
    await page.keyboard.press('Enter')
    await expect(page.locator('.tree-panel h3')).toHaveText(itemsOf('tronco')[2].title)
    await expect(label(page, itemsOf('tronco')[2].id)).toHaveAttribute('data-state', 'selected')
    await page.keyboard.press('Escape')
    await expect(page.locator('.tree-panel h3')).toHaveText('Tronco')
    await page.keyboard.press('Escape')
    await expect(page.locator('.tree-panel')).toHaveCount(0)
  })

  test('redimensionamento e diferentes resoluções mantêm a árvore enquadrada', async ({ page }) => {
    const errors = errorsOf(page)
    await completeTree(page)
    for (const [width, height] of [[1920, 1080], [1280, 720], [1100, 800], [2560, 1440]]) {
      await page.setViewportSize({ width, height })
      await page.waitForTimeout(1200)
      await formation(page, 1)
      await page.waitForTimeout(1500)
      for (const id of ['varejo-experience', 'e-commerce', 'cuidado-pessoas', 'compromisso-social']) {
        const box = (await label(page, id).locator('.tree-label-dot').boundingBox())!
        expect(box.x, `${id} @${width}`).toBeGreaterThan(0)
        expect(box.x + box.width, `${id} @${width}`).toBeLessThan(width)
        expect(box.y + box.height, `${id} @${width}`).toBeLessThan(height)
      }
      await page.screenshot({ path: `${shots}/resolucao-${width}.png` })
    }
    // The canvas keeps rendering frames.
    const frame = () => page.locator('.tree-canvas').evaluate(canvas => Number((canvas as HTMLCanvasElement).dataset.frame))
    const before = await frame()
    await page.waitForTimeout(500)
    expect(await frame()).toBeGreaterThan(before)
    expect(errors).toEqual([])
  })

  test('trocar a preferência de animação recria a cena sem erros nem contextos extras', async ({ page }) => {
    const errors = errorsOf(page)
    await completeTree(page)
    for (let i = 0; i < 3; i++) {
      await page.getByRole('button', { name: 'Reduzir animações', exact: true }).click()
      await expect(page.locator('#arvore')).toHaveAttribute('data-status', 'ready')
      await page.getByRole('button', { name: 'Ativar animações', exact: true }).click()
      await expect(page.locator('#arvore')).toHaveAttribute('data-status', 'ready')
    }
    await expect(page.locator('canvas.tree-canvas')).toHaveCount(1)
    await expect(page.locator('.pin-spacer')).toHaveCount(3)
    expect(errors).toEqual([])
  })

  test('F5 na árvore recomeça pela introdução', async ({ page }) => {
    await page.goto('/#arvore')
    await skipOpening(page)
    await page.reload()
    await expect.poll(() => page.evaluate(() => [scrollY, location.hash])).toEqual([0, ''])
  })
})

test('Movimento reduzido: árvore completa, sem pin, explorável', async ({ page }) => {
  const errors = errorsOf(page)
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await skipOpening(page)
  await page.locator('#arvore').scrollIntoViewIfNeeded()
  await expect(page.locator('#arvore')).toHaveAttribute('data-status', 'ready', { timeout: 30000 })
  await expect(page.locator('#arvore')).not.toHaveClass(/is-pinned/)
  await page.locator('#arvore .tree-pin').evaluate(element => element.scrollIntoView({ behavior: 'instant' }))
  expect(await progress(page)).toBe(1)
  await expect(page.locator('.tree-region-label[data-visible="true"]')).toHaveCount(4)
  await page.getByRole('navigation', { name: 'Regiões da árvore' }).getByRole('button', { name: 'Galhos', exact: true }).click()
  await expect(page.locator('.tree-panel h3')).toHaveText('Galhos')
  await page.waitForTimeout(400)
  await page.screenshot({ path: `${shots}/reduzido.png` })
  expect(errors).toEqual([])
})

test.describe('Celular', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: 'no-preference' })

test('árvore reconhecível, exploração por toque, sem rolagem lateral', async ({ page }) => {
  const errors = errorsOf(page)
  await page.goto('/')
  await skipOpening(page)
  await page.locator('#tree-title').scrollIntoViewIfNeeded()
  await expect(page.locator('#arvore')).toHaveAttribute('data-status', 'ready', { timeout: 30000 })
  await page.screenshot({ path: `${shots}/mobile-titulo.png` })
  await page.locator('.tree-stage').evaluate(element => element.scrollIntoView({ block: 'center', behavior: 'instant' }))
  await expect.poll(() => progress(page)).toBeGreaterThan(.99)
  await page.waitForTimeout(800)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.screenshot({ path: `${shots}/mobile-arvore.png` })
  await page.getByRole('navigation', { name: 'Regiões da árvore' }).getByRole('button', { name: 'Frutos', exact: true }).tap()
  await expect(page.locator('.tree-panel h3')).toHaveText('Frutos')
  await page.locator('.tree-panel-list button').nth(8).tap()
  await expect(page.locator('.tree-panel h3')).toHaveText(itemsOf('frutos')[8].title)
  await page.waitForTimeout(1200)
  await page.locator('.tree-stage').evaluate(element => element.scrollIntoView({ behavior: 'instant' }))
  await page.screenshot({ path: `${shots}/mobile-fruto.png` })
  // Tap directly on a label in the tree.
  await page.getByRole('navigation', { name: 'Regiões da árvore' }).getByRole('button', { name: 'Raízes', exact: true }).tap()
  await page.waitForTimeout(1200)
  const box = (await label(page, 'coragem').locator('.tree-label-dot').boundingBox())!
  await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2)
  await expect(page.locator('.tree-panel h3')).toHaveText('Coragem')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  expect(errors).toEqual([])
})
})
