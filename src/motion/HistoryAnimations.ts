import { gsap, ScrollTrigger, reveal, type MotionOptions } from './MotionConfig'

/**
 * Nossa História. Desktop (mouse, ≥ 1100 px): the section is pinned and the mouse wheel
 * drives the horizontal rail, year by year (scrubbed, so it is fully reversible). This
 * applies with reduced motion and on low-capacity devices too: the movement only follows
 * the reader's own scroll. With full motion each frame also drifts with its own parallax.
 * Touch screens and small widths keep a native swipe carousel (no pin).
 * Returns a cleanup for what GSAP does not revert by itself.
 */
export function historyAnimations({ desktop, gentle, motion }: MotionOptions & { motion: boolean }) {
  const section = document.querySelector<HTMLElement>('#historia')
  if (!section) return () => {}
  const pin = section.querySelector<HTMLElement>('.history-pin')!
  const head = section.querySelector<HTMLElement>('.history-head')!
  const viewport = section.querySelector<HTMLElement>('.history-viewport')!
  const rail = section.querySelector<HTMLElement>('.history-rail')!
  const track = section.querySelector<HTMLElement>('.history-track')!

  if (!desktop) {
    if (motion) {
      head.querySelectorAll<HTMLElement>(':scope > *').forEach((element, index) => reveal(element, head, index * .08, 22, { replay: true, start: 'top 85%' }))
      reveal(viewport, viewport, .1, 30, { replay: true, start: 'top 90%' })
    }
    return () => {}
  }

  section.classList.add('is-pinned')
  // Reduced motion: the rail follows the wheel directly, without easing behind it.
  const scrub = motion ? .6 : true
  const distance = () => Math.max(0, rail.scrollWidth - viewport.clientWidth)
  const horizontal = gsap.to(rail, {
    x: () => -distance(), ease: 'none',
    // The scrub keeps moving after the scroll stops: keep the year indicator in sync.
    onUpdate: () => { window.dispatchEvent(new Event('history:progress')) },
    scrollTrigger: {
      trigger: pin, start: 'top top', end: () => `+=${distance()}`, pin: true, scrub,
      invalidateOnRefresh: true, anticipatePin: 1,
      onRefresh: self => { section.dataset.pinStart = String(Math.round(self.start)) },
    },
  })

  // Title enters, then gives way to the photographs (it must fade: the rail passes over it).
  if (motion) {
    gsap.timeline({ scrollTrigger: { trigger: pin, start: 'top 75%', end: 'top top', scrub: .6 } })
      .from(head.querySelectorAll(':scope > *'), { opacity: 0, y: 40, stagger: .12, ease: 'power2.out' })
  }
  gsap.to(head, { opacity: 0, x: motion ? -60 : 0, ease: 'none', scrollTrigger: { trigger: pin, start: 'top top', end: () => `+=${Math.min(innerWidth * .45, distance())}`, scrub, invalidateOnRefresh: true } })

  // Connector draws itself along the journey.
  gsap.fromTo(section.querySelector('.history-connector-progress'), { strokeDashoffset: 1 }, {
    strokeDashoffset: 0, ease: 'none',
    scrollTrigger: { trigger: pin, start: 'top top', end: () => `+=${distance()}`, scrub, invalidateOnRefresh: true },
  })

  // Parallax only with full motion on capable hardware.
  if (motion && !gentle) section.querySelectorAll<HTMLElement>('.history-item').forEach((item, index) => {
    const float = item.querySelector<HTMLElement>('.history-float')!
    const rotation = Number(item.dataset.rotation) || 0
    const lift = index % 2 ? -28 : 28
    gsap.timeline({ scrollTrigger: { trigger: item, containerAnimation: horizontal, start: 'left right', end: 'right left', scrub: true } })
      .fromTo(float, { y: lift, rotation: 0, scale: .94, opacity: .5 }, { y: 0, rotation: -rotation * .55, scale: 1, opacity: 1, ease: 'sine.out', duration: .5 })
      .to(float, { y: -lift * .6, rotation: 0, scale: .96, opacity: .6, ease: 'sine.in', duration: .5 })
  })

  // Keyboard: focusing a frame brings it to the centre (pinned content cannot scroll itself).
  const onFocus = (event: FocusEvent) => {
    const target = event.target as HTMLElement
    const item = target.closest<HTMLElement>('.history-item')
    // Only keyboard focus: a mouse click must not move the timeline.
    if (!item || !target.matches(':focus-visible') || 'restoringFocus' in section.dataset) return
    const start = Number(section.dataset.pinStart)
    if (!Number.isFinite(start)) return
    const offset = item.offsetLeft + track.offsetLeft + item.offsetWidth / 2 - viewport.clientWidth / 2
    window.scrollTo({ top: start + Math.min(distance(), Math.max(0, offset)), behavior: 'instant' })
    ScrollTrigger.update()
  }
  section.addEventListener('focusin', onFocus)

  // Photos decoded later may change widths: recalculate the travel distance.
  let timer = 0, width = rail.scrollWidth
  const onMedia = () => {
    clearTimeout(timer)
    timer = window.setTimeout(() => { if (rail.scrollWidth !== width) { width = rail.scrollWidth; ScrollTrigger.refresh() } }, 150)
  }
  addEventListener('history:media', onMedia)

  return () => {
    section.classList.remove('is-pinned')
    delete section.dataset.pinStart
    section.removeEventListener('focusin', onFocus)
    removeEventListener('history:media', onMedia)
    clearTimeout(timer)
  }
}
