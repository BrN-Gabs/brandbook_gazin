import { test, expect, type Locator, type Page } from '@playwright/test'

async function positionAt(page: Page, target: Locator, viewportRatio: number) {
  const top = await target.evaluate((element, ratio) =>
    element.getBoundingClientRect().top + scrollY - innerHeight * ratio, viewportRatio)
  await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), top)
}

for (const width of [1440, 390]) {
  test(`Visão e Valores entram na área visível e repetem em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 1440 ? 1000 : 844 })
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto('/')
    await expect(page.locator('html')).toHaveClass(/motion-enabled/)

    const visionTrigger = page.locator(width === 1440 ? '.vision .purpose-line' : '.vision .purpose-text').last()
    const visionText = page.locator(width === 1440 ? '.vision .purpose-line-content' : '.vision .purpose-text').last()
    const value = page.locator('.brand-values li').last()

    // Slow reading must not consume the entrance while the target is still below the viewport.
    for (const [trigger, animated] of [[visionTrigger, visionText], [value, value]]) {
      await positionAt(page, trigger, 1.05)
      await page.waitForTimeout(1600)
      await expect(animated).toHaveCSS('opacity', '0')
      await positionAt(page, trigger, 0.7)
      await expect(animated).toHaveCSS('opacity', '1')
    }

    // Returning above the sections rearms their entrances.
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    await expect(visionText).toHaveCSS('opacity', '0')
    await expect(value).toHaveCSS('opacity', '0')
    await positionAt(page, visionTrigger, 0.7)
    await expect(visionText).toHaveCSS('opacity', '1')
    await positionAt(page, value, 0.7)
    await expect(value).toHaveCSS('opacity', '1')

    await page.emulateMedia({ reducedMotion: 'reduce' })
    await expect(page.locator('html')).not.toHaveClass(/motion-enabled/)
    await expect(visionText).toHaveCSS('opacity', '1')
    await expect(value).toHaveCSS('opacity', '1')
    await expect(value.locator('.value-label')).toHaveCSS('opacity', '1')
  })
}
