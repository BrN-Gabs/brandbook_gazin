import { useEffect, useRef, useState } from 'react'
import { Pause, Play, RotateCcw } from 'lucide-react'
import type { Subsection } from '../../data/brandChapters'
import {
  constructionSteps, logoIntro, logoMeasures, slantAngle, slogan, sloganNotes, symbology, symbologyClosing,
} from '../../data/visualIdentity'
import { H, IdentitySection, LogoLetters, LogoVersion, ProvenanceTag, W, logoOutline, logoUrl, useInView, useMotionEnabled } from './shared'

// Positions in % of the composition with slogan (logo 2974 × 835 + slogan below).
const anatomy = [
  { id: 'retangulo', label: 'Retângulo inclinado', x: 6, y: 49 },
  { id: 'cantos', label: 'Cantos arredondados', x: 15, y: 4 },
  { id: 'azul', label: 'Fundo azul', x: 80, y: 72 },
  { id: 'nome', label: 'Nome GAZIN em branco', x: 44, y: 35 },
  { id: 'slogan', label: 'Slogan, em algumas aplicações', x: 41, y: 92 },
] as const

function LogoOpening() {
  const [focus, setFocus] = useState<string | null>(null)
  return <div className="vi-opening">
    <figure className="vi-hero-plate" data-focus={focus ?? undefined}>
      <div className="vi-hero-logo-wrap">
        <LogoVersion id="cores-originais" slogan className="vi-hero-logo" />
        {anatomy.map((item, index) => <span key={item.id} className={`vi-hotspot ${focus === item.id ? 'is-on' : ''}`} style={{ left: `${item.x}%`, top: `${item.y}%` }} aria-hidden="true">{index + 1}</span>)}
      </div>
      <figcaption>Logomarca com slogan, em cores originais</figcaption>
    </figure>
    <ol className="vi-anatomy" aria-label="Elementos da logomarca">
      {anatomy.map((item, index) => <li key={item.id}>
        <button type="button" onMouseEnter={() => setFocus(item.id)} onMouseLeave={() => setFocus(null)} onFocus={() => setFocus(item.id)} onBlur={() => setFocus(null)} aria-pressed={focus === item.id}>
          <b>{index + 1}</b>{item.label}
        </button>
      </li>)}
    </ol>
  </div>
}

/** Point on the left/right sides extended beyond the frame (for the inclination guides). */
const extend = ([x1, y1]: readonly number[], [x2, y2]: readonly number[], amount: number) => {
  const dx = x2 - x1, dy = y2 - y1
  return [x1 - dx * amount, y1 - dy * amount, x2 + dx * amount, y2 + dy * amount]
}
const left = extend(logoMeasures.slantSide.from, logoMeasures.slantSide.to, .32)
const right = extend([2596.8, 760.2], [2959.1, 135.1], .3)
// Where the left side meets the base line: centre of the angle arc.
const slope = (logoMeasures.slantSide.to[0] - logoMeasures.slantSide.from[0]) / (logoMeasures.slantSide.from[1] - logoMeasures.slantSide.to[1])
const apexX = logoMeasures.slantSide.from[0] - (H - logoMeasures.slantSide.from[1]) * slope
const arc = 300
const arcEnd = [apexX + arc * Math.cos(slantAngle * Math.PI / 180), H - arc * Math.sin(slantAngle * Math.PI / 180)]
const corners = [[428, 30], [2944, 40], [2548, 806], [26, 796]]

