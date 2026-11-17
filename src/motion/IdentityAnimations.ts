import { gsap, ScrollTrigger, motionConfig, reveal, type MotionOptions } from './MotionConfig'

/**
 * Chapter 02 · Identidade Visual. Entrances that explain rather than decorate:
 * section titles rise from a mask, the logo is revealed by a slanted wipe that
 * follows its own inclination (the file itself is never transformed), typeface
 * names appear letter by letter. Interactive demos animate through CSS, which the
 * site-wide `html:not(.motion-enabled)` rule switches off.
 */
export function identityAnimations({ desktop }: MotionOptions) {
  const chapter = document.querySelector<HTMLElement>('.layout-identity')
  if (!chapter) return

  chapter.querySelectorAll<HTMLElement>('.vi-section').forEach(section => {
    const head = section.querySelector<HTMLElement>('.vi-section-head')!
    gsap.from(section.querySelector('.vi-title-line'), {
      yPercent: 110, opacity: 0, duration: .95, ease: 'power3.out',
      scrollTrigger: { trigger: head, start: 'top 82%', toggleActions: 'play none none reverse' },
    })
    if (desktop) {
      gsap.fromTo(section.querySelector('.vi-section-number'), { yPercent: 18 }, {
        yPercent: -18, ease: 'none', scrollTrigger: { trigger: section, start: 'top bottom', end: 'top top', scrub: true },
      })
    }
  })

  chapter.querySelectorAll<HTMLElement>('[data-vi-reveal]').forEach((element, index) => {
    reveal(element, element, (index % 3) * .06, 24, { replay: true, start: 'top 97%' })
  })

  // Opening: slanted wipe along the logo's inclination, then a light sweep across the plate.
  const plate = chapter.querySelector<HTMLElement>('.vi-hero-plate')
  const logo = plate?.querySelector<HTMLElement>('.vi-hero-logo')
  if (plate && logo) {
    gsap.timeline({
      scrollTrigger: {
        trigger: plate, start: 'top 78%', toggleActions: 'play none none reverse',
        onEnter: () => { plate.classList.remove('is-swept'); void plate.offsetWidth; plate.classList.add('is-swept') },
      },
    })
      .from(plate, { opacity: 0, y: 40, scale: .97, duration: .9, ease: motionConfig.ease })
      .fromTo(logo, { clipPath: 'polygon(0% 0%, 0% 0%, -30% 100%, -30% 100%)' }, { clipPath: 'polygon(0% 0%, 130% 0%, 100% 100%, -30% 100%)', duration: 1.25, ease: 'power3.inOut' }, .25)
  }

  chapter.querySelectorAll<HTMLElement>('.vi-face-name').forEach(name => {
    gsap.from(name.querySelectorAll('.vi-char'), {
      yPercent: 70, opacity: 0, duration: .7, stagger: .035, ease: 'power3.out',
      scrollTrigger: { trigger: name, start: 'top 88%', toggleActions: 'play none none reset' },
    })
  })

  // Subnav appears once the reader enters the chapter body.
  const subnav = chapter.querySelector<HTMLElement>('.vi-subnav')
  if (subnav) gsap.from(subnav, { opacity: 0, y: -12, duration: .6, ease: motionConfig.ease, scrollTrigger: { trigger: chapter, start: 'top 70%', toggleActions: 'play none none reverse' } })

  // Images inside the chapter may change layout height once decoded.
  chapter.querySelectorAll('img').forEach(image => {
    if (!image.complete) image.addEventListener('load', () => ScrollTrigger.refresh(), { once: true })
  })
}
