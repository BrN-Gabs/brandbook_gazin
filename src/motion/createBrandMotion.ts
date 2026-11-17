import { gsap, ScrollTrigger, motionConfig, reveal } from './MotionConfig'
import { createScrollManager } from './ScrollManager'
import { missionAnimations } from './MissionAnimations'
import { visionAnimations } from './VisionAnimations'
import { valuesAnimations } from './ValuesAnimations'
import { pillarsAnimations } from './PillarsAnimations'
import { chapterAnimations } from './ChapterAnimations'
import { identityAnimations } from './IdentityAnimations'
import { historyAnimations } from './HistoryAnimations'
import { treeAnimations } from './TreeAnimations'
import { positioningAnimations } from './PositioningAnimations'
import { physicalAnimations, verbalAnimations } from './VerbalAnimations'
import type { MotionPreference } from './useMotionPreference'

export function createBrandMotion(preference: MotionPreference = 'system', alignInitialHash = true) {
  const media = gsap.matchMedia()
  const root = document.documentElement
  // Refresh can reinitialize fromTo() start values. Preserve the unanimated styles
  // so media changes restore full contrast even mid-scrub.
  const scrubSelector = '.mission-word, .value-label, .value-marker'
  const originalStyles = Array.from(document.querySelectorAll<HTMLElement>(scrubSelector), element => ({ element, style: element.getAttribute('style') }))
  const restoreStyles = () => originalStyles.forEach(({ element, style }) => {
    if (style === null) element.removeAttribute('style')
    else element.setAttribute('style', style)
  })
  ScrollTrigger.saveStyles(scrubSelector)
  let firstSetup = alignInitialHash
  const motionQuery = preference === 'full' ? 'all' : preference === 'reduced' ? 'not all' : motionConfig.queries.motion
  try {
    media.add({ ...motionConfig.queries, motion: motionQuery, all: 'all' }, context => {
      const { motion, desktop, wide, tall } = context.conditions!
      const hardware = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } }
      const gentle = !!hardware.connection?.saveData || (hardware.deviceMemory !== undefined && hardware.deviceMemory <= 4) || navigator.hardwareConcurrency <= 4
      const scroll = createScrollManager(motion && desktop && !gentle, preference === 'full')
      const cleanups: (() => void)[] = []
      try {
        const options = { desktop, wide, tall, gentle }
        if (motion) {
          root.classList.add('motion-enabled')
          missionAnimations(options)
          visionAnimations(options)
          valuesAnimations(options)
          pillarsAnimations(options)
        }
        // Wheel-driven timeline on every desktop, even with reduced motion. Its pin must
        // exist before later triggers measure their positions.
        cleanups.push(historyAnimations({ ...options, motion }))
        cleanups.push(treeAnimations({ ...options, motion }))
        if (motion) {
          chapterAnimations(options)
          positioningAnimations(options)
          verbalAnimations()
          physicalAnimations()
          identityAnimations(options)
          document.querySelectorAll<HTMLElement>('[data-reveal]').forEach(element => {
            reveal(element, element, Number(element.dataset.revealDelay) || 0)
          })
        }
        gsap.fromTo('.scroll-progress > span', { scaleX: 0 }, {
          scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true },
        })
        const progress = document.querySelector<HTMLElement>('.scroll-progress')!
        const tokens = getComputedStyle(root)
        const brand = tokens.getPropertyValue('--color-brand').trim()
        const white = tokens.getPropertyValue('--gazin-white').trim() || '#FFFFFF'
        document.querySelectorAll<HTMLElement>('.hero, .introduction, .mission, .vision, #valores, #pilares, #historia, #arvore, .chapter, .site-footer').forEach(section => {
          ScrollTrigger.create({ trigger: section, start: 'top top', end: 'bottom top',
            onToggle: self => { if (self.isActive) progress.style.color = section.classList.contains('blue-section') ? white : brand },
          })
        })
        ScrollTrigger.refresh()
        if (firstSetup) { scroll.alignHash(); firstSetup = false }
      } catch (error) {
        cleanups.forEach(cleanup => cleanup())
        scroll.destroy()
        root.classList.remove('motion-enabled')
        throw error
      }
      return () => {
        cleanups.forEach(cleanup => cleanup())
        scroll.destroy()
        root.classList.remove('motion-enabled')
      }
    })
  } catch (error) {
    media.revert()
    restoreStyles()
    throw error
  }
  return () => { media.revert(); restoreStyles() }
}
