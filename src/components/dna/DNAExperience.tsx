import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { brandContent as content } from '../../data/brandContent'
import { gsap, ScrollTrigger } from '../../motion/MotionConfig'
import { createDNAController, type DNAState } from './DNAScrollController'
import { createIntroController } from './IntroController'
import { logoOutline, logoSize } from './logoOutline'
import type { DNAScene } from './DNACanvas'
import { isReload } from '../../motion/entry'
import '../../styles/dna.css'

// The opening plays on every reload (wherever the reader was) and on every load that starts
// at the top of the home; in-page navigation never reloads the document, so never replays it.
const shouldPlayIntro = () => isReload() || ((!location.hash || location.hash === '#inicio') && scrollY < 100)
const logoSrc = `${import.meta.env.BASE_URL}${content.meta.logoSrc}`

export function DNAExperience({ reduced }: { reduced: boolean }) {
  const root = useRef<HTMLElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const hasOpened = useRef(false)
  const finish = useRef<() => void>(() => {})
  // Decided before the first paint so no home element flashes ahead of the opening.
  const [loading, setLoading] = useState(() => !reduced && shouldPlayIntro())
  const [available, setAvailable] = useState(false)

  useEffect(() => {
    const element = root.current!
    let disposed = false
    let scene: DNAScene | undefined
    let context: gsap.Context | undefined
    let destroyController: (() => void) | undefined
    const playIntro = !reduced && !hasOpened.current && shouldPlayIntro() && !!element.querySelector('.dna-logo-light')
    const originalStyles = Array.from(element.querySelectorAll<HTMLElement>('.dna-reveal, .dna-hero-copy, .dna-title-word, .dna-hero-detail, .dna-logo-mask, .dna-hero-logo'), node => ({ node, style: node.getAttribute('style') }))
    const state: DNAState = { x: .24, y: 0, turn: 0, tilt: -.24, scale: 1, opacity: 1, formation: 1, entrance: 1, energy: 1, draw: 1, ambient: 1, traits: 1 }
    const done = () => { hasOpened.current = true; if (!disposed) setLoading(false) }
    const intro = playIntro ? createIntroController(element, state, () => {}, done) : undefined
    if (!intro) done()
    const release = () => intro?.release()
    finish.current = release
    // Only real gestures skip the opening: the wheel, a touch drag or any key (Escape, Tab,
    // PageDown, Space…), so keyboard users are never held. A plain 'scroll' event is not a
    // gesture (the browser may emit one restoring an old offset) and is undone instead.
    const onWheel = () => release()
    const onScroll = () => { if (intro && !intro.released && scrollY !== 0) window.scrollTo(0, 0) }
    const onKey = (event: KeyboardEvent) => { if (!['Shift', 'Control', 'Alt', 'Meta'].includes(event.key)) release() }
    const onTouch = () => release()
    if (intro) window.scrollTo(0, 0)
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('keydown', onKey)
    window.addEventListener('touchmove', onTouch, { passive: true })

    const logo = element.querySelector<HTMLImageElement>('.dna-hero-logo')
    void document.fonts.ready.then(() => intro?.markReady('fonts'))
    void (logo?.decode() ?? Promise.resolve()).catch(() => undefined).then(() => intro?.markReady('logo'))
    void import('./DNACanvas').then(module => {
      if (disposed) return
      intro?.markReady('module')
      scene = module.createDNACanvas(canvas.current!, element, state, reduced, () => {
        if (!disposed) { setAvailable(false); release() }
      })
      intro?.setScene(scene)
      intro?.markReady('scene')
      setAvailable(true)
      context = gsap.context(() => {
        destroyController = createDNAController(element, state, reduced)
        ScrollTrigger.refresh()
      }, element)
    }).catch(() => {
      // No 3D: the vector fallback and the full content are shown right away.
      if (!disposed) { setAvailable(false); release() }
    })

    return () => {
      disposed = true
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('touchmove', onTouch)
      intro?.dispose()
      context?.revert()
      destroyController?.()
      originalStyles.forEach(({ node, style }) => { if (style === null) node.removeAttribute('style'); else node.setAttribute('style', style) })
      scene?.dispose()
    }
  }, [reduced])

  return <section ref={root} className={`dna-experience ${loading ? 'is-opening' : ''} ${available ? 'has-webgl' : ''} ${reduced ? 'is-reduced' : ''}`} aria-label="DNA Gazin — nossa identidade">
    <div className="dna-stage" aria-hidden="true">
      <div className="dna-atmosphere" />
      <div className="dna-fallback">
        <svg viewBox="0 0 400 700" fill="none">
          <path d="M120 0C420 175-20 175 280 350S-20 525 280 700M280 0C-20 175 420 175 120 350S420 525 120 700" stroke="currentColor" strokeWidth="7" />
          {Array.from({ length: 27 }, (_, i) => { const y = i * 25; const x = 80 * Math.cos(y / 350 * Math.PI * 2); return <path key={i} d={`M${200 - x} ${y}H${200 + x}`} stroke="currentColor" opacity=".35" strokeWidth="2" /> })}
        </svg>
      </div>
      <canvas ref={canvas} className="dna-canvas" />
      <div className="dna-stage-caption"><span className="dna-light" /> UMA ESSÊNCIA. INFINITAS CONEXÕES.</div>
    </div>

    {/* Positioned by DNACanvas each frame; hidden when WebGL is unavailable. */}
    <ul className="dna-hotspots" aria-label="Nosso DNA">
      {content.dnaTraits.map((trait, index) => <li key={trait.number} className="dna-hotspot" data-side="right" style={{ '--i': index } as CSSProperties}>
        <button type="button" aria-label={`${trait.number} — ${trait.title}`}>
          <span className="dna-hotspot-dot" aria-hidden="true"><span className="dna-hotspot-number">{trait.number}</span></span>
          <span className="dna-hotspot-label" aria-hidden="true">{trait.title}</span>
        </button>
      </li>)}
    </ul>

    {/* Full-viewport night layer; the hero (later in the DOM) paints above it so the real logo can perform. */}
    {loading && <div className="dna-loader" role="status" aria-label="Preparando experiência DNA Gazin" />}
    {/* Outside the loader: the loader sits below the hero (z-index 0), which used to swallow the click. */}
    {loading && <button type="button" className="dna-skip" onClick={() => finish.current()}>Pular abertura <ArrowUpRight size={14} /></button>}

    <section id="inicio" className="dna-panel dna-hero" aria-labelledby="hero-title">
      <div className="page-container">
        <div className="dna-hero-copy">
          <p className="eyebrow dna-hero-detail"><span className="dna-light" /> {content.meta.edition}</p>
          <h1 id="hero-title" aria-label="DNA GAZIN">
            <span className="dna-title-mask"><span className="dna-title-word">DNA</span></span>
            <span className="dna-title-mask dna-logo-mask">
              <span className="dna-title-word"><img className="dna-hero-logo brand-logo" src={logoSrc} alt="Gazin" width="2974" height="835" fetchPriority="high" /></span>
              {loading && <LogoLight />}
            </span>
          </h1>
          <p className="dna-subtitle dna-hero-detail">Nossa marca, nosso jeito!</p>
          <p className="dna-hero-description dna-hero-detail">{content.hero.description}</p>
          <a href="#introducao" className="dna-explore dna-hero-detail"><span><ArrowDown size={18} /></span>{content.hero.scrollLabel}</a>
        </div>
      </div>
    </section>

    <section id="introducao" className="dna-panel dna-concept" aria-labelledby="dna-concept-title">
      <div className="page-container dna-panel-layout dna-align-right">
        <div className="dna-copy">
          <p className="eyebrow dna-reveal">A ESSÊNCIA DA NOSSA MARCA</p>
          <h2 id="dna-concept-title" className="dna-section-title dna-reveal">Nossa identidade<br />em cada detalhe.</h2>
          <p className="dna-lead dna-reveal">Mais do que uma identidade visual, uma marca é a expressão de tudo aquilo em que acreditamos. Nosso jeito de comunicar, agir e nos conectar é o que torna a Gazin única.</p>
          <p className="dna-body dna-reveal">{content.introduction.description}</p>
          <span className="dna-connection dna-reveal" aria-hidden="true" />
        </div>
      </div>
    </section>

    {content.introduction.items.map((item, index) => <section key={item.number} id={`dna-${item.number}`} className={`dna-panel dna-story dna-story-${item.number}`} aria-labelledby={`dna-title-${item.number}`}>
      <div className={`page-container dna-panel-layout ${index === 1 ? 'dna-align-right' : ''}`}>
        <div className="dna-copy">
          <span className="dna-section-number" aria-hidden="true">{item.number}</span>
          <p className="eyebrow dna-reveal">UM GUIA PARA O NOSSO JEITO DE SER</p>
          <h2 id={`dna-title-${item.number}`} className="dna-section-title dna-reveal"><span className="dna-inline-index">{item.number} / </span>{item.title}</h2>
          <p className="dna-lead dna-reveal">{item.text}</p>
          <span className="dna-connection dna-reveal" aria-hidden="true" />
          <a className="dna-next dna-reveal" href={index < 2 ? `#dna-0${index + 2}` : '#dna-bridge'}>{index < 2 ? content.introduction.items[index + 1].title : 'Conheça nossa essência'}<ArrowDown size={16} /></a>
        </div>
      </div>
    </section>)}

    <section id="dna-bridge" className="dna-panel dna-bridge" aria-labelledby="dna-bridge-title">
      <div className="page-container">
        <p className="eyebrow dna-reveal">DA NOSSA ESSÊNCIA PARA O MUNDO</p>
        <h2 id="dna-bridge-title" className="dna-reveal">Presente em<br />tudo o que fazemos.</h2>
        <p className="dna-body dna-reveal">Cada escolha, cada atitude e cada conexão carrega o DNA Gazin.</p>
        <a className="dna-explore dna-reveal" href="#missao-visao"><span><ArrowDown size={18} /></span>Nosso propósito</a>
      </div>
    </section>
  </section>
}

