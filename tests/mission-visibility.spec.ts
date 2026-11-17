import { test, expect } from '@playwright/test'
import { skipOpening } from './helpers'

// Regression: the sticky 3D stage of the opening extends one viewport past the
// introduction and used to paint over "Nossa Missão" whenever the section is not
// pinned (viewports under 900px tall, touch devices, modest hardware).
for (const viewport of [{ width: 1440, height: 800 }, { width: 1366, height: 680 }, { width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
  test(`Nossa Missão fica visível e por cima do cenário 3D em ${viewport.width}×${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto('/')
    await skipOpening(page)
    const mission = page.locator('.mission')
    const top = await mission.evaluate(el => el.getBoundingClientRect().top + scrollY)
    await page.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), top)
    await page.waitForTimeout(1000)
    await expect(mission.locator('.section-pill')).toBeInViewport()
    // The 3D layer ignores pointer hit-testing, so assert the cause: the introduction clips its
    // sticky stage at its own edge, and the visible part of the stage ends before Mission starts.
    const geometry = await page.evaluate(() => {
      const experience = document.querySelector('.dna-experience')!
      return { clip: getComputedStyle(experience).overflowY, end: experience.getBoundingClientRect().bottom, mission: document.querySelector('.mission')!.getBoundingClientRect().top }
    })
    expect(geometry.clip).toBe('clip')
    expect(geometry.end).toBeLessThanOrEqual(geometry.mission + 1)
    for (const target of ['.section-pill', '.mission-word']) {
      const box = (await mission.locator(target).first().boundingBox())!
      const hit = await page.evaluate(([x, y]) => !!document.elementFromPoint(x, y)?.closest('.mission'), [box.x + box.width / 2, box.y + box.height / 2])
      expect(hit, `${target} must be the topmost element`).toBe(true)
    }
    await page.screenshot({ path: `docs/screenshots/missao-${viewport.width}x${viewport.height}.png` })
  })
}
