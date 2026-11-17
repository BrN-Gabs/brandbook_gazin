import { gsap, motionConfig, reveal, type MotionOptions } from './MotionConfig'

/**
 * Chapters after the pillars: light, reversible entrances. Titles rise from a mask,
 * the chapter spine grows with scroll and the big number
 * drifts in parallax (desktop only). Nothing here hides content without motion.
 */
export function chapterAnimations({ desktop }: MotionOptions) {
  const replay = { replay: true, start: 'top 86%' }
  document.querySelectorAll<HTMLElement>('.chapter').forEach(chapter => {
    const header = chapter.querySelector<HTMLElement>('.chapter-header')!
    const trigger = { trigger: header, start: 'top 80%', toggleActions: 'play none none reverse' }
    gsap.from(chapter.querySelector('.chapter-title-line'), { yPercent: 110, opacity: 0, duration: .95, ease: 'power3.out', scrollTrigger: trigger })
    reveal(chapter.querySelector('.chapter-eyebrow')!, header, 0, 14, replay)
    reveal(chapter.querySelector('.chapter-intro')!, header, .15, 18, replay)
    const nav = chapter.querySelector<HTMLElement>('.chapter-nav')!
    gsap.from(nav.querySelectorAll('li'), { opacity: 0, x: -14, duration: .6, stagger: .05, ease: motionConfig.ease, scrollTrigger: { trigger: nav, start: 'top 88%', toggleActions: 'play none none reset' } })

    if (desktop) {
      gsap.fromTo(chapter.querySelector('.chapter-ghost'), { yPercent: 14 }, { yPercent: -14, ease: 'none', scrollTrigger: { trigger: chapter, start: 'top bottom', end: 'bottom top', scrub: true } })
    }

    const body = chapter.querySelector<HTMLElement>('.chapter-body')!
    // The DNA spine connecting subtopics grows as the reader goes through the chapter.
    gsap.fromTo(body, { '--spine': 0 }, { '--spine': 1, ease: 'none', scrollTrigger: { trigger: body, start: 'top 75%', end: 'bottom 70%', scrub: motionConfig.scrub } })
    body.querySelectorAll<HTMLElement>('.subsection').forEach((subsection, index) => {
      reveal(subsection, subsection, (index % 3) * .07, 26, { replay: true, start: 'top 90%' })
    })
  })
}
