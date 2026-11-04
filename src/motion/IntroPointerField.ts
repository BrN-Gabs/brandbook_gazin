import { createIntroHoverEffect, introHoverTarget } from './IntroHoverEffect'

type Ripple = { x: number; y: number; born: number; kind: 'pointer' | 'click' }
type QuietArea = { left: number; top: number; right: number; bottom: number; strength: number }
type Surface = {
  section: HTMLElement
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  width: number
  height: number
  top: number
  left: number
  quietAreas: QuietArea[]
}

const fieldConfig = {
  spacing: 24,
  mobileSpacing: 32,
  idleSize: 1.5,
  activeSize: 4.5,
  idleOpacity: 0.14,
  activeOpacity: 0.56,
  reach: 155,
  maxRipples: 5,
  maxClickRipples: 3,
  followTime: 85,
  buckets: 16,
} as const

const rippleConfig = {
  pointer: { life: 1450, speed: 0.19, width: 32, displacement: 4, brightness: 0.7 },
  click: { life: 2400, speed: 0.65, width: 65, displacement: 52, brightness: 1.25 },
} as const

export function createIntroPointerField(interactive: boolean) {
  const pointer = document.querySelector<HTMLElement>('.intro-pointer')
  const color = getComputedStyle(document.documentElement).getPropertyValue('--color-motion-light').trim()
  const surfaces: Surface[] = []
  document.querySelectorAll<HTMLElement>('.hero, .introduction').forEach(section => {
    const canvas = section.querySelector<HTMLCanvasElement>('.intro-field')
    const context = canvas?.getContext('2d')
    if (canvas && context) surfaces.push({ section, canvas, context, width: 0, height: 0, top: 0, left: 0, quietAreas: [] })
  })
  if (!surfaces.length || !pointer) return () => {}
  const hover = interactive ? createIntroHoverEffect() : undefined
  let hoverTarget: HTMLElement | null = null

  let frame = 0
  let previousTime = 0
  let disposed = false
  let inside = false
  let presence = 0
  let scrollY = window.scrollY
  let targetX = 0
  let targetY = 0
  let followX = 0
  let followY = 0
  let lastRippleX = 0
  let lastRippleY = 0
  let lastRippleTime = 0
  let ripples: Ripple[] = []

  function draw(surface: Surface, now: number) {
    const { context, width, height, top, left } = surface
    context.clearRect(0, 0, width, height)
    const spacing = innerWidth < 768 ? fieldConfig.mobileSpacing : fieldConfig.spacing
    const paths = Array.from({ length: fieldConfig.buckets }, () => new Path2D())
    const cursorX = followX - left
    const cursorY = followY + scrollY - top
    // Align both canvases to one document grid so the seam stays invisible.
    const firstY = ((spacing / 2 - top) % spacing + spacing) % spacing
    const firstX = ((spacing / 2 - left) % spacing + spacing) % spacing
    for (let y = firstY; y < height; y += spacing) {
      for (let x = firstX; x < width; x += spacing) {
        const dx = x - cursorX
        const dy = y - cursorY
        const distance = Math.hypot(dx, dy)
        const proximity = Math.max(0, 1 - distance / fieldConfig.reach) ** 2 * presence
        let offsetX = distance > 0 ? dx / distance * proximity * 7 : 0
        let offsetY = distance > 0 ? dy / distance * proximity * 7 : 0
        let impact = 0
        let brightness = proximity
        for (const ripple of ripples) {
          const config = rippleConfig[ripple.kind]
          const age = now - ripple.born
          const radius = age * config.speed
          const rippleX = x + left - ripple.x
          const rippleY = y + top - ripple.y
          const rippleDistance = Math.hypot(rippleX, rippleY)
          const edge = (rippleDistance - radius) / config.width
          if (Math.abs(edge) > 3) continue
          const envelope = Math.exp(-edge * edge) * (1 - age / config.life)
          const wave = envelope * Math.cos(edge * 2)
          // Every wave pushes radially from its own fixed origin, even after the mouse moves.
          if (rippleDistance > 0) {
            offsetX += rippleX / rippleDistance * wave * config.displacement
            offsetY += rippleY / rippleDistance * wave * config.displacement
          }
          if (ripple.kind === 'click') impact += wave
          brightness += envelope * config.brightness
        }
        brightness = Math.min(1, brightness)
        const limit = Math.min(1, 64 / (Math.hypot(offsetX, offsetY) || 1))
        const px = x + offsetX * limit
        const py = y + offsetY * limit
        impact = Math.max(-1, Math.min(1, impact))
        const size = fieldConfig.idleSize + brightness * (fieldConfig.activeSize - fieldConfig.idleSize) + Math.abs(impact) * 2
        let protection = 1
        for (const area of surface.quietAreas) {
          const distanceToArea = Math.hypot(Math.max(area.left - x, 0, x - area.right), Math.max(area.top - y, 0, y - area.bottom))
          const edge = Math.min(1, distanceToArea / 36)
          protection = Math.min(protection, area.strength + (1 - area.strength) * edge * edge * (3 - 2 * edge))
        }
        const opacity = (fieldConfig.idleOpacity + brightness * (fieldConfig.activeOpacity - fieldConfig.idleOpacity)) * protection
        const path = paths[Math.round(opacity / fieldConfig.activeOpacity * (fieldConfig.buckets - 1))]
        const cos = Math.cos(impact * 0.65)
        const sin = Math.sin(impact * 0.65)
        const armX = size * (cos - sin)
        const armY = size * (sin + cos)
        path.moveTo(px - armX, py - armY)
        path.lineTo(px + armX, py + armY)
        path.moveTo(px + armY, py - armX)
        path.lineTo(px - armY, py + armX)
      }
    }
    context.strokeStyle = color
    context.lineWidth = 0.85
    context.lineCap = 'round'
    paths.forEach((path, index) => {
      context.globalAlpha = index / (fieldConfig.buckets - 1) * fieldConfig.activeOpacity
      context.stroke(path)
    })
    context.globalAlpha = 1
  }

  function containsPointer() {
    const documentY = targetY + scrollY
    return surfaces.some(surface => targetX >= surface.left && targetX <= surface.left + surface.width && documentY >= surface.top && documentY <= surface.top + surface.height)
  }

  function render(now: number) {
    frame = 0
    if (disposed || document.hidden) return
    const delta = Math.min(64, previousTime ? now - previousTime : 16)
    previousTime = now
    const ease = 1 - Math.exp(-delta / fieldConfig.followTime)
    followX += (targetX - followX) * ease
    followY += (targetY - followY) * ease
    const active = inside && containsPointer()
    presence += ((active ? 1 : 0) - presence) * ease
    if (presence < 0.003) presence = 0
    ripples = ripples.filter(ripple => now - ripple.born < rippleConfig[ripple.kind].life)
    pointer!.style.opacity = active ? '1' : '0'
    pointer!.style.transform = `translate3d(${followX}px, ${followY}px, 0)`
    hover?.update(followX, followY, active ? hoverTarget : null, presence)
    for (const surface of surfaces) {
      if (surface.top + surface.height >= scrollY && surface.top <= scrollY + innerHeight) draw(surface, now)
    }
    const settling = Math.abs(targetX - followX) + Math.abs(targetY - followY) > 0.15 || Math.abs((active ? 1 : 0) - presence) > 0.003
    if (ripples.length || settling) schedule()
    else previousTime = 0
  }

  function schedule() {
    if (!frame && !disposed && !document.hidden) frame = requestAnimationFrame(render)
  }

  function measure() {
    scrollY = window.scrollY
    const ratio = Math.min(window.devicePixelRatio || 1, 2)
    surfaces.forEach(surface => {
      const rect = surface.section.getBoundingClientRect()
      surface.width = rect.width
      surface.height = rect.height
      surface.top = rect.top + scrollY
      surface.left = rect.left
      // Keep the original logo and reading areas quiet, with feathered edges.
      surface.quietAreas = Array.from(surface.section.querySelectorAll<HTMLElement>('.hero-logo-stage, .introduction-column'), element => {
        const bounds = element.getBoundingClientRect()
        const logo = element.classList.contains('hero-logo-stage')
        const padding = logo ? 8 : parseFloat(getComputedStyle(element).paddingLeft)
        return {
          left: bounds.left - rect.left + (logo ? -padding : padding),
          right: bounds.right - rect.left - (logo ? -padding : padding),
          top: bounds.top - rect.top - (logo ? 65 : 28),
          bottom: bounds.bottom - rect.top + 8,
          strength: logo ? 0 : 0.18,
        }
      })
      surface.canvas.width = Math.round(rect.width * ratio)
      surface.canvas.height = Math.round(rect.height * ratio)
      surface.context.setTransform(ratio, 0, 0, ratio, 0, 0)
      draw(surface, performance.now())
    })
    if (interactive) schedule()
  }

  function onMove(event: PointerEvent) {
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return
    const entering = !inside
    inside = true
    targetX = event.clientX
    targetY = event.clientY
    hoverTarget = introHoverTarget(event.target instanceof Element ? event.target : null)
    if (entering) { followX = targetX; followY = targetY }
    const now = performance.now()
    const documentY = targetY + scrollY
    if (entering || (now - lastRippleTime > 85 && Math.hypot(targetX - lastRippleX, documentY - lastRippleY) > 22)) {
      addRipple({ x: targetX, y: documentY, born: now, kind: 'pointer' })
      lastRippleTime = now
      lastRippleX = targetX
      lastRippleY = documentY
    }
    schedule()
  }

  function addRipple(ripple: Ripple) {
    const limit = ripple.kind === 'click' ? fieldConfig.maxClickRipples : fieldConfig.maxRipples
    if (ripples.filter(item => item.kind === ripple.kind).length >= limit) {
      ripples.splice(ripples.findIndex(item => item.kind === ripple.kind), 1)
    }
    ripples.push(ripple)
  }

  function onPress(event: PointerEvent) {
    if (event.button !== 0 || event.pointerType !== 'mouse') return
    if (event.target instanceof Element && event.target.closest('a, button, input, textarea, select, [contenteditable]')) return
    addRipple({ x: event.clientX, y: event.clientY + window.scrollY, born: performance.now(), kind: 'click' })
    schedule()
  }

  function onLeave(event: PointerEvent) {
    if (event.relatedTarget instanceof Element && event.relatedTarget.closest('.hero, .introduction')) return
    inside = false
    hoverTarget = null
    schedule()
  }

  function onScroll() {
    scrollY = window.scrollY
    hoverTarget = inside ? introHoverTarget(document.elementFromPoint(targetX, targetY)) : null
    schedule()
  }
  function suspend() {
    inside = false
    presence = 0
    ripples = []
    hoverTarget = null
    hover?.reset()
    pointer!.style.opacity = '0'
    cancelAnimationFrame(frame)
    frame = 0
    previousTime = 0
    surfaces.forEach(surface => draw(surface, performance.now()))
  }
  function onVisibility() { if (document.hidden) suspend(); else measure() }

  const resize = new ResizeObserver(measure)
  surfaces.forEach(surface => {
    resize.observe(surface.section)
    if (interactive) {
      surface.section.addEventListener('pointermove', onMove)
      surface.section.addEventListener('pointerleave', onLeave)
      surface.section.addEventListener('pointerdown', onPress)
    }
  })
  if (interactive) {
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('blur', suspend)
    document.addEventListener('visibilitychange', onVisibility)
  }
  measure()

  return () => {
    disposed = true
    cancelAnimationFrame(frame)
    resize.disconnect()
    hover?.destroy()
    surfaces.forEach(({ section, canvas, context }) => {
      section.removeEventListener('pointermove', onMove)
      section.removeEventListener('pointerleave', onLeave)
      section.removeEventListener('pointerdown', onPress)
      context.clearRect(0, 0, canvas.width, canvas.height)
    })
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('blur', suspend)
    document.removeEventListener('visibilitychange', onVisibility)
    pointer.style.removeProperty('transform')
    pointer.style.removeProperty('opacity')
  }
}
