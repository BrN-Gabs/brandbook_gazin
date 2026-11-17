import { useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { marketPositioning } from '../../data/positioning'
import { useStageSize } from './useStageSize'

/**
 * 01.4 · the five positioning attributes as a constellation. Each star is a button:
 * the active one grows, its connections light up and its meaning is revealed beside it.
 */
export function PositioningConstellation() {
  const { attributes, links } = marketPositioning
  const [active, setActive] = useState(0)
  const preview = (index: number) => (event: PointerEvent) => { if (event.pointerType === 'mouse') setActive(index) }
  const current = attributes[active]
  const sky = useRef<HTMLDivElement>(null)
  const { width, height } = useStageSize(sky)

  return <div className="pos-constellation" data-pos-constellation>
    <div ref={sky} className="pos-sky">
      <svg className="pos-sky-links" viewBox={`0 0 ${width || 1} ${height || 1}`} aria-hidden="true">
        {links.map(([a, b]) => {
          const [x1, y1] = attributes[a].point, [x2, y2] = attributes[b].point
          const lit = a === active || b === active
          return <line key={`${a}-${b}`} className={lit ? 'is-lit' : ''} x1={x1 / 100 * width} y1={y1 / 100 * height} x2={x2 / 100 * width} y2={y2 / 100 * height} pathLength={1} />
        })}
      </svg>
      <div className="pos-stars" role="group" aria-label="Atributos de posicionamento">
        {attributes.map((attribute, i) => <button key={attribute.id} type="button" className={`pos-star ${attribute.point[0] > 80 ? 'is-right' : ''}`}
          style={{ '--x': `${attribute.point[0]}%`, '--y': `${attribute.point[1]}%`, '--i': i } as CSSProperties}
          aria-pressed={active === i} aria-controls="pos-star-detail" onClick={() => setActive(i)} onPointerEnter={preview(i)} onFocus={() => setActive(i)}>
          <span className="pos-star-dot" aria-hidden="true" />
          <span className="pos-star-label">{attribute.name}</span>
        </button>)}
      </div>
    </div>
    <div id="pos-star-detail" className="pos-detail" aria-live="polite">
      <p className="pos-kicker"><span aria-hidden="true" />{marketPositioning.hint} · {active + 1}/{attributes.length}</p>
      <div className="pos-detail-body" key={current.id}>
        <p className="pos-detail-title">{current.name}</p>
        <p className="pos-detail-text">{current.description}</p>
      </div>
    </div>
  </div>
}
