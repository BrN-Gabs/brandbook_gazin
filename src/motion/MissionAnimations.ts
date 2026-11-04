import { gsap, motionConfig, reveal, type MotionOptions } from './MotionConfig'

export function missionAnimations({ desktop, tall, gentle }: MotionOptions) {
  const mission = document.querySelector<HTMLElement>('.mission')!
  reveal(mission.querySelector('.section-pill'), mission, 0, desktop ? 22 : motionConfig.mobileDistance)
  const canPin = desktop && tall && !gentle && mission.offsetHeight < innerHeight - 32
  gsap.fromTo(mission.querySelectorAll('.mission-word'), { opacity: 0.2 }, {
    opacity: 1, stagger: 0.12, duration: 0.35, ease: 'none',
    scrollTrigger: {
      id: 'mission-reading', trigger: mission,
      start: canPin ? 'top top' : 'top 55%',
      end: canPin ? () => `+=${Math.min(innerHeight * 0.65, 620)}` : 'bottom 75%',
      pin: canPin, pinSpacing: true, scrub: motionConfig.scrub, invalidateOnRefresh: true,
    },
  })
}
