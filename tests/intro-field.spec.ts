import { test, expect } from '@playwright/test'

test.use({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' })

test('Clique esquerdo propaga a onda nas quatro direções e a malha volta ao repouso', async ({ page }) => {
  await page.goto('/#inicio')
  await expect(page.locator('html')).toHaveClass(/motion-enabled/)
  await page.waitForTimeout(2300)
  const origin = await page.locator('.introduction').evaluate(element => ({ x: 180, y: element.getBoundingClientRect().top + 70 }))
  await page.mouse.move(origin.x, origin.y)
  await page.waitForTimeout(1800)
  const sample = () => page.locator('.intro-field').evaluateAll((elements, center) => {
    return [[-140, 0], [140, 0], [0, -140], [0, 140]].map(([dx, dy]) => {
      const x = center.x + dx
      const y = center.y + dy
      const canvas = elements.find(element => {
        const rect = element.getBoundingClientRect()
        return y >= rect.top && y < rect.bottom && x >= rect.left && x < rect.right
      }) as HTMLCanvasElement
      const rect = canvas.getBoundingClientRect()
      const ratio = canvas.width / rect.width
      const pixels = canvas.getContext('2d')!.getImageData((x - rect.left - 24) * ratio, (y - rect.top - 24) * ratio, 48 * ratio, 48 * ratio).data
      return Array.from(pixels.filter((_, index) => index % 4 === 3))
    })
  }, origin)
  const idle = await sample()
  // Allow subpixel antialiasing differences when Chrome switches canvas rasterizers after readback.
  const differences = (current: number[][]) => current.map((pixels, direction) =>
    pixels.reduce((sum, alpha, index) => sum + Math.abs(alpha - idle[direction][index]), 0) / pixels.length)
  await page.locator('.introduction').dispatchEvent('pointerdown', { pointerType: 'mouse', button: 2, clientX: origin.x, clientY: origin.y })
  await page.waitForTimeout(100)
  differences(await sample()).forEach(change => expect(change).toBeLessThan(0.5))
  await page.mouse.click(origin.x, origin.y)
  await page.waitForTimeout(240)
  const wave = await sample()
  differences(wave).forEach(change => expect(change).toBeGreaterThan(1))
  await page.screenshot({ path: 'docs/screenshots/motion/introducao-onda-clique.png' })
  await expect.poll(async () => Math.max(...differences(await sample())), { timeout: 4500 }).toBeLessThan(0.5)
})

test('Hover azul acompanha letras e logo e restaura os elementos ao sair', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/#inicio')
  await expect(page.locator('html')).toHaveClass(/motion-enabled/)
  await page.waitForTimeout(2300)
  const effect = page.locator('.intro-hover-effect')
  const title = page.locator('#introduction-title')
  const logo = page.locator('.hero-logo')
  const logoSource = await logo.getAttribute('src')

  await page.locator('.intro-letter').nth(4).hover()
  await expect(effect).toHaveCSS('opacity', '1')
  await expect(title).toHaveCSS('filter', /url\(.+intro-hover-/)
  const firstPosition = await effect.evaluate(el => getComputedStyle(el).transform)
  await page.locator('.intro-letter').nth(7).hover()
  await expect.poll(() => effect.evaluate(el => getComputedStyle(el).transform)).not.toBe(firstPosition)

  await logo.hover()
  await expect(logo).toHaveCSS('filter', /url\(.+intro-hover-/)
  await expect(title).toHaveCSS('filter', 'none')
  await expect(logo).toHaveAttribute('src', logoSource!)
  await expect(effect).toHaveCSS('pointer-events', 'none')

  await page.mouse.move(40, 100)
  await expect(effect).toHaveCSS('opacity', '0')
  await expect(logo).toHaveCSS('filter', 'none')
  await logo.hover()
  await page.locator('#valores').scrollIntoViewIfNeeded()
  await expect(effect).toHaveCSS('opacity', '0')
  await expect(logo).toHaveCSS('filter', 'none')

  await page.getByRole('button', { name: 'Reduzir animações', exact: true }).click()
  await expect(effect).toHaveCount(0)
  await expect(page.locator('.intro-hover-definitions')).toHaveCount(0)
  await page.getByRole('button', { name: 'Ativar animações', exact: true }).click()
  await expect(effect).toHaveCount(1)
  await expect(page.locator('.intro-hover-definitions')).toHaveCount(1)
  expect(errors).toEqual([])
})

test('Malha reage ao mouse, preserva o azul e repousa ao sair da introdução', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/#inicio')
  await expect(page.locator('html')).toHaveClass(/motion-enabled/)
  await page.waitForTimeout(2300)
  await expect(page.locator('.hero')).toHaveCSS('background-color', 'rgb(8, 11, 112)')
  await expect(page.locator('.introduction')).toHaveCSS('background-color', 'rgb(8, 11, 112)')
  await expect(page.locator('.intro-pointer')).toHaveCSS('background-color', 'rgb(0, 210, 239)')
  const canvas = page.locator('.introduction .intro-field')
  const idle = await canvas.evaluate((element: HTMLCanvasElement) => element.toDataURL())
  await page.mouse.move(80, 430)
  await page.mouse.move(230, 450, { steps: 12 })
  await expect(page.locator('.intro-pointer')).toHaveCSS('opacity', '1')
  await expect.poll(() => canvas.evaluate((element: HTMLCanvasElement) => element.toDataURL())).not.toBe(idle)
  await page.waitForTimeout(240)
  await page.screenshot({ path: 'docs/screenshots/motion/introducao-onda-mouse.png' })
  await expect.poll(() => page.locator('.intro-pointer').evaluate(element => Math.abs(new DOMMatrix(getComputedStyle(element).transform).m41 - 230))).toBeLessThan(1)
  // The same marker follows across the two sections, then leaves the light section clear.
  await page.mouse.move(100, 160)
  await expect(page.locator('.intro-pointer')).toHaveCSS('opacity', '1')
  await page.mouse.move(100, 890)
  await expect(page.locator('.intro-pointer')).toHaveCSS('opacity', '0')
  await expect.poll(() => canvas.evaluate((element: HTMLCanvasElement) => element.toDataURL()), { timeout: 4000 }).toBe(idle)
  expect(await page.locator('.hero').evaluate(element => getComputedStyle(element).cursor)).not.toBe('none')
  expect(errors).toEqual([])
})

test('Preferência reduzida desliga a interação e a escolha explícita restaura o efeito', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/#inicio')
  await expect(page.locator('.intro-hover-effect')).toHaveCount(0)
  await expect.poll(() => page.locator('.intro-field').first().getAttribute('width')).not.toBeNull()
  const canvas = page.locator('.introduction .intro-field')
  const idle = await canvas.evaluate((element: HTMLCanvasElement) => element.toDataURL())
  await page.mouse.move(120, 450)
  await page.mouse.click(120, 450)
  await page.waitForTimeout(100)
  await expect(page.locator('.intro-pointer')).toHaveCSS('opacity', '0')
  expect(await canvas.evaluate((element: HTMLCanvasElement) => element.toDataURL())).toBe(idle)
  await page.getByRole('button', { name: 'Ativar animações', exact: true }).click()
  await expect(page.locator('html')).toHaveClass(/motion-enabled/)
  await page.mouse.move(120, 450)
  await expect(page.locator('.intro-pointer')).toHaveCSS('opacity', '1')
  await page.getByRole('button', { name: 'Reduzir animações', exact: true }).click()
  await expect(page.locator('.intro-pointer')).toHaveCSS('opacity', '0')
  await page.mouse.move(180, 440)
  await expect(page.locator('.intro-pointer')).toHaveCSS('opacity', '0')
})

test('Redimensionar mantém a malha dentro dos limites', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('html')).toHaveClass(/motion-enabled/)
  for (const width of [768, 390, 320, 1440]) {
    await page.setViewportSize({ width, height: 1000 })
    await expect.poll(() => page.locator('.hero .intro-field').evaluate(element => element.getBoundingClientRect().width)).toBe(width)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
})

test.describe('Dispositivo touch', () => {
  test.use({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } })
  test('Mantém apenas a textura estática', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.intro-hover-effect')).toHaveCount(0)
    await expect.poll(() => page.locator('.intro-field').first().getAttribute('width')).not.toBeNull()
    const canvas = page.locator('.hero .intro-field')
    const idle = await canvas.evaluate((element: HTMLCanvasElement) => element.toDataURL())
    await page.touchscreen.tap(150, 150)
    await expect(page.locator('.intro-pointer')).toHaveCSS('opacity', '0')
    expect(await canvas.evaluate((element: HTMLCanvasElement) => element.toDataURL())).toBe(idle)
  })
})
