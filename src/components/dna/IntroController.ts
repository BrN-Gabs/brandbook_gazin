import { gsap } from '../../motion/MotionConfig'
import type { DNAState } from './DNAScrollController'

export type IntroPhase = 'loading' | 'midpoint' | 'accelerating' | 'logoReveal' | 'dnaMorph' | 'introReveal' | 'ready'
export type ReadinessKey = 'module' | 'scene' | 'fonts' | 'logo'
type Scene = { ignite(clientX: number, clientY: number): void }

// Real readiness caps the visible percentage: the counter can lag the light,
// but never claims a resource is ready before it is.
const weights: Record<ReadinessKey, number> = { module: 28, scene: 25, fonts: 15, logo: 20 }
const BASE = 12
const SOFT_DEADLINE = 9 // s: a stuck font/image stops holding the counter back
const HARD_DEADLINE = 16 // s: absolute guarantee that the page is released

const smooth = (x: number) => x * x * (3 - 2 * x)
const approach = (current: number, target: number, rate: number, dt: number) => current + (target - current) * (1 - Math.exp(-rate * dt))

/**
 * Cinematic opening: a light runs along the real Gazin frame silhouette while the
 * counter rises (slowing at 50%, accelerating to 100%), reveals the original logo,
 * carries it to its layout slot (FLIP) and hands the same light to the 3D scene,
 * which draws a luminous helix that fragments into the existing particle DNA.
 */
