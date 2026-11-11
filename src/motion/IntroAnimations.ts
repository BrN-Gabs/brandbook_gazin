import { gsap, motionConfig, type MotionOptions } from './MotionConfig'

export function introAnimations({ desktop, gentle }: MotionOptions) {
  const intro = document.querySelector<HTMLElement>('.introduction')!
  // The initial reveal belongs to BrandbookPreloader. Reinitializing scroll motion
  // (preference changes / breakpoints) must not hide or replay the introduction.
  if (!desktop || gentle) return
  const exit = gsap.timeline({ scrollTrigger: {
    trigger: '#inicio', start: 'top top', endTrigger: intro, end: 'bottom top', scrub: motionConfig.scrub,
  } })
  exit.to('.hero-logo-stage', { y: -65, ease: 'none' }, 0)
  gsap.to('#introduction-title', {
    opacity: 0.28, y: -24, ease: 'none',
    scrollTrigger: { trigger: intro, start: 'top 10%', end: 'bottom top', scrub: motionConfig.scrub },
  })
  gsap.to('.introduction-grid', {
    y: -22, ease: 'none',
    scrollTrigger: { trigger: intro, start: 'top top', end: 'bottom top', scrub: motionConfig.scrub },
  })
}