function LogoConstruction() {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const stage = useRef<HTMLDivElement>(null)
  const inView = useInView(stage, '0px 0px -25% 0px', true)
  const motion = useMotionEnabled()

  // Plays once on first view (only with motion); afterwards the reader drives it.
  useEffect(() => { if (inView && motion) { setStep(0); setPlaying(true) } }, [inView, motion])
  useEffect(() => {
    if (!playing) return
    if (step >= constructionSteps.length - 1) { setPlaying(false); return }
    const timer = setTimeout(() => setStep(value => value + 1), step === 0 ? 1900 : 1700)
    return () => clearTimeout(timer)
  }, [playing, step])

  const current = constructionSteps[step]
  const go = (index: number) => { setPlaying(false); setStep(index) }
  return <div className="vi-construction">
    <div ref={stage} className="vi-construction-stage" data-step={step} data-drawn={inView || !motion ? 'true' : undefined}>
      <svg viewBox={`-160 -110 ${W + 320} ${H + 220}`} role="img" aria-label={`Construção da logomarca, etapa ${step + 1} de 4: ${current.label}`}>
        <g className="vi-c-guides" aria-hidden="true">
          <line x1="-160" x2={W + 160} y1={H} y2={H} />
          <line x1="-160" x2={W + 160} y1="0" y2="0" />
          <line x1={left[0]} y1={left[1]} x2={left[2]} y2={left[3]} />
          <line x1={right[0]} y1={right[1]} x2={right[2]} y2={right[3]} />
          <path className="vi-c-arc" d={`M ${apexX + arc} ${H} A ${arc} ${arc} 0 0 0 ${arcEnd[0]} ${arcEnd[1]}`} />
          <text x={apexX + arc + 40} y={H - 60}>≈ {slantAngle}°</text>
          {corners.map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="62" />)}
        </g>
        <path className="vi-c-outline" d={logoOutline} pathLength={1} />
        <LogoLetters className="vi-c-letters" />
        <image className="vi-c-final" href={logoUrl} width={W} height={H} />
      </svg>
      <div className="vi-construction-caption" aria-live="polite">
        <span className="vi-step-count">Etapa {step + 1} / {constructionSteps.length}</span>
        <strong>{current.label}</strong>
        <p>{current.text}</p>
        {step === 1 && <ProvenanceTag kind="medido">Ângulo medido no arquivo; não é regra do manual</ProvenanceTag>}
        {step === 2 && <ProvenanceTag kind="didatico">Destaque das letras a partir do próprio arquivo</ProvenanceTag>}
      </div>
    </div>
    <div className="vi-stepper">
      <ol>
        {constructionSteps.map((item, index) => <li key={item.id}>
          <button type="button" onClick={() => go(index)} aria-current={index === step ? 'step' : undefined} className={index <= step ? 'is-done' : ''}>
            <span>{String(index + 1).padStart(2, '0')}</span>{item.label}
          </button>
        </li>)}
      </ol>
      <button type="button" className="vi-icon-button" onClick={() => {
        if (playing) setPlaying(false)
        else { if (step >= constructionSteps.length - 1) setStep(0); setPlaying(true) }
      }} aria-label={playing ? 'Pausar construção' : step >= constructionSteps.length - 1 ? 'Reproduzir construção novamente' : 'Reproduzir construção'}>
        {playing ? <Pause size={16} aria-hidden="true" /> : step >= constructionSteps.length - 1 ? <RotateCcw size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
      </button>
    </div>
  </div>
}

function SymbolGlyph({ id }: { id: string }) {
  return <svg className={`vi-symbol-glyph is-${id}`} viewBox={`-40 -40 ${W + 80} ${H + 80}`} aria-hidden="true">
    <path d={logoOutline} />
  </svg>
}

function Symbology() {
  return <div className="vi-symbology">
    <div className="vi-symbology-head" data-vi-reveal>
      <h4 className="vi-h4">Simbologia</h4>
    </div>
    <ol className="vi-symbology-list">
      {symbology.map((item, index) => <li key={item.id} className="vi-symbol" data-vi-reveal>
        <span className="vi-symbol-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
        <SymbolGlyph id={item.id} />
        <h5>{item.title}</h5>
        <p className="vi-symbol-words">{item.words.join(' · ')}</p>
        <p className="vi-muted">{item.text}</p>
      </li>)}
    </ol>
    <p className="vi-closing" data-vi-reveal>{symbologyClosing}</p>
  </div>
}

function SloganBlock() {
  return <div className="vi-slogan">
    <div className="vi-slogan-quote" data-vi-reveal>
      <p className="vi-kicker"><span className="vi-kicker-line" aria-hidden="true" />Slogan</p>
      <blockquote><p>“{slogan}”</p></blockquote>
      <ul className="vi-notes">{sloganNotes.map(note => <li key={note}>{note}</li>)}</ul>
    </div>
    <figure className="vi-slogan-diagram" data-vi-reveal>
      <div className="vi-slogan-plate">
        <LogoVersion id="cores-originais" slogan decorative />
      </div>
      <figcaption>O slogan fica abaixo do retângulo, alinhado à esquerda da composição e ocupando cerca de quatro quintos da largura da logomarca.</figcaption>
    </figure>
    <p className="vi-muted vi-slogan-distinct">“Nossa marca, nosso jeito!” é o título deste Manual da Marca. Não substitui o slogan da logomarca.</p>
  </div>
}

export function LogoSection({ subsection }: { subsection: Subsection }) {
  return <IdentitySection subsection={subsection} className="vi-logo-section"
    lead={logoIntro.map(paragraph => <p key={paragraph}>{paragraph}</p>)}>
    <LogoOpening />
    <div className="vi-block-head" data-vi-reveal>
      <h4 className="vi-h4">Construção geométrica</h4>
      <p className="vi-muted">A logomarca é composta por um retângulo, inclinado e com os cantos arredondados, na cor azul, com o nome GAZIN em tipologia branca. Acompanhe a composição em quatro etapas.</p>
    </div>
    <LogoConstruction />
    <Symbology />
    <SloganBlock />
  </IdentitySection>
}
