import { gsap, reveal, type MotionOptions } from './MotionConfig'
import { setTreeProgress } from '../components/tree/treeState'

/**
 * Árvore da Jornada de Sucesso: the DNA comes apart and builds the tree with the scroll (roots → trunk → branches →
 * canopy → fruits), scrubbed so scrolling up takes it back step by step. Desktop pins the
 * stage for a short distance (2.2 screens) and releases the scroll once the tree is
 * complete; smaller screens build it as the stage crosses the viewport, without a pin.
 * Without motion the tree is simply complete. Returns a cleanup.
 */
export function treeAnimations({ desktop, motion }: MotionOptions & { motion: boolean }) {
  const section = document.querySelector<HTMLElement>('#arvore')
  if (!section) return () => {}
  if (!motion) { setTreeProgress(1); return () => {} }
  const pin = section.querySelector<HTMLElement>('.tree-pin')!
  const stage = section.querySelector<HTMLElement>('.tree-stage')!
  const head = section.querySelector<HTMLElement>('.tree-head')!

  const state = { progress: 0 }
  setTreeProgress(0)
  if (desktop) section.classList.add('is-pinned')
  gsap.to(state, {
    progress: 1, ease: 'none',
    onUpdate: () => setTreeProgress(state.progress),
    scrollTrigger: desktop
      ? { trigger: pin, start: 'top top', end: () => `+=${Math.round(innerHeight * 2.2)}`, pin: true, scrub: .8, invalidateOnRefresh: true, anticipatePin: 1,
          onRefresh: self => { section.dataset.pinStart = String(Math.round(self.start)); section.dataset.pinEnd = String(Math.round(self.end)) } }
      : { trigger: stage, start: 'top 90%', end: 'bottom 96%', scrub: .6, invalidateOnRefresh: true },
  })
  head.querySelectorAll<HTMLElement>(':scope > *').forEach((element, index) => reveal(element, head, index * .08, desktop ? 26 : 18, { replay: true, start: 'top 85%' }))
  section.querySelectorAll<HTMLElement>('.tree-closing > *').forEach((element, index) => reveal(element, element, index * .08, 22, { replay: true, start: 'top 90%' }))

  return () => {
    section.classList.remove('is-pinned')
    delete section.dataset.pinStart
    delete section.dataset.pinEnd
    setTreeProgress(1)
  }
}
