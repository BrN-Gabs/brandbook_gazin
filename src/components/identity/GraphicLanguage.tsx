import { useEffect, useRef, useState } from 'react'
import type { Subsection } from '../../data/brandChapters'
import { digitalElements, documentedElements } from '../../data/visualIdentity'
import { H, IdentitySection, LogoLetters, OfficialLogo, ProvenanceTag, W, logoOutline, useInView, useMotionEnabled } from './shared'

/** Small diagram per documented element, drawn on the outline extracted from the file. */
function ElementGlyph({ id }: { id: string }) {
  return <svg className={`vi-el-glyph is-${id}`} viewBox={`-120 -120 ${W + 240} ${H + 240}`} aria-hidden="true">
    {id === 'equilibrio' && <g className="vi-el-axes"><line x1={W / 2} x2={W / 2} y1="-100" y2={H + 100} /><line x1="-100" x2={W + 100} y1={H / 2} y2={H / 2} /></g>}
    <path className="vi-el-shape" d={logoOutline} />
    {id === 'cantos' && [[428, 30], [2944, 40], [2548, 806], [26, 796]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="90" />)}
    {id === 'tipografia' && <LogoLetters fill="currentColor" />}
  </svg>
}

type Particle = { t: number; speed: number; offset: number; phase: number; size: number }

/**
 * Digital layer of the Brandbook around the untouched logo: particles orbit the outline
 * extracted from the original file and connect when close. Pauses off-screen; static
 * frame when motion is reduced.
 */
function LanguageCanvas({ on }: { on: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const path = useRef<SVGPathElement>(null)
  const wrap = useRef<HTMLDivElement>(null)
  const visible = useInView(wrap, '100px')
  const motion = useMotionEnabled()

  useEffect(() => {
    const element = canvas.current, outline = path.current
    if (!element || !outline || !on) return
    const context = element.getContext('2d')
    if (!context) return
    const tokens = getComputedStyle(document.documentElement)
    const bright = tokens.getPropertyValue('--gazin-blue-bright-rgb').trim().split(/\s+/).join(',') || '65,105,254'
    const white = tokens.getPropertyValue('--gazin-white-rgb').trim().split(/\s+/).join(',') || '255,255,255'

    // Sample the outline once; particles interpolate along these points.
    const total = outline.getTotalLength()
    const samples = Array.from({ length: 480 }, (_, index) => { const point = outline.getPointAtLength(total * index / 480); return [point.x, point.y] })
    const centre = [W / 2, H / 2]
    const count = innerWidth < 768 ? 46 : 78
    const particles: Particle[] = Array.from({ length: count }, (_, index) => ({
      t: index / count + Math.random() * .01, speed: (.006 + Math.random() * .012) * (index % 2 ? 1 : -1),
      offset: 40 + Math.random() * 360, phase: Math.random() * Math.PI * 2, size: .8 + Math.random() * 1.6,
    }))

    let width = 0, height = 0, scale = 1, originX = 0, originY = 0
    const resize = () => {
      const ratio = Math.min(devicePixelRatio || 1, 2)
      width = element.clientWidth; height = element.clientHeight
      element.width = width * ratio; element.height = height * ratio
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      scale = Math.min(width * .62 / W, height * .5 / H)
      originX = (width - W * scale) / 2; originY = (height - H * scale) / 2
    }
    const positionOf = (particle: Particle, time: number) => {
      const position = ((particle.t + particle.speed * time) % 1 + 1) % 1 * samples.length
      const a = samples[Math.floor(position) % samples.length], b = samples[(Math.floor(position) + 1) % samples.length]
      const f = position % 1
      const x = a[0] + (b[0] - a[0]) * f, y = a[1] + (b[1] - a[1]) * f
      const dx = x - centre[0], dy = (y - centre[1]) * 3.2, length = Math.hypot(dx, dy) || 1
      const offset = particle.offset + Math.sin(time * .9 + particle.phase) * 26
      return [originX + (x + dx / length * offset) * scale, originY + (y + dy / length * offset / 3.2 * 1.6) * scale]
    }
    const draw = (time: number) => {
      context.clearRect(0, 0, width, height)
      const points = particles.map(particle => positionOf(particle, time))
      const reach = 150 * scale + 30
      context.lineWidth = 1
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const distance = Math.hypot(points[i][0] - points[j][0], points[i][1] - points[j][1])
          if (distance > reach) continue
          context.strokeStyle = `rgba(${bright},${(1 - distance / reach) * .45})`
          context.beginPath(); context.moveTo(points[i][0], points[i][1]); context.lineTo(points[j][0], points[j][1]); context.stroke()
        }
      }
      points.forEach(([x, y], index) => {
        const particle = particles[index]
        context.fillStyle = index % 5 === 0 ? `rgba(${white},.9)` : `rgba(${bright},.95)`
        context.shadowColor = `rgba(${bright},.8)`; context.shadowBlur = 8
        context.beginPath(); context.arc(x, y, particle.size, 0, Math.PI * 2); context.fill()
      })
      context.shadowBlur = 0
    }

    resize()
    const observer = new ResizeObserver(() => { resize(); if (!motion || !visible) draw(4) })
    observer.observe(element)
    let frame = 0
    const start = performance.now()
    const loop = (now: number) => { draw((now - start) / 1000 + 4); frame = requestAnimationFrame(loop) }
    if (motion && visible) frame = requestAnimationFrame(loop)
    else draw(4)
    return () => { cancelAnimationFrame(frame); observer.disconnect() }
  }, [on, motion, visible])

  return <div ref={wrap} className={`vi-lang-canvas ${on ? 'is-on' : ''}`}>
    <svg className="vi-hidden-path" aria-hidden="true" width="0" height="0"><path ref={path} d={logoOutline} /></svg>
    <canvas ref={canvas} aria-hidden="true" />
    <OfficialLogo className="vi-lang-logo" alt="Logomarca Gazin original, ao centro da camada digital do Manual da Marca" />
  </div>
}

