import { useState, type CSSProperties, type PointerEvent } from 'react'
import { personality } from '../../data/positioning'

/**
 * 01.1 · six personality attributes as an expressive word composition (different weights).
 * Hover (mouse) or select (click, tap, keyboard) one to read its meaning; one is always shown.
 */
export function PersonalityKeywords() {
  const { attributes } = personality
  const [active, setActive] = useState(attributes[0].id)
  const index = attributes.findIndex(attribute => attribute.id === active)
  const current = attributes[index]
  const preview = (id: string) => (event: PointerEvent) => { if (event.pointerType === 'mouse') setActive(id) }

  return <div className="pos-keywords" data-pos-reveal>
    <div className="pos-keyword-cloud" role="group" aria-label="Atributos da personalidade da marca">
      {attributes.map((attribute, i) => <button key={attribute.id} type="button" className={`pos-keyword is-${attribute.scale}`} style={{ '--i': i } as CSSProperties}
        aria-pressed={active === attribute.id} aria-controls="pos-keyword-detail" onClick={() => setActive(attribute.id)} onPointerEnter={preview(attribute.id)} onFocus={() => setActive(attribute.id)}>
        <span className="pos-keyword-index" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
        <span className="pos-keyword-name">{attribute.name}</span>
      </button>)}
    </div>
    <div id="pos-keyword-detail" className="pos-detail" aria-live="polite">
      <p className="pos-kicker"><span aria-hidden="true" />{personality.hint} · {index + 1}/{attributes.length}</p>
      <div className="pos-detail-body" key={current.id}>
        <p className="pos-detail-title">{current.name}</p>
        <p className="pos-detail-text">{current.description}</p>
      </div>
    </div>
  </div>
}
