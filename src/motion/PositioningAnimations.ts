import { gsap, motionConfig, reveal, type MotionOptions } from './MotionConfig'

/**
 * Chapter 01 · Posicionamento da Marca. Discreet, reversible entrances that explain the
 * diagrams: the lead is revealed word by word, titles rise from a mask, the differentials
 * line draws before its pillars, the value connections draw from the centre outwards and
 * the constellation links appear before its stars. Only runs with motion enabled; without
 * it, everything is simply visible. Elements placed with CSS `translate` (stars, audiences, floating
 * words) are animated through their children, so GSAP never rewrites their positioning.
 */
export function positioningAnimations({ desktop }: MotionOptions) {
  const body = document.querySelector<HTMLElement>('.layout-positioning')
  const chapter = body?.closest<HTMLElement>('.chapter')
  if (!body || !chapter) return
  const play = (trigger: Element, start = 'top 82%') => ({ trigger, start, toggleActions: 'play none none reverse' })

  const lead = chapter.querySelector('.pos-lead')
  if (lead) gsap.from(lead.querySelectorAll('.pos-word'), { opacity: .08, y: 10, duration: .8, stagger: .022, ease: motionConfig.ease, scrollTrigger: play(lead, 'top 86%') })

  body.querySelectorAll<HTMLElement>('.pos-subsection').forEach(section => {
    gsap.from(section.querySelector('.pos-title-line'), { yPercent: 110, opacity: 0, duration: .95, ease: 'power3.out', scrollTrigger: play(section.querySelector('.subsection-head')!) })
  })
  body.querySelectorAll<HTMLElement>('[data-pos-reveal]').forEach(element => reveal(element, element, .08, 22, { replay: true, start: 'top 90%' }))

  const keywords = body.querySelector('.pos-keyword-cloud')
  if (keywords) gsap.from(keywords.querySelectorAll('.pos-keyword > *'), { opacity: 0, y: 26, scale: .94, duration: .8, stagger: .07, ease: motionConfig.ease, scrollTrigger: play(keywords, 'top 86%') })

  const differentials = body.querySelector<HTMLElement>('[data-pos-diff]')
  if (differentials) {
    gsap.timeline({ scrollTrigger: play(differentials, 'top 82%') })
      .from(differentials.querySelector('.pos-diff-line'), { [desktop ? 'scaleX' : 'scaleY']: 0, transformOrigin: desktop ? 'left center' : 'center top', duration: 1.1, ease: 'power2.inOut' })
      .from(differentials.querySelectorAll('.pos-diff-item'), { opacity: 0, y: 24, duration: .7, stagger: .1, ease: motionConfig.ease }, .25)
  }

  const value = body.querySelector<HTMLElement>('[data-pos-value]')
  if (value) {
    gsap.timeline({ scrollTrigger: play(value, 'top 78%') })
      .from(value.querySelector('.pos-value-core'), { opacity: 0, scale: .86, duration: .9, ease: motionConfig.ease })
      .fromTo(value.querySelectorAll('.pos-value-link'), { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1, stagger: .12, ease: 'power2.inOut' }, .3)
      .from(value.querySelectorAll('.pos-audience > *'), { opacity: 0, y: 18, duration: .7, stagger: .12, ease: motionConfig.ease }, .7)
  }

  const constellation = body.querySelector<HTMLElement>('[data-pos-constellation]')
  if (constellation) {
    gsap.timeline({ scrollTrigger: play(constellation, 'top 80%') })
      .fromTo(constellation.querySelectorAll('.pos-sky-links line'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1, stagger: .08, ease: 'power2.inOut' })
      .from(constellation.querySelectorAll('.pos-star > *'), { opacity: 0, scale: .6, duration: .55, stagger: .08, ease: 'back.out(2)' }, .3)
  }

  const synthesis = body.querySelector<HTMLElement>('[data-pos-synthesis]')
  if (synthesis) gsap.from(synthesis.children, { opacity: 0, y: 30, duration: .9, stagger: .12, ease: motionConfig.ease, scrollTrigger: play(synthesis, 'top 85%') })
}
