import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { ArrowUp, ChevronDown, Menu, X } from 'lucide-react'
import { brandContent as content } from '../data/brandContent'
import { brandChapters } from '../data/brandChapters'

type Entry = { id: string; number?: string; label: string; children?: { id: string; number: string; label: string }[] }

// The essence sections that already existed, then the chapters (all generated from data).
const essence: Entry[] = content.navigation.map(item => ({ id: item.id, label: item.id === 'pilares' ? 'Pilares da Marca' : item.label }))
const chapters: Entry[] = brandChapters.map(chapter => ({
  id: chapter.id, number: chapter.number, label: chapter.title,
  children: chapter.subsections.map(subsection => ({ id: subsection.id, number: subsection.number, label: subsection.title })),
}))

/** Tracks which section (and subtopic) is at the reading line, 40% down the viewport. */
function useActiveSection() {
  const [active, setActive] = useState({ section: 'inicio', sub: '' })
  useEffect(() => {
    let frame = 0
    const sections = [...essence, ...chapters]
    const update = () => {
      frame = 0
      const line = innerHeight * .4
      let section = sections[0].id, sub = ''
      for (const entry of sections) {
        const element = document.getElementById(entry.id)
        if (element && element.getBoundingClientRect().top <= line) section = entry.id
      }
      const current = sections.find(entry => entry.id === section)
      for (const child of current?.children ?? []) {
        const element = document.getElementById(child.id)
        if (element && element.getBoundingClientRect().top <= line) sub = child.id
      }
      setActive(previous => previous.section === section && previous.sub === sub ? previous : { section, sub })
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    addEventListener('scroll', schedule, { passive: true })
    addEventListener('resize', schedule)
    return () => { cancelAnimationFrame(frame); removeEventListener('scroll', schedule); removeEventListener('resize', schedule) }
  }, [])
  return active
}

/**
 * Brandbook navigation: a compact bar (current chapter + back to top) that opens a
 * panel with every chapter; chapters expand to reveal their subtopics.
 */
export function BrandbookNav() {
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set())
  const active = useActiveSection()
  const trigger = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const current = useMemo(() => [...essence, ...chapters].find(entry => entry.id === active.section) ?? essence[0], [active.section])
  const pastHero = active.section !== 'inicio'

  const close = (restoreFocus = true) => {
    setOpen(false)
    if (restoreFocus) requestAnimationFrame(() => trigger.current?.focus())
  }
  const toggleChapter = (id: string) => setExpanded(previous => {
    const next = new Set(previous)
    if (next.has(id)) next.delete(id); else next.add(id)
    return next
  })

  useEffect(() => {
    if (!open) return
    // Opening reveals where the reader is: the current chapter starts expanded.
    if (current.children) setExpanded(previous => new Set(previous).add(current.id))
    requestAnimationFrame(() => (panel.current?.querySelector<HTMLElement>('[aria-current="true"]') ?? panel.current?.querySelector<HTMLElement>('a, button'))?.focus())
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') close() }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // Keep Tab inside the open panel (modal dialog).
  const trapFocus = (event: ReactKeyboardEvent) => {
    if (event.key !== 'Tab' || !panel.current) return
    const focusable = Array.from(panel.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')).filter(element => element.offsetParent !== null)
    const first = focusable[0], last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
  }

  const link = (entry: { id: string; number?: string; label: string }, isActive: boolean, className = '') =>
    <a href={`#${entry.id}`} className={className} aria-current={isActive ? 'true' : undefined} onClick={() => close(false)}>
      {entry.number && <b>{entry.number}</b>}<span>{entry.label}</span>
    </a>

  return <div className={`brandbook-nav ${open ? 'is-open' : ''} ${pastHero ? 'is-past-hero' : ''}`}>
    <div className="nav-bar">
      <button ref={trigger} type="button" className="nav-trigger" aria-expanded={open} aria-controls="brandbook-menu" aria-haspopup="dialog" aria-label={`Capítulos — seção atual: ${current.number ? current.number + " " : ""}${current.label}`} onClick={() => setOpen(value => !value)}>
        <Menu size={16} aria-hidden="true" />
        <span className="nav-trigger-label">Capítulos</span>
        <span className="nav-current" aria-hidden="true">{current.number && <b>{current.number}</b>}<span>{current.label}</span></span>
      </button>
      <a className="nav-top" href="#inicio" aria-label="Voltar ao topo" tabIndex={pastHero ? 0 : -1} aria-hidden={!pastHero}><ArrowUp size={16} aria-hidden="true" /></a>
    </div>

    <div className="nav-scrim" aria-hidden="true" onClick={() => close()} />
    <div ref={panel} id="brandbook-menu" className="nav-panel" role="dialog" aria-modal="true" aria-label="Navegação do Manual da Marca" hidden={!open} onKeyDown={trapFocus} data-lenis-prevent>
      <div className="nav-panel-head">
        <span className="nav-panel-title">Manual da Marca <b>DNA Gazin</b></span>
        <button type="button" className="nav-close" onClick={() => close()} aria-label="Fechar navegação"><X size={18} aria-hidden="true" /></button>
      </div>
      <nav aria-label="Capítulos do Manual da Marca">
        <p className="nav-group">Essência</p>
        <ol className="nav-list">
          {essence.map(entry => <li key={entry.id}>{link(entry, active.section === entry.id, 'nav-link')}</li>)}
        </ol>
        <p className="nav-group">Capítulos</p>
        <ol className="nav-list">
          {chapters.map(entry => {
            const isOpen = expanded.has(entry.id)
            return <li key={entry.id} className={isOpen ? 'is-expanded' : ''}>
              <div className="nav-chapter">
                {link(entry, active.section === entry.id, 'nav-link')}
                <button type="button" className="nav-expand" aria-expanded={isOpen} aria-controls={`nav-${entry.id}`} aria-label={`${isOpen ? 'Ocultar' : 'Mostrar'} assuntos de ${entry.label}`} onClick={() => toggleChapter(entry.id)}>
                  <ChevronDown size={16} aria-hidden="true" />
                </button>
              </div>
              <ol id={`nav-${entry.id}`} className="nav-sublist" hidden={!isOpen}>
                {entry.children!.map(child => <li key={child.id}>{link(child, active.sub === child.id, 'nav-sublink')}</li>)}
              </ol>
            </li>
          })}
        </ol>
      </nav>
    </div>
  </div>
}
