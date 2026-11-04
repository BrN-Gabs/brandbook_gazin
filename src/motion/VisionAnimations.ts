import { gsap, motionConfig, reveal, type MotionOptions } from './MotionConfig'

export function visionAnimations({ desktop, gentle }: MotionOptions) {
  const vision = document.querySelector<HTMLElement>('.vision')!
  const heading = vision.querySelector('.section-pill')!
  reveal(heading, heading, 0, 20, { replay: true })
  // Trigger each line from its stable mask, so lower lines cannot finish offscreen.
  if (desktop) {
    vision.querySelectorAll('.purpose-line').forEach(line => {
      gsap.from(line.querySelector('.purpose-line-content'), {
        yPercent: 105, opacity: 0, duration: motionConfig.typography, ease: motionConfig.ease,
        scrollTrigger: { trigger: line, start: 'top 90%', toggleActions: 'play none none reset' },
      })
    })
  } else {
    const text = vision.querySelector('.purpose-text')!
    gsap.from(text, {
      opacity: 0, y: motionConfig.mobileDistance, duration: motionConfig.typography, ease: motionConfig.ease,
      scrollTrigger: { trigger: text, start: 'top 90%', toggleActions: 'play none none reset' },
    })
  }
  if (!desktop || gentle) return
  // The panel animates behind the content; no mask ever cuts into the statement.
  gsap.fromTo(vision.querySelector('.vision-panel'), { scaleY: 0.82 }, {
    scaleY: 1, ease: 'none', scrollTrigger: { trigger: vision, start: 'top bottom', end: 'top 50%', scrub: true },
  })
  gsap.fromTo(vision.querySelector('.vision-arc'), { y: 45, rotation: -12, scale: 0.96, opacity: 0.5 }, {
    y: -65, rotation: 22, scale: 1.06, opacity: 1, ease: 'none',
    scrollTrigger: { trigger: vision, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
  })
  gsap.to(vision.querySelector('.page-container'), {
    y: -22, ease: 'none', scrollTrigger: { trigger: vision, start: 'bottom 65%', end: 'bottom top', scrub: motionConfig.scrub },
  })
}