/** Light trace over the real frame silhouette (extracted from the original PNG) and the edge-in reveal mask. */
function LogoLight() {
  const { width, height } = logoSize
  return <>
    <svg className="dna-logo-light" viewBox={`0 0 ${width} ${height}`} aria-hidden="true" focusable="false">
      <defs>
        <filter id="dna-light-blur" x="-10%" y="-40%" width="120%" height="180%"><feGaussianBlur stdDeviation="18" /></filter>
        <radialGradient id="dna-light-halo">
          {/* White core with a vibrant-blue halo (tokens from globals.css). */}
          <stop offset="0" style={{ stopColor: 'var(--gazin-white)' }} />
          <stop offset=".22" style={{ stopColor: 'var(--gazin-blue-light)', stopOpacity: .8 }} />
          <stop offset=".55" style={{ stopColor: 'var(--gazin-blue-bright)', stopOpacity: .3 }} />
          <stop offset="1" style={{ stopColor: 'var(--gazin-blue-mid)', stopOpacity: 0 }} />
        </radialGradient>
        {/* Soft-edged reveal: the light's path widens inward into the original artwork. */}
        <filter id="dna-light-soft" filterUnits="userSpaceOnUse" x={-900} y={-900} width={width + 1800} height={height + 1800}><feGaussianBlur stdDeviation="60" /></filter>
        <mask id="dna-light-mask" maskUnits="userSpaceOnUse" x={-900} y={-900} width={width + 1800} height={height + 1800}>
          <path className="dna-light-reveal" d={logoOutline} fill="none" stroke="#fff" strokeWidth="0" strokeLinejoin="round" filter="url(#dna-light-soft)" />
        </mask>
      </defs>
      <image className="dna-light-image" href={logoSrc} width={width} height={height} mask="url(#dna-light-mask)" />
      <path className="dna-light-path" d={logoOutline} fill="none" stroke="none" />
      <path className="dna-light-ring" d={logoOutline} fill="none" />
      <g filter="url(#dna-light-blur)"><path className="dna-light-trail dna-light-trail-wide" d={logoOutline} fill="none" /></g>
      <path className="dna-light-trail dna-light-trail-mid" d={logoOutline} fill="none" />
      <path className="dna-light-trail dna-light-trail-core" d={logoOutline} fill="none" />
      {Array.from({ length: 28 }, (_, i) => <circle key={i} className="dna-light-spark" r="0" />)}
      <g className="dna-light-head"><circle r="78" fill="url(#dna-light-halo)" /><circle r="12" style={{ fill: 'var(--gazin-white)' }} /></g>
    </svg>
    <span className="dna-loading-value" aria-hidden="true"><span className="dna-loading-number">0</span><small>%</small></span>
  </>
}
