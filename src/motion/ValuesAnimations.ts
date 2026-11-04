import { gsap, motionConfig, reveal, type MotionOptions } from './MotionConfig'

export function valuesAnimations({ desktop }: MotionOptions) {
  const section = document.querySelector<HTMLElement>('#valores')!
  const heading = section.querySelector('.section-pill')!
  reveal(heading, heading, 0, motionConfig.distance, { replay: true })
  section.querySelectorAll<HTMLElement>('li').forEach((item, index) => {
    reveal(item, item, desktop ? index * 0.06 : 0, desktop ? 28 : 18, { replay: true, start: 'top 85%' })
    gsap.fromTo(item.querySelector('.value-label'), { opacity: 0.56 }, {
      opacity: 1, ease: 'none',
      scrollTrigger: { trigger: item, start: 'top 85%', end: 'top 48%', scrub: motionConfig.scrub },
    })
    gsap.fromTo(item.querySelector('.value-marker'), { scale: 0.72 }, {
      scale: 1, ease: 'none',
      scrollTrigger: { trigger: item, start: 'top 85%', end: 'top 48%', scrub: motionConfig.scrub },
    })
  })
}
