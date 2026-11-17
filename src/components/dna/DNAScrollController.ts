import { gsap, ScrollTrigger } from '../../motion/MotionConfig'

// formation: particle helix assembled; entrance: base pose settled; energy/draw: opening light
// flight and luminous helix drawing; ambient: background layers (helices, bokeh, network);
// traits: staggers the white DNA points igniting one by one, from the base up.
export type DNAState = { x: number; y: number; turn: number; tilt: number; scale: number; opacity: number; formation: number; entrance: number; energy: number; draw: number; ambient: number; traits: number }

// One timeline owns the base transform AND the HTML reveals. Organic and pointer
// offsets are composed separately by the renderer, never written into this state.
export function createDNAController(root: HTMLElement, state: DNAState, reduced: boolean) {
  if (reduced) return
  const panels = Array.from(root.querySelectorAll<HTMLElement>('.dna-panel'))
  const poses = [
    { x: .24, y: 0, turn: 0, tilt: -.24, scale: 1, opacity: 1 },
    { x: -.27, y: 0, turn: 1.3, tilt: .25, scale: .85, opacity: .85 },
    { x: .26, y: 0, turn: 2.7, tilt: -.2, scale: .95, opacity: 1 },
    { x: -.27, y: .1, turn: 4.2, tilt: .28, scale: .85, opacity: 1 },
    { x: .24, y: 0, turn: Math.PI * 2, tilt: -.1, scale: 1.03, opacity: 1 },
    { x: 0, y: .5, turn: Math.PI * 2 + .8, tilt: 1.1, scale: .3, opacity: .2 },
  ]
  const build = () => {
    gsap.set(state, poses[0])
    const timeline = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: {
      id: 'dna-journey', trigger: root, start: 'top top', end: 'bottom bottom', scrub: true,
      onUpdate: self => { root.dataset.scrollProgress = self.progress.toFixed(4) },
    } })
    panels.forEach((panel, index) => {
      const position = panel.offsetTop
      if (index > 0) {
        const previous = panels[index - 1].offsetTop
        timeline.to(state, { ...poses[index], duration: position - previous }, previous)
        timeline.fromTo(panel.querySelectorAll('.dna-reveal'), { opacity: .12, y: 28 }, {
          opacity: 1, y: 0, duration: innerHeight * .35, stagger: innerHeight * .035,
        }, Math.max(0, position - innerHeight * .65))
      }
    })
    timeline.to('.dna-hero-copy', { y: -70, opacity: 0, duration: innerHeight * .65 }, 0)
  }
  // Recalculate actual panel offsets on any viewport resize, including a height-only
  // change. Reset the base pose so reverse scroll remains deterministic.
  let context = gsap.context(build, root)
  let timeout = 0
  const resize = () => {
    window.clearTimeout(timeout)
    timeout = window.setTimeout(() => {
      context.revert()
      context = gsap.context(build, root)
      ScrollTrigger.refresh()
    }, 150)
  }
  window.addEventListener('resize', resize)
  return () => { window.clearTimeout(timeout); window.removeEventListener('resize', resize); context.revert() }
}
