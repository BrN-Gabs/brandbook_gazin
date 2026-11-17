import { useId, useState, type CSSProperties, type PointerEvent } from 'react'
import { manualPage, photo, type Hotspot, type Photo } from '../../data/physicalCommunication'

const base = import.meta.env.BASE_URL

/** Official photo from the manual, sized by its real proportion (no layout shift). */
export function ManualPhoto({ image, className = '', fit }: { image: Photo; className?: string; fit?: 'cover' | 'contain' }) {
  const meta = photo(image.id)
  return <img className={`cf-photo ${className}`} src={`${base}${meta.src}`} width={meta.width} height={meta.height} alt={image.alt}
    loading="lazy" decoding="async" style={fit ? { objectFit: fit } : undefined} />
}

/**
 * Photo with numbered points of attention. Hover (mouse), click, tap or keyboard selects a
 * point; its explanation appears under the photo, so nothing covers the image.
 */
export function InteractiveImageGuide({ image, hotspots, className = '' }: { image: Photo; hotspots: Hotspot[]; className?: string }) {
  const [active, setActive] = useState(0)
  const id = useId()
  const current = hotspots[active]
  const preview = (index: number) => (event: PointerEvent) => { if (event.pointerType === 'mouse') setActive(index) }
  return <figure className={`cf-guide ${className}`}>
    <div className="cf-guide-stage">
      <ManualPhoto image={image} />
      <div className="cf-hotspots" role="group" aria-label={`Pontos de atenção: ${image.caption}`}>
        {hotspots.map((spot, index) => <button key={spot.id} type="button" className="cf-hotspot" style={{ '--x': `${spot.x}%`, '--y': `${spot.y}%` } as CSSProperties}
          aria-pressed={active === index} aria-controls={id} aria-label={`${index + 1}. ${spot.label}`}
          onClick={() => setActive(index)} onPointerEnter={preview(index)} onFocus={() => setActive(index)}>
          <span aria-hidden="true">{index + 1}</span>
        </button>)}
      </div>
    </div>
    <figcaption id={id} className="cf-guide-caption" aria-live="polite">
      <span className="cf-guide-count" aria-hidden="true">{active + 1}/{hotspots.length}</span>
      <span className="cf-guide-text" key={current.id}><b>{current.label}</b>{current.text}</span>
      <span className="cf-source">{image.caption} · {manualPage(current.page)}</span>
    </figcaption>
  </figure>
}
