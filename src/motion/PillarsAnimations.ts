import { gsap, motionConfig, reveal, type MotionOptions } from './MotionConfig'

export function pillarsAnimations({ desktop, wide }: MotionOptions) {
  const section = document.querySelector<HTMLElement>('#pilares')!
  const heading = section.querySelector('.pillars-heading')!
  reveal(heading, heading, 0, motionConfig.distance, { replay: true, start: 'top 85%' })
  const pillars = section.querySelectorAll<HTMLElement>('.pillar')
  pillars.forEach((pillar, index) => {
    const delay = desktop && wide ? index * 0.1 : 0
    // Each part enters independently; a tall pillar must not reveal paragraphs offscreen.
    const entrances = [
      ['.pillar-number', 30], ['h3', 24], ['.pillar-attributes', 16], ['.pillar-description', 20],
    ] as const
    entrances.forEach(([selector, distance]) => {
      const element = pillar.querySelector(selector)!
      reveal(element, element, delay, distance, { replay: true, start: 'top 85%' })
    })
    const line = pillar.querySelector('.pillar-line')!
    gsap.from(line, {
      scaleX: 0, duration: 0.9, ease: motionConfig.ease, delay,
      scrollTrigger: { trigger: line, start: 'top 85%', toggleActions: 'play none none reset' },
    })
    const icon = pillar.querySelector('.pillar-icon-stage')!
    reveal(icon, icon, 0.14, 16, { replay: true })
  })
  if (desktop && wide) {
    // Long institutional paragraphs stay in normal flow. Only emphasis travels across columns.
    const story = gsap.timeline({ scrollTrigger: {
      trigger: section.querySelector('.pillars-grid'), start: 'top 58%', end: 'bottom 78%', scrub: motionConfig.scrub,
    } })
    pillars.forEach((pillar, index) => {
      story.to(pillar, { '--pillar-emphasis': 1, duration: 0.6, ease: 'none' }, index * 0.65)
      if (index < pillars.length - 1) story.to(pillar, { '--pillar-emphasis': 0.2, duration: 0.5, ease: 'none' }, (index + 1) * 0.65)
    })
  }
  const note = section.querySelector('.pillars-note')!
  reveal(note, note, 0, 16, { replay: true })
}
