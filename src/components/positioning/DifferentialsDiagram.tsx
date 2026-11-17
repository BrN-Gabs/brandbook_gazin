import { useState, type CSSProperties } from 'react'
import { Handshake, HeartHandshake, History, Layers, Sparkles, type LucideIcon } from 'lucide-react'
import { differentials, type DifferentialIcon } from '../../data/positioning'

const icons: Record<DifferentialIcon, LucideIcon> = { history: History, people: HeartHandshake, layers: Layers, handshake: Handshake, sparkles: Sparkles }

/**
 * 01.2 · five strategic pillars on one luminous line (concepts, not statistics).
 * Hovering one lights the line up to it and lets the others recede slightly.
 * All texts are always visible: the highlight is an enhancement, not a gate.
 */
export function DifferentialsDiagram() {
  const { items } = differentials
  const [active, setActive] = useState<number | null>(null)
  const fill = active === null ? 1 : (active + .5) / items.length
  return <div className="pos-diff" data-pos-diff style={{ '--fill': fill } as CSSProperties} onPointerLeave={() => setActive(null)}>
    <div className="pos-diff-line" aria-hidden="true"><span className="pos-diff-line-fill" /></div>
    <ol className="pos-diff-list">
      {items.map((item, i) => {
        const Icon = icons[item.icon]
        const state = active === i ? 'is-active' : active !== null ? 'is-dim' : ''
        return <li key={item.number} className={`pos-diff-item ${state}`} onPointerEnter={event => { if (event.pointerType === 'mouse') setActive(i) }}>
          <span className="pos-diff-node" aria-hidden="true" />
          <span className="pos-diff-number" aria-hidden="true">{item.number}</span>
          <span className="pos-diff-icon" aria-hidden="true"><Icon size={22} strokeWidth={1.5} /></span>
          <h4><span className="pos-sr-only">{item.number} · </span>{item.title}</h4>
          <p>{item.description}</p>
        </li>
      })}
    </ol>
  </div>
}
