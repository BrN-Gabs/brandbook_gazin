import { gsap, motionConfig, type MotionOptions } from './MotionConfig'

export function introAnimations({ desktop, gentle }: MotionOptions) {
  const intro = document.querySelector<HTMLElement>('.introduction')!
  const columnLayout = window.innerWidth >= 768
  const opening = gsap.timeline({ defaults: { ease: motionConfig.ease, duration: motionConfig.reveal } })
  opening.from('.hero-title-motion', { opacity: 0, y: 20 }, 0)
    .from('.hero-logo', { opacity: 0, scale: 0.94, duration: 1.1 }, 0.18)

  // Landing on a deep link must not replay an opening above the viewport.
  if (window.scrollY > 100 || (location.hash && location.hash !== '#inicio')) opening.progress(1)

  gsap.from('.intro-letter', {
    opacity: 0, yPercent: 105, stagger: 0.065, duration: motionConfig.typography, ease: motionConfig.ease,
    delay: window.scrollY < 100 && (!location.hash || location.hash === '#inicio') ? 0.55 : 0,
    scrollTrigger: { trigger: '#introduction-title', start: 'top 93%', once: true },
  })

  intro.querySelectorAll<HTMLElement>('.introduction-column').forEach((column, index) => {
    const timeline = gsap.timeline({
      defaults: { duration: motionConfig.reveal, ease: motionConfig.ease },
      scrollTrigger: { trigger: column, start: 'top 94%', once: true },
      delay: desktop ? 0.7 + index * 0.12 : 0,
    })
    timeline.from(column.querySelector('.intro-divider'), { scaleY: columnLayout ? 0 : 1, scaleX: columnLayout ? 1 : 0 }, 0)
      .from(column.querySelector('.column-heading'), { opacity: 0, y: 22 }, 0.08)
      .from(column.querySelector('.body-copy'), { opacity: 0, y: 18 }, 0.2)
  })

  if (!desktop || gentle) return
  const exit = gsap.timeline({ scrollTrigger: {
    trigger: '#inicio', start: 'top top', endTrigger: intro, end: 'bottom top', scrub: motionConfig.scrub,
  } })
  exit.to('.hero-title', { y: -35, ease: 'none' }, 0)
    .to('.hero-logo-stage', { y: -65, ease: 'none' }, 0)
  gsap.to('#introduction-title', {
    opacity: 0.28, y: -24, ease: 'none',
    scrollTrigger: { trigger: intro, start: 'top 10%', end: 'bottom top', scrub: motionConfig.scrub },
  })
  gsap.to('.introduction-grid', {
    y: -22, ease: 'none',
    scrollTrigger: { trigger: intro, start: 'top top', end: 'bottom top', scrub: motionConfig.scrub },
  })
}
