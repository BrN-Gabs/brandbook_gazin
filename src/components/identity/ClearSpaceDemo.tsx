import { useEffect, useRef, useState } from 'react'
import { Check, X as Cross } from 'lucide-react'
import type { Subsection } from '../../data/brandChapters'
import { clearSpaceRatio, logoMeasures } from '../../data/visualIdentity'
import { H, IdentitySection, ProvenanceTag, RadioSegmented, W, logoUrl, useSvgId } from './shared'

type Mode = 'correta' | 'invasao' | 'moldura'
const modes: { id: Mode; label: string; text: string }[] = [
  { id: 'correta', label: 'Aplicação correta', text: 'Textos e outros elementos ficam fora da área de segurança. O fundo pode ocupá-la; nada mais.' },
  { id: 'invasao', label: 'Invasão', text: 'Texto e forma invadem a área de segurança: a logomarca perde visibilidade e impacto.' },
  { id: 'moldura', label: 'Moldura', text: 'Os limites da área de segurança foram desenhados como um quadro. Eles nunca devem moldurar a logomarca.' },
]

const X = logoMeasures.iWidth
const M = X * 2.6
const zone = { x: -X, y: -X, w: W + X * 2, h: H + X * 2 }
const view = { x: zone.x - M, y: zone.y - M, w: zone.w + M * 2, h: zone.h + M * 2 }
const { x: iX, y: iY } = logoMeasures.iSample

export function ClearSpaceDemo({ subsection }: { subsection: Subsection }) {
  const [guides, setGuides] = useState(true)
  const [mode, setMode] = useState<Mode>('correta')
  const [scale, setScale] = useState(100)
  const [logoPx, setLogoPx] = useState(0)
  const svg = useRef<SVGSVGElement>(null)
  const hatch = useSvgId('vi-zone-hatch')

  // Live value of X in screen pixels: it follows the logo size, never a fixed number.
  useEffect(() => {
    const element = svg.current
    if (!element) return
    const observer = new ResizeObserver(([entry]) => setLogoPx(entry.contentRect.width * W / view.w))
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const current = modes.find(item => item.id === mode)!
  const wrong = mode !== 'correta'
  return <IdentitySection subsection={subsection} className="vi-clear-section"
    lead={<>
      <p>Para dar visibilidade e impacto à logomarca, ela é protegida por uma área livre proporcional à largura da letra “i” da palavra Gazin. Essa medida é a unidade <strong>X</strong> e vale para todos os lados.</p>
      <p>A área nunca deve ser invadida por objetos ou textos além do fundo. E seus limites não devem ser usados para moldurar a logomarca.</p>
    </>}>
    <div className="vi-clear">
      <div className="vi-clear-controls">
        <RadioSegmented label="Exemplo de aplicação" options={modes} value={mode} onChange={setMode} />
        <button type="button" className="vi-switch" aria-pressed={guides} onClick={() => setGuides(value => !value)}>
          <span className="vi-switch-track" aria-hidden="true"><span /></span>{guides ? 'Ocultar área de segurança' : 'Mostrar área de segurança'}
        </button>
      </div>

      <div className={`vi-clear-stage ${guides ? 'has-guides' : ''}`} data-mode={mode}>
        <div className="vi-clear-scale" style={{ width: `${scale}%` }}>
          <svg ref={svg} viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`} role="img"
            aria-label={`Logomarca com área de segurança de X em todos os lados. Exemplo: ${current.label}. ${current.text}`}>
            <defs>
              <pattern id={hatch} width="44" height="44" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)">
                <line x1="0" y1="0" x2="0" y2="44" className="vi-zone-hatch-line" />
              </pattern>
            </defs>
            <g className="vi-zone" aria-hidden="true">
              <rect x={zone.x} y={zone.y} width={zone.w} height={zone.h} fill={`url(#${hatch})`} className="vi-zone-fill" />
              <rect x={zone.x} y={zone.y} width={zone.w} height={zone.h} className="vi-zone-line" />
              <rect x="0" y="0" width={W} height={H} className="vi-zone-inner" />
              {[[zone.x, zone.y], [W, zone.y], [zone.x, H], [W, H]].map(([x, y]) => <g key={`${x}-${y}`} className="vi-zone-unit">
                <rect x={x} y={y} width={X} height={X} />
                <text x={x + X / 2} y={y + X / 2 + 26} textAnchor="middle">X</text>
              </g>)}
            </g>
            <image href={logoUrl} width={W} height={H} />
            <g className="vi-i-measure" aria-hidden="true">
              <line x1={iX} x2={iX + X} y1={iY} y2={iY} />
              <line x1={iX} x2={iX} y1={iY - 34} y2={iY + 34} />
              <line x1={iX + X} x2={iX + X} y1={iY - 34} y2={iY + 34} />
              <path d={`M ${iX + X / 2} ${iY - 40} L ${iX + X / 2} ${zone.y - 70} L ${W + X * .55} ${zone.y - 70}`} />
              <text x={W + X * .6} y={zone.y - 50}>X = largura do “i”</text>
            </g>
            <rect className="vi-frame-error" x={zone.x} y={zone.y} width={zone.w} height={zone.h} rx="40" aria-hidden="true" />
            <g className="vi-intruder vi-intruder-text" aria-hidden="true">
              <rect x={W + X + 60} y={H * .22} width={M - 120} height="54" rx="8" />
              <rect x={W + X + 60} y={H * .22 + 96} width={(M - 120) * .82} height="54" rx="8" />
              <rect x={W + X + 60} y={H * .22 + 192} width={(M - 120) * .6} height="54" rx="8" />
              <text x={W + X + 60} y={H * .22 - 34}>Texto</text>
            </g>
            <g className="vi-intruder vi-intruder-shape" aria-hidden="true">
              <circle cx={zone.x - M / 2} cy={H * .72} r={M * .3} />
            </g>
          </svg>
        </div>
        <p className={`vi-clear-verdict ${wrong ? 'is-wrong' : 'is-right'}`} aria-live="polite">
          {wrong ? <Cross size={16} aria-hidden="true" /> : <Check size={16} aria-hidden="true" />}
          <span><b>{wrong ? 'Incorreto' : 'Correto'}</b> · {current.text}</span>
        </p>
      </div>

      <div className="vi-clear-footer">
        <label className="vi-field vi-clear-size">
          <span>Tamanho da logomarca na demonstração</span>
          <input type="range" min={45} max={100} value={scale} onChange={event => setScale(Number(event.target.value))} aria-valuetext={`${scale}%`} />
        </label>
        <dl className="vi-readout" aria-live="polite">
          <div><dt>Largura da logo</dt><dd>{Math.round(logoPx)} px</dd></div>
          <div><dt>X nesta tela</dt><dd>{Math.round(logoPx * clearSpaceRatio)} px</dd></div>
        </dl>
        <p className="vi-note">X acompanha sempre o tamanho da logomarca. No arquivo original, a letra “i” tem {X} px de largura em {W} px. <ProvenanceTag kind="medido" /> As linhas são guias de demonstração, nunca parte da marca.</p>
      </div>
    </div>
  </IdentitySection>
}
