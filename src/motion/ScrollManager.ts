import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { gsap, ScrollTrigger } from './MotionConfig'

export function createScrollManager(smooth: boolean, explicitlyEnabled = false) {
  const lenis = smooth ? new Lenis({
    autoRaf: false, lerp: 0.12, smoothWheel: true, syncTouch: false,
    anchors: false, stopInertiaOnNavigate: true, respectReducedMotion: !explicitlyEnabled,
  }) : undefined
  const tick = (time: number) => lenis?.raf(time * 1000)
  if (lenis) {
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(tick)
  }

  const temporaryFocusTargets = new Set<HTMLElement>()
  function restoreTabIndex(event: FocusEvent) {
    const target = event.currentTarget as HTMLElement
    target.removeAttribute('tabindex')
    temporaryFocusTargets.delete(target)
  }
  function focusTarget(target: HTMLElement) {
    const temporary = !target.hasAttribute('tabindex')
    if (temporary) {
      target.tabIndex = -1
      temporaryFocusTargets.add(target)
      target.addEventListener('blur', restoreTabIndex, { once: true })
    }
    target.focus({ preventScroll: true })
  }

  function targetFromHash(hash: string) {
    try { return document.getElementById(decodeURIComponent(hash.slice(1))) } catch { return null }
  }

  function onAnchor(event: MouseEvent) {
    if (!lenis || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null
    if (!anchor || anchor.target || anchor.hasAttribute('download') || anchor.classList.contains('skip-link')) return
    const url = new URL(anchor.href, location.href)
    if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search || !url.hash) return
    const target = targetFromHash(url.hash)
    if (!target) return
    event.preventDefault()
    if (location.hash !== url.hash) history.pushState(null, '', url.hash)
    // Keyboard focus and native anchor jumps can precede Lenis's scroll event.
    lenis.resize()
    lenis.scrollTo(target, { duration: 0.85, onComplete: () => focusTarget(target) })
  }

  const alignHash = () => {
    const target = targetFromHash(location.hash)
    if (target) {
      if (lenis) { lenis.resize(); lenis.scrollTo(target, { immediate: true }) }
      else target.scrollIntoView({ behavior: 'instant' })
      ScrollTrigger.update()
    }
  }
  const onRefresh = () => lenis?.resize()
  const onVisibility = () => { if (!document.hidden) { lenis?.resize(); ScrollTrigger.update() } }
  document.addEventListener('click', onAnchor)
  document.addEventListener('visibilitychange', onVisibility)
  window.addEventListener('hashchange', alignHash)
  ScrollTrigger.addEventListener('refresh', onRefresh)
  return {
    alignHash,
    destroy() {
      temporaryFocusTargets.forEach(target => {
        target.removeEventListener('blur', restoreTabIndex)
        target.removeAttribute('tabindex')
      })
      temporaryFocusTargets.clear()
      document.removeEventListener('click', onAnchor)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('hashchange', alignHash)
      ScrollTrigger.removeEventListener('refresh', onRefresh)
      gsap.ticker.remove(tick)
      lenis?.off('scroll', ScrollTrigger.update)
      lenis?.destroy()
    },
  }
}
