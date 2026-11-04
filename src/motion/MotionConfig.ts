import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
gsap.ticker.lagSmoothing(0)

export { gsap, ScrollTrigger }
export const motionConfig = {
  ease: 'power3.out',
  reveal: 0.8,
  typography: 1,
  stagger: 0.09,
  distance: 32,
  mobileDistance: 18,
  scrub: 0.45,
  queries: {
    motion: '(prefers-reduced-motion: no-preference)',
    desktop: '(min-width: 1100px) and (hover: hover) and (pointer: fine)',
    pointer: '(hover: hover) and (pointer: fine)',
    wide: '(min-width: 1280px)',
    tall: '(min-height: 900px)',
  },
} as const

export type MotionOptions = { desktop: boolean; wide: boolean; tall: boolean; gentle: boolean }

export function reveal(target: gsap.TweenTarget, trigger: Element, delay = 0, distance: number = motionConfig.distance, options: { replay?: boolean; start?: string } = {}) {
  return gsap.from(target, {
    opacity: 0, y: distance, duration: motionConfig.reveal, ease: motionConfig.ease, delay,
    scrollTrigger: {
      trigger, start: options.start ?? 'top 92%', once: !options.replay,
      toggleActions: options.replay ? 'play none none reset' : 'play none none none',
    },
  })
}
