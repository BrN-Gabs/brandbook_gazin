import { useRef, type KeyboardEvent, type ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { digitalLabels, type CrossLink, type Guideline } from '../../data/digitalCommunication'

export const base = import.meta.env.BASE_URL

/**
 * Segmented control (radio group): one selected option, arrow keys move the selection,
 * only the selected option is in the Tab order (roving tabindex). Works with mouse and touch.
 */
export function Segmented<T extends string>({ label, options, value, onChange, className = '' }: {
  label: string
  options: { id: T; label: ReactNode; title?: string }[]
  value: T
  onChange: (id: T) => void
  className?: string
}) {
  const group = useRef<HTMLDivElement>(null)
  const index = Math.max(0, options.findIndex(option => option.id === value))
  const onKeyDown = (event: KeyboardEvent) => {
    const step = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 0
    const edge = event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1 : -1
    if (!step && edge < 0) return
    event.preventDefault()
    const next = edge >= 0 ? edge : (index + step + options.length) % options.length
    onChange(options[next].id)
    group.current?.querySelectorAll<HTMLElement>('[role="radio"]')[next]?.focus()
  }
  return <div ref={group} className={`dg-segmented ${className}`} role="radiogroup" aria-label={label} onKeyDown={onKeyDown}>
    {options.map(option => <button key={option.id} type="button" role="radio" aria-checked={option.id === value} tabIndex={option.id === value ? 0 : -1} title={option.title} onClick={() => onChange(option.id)}>{option.label}</button>)}
  </div>
}

/** Compact list of guidelines (title + one line). */
export function Guidelines({ items, label = digitalLabels.guidelines }: { items: Guideline[]; label?: string }) {
  return <div className="dg-guidelines">
    <p className="dg-kicker">{label}</p>
    <dl>{items.map(item => <div key={item.title}><dt>{item.title}</dt><dd>{item.text}</dd></div>)}</dl>
  </div>
}

/** Discreet links to the chapters this one builds on (no duplicated content). */
export function Related({ links }: { links: CrossLink[] }) {
  return <p className="dg-related"><span>{digitalLabels.related}</span>{links.map(link => <a key={link.href} href={link.href}>{link.label}<ArrowUpRight size={13} aria-hidden="true" /></a>)}</p>
}

export function DemoLabel({ children }: { children: ReactNode }) {
  return <p className="dg-demo-label">{children}</p>
}
