import { test, expect } from '@playwright/test'

test.use({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' })

test('Pontos do DNA acompanham a hélice e revelam cada traço ao passar o mouse', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.dna-canvas')).toHaveAttribute('data-formation', '1.000')
  const spots = page.locator('.dna-hotspot')
  await expect(spots).toHaveCount(11)
  await expect(page.locator('.dna-hotspots')).toHaveAttribute('data-active', 'true')
  await expect(page.locator('.dna-loader')).toHaveCount(0)
  await page.screenshot({ path: 'docs/screenshots/dna/hotspots-idle.png' })

  // Sweeping the mouse across the helix scatters its particles and pulls network threads.
  for (let x = 900; x <= 1130; x += 23) await page.mouse.move(x, 430 + (x - 900) * .2, { steps: 2 })
  await page.waitForTimeout(150)
  await page.screenshot({ path: 'docs/screenshots/dna/helix-mouse.png' })

  const first = spots.first()
  const button = first.locator('button')
  await expect(button).toHaveAccessibleName('01 — Ter fé')
  const label = first.locator('.dna-hotspot-label')
  await expect(label).toHaveCSS('opacity', '0')
  await button.hover()
  await expect(label).toHaveCSS('opacity', '1')
  await expect(label).toHaveText('Ter fé')
  await page.screenshot({ path: 'docs/screenshots/dna/hotspots-hover.png' })

  // Points are re-projected as the helix turns with scroll.
  const before = await spots.nth(5).getAttribute('style')
  await page.mouse.move(10, 10)
  await page.locator('#introducao').scrollIntoViewIfNeeded()
  await expect.poll(() => spots.nth(5).getAttribute('style')).not.toBe(before)
  await page.waitForTimeout(600)
  const visible = page.locator('.dna-hotspot[data-hidden="false"] button')
  // The helix keeps turning, so point the mouse at the live position instead of waiting for stability.
  const box = (await visible.nth(4).locator('.dna-hotspot-dot').boundingBox())!
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await expect(page.locator('.dna-hotspot:has(button:hover) .dna-hotspot-label')).toHaveCSS('opacity', '1')
  await page.screenshot({ path: 'docs/screenshots/dna/hotspots-scroll.png' })
})

test('Sem WebGL os pontos não aparecem', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...rest: unknown[]) {
      return type.startsWith('webgl') ? null : (original as (...args: unknown[]) => unknown).call(this, type, ...rest)
    } as typeof original
  })
  await page.goto('/')
  await expect(page.locator('.dna-hotspots')).toBeHidden()
})
