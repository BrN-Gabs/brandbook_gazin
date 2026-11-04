import { test, expect, type Locator, type Page } from '@playwright/test'

async function positionAt(page: Page, target: Locator, ratio: number) {
  const top = await target.evaluate((element, viewportRatio) => element.getBoundingClientRect().top + scrollY - innerHeight * viewportRatio, ratio)
  await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), top)
}

for (const width of [1440, 768, 390]) {
  test(`Pilares revelam o conteúdo visível e repetem a entrada em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 })
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto('/')
    await expect(page.locator('html')).toHaveClass(/motion-enabled/)
    const heading = page.locator('.pillars-heading')
    const title = page.locator('.pillar h3').first()
    const description = page.locator('.pillar-description').first()

    // Slow scrolling must not consume the paragraph's entrance below the screen.
    await positionAt(page, description, 1.05)
    await page.waitForTimeout(1600)
    await expect(description).toHaveCSS('opacity', '0')
    await positionAt(page, description, 0.7)
    await expect(description).toHaveCSS('opacity', '1')
    await expect(heading).toHaveCSS('opacity', '1')
    await expect(title).toHaveCSS('opacity', '1')

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    await expect(description).toHaveCSS('opacity', '0')
    await expect(heading).toHaveCSS('opacity', '0')
    await expect(title).toHaveCSS('opacity', '0')
    await positionAt(page, description, 0.7)
    await expect(description).toHaveCSS('opacity', '1')
    await expect(title).toHaveCSS('opacity', '1')

    await page.emulateMedia({ reducedMotion: 'reduce' })
    await expect(page.locator('html')).not.toHaveClass(/motion-enabled/)
    for (const selector of ['.pillars-heading', '.pillar-number', '.pillar h3', '.pillar-attributes', '.pillar-description', '.pillar-icon-stage', '.pillars-note']) {
      for (const element of await page.locator(selector).all()) await expect(element).toHaveCSS('opacity', '1')
    }
  })
}
