import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { brandContent } from '../data/brandContent'
import { usePreloader } from '../motion/usePreloader'
import '../styles/preloader.css'

gsap.registerPlugin(CustomEase)
CustomEase.create('brand-travel', '0.76,0,0.24,1')
CustomEase.create('brand-settle', '0.22,1,0.36,1')

const outlinePath = 'M104 3 H582 C595 3 600 18 593 30 L524 147 Q512 167 493 167 H18 C5 167 0 152 7 140 L76 23 Q88 3 104 3 Z'

function LoadingOutline() {
  return <svg className="loading-outline" viewBox="0 0 600 170" fill="none" aria-hidden="true">
    <path className="loading-track" d={outlinePath} pathLength="100" />
    <path className="loading-segments" d={outlinePath} pathLength="100" strokeDasharray="14 36 14 36" />
  </svg>
}

export function BrandbookPreloader({ reduced, onComplete }: { reduced: boolean; onComplete: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const loading = usePreloader()
  const state = useRef(loading)
  const reducedRef = useRef(reduced)
  const finishRef = useRef(onComplete)
  const skip = useRef<() => void>(() => {})
  state.current = loading
  reducedRef.current = reduced
  finishRef.current = onComplete

  useLayoutEffect(() => {
    const overlay = root.current!
    const page = document.getElementById('brandbook-page')!
    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.documentElement.style.overflow
    const previousBodyOverflow = document.body.style.overflow
    const previousInert = page.inert
    const scrollPosition = { x: scrollX, y: scrollY }
    page.inert = true
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    document.documentElement.removeAttribute('data-brandbook-boot')
    overlay.focus({ preventScroll: true })

    let finished = false
    let stage = 'loading'
    let frame = 0
    let previousTime = performance.now()
    let displayed = 0
    let rotation = 0
    const started = previousTime
    const count = overlay.querySelector<HTMLElement>('.loading-percentage')!
    const progressbar = overlay.querySelector<HTMLElement>('[role="progressbar"]')!
    const segments = overlay.querySelector<SVGPathElement>('.loading-segments')!
    const status = overlay.querySelector<HTMLElement>('[role="status"]')!
    const logo = overlay.querySelector<HTMLElement>('.preloader-logo')!
    let timeline: gsap.core.Timeline | undefined
    let context: gsap.Context

    const restore = () => {
      page.inert = previousInert
      document.documentElement.style.overflow = previousOverflow
      document.body.style.overflow = previousBodyOverflow
      window.scrollTo({ left: scrollPosition.x, top: scrollPosition.y, behavior: 'instant' })
      if (previousFocus?.isConnected) {
        const tabIndex = previousFocus.getAttribute('tabindex')
        if (previousFocus === document.body) previousFocus.tabIndex = -1
        previousFocus.focus({ preventScroll: true })
        if (tabIndex === null) previousFocus.removeAttribute('tabindex')
        else previousFocus.setAttribute('tabindex', tabIndex)
      }
    }
    const finish = () => {
      if (finished) return
      finished = true
      cancelAnimationFrame(frame)
      timeline?.kill()
      // Revert restores the initial blue backdrop. Keep it out of rendering
      // while React schedules the unmount, including reduced motion / skip exits.
      // Use an attribute so GSAP's inline-style cleanup cannot undo this guard.
      overlay.hidden = true
      context.revert()
      restore()
      finishRef.current()
    }
    const setStage = (next: string) => { stage = next; overlay.dataset.stage = next }
    const quickExit = () => {
      if (finished || stage === 'fallback') return
      setStage('fallback')
      timeline?.kill()
      context.add(() => {
        gsap.to(overlay, { opacity: 0, duration: 0.16, onComplete: finish })
      })
    }
    skip.current = quickExit
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); quickExit() }
      // Only the skip action belongs to the opening's focus scope.
      if (event.key === 'Tab') {
        event.preventDefault()
        overlay.querySelector<HTMLButtonElement>('button')!.focus()
      }
    }
    overlay.addEventListener('keydown', onKey)
    context = gsap.context(() => {
      gsap.fromTo('.loading-track', { strokeDasharray: 100, strokeDashoffset: 100 }, {
        strokeDashoffset: 0, duration: reducedRef.current ? 0 : 0.38, ease: 'brand-settle',
      })
      gsap.set(['.hero-logo', '.intro-word', '.introduction-column'], { opacity: 0 })
    })

    const reveal = () => {
      setStage('complete')
      status.textContent = 'Brandbook pronto.'
      if (reducedRef.current) { quickExit(); return }
      const slowLoad = performance.now() - started > 1800
      // The same two words travel from the storyboard into the permanent title.
      const wordDestination = (word: 'brand' | 'book') => {
        const source = overlay.querySelector<HTMLElement>(`.preloader-${word}`)!
        const target = document.querySelector<HTMLElement>(`.intro-word-${word}`)!
        return {
          x: () => target.getBoundingClientRect().left - source.offsetLeft,
          y: () => target.getBoundingClientRect().top - source.offsetTop,
          scale: () => target.getBoundingClientRect().width / source.offsetWidth,
          transformOrigin: 'top left', duration: 1.02, ease: 'brand-travel',
        }
      }
      context.add(() => {
        timeline = gsap.timeline({ onComplete: finish })
        timeline.addLabel('identity', 0.24)
          .call(() => setStage('identity'), [], 'identity')
          .to('.preloader-brand', { x: 0, duration: 0.82, ease: 'brand-travel' }, 'identity')
          .to('.preloader-book', { x: 0, duration: 0.82, ease: 'brand-travel' }, 'identity+=0.06')
          .to('.loading-percentage', { opacity: 0, duration: 0.24 }, 'identity+=0.08')
          .to('.loading-outline', { opacity: 0, duration: 0.4 }, 'identity+=0.18')
          .fromTo(logo, { opacity: 0, y: 12, clipPath: 'inset(0 100% 0 0)' }, {
            opacity: 1, y: 0, clipPath: 'inset(0 0% 0 0)', duration: 0.64, ease: 'brand-settle',
          }, 'identity+=0.23')
          .call(() => setStage('composition'))
          .addLabel('exit', `+=${slowLoad ? 0.42 : 0.55}`)
          .call(() => setStage('transition'), [], 'exit')
          .to('.preloader-brand', wordDestination('brand'), 'exit')
          .to('.preloader-book', wordDestination('book'), 'exit')
          .to('.preloader-backdrop', { backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--color-brand').trim(), duration: 0.65, ease: 'power2.inOut' }, 'exit')
          // Read destination once at the transition boundary; only transforms animate.
          .to(logo, {
            x: () => {
              const target = document.querySelector<HTMLElement>('.hero-logo')!.getBoundingClientRect()
              return target.left + target.width / 2 - innerWidth / 2
            },
            y: () => {
              const target = document.querySelector<HTMLElement>('.hero-logo')!.getBoundingClientRect()
              return target.top + target.height / 2 - innerHeight / 2
            },
            scale: () => document.querySelector<HTMLElement>('.hero-logo')!.getBoundingClientRect().width / logo.offsetWidth,
            duration: 0.92, ease: 'brand-travel',
          }, 'exit')
          .to('.preloader-backdrop', { opacity: 0, duration: 0.42 }, 'exit+=0.54')
          .set('.intro-word', { opacity: 1 }, 'exit+=1.02')
          .set('.preloader-word', { opacity: 0 }, 'exit+=1.02')
          .fromTo('.introduction-column', { y: 12 }, { y: 0, opacity: 1, stagger: 0.07, duration: 0.45, ease: 'brand-settle' }, 'exit+=0.85')
          .set('.hero-logo', { opacity: 1 }, 'exit+=0.92')
          .set(logo, { opacity: 0 }, 'exit+=0.92')
      })
    }

    const tick = (now: number) => {
      const delta = Math.min(now - previousTime, 64)
      previousTime = now
      if (state.current.state === 'fallback' || (reducedRef.current && stage !== 'loading')) quickExit()
      if (stage === 'loading') {
        displayed += (state.current.progress - displayed) * (1 - Math.exp(-delta / (reducedRef.current ? 30 : 105)))
        const value = state.current.state === 'ready' && displayed > 99.4 ? 100 : Math.floor(displayed)
        count.textContent = `${value}%`
        progressbar.setAttribute('aria-valuenow', String(value))
        if (value === 100) reveal()
      }
      if (stage === 'loading' || stage === 'complete' || stage === 'identity') {
        rotation += delta * (stage === 'loading' ? 0.006 : 0.001)
        segments.style.strokeDashoffset = String(-25 - displayed * 0.5 - (reducedRef.current ? 0 : rotation))
      }
      if (!finished) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    // A resize invalidates the logo's measured destination: settle without a jump to stale coordinates.
    const onResize = () => { if (stage === 'transition') quickExit() }
    window.addEventListener('resize', onResize)
    return () => {
      finished = true
      cancelAnimationFrame(frame)
      timeline?.kill()
      context.revert()
      restore()
      overlay.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return <div ref={root} className="brandbook-preloader" data-stage="loading" role="dialog" aria-modal="true" aria-label="Abertura do Brandbook Gazin" tabIndex={-1}>
    <div className="preloader-backdrop" />
    <div className="preloader-word preloader-brand" aria-hidden="true">brand</div>
    <div className="preloader-word preloader-book" aria-hidden="true">book</div>
    <div className="preloader-center" role="progressbar" aria-label="Preparando o Brandbook" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}>
      <LoadingOutline />
      <span className="loading-percentage" aria-hidden="true">0%</span>
      <img className="preloader-logo" src={`${import.meta.env.BASE_URL}${brandContent.meta.logoSrc}`} width="2974" height="835" alt="" fetchPriority="high" />
    </div>
    <span className="sr-only" role="status">Preparando o Brandbook Gazin.</span>
    <button className="preloader-skip" onClick={() => skip.current()}>Pular abertura</button>
  </div>
}
