import { test, expect } from '@playwright/test'
import { skipOpening } from './helpers'

test.use({ reducedMotion: 'no-preference', viewport: { width: 1440, height: 900 } })

test('Missão e Visão: moldura grande e interativa ao lado de cada frase, sem os círculos', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
  await page.goto('/')
  await skipOpening(page)
  await expect(page.locator('html')).toHaveClass(/motion-enabled/)
  await expect(page.locator('.vision-arc')).toHaveCount(0)
  // The mission still pins while its words are read.
  await expect(page.locator('.pin-spacer')).toHaveCount(3)
  for (const id of ['missao', 'visao']) {
    const stage = page.locator(`#${id} .purpose-photo-stage`)
    await stage.evaluate(element => element.scrollIntoView({ behavior: 'instant', block: 'center' }))
    await page.waitForTimeout(900)
    await page.screenshot({ path: `docs/screenshots/proposito-${id}.png` })
    const box = (await stage.boundingBox())!
    // Large, vertical 4:5, beside the statement.
    expect(box.width).toBeGreaterThan(380)
    expect(box.height / box.width).toBeCloseTo(1.25, 1)
    const copy = (await page.locator(`#${id} .purpose-copy`).boundingBox())!
    expect(box.x).toBeGreaterThan(copy.x + copy.width - 1)
    // The chosen photo is in the frame (mission: family; vision: employee), no leftover circle shapes.
    const photo = stage.locator('img')
    await expect(photo).toHaveAttribute('src', new RegExp(id === 'missao' ? 'missao-familia' : 'visao-colaboradora'))
    await expect.poll(() => photo.evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
    await expect(stage.locator('.purpose-photo-empty')).toHaveCount(0)
    expect(await stage.locator('.purpose-photo-window').evaluate(element => getComputedStyle(element).borderRadius)).not.toBe('50%')
    // Interactive: tilts towards the cursor and goes back when it leaves.
    await page.mouse.move(box.x + box.width * .85, box.y + box.height * .2)
    await expect.poll(() => stage.locator('.purpose-photo-frame').evaluate(element => getComputedStyle(element).transform)).not.toBe('none')
    await page.mouse.move(5, 450)
    await expect.poll(() => stage.evaluate(element => element.style.getPropertyValue('--ry'))).toBe('')
  }
  expect(errors).toEqual([])
})

test('Celular: moldura abaixo da frase, sem rolagem lateral', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await skipOpening(page)
  for (const id of ['missao', 'visao']) {
    const stage = page.locator(`#${id} .purpose-photo-stage`)
    await stage.evaluate(element => element.scrollIntoView({ behavior: 'instant', block: 'center' }))
    const box = (await stage.boundingBox())!
    const copy = (await page.locator(`#${id} .purpose-copy`).boundingBox())!
    expect(box.y).toBeGreaterThan(copy.y + copy.height - 1)
    expect(box.x + box.width).toBeLessThanOrEqual(390)
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})
