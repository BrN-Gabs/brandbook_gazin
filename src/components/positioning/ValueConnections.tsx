import { useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { ShoppingBag, Sprout, Users, type LucideIcon } from 'lucide-react'
import { editorialLabel, valueProposition, type ValueDimension } from '../../data/positioning'
import { percentPath, useStageSize } from './useStageSize'

const icons: Record<ValueDimension['icon'], LucideIcon> = { clients: ShoppingBag, team: Users, community: Sprout }
/** Where each audience's node sits around the statement (% of the stage) and the curve to it: lines reach
 * the nodes vertically, on the side facing the centre, so they never cross the texts. */
const anchors: Record<string, { x: number; y: number; curve: [number, number][] }> = {
  clientes: { x: 31, y: 14, curve: [[50, 46], [43, 46], [31, 34], [31, 14]] },
  colaboradores: { x: 69, y: 14, curve: [[50, 46], [57, 46], [69, 34], [69, 14]] },
  comunidades: { x: 50, y: 80, curve: [[50, 46], [50, 60], [50, 70], [50, 80]] },
}

/**
 * 01.3 · the proposed value statement at the centre, connected by luminous lines to the
 * three audiences it serves. Selecting an audience lights its connection; the common
 * centre shows they share one purpose. The statement is labelled as an editorial synthesis.
 */
export function ValueConnections() {
  const { dimensions, statement } = valueProposition
  const [active, setActive] = useState<string | null>(null)
  const stage = useRef<HTMLDivElement>(null)
  const size = useStageSize(stage)
  const preview = (id: string | null) => (event: PointerEvent) => { if (event.pointerType === 'mouse') setActive(id) }

  return <div ref={stage} className="pos-value" data-pos-value data-active={active ?? ''}>
    <svg className="pos-value-links" viewBox={`0 0 ${size.width || 1} ${size.height || 1}`} aria-hidden="true">
      {dimensions.map(dimension => <g key={dimension.id} className={active === dimension.id ? 'is-lit' : active ? 'is-dim' : ''}>
        <path className="pos-value-link" d={percentPath(anchors[dimension.id].curve, size)} pathLength={1} />
        <path className="pos-value-flow" d={percentPath(anchors[dimension.id].curve, size)} pathLength={1} />
      </g>)}
    </svg>

    <figure className="pos-value-core">
      <span className="pos-value-orbit" aria-hidden="true" />
      <span className="pos-value-orbit is-second" aria-hidden="true" />
      <blockquote><p>{statement}</p></blockquote>
      <figcaption>{editorialLabel}</figcaption>
    </figure>

    <ul className="pos-value-audiences" aria-label="Dimensões da proposta de valor">
      {dimensions.map(dimension => {
        const Icon = icons[dimension.icon]
        const { x, y } = anchors[dimension.id]
        const state = active === dimension.id ? 'is-active' : active ? 'is-dim' : ''
        return <li key={dimension.id} className={`pos-audience is-${dimension.id} ${state}`} style={{ '--x': `${x}%`, '--y': `${y}%` } as CSSProperties}>
          <button type="button" aria-pressed={active === dimension.id} onClick={() => setActive(dimension.id)}
            onPointerEnter={preview(dimension.id)} onPointerLeave={preview(null)} onFocus={() => setActive(dimension.id)}>
            <span className="pos-audience-node" aria-hidden="true"><Icon size={20} strokeWidth={1.6} /></span>
            <span className="pos-audience-title">{dimension.title}</span>
          </button>
          <p>{dimension.description}</p>
        </li>
      })}
    </ul>
  </div>
}
