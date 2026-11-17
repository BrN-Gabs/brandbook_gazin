import { gsap, motionConfig, reveal } from './MotionConfig'

/** Chapters 04, 05, 06, 07 and 11: the lead word by word, highlighted blocks fade in. */
export function physicalAnimations() {
  for (const selector of ['.layout-physical', '.layout-photo', '.layout-governance', '.layout-campaigns', '.layout-digital', '.layout-internal', '.layout-sponsorships', '.layout-characters', '.layout-our-brands']) leadAndReveal(document.querySelector<HTMLElement>(selector))
}
function leadAndReveal(body: HTMLElement | null) {
  const leadTitle = body?.closest('.chapter')?.querySelector('.vb-lead-title')
  if (leadTitle) reveal(leadTitle, leadTitle, 0, 18, { replay: true, start: 'top 88%' })
  const lead = body?.closest('.chapter')?.querySelector('.pos-lead')
  if (lead) gsap.from(lead.querySelectorAll('.pos-word'), { opacity: .1, y: 8, duration: .7, stagger: .015, ease: motionConfig.ease, scrollTrigger: { trigger: lead, start: 'top 88%', toggleActions: 'play none none reverse' } })
  body?.querySelectorAll<HTMLElement>('[data-cf-reveal], [data-gv-reveal], [data-cp-reveal], [data-dg-reveal], [data-in-reveal], [data-sp-reveal], [data-ch-reveal]').forEach(element => reveal(element, element, .05, 24, { replay: true, start: 'top 94%' }))
}

/**
 * Chapter 03 · Identidade Verbal. Quiet, reversible entrances so the words lead: the lead is
 * revealed word by word, titles rise from a mask, paragraphs and examples fade in, the voice
 * words and the key-message concepts enter in sequence. Only with motion enabled.
 */
export function verbalAnimations() {
  const body = document.querySelector<HTMLElement>('.layout-verbal')
  const chapter = body?.closest<HTMLElement>('.chapter')
  if (!body || !chapter) return
  const play = (trigger: Element, start = 'top 84%') => ({ trigger, start, toggleActions: 'play none none reverse' })

  const lead = chapter.querySelector('.pos-lead')
  if (lead) gsap.from(lead.querySelectorAll('.pos-word'), { opacity: .1, y: 8, duration: .7, stagger: .015, ease: motionConfig.ease, scrollTrigger: play(lead, 'top 88%') })
  const leadTitle = chapter.querySelector('.vb-lead-title')
  if (leadTitle) reveal(leadTitle, leadTitle, 0, 18, { replay: true, start: 'top 88%' })

  body.querySelectorAll<HTMLElement>('.vb-subsection').forEach(section => {
    gsap.from(section.querySelector('.vb-title-line'), { yPercent: 110, opacity: 0, duration: .9, ease: 'power3.out', scrollTrigger: play(section.querySelector('.subsection-number')!) })
  })
  body.querySelectorAll<HTMLElement>('[data-vb-reveal]').forEach(element => reveal(element, element, .06, 20, { replay: true, start: 'top 92%' }))

  // Animated through their inner spans: the buttons themselves keep their CSS layout.
  const voice = body.querySelector('.vb-voice-words')
  if (voice) gsap.from(voice.querySelectorAll('.vb-voice-name'), { opacity: 0, x: -24, duration: .7, stagger: .08, ease: motionConfig.ease, scrollTrigger: play(voice, 'top 86%') })
  const concepts = body.querySelector('.vb-messages-words')
  if (concepts) gsap.from(concepts.querySelectorAll('.vb-message-word > *'), { opacity: 0, y: 14, duration: .6, stagger: .05, ease: motionConfig.ease, scrollTrigger: play(concepts, 'top 88%') })
}
