import { expect, type Page } from '@playwright/test'

/**
 * Skips the cinematic opening the way a visitor would (Escape). Programmatic
 * window.scrollTo() during the opening is deliberately undone by the page (it is
 * how browsers restore a stale offset on reload), so scroll-driven tests skip first.
 */
export async function skipOpening(page: Page) {
  if (await page.locator('.dna-loader').count()) await page.keyboard.press('Escape')
  await expect(page.locator('.dna-loader')).toHaveCount(0)
}