export function createIntroController(root: HTMLElement, state: DNAState, onPhase: (phase: IntroPhase) => void, onDone: () => void) {
  const mask = root.querySelector<HTMLElement>('.dna-logo-mask')!
  const logo = root.querySelector<HTMLImageElement>('.dna-hero-logo')!
  const svg = root.querySelector<SVGSVGElement>('.dna-logo-light')!
  const outline = svg.querySelector<SVGPathElement>('.dna-light-path')!
  const trails = Array.from(svg.querySelectorAll<SVGPathElement>('.dna-light-trail'))
  const ring = svg.querySelector<SVGPathElement>('.dna-light-ring')!
  const revealStroke = svg.querySelector<SVGPathElement>('.dna-light-reveal')!
  const revealImage = svg.querySelector<SVGImageElement>('.dna-light-image')!
  const head = svg.querySelector<SVGGElement>('.dna-light-head')!
  const sparkNodes = Array.from(svg.querySelectorAll<SVGCircleElement>('.dna-light-spark'))
  const counter = root.querySelector<HTMLElement>('.dna-loading-value')!
  const counterNumber = counter.querySelector<HTMLElement>('.dna-loading-number')!
  const loader = root.querySelector<HTMLElement>('.dna-loader')
  const word = root.querySelector<HTMLElement>('.dna-title-mask:first-child .dna-title-word')
  const details = Array.from(root.querySelectorAll<HTMLElement>('.dna-hero-detail'))

  const length = outline.getTotalLength()
  const ready = new Set<ReadinessKey>()
  let scene: Scene | undefined
  let phase: IntroPhase = 'loading'
  let elapsed = 0, progress = 0, shown = -1, midStart = 0
  let position = length * .02, speed = 0, trail = .12, glow = 0, detached = false, lightAlpha = 0
  let logoMove = 0, timeline: gsap.core.Timeline | undefined, finished = false
  const sparks = sparkNodes.map(node => ({ node, life: 0, max: 1, x: 0, y: 0, vx: 0, vy: 0, r: 1 }))
  let sparkCursor = 0, sparkDebt = 0

  const setPhase = (next: IntroPhase) => { phase = next; root.dataset.phase = next; onPhase(next) }
  const cap = () => elapsed > SOFT_DEADLINE ? 100 : BASE + [...ready].reduce((sum, key) => sum + weights[key], 0)

  // FLIP: the real logo element is transformed from a centred hero scale to its layout slot.
  const applyLogo = () => {
    const parent = mask.offsetParent as HTMLElement | null
    if (!parent) return
    const box = parent.getBoundingClientRect()
    const left = box.left + mask.offsetLeft, top = box.top + mask.offsetTop
    const width = mask.offsetWidth, height = mask.offsetHeight
    if (!width) return
    const targetWidth = innerWidth < 768 ? innerWidth * .82 : Math.min(innerWidth * .5, 780, innerHeight * 1.5)
    const e = smooth(smooth(logoMove))
    const scale = targetWidth / width + (1 - targetWidth / width) * e
    const dx = (innerWidth / 2 - (left + width / 2)) * (1 - e)
    const dy = (innerHeight * .47 - (top + height / 2)) * (1 - e)
    mask.style.transform = logoMove >= 1 ? '' : `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`
  }

  const pointAt = (distance: number) => outline.getPointAtLength(((distance % length) + length) % length)
  const spawn = (x: number, y: number, inward: boolean) => {
    const spark = sparks[sparkCursor]
    sparkCursor = (sparkCursor + 1) % sparks.length
    const angle = Math.random() * Math.PI * 2
    const distance = inward ? 70 + Math.random() * 90 : 0
    spark.x = x + Math.cos(angle) * distance
    spark.y = y + Math.sin(angle) * distance
    const velocity = inward ? -distance * 1.6 : 40 + Math.random() * 110
    spark.vx = Math.cos(angle) * velocity
    spark.vy = Math.sin(angle) * velocity
    spark.max = spark.life = .45 + Math.random() * .5
    spark.r = 4 + Math.random() * 7
  }

  const drawLight = (dt: number) => {
    position += speed * length * dt
    const point = pointAt(position)
    trails.forEach((path, i) => {
      const dash = length * trail * [1, .5, .16][i]
      path.style.strokeDasharray = `${dash.toFixed(1)} ${(length - dash).toFixed(1)}`
      path.style.strokeDashoffset = (((dash - position) % length) + length).toFixed(1)
    })
    head.setAttribute('transform', `translate(${point.x.toFixed(1)} ${point.y.toFixed(1)}) scale(${(.8 + glow * .45).toFixed(3)})`)
    svg.style.setProperty('--light', lightAlpha.toFixed(3))
    svg.style.setProperty('--glow', glow.toFixed(3))
    // Discrete particles shed by the light; at the midpoint they gather toward it.
    if (!detached && lightAlpha > .1) {
      sparkDebt += dt * (phase === 'midpoint' ? 34 : 14 + speed * 18)
      while (sparkDebt >= 1) { sparkDebt--; spawn(point.x, point.y, phase === 'midpoint') }
    }
    sparks.forEach(spark => {
      if (spark.life <= 0) { if (spark.node.style.opacity !== '0') spark.node.style.opacity = '0'; return }
      spark.life -= dt
      spark.vx *= Math.exp(-dt * 2.2); spark.vy *= Math.exp(-dt * 2.2)
      spark.x += spark.vx * dt; spark.y += spark.vy * dt
      const life = Math.max(0, spark.life / spark.max)
      spark.node.setAttribute('cx', spark.x.toFixed(1))
      spark.node.setAttribute('cy', spark.y.toFixed(1))
      spark.node.setAttribute('r', (spark.r * (.4 + life * .6)).toFixed(1))
      spark.node.style.opacity = (life * life * lightAlpha).toFixed(3)
    })
  }

  const render = (n: number) => {
    if (n === shown) return
    shown = n
    counterNumber.textContent = String(n)
  }

  function startReveal() {
    setPhase('logoReveal')
    const words = word ? [word] : []
    timeline = gsap.timeline({ onComplete: finish })
      // 100%: the counter dissolves and the light completes one last fast lap.
      .to(counter, { opacity: 0, y: -8, filter: 'blur(4px)', duration: .4, ease: 'power2.in' }, 0)
      .fromTo(ring, { opacity: 0 }, { opacity: .9, duration: .25, ease: 'power2.out' }, 0)
      .to(ring, { opacity: 0, duration: .8, ease: 'power2.inOut' }, .3)
      // The path the light travelled reveals the original artwork from its edge inward.
      .fromTo(revealStroke, { attr: { 'stroke-width': 0 } }, { attr: { 'stroke-width': 1500 }, duration: .9, ease: 'power2.inOut' }, .12)
      .add(() => {
        // Same pixels, same box: swap the SVG copy for the real <img> without a frame of difference.
        logo.style.opacity = '1'
        revealImage.style.opacity = '0'
      }, 1.04)
      // The light leaves the frame: the 3D scene takes over from the exact same screen point.
      .add(() => {
        detached = true
        setPhase('dnaMorph')
        const rect = head.getBoundingClientRect()
        scene?.ignite(rect.left + rect.width / 2, rect.top + rect.height / 2)
      }, .95)
      .to({}, { duration: .25, onUpdate() { lightAlpha = 1 - this.progress() } }, .95)
      .to({ value: 0 }, { value: 1, duration: 1.15, ease: 'none', onUpdate() { logoMove = this.targets()[0].value; applyLogo() } }, .95)
      .to(loader, { opacity: 0, duration: .6, ease: 'power1.out' }, 1)
      .to(state, { energy: 1, duration: .7, ease: 'power2.inOut' }, .95)
      .to(state, { draw: 1, duration: 1.05, ease: 'sine.inOut' }, 1.6)
      .add(() => setPhase('introReveal'), 1.9)
      .to(state, { formation: 1, duration: 1.6, ease: 'power1.inOut' }, 2.05)
      // The white DNA points ignite one by one, base first, behind the particle wave.
      .to(state, { traits: 1, duration: 2.3, ease: 'none' }, 2.5)
      // Editorial order: logo settles → DNA → MANUAL DA MARCA → title → text → button.
      .fromTo(words, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .85, ease: 'power3.out' }, 1.75)
      .fromTo(details, { y: 18, opacity: 0, filter: 'blur(6px)' }, { y: 0, opacity: 1, filter: 'blur(0px)', duration: .75, stagger: .15, ease: 'power2.out', clearProps: 'filter' }, 2)
      // Background decoration arrives last and quietly.
      .to(state, { ambient: 1, duration: 1.1, ease: 'sine.inOut' }, 2.95)
  }

  const tick = (_: number, deltaMs: number) => {
    const dt = Math.min(deltaMs / 1000, .05)
    elapsed += dt
    if (elapsed > HARD_DEADLINE) { release(); return }
    const limit = cap()
    if (phase === 'loading') {
      lightAlpha = smooth(Math.min(1, elapsed / .4))
      const script = elapsed < .4 ? 0 : 50 * (.5 - .5 * Math.cos(Math.PI * Math.min(1, (elapsed - .4) / 1.3)))
      progress = Math.min(script, limit)
      speed = approach(speed, .42 + .12 * progress / 50, 2.5, dt)
      trail = approach(trail, .12, 3, dt)
      glow = approach(glow, .15 + .35 * progress / 50, 3, dt)
      if (progress >= 49.95) { midStart = elapsed; setPhase('midpoint') }
    } else if (phase === 'midpoint') {
      // Energy accumulates: slower light, longer trail, stronger glow; the counter barely moves.
      const t = Math.min(1, (elapsed - midStart) / .6)
      progress = Math.min(50 + 3 * smooth(t), limit)
      speed = approach(speed, .13, 4, dt)
      trail = approach(trail, .24, 4, dt)
      glow = approach(glow, .85, 4, dt)
      if (t >= 1 && limit > 53) setPhase('accelerating')
    } else if (phase === 'accelerating') {
      const k = (progress - 53) / 47
      progress = Math.min(progress + (16 + 74 * Math.pow(Math.max(0, k), 1.2)) * dt, limit, 100)
      speed = approach(speed, .3 + 1.15 * Math.pow(k, 1.4), 3, dt)
      trail = approach(trail, .16 + .06 * k, 3, dt)
      glow = approach(glow, .55 + .45 * k, 3, dt)
      if (progress >= 100) startReveal()
    } else if (!detached) {
      // Final quick lap while the logo is revealed.
      speed = approach(speed, 1.35, 3, dt)
      glow = approach(glow, 1, 3, dt)
    }
    render(Math.floor(progress))
    drawLight(dt)
    if (logoMove < 1) applyLogo()
  }

  function teardown() {
    gsap.ticker.remove(tick)
    timeline?.kill()
    timeline = undefined
    document.documentElement.classList.remove('dna-opening')
  }

  // Jump to the settled page: also used by Skip, Escape, user scroll and the deadline.
  function release() {
    if (finished) return
    finished = true
    teardown()
    Object.assign(state, { energy: 1, draw: 1, formation: 1, entrance: 1, ambient: 1, traits: 1 })
    logoMove = 1
    mask.style.transform = ''
    logo.style.opacity = '1'
    // Final values (not clearProps): CSS still hides them until React drops .is-opening.
    if (word) gsap.set(word, { yPercent: 0, opacity: 1 })
    gsap.set(details, { y: 0, opacity: 1, filter: 'none' })
    setPhase('ready')
    onDone()
  }
  function finish() { release() }

  setPhase('loading')
  document.documentElement.classList.add('dna-opening')
  Object.assign(state, { energy: 0, draw: 0, formation: 0, entrance: 1, ambient: 0, traits: 0 })
  logo.style.opacity = '0'
  revealImage.style.opacity = '1'
  gsap.set(revealStroke, { attr: { 'stroke-width': 0 } })
  applyLogo()
  render(0)
  gsap.ticker.add(tick)

  return {
    markReady(key: ReadinessKey) { ready.add(key) },
    setScene(next: Scene | undefined) { scene = next },
    release,
    get phase() { return phase },
    get released() { return finished },
    /** Cleanup on unmount/remount (StrictMode, preference change): no ticker or tween survives. */
    dispose() {
      teardown()
      finished = true
      mask.style.transform = ''
      logo.style.removeProperty('opacity')
      revealImage.style.removeProperty('opacity')
      ;[counter, loader, word, ...details].forEach(node => node && gsap.set(node, { clearProps: 'all' }))
      delete root.dataset.phase
    },
  }
}