export function GraphicLanguage({ subsection }: { subsection: Subsection }) {
  const [layer, setLayer] = useState(true)
  return <IdentitySection subsection={subsection} className="vi-graphics-section"
    lead={<>
      <p>A identidade tradicional da Gazin se apoia em poucos elementos, encaixados de forma simétrica. O Manual da Marca digital acrescenta uma linguagem própria, tecnológica, construída ao redor da marca, sem nunca alterar seu símbolo.</p>
    </>}
    source={<ProvenanceTag kind="digital" />}>
    <div className="vi-graphics-group">
      <p className="vi-group-label"><span>A</span>Elementos documentados no manual</p>
      <ul className="vi-elements">
        {documentedElements.map(element => <li key={element.id} data-vi-reveal>
          <ElementGlyph id={element.id} />
          <h4>{element.title}</h4>
          <p className="vi-muted">{element.text}</p>
        </li>)}
      </ul>
    </div>

    <div className="vi-graphics-group">
      <p className="vi-group-label"><span>B</span>Linguagem visual do Manual da Marca digital</p>
      <div className="vi-lang">
        <div className="vi-lang-stage">
          <LanguageCanvas on={layer} />
          <button type="button" className="vi-switch is-on-dark" aria-pressed={layer} onClick={() => setLayer(value => !value)}>
            <span className="vi-switch-track" aria-hidden="true"><span /></span>{layer ? 'Ocultar camada digital' : 'Mostrar camada digital'}
          </button>
        </div>
        <div className="vi-lang-info">
          <p className="vi-muted">Partículas, conexões, luz e movimento orbitam o contorno extraído do arquivo original: a linguagem do site nasce da geometria da marca, mas a logomarca permanece intacta, no centro.</p>
          <ul className="vi-lang-list">
            {digitalElements.map(element => <li key={element.id}><b>{element.title}</b><span>{element.text}</span></li>)}
          </ul>
          <ProvenanceTag kind="digital">Interpretação contemporânea · o manual não prescreve DNA 3D, partículas ou WebGL</ProvenanceTag>
        </div>
      </div>
    </div>
  </IdentitySection>
}
