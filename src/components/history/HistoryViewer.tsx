import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { ArrowLeft, ArrowRight, ImageOff, X } from 'lucide-react'
import { historyPhoto, type HistoryEvent } from '../../data/history'

const base = import.meta.env.BASE_URL
const scrollKeys = new Set([' ', 'PageUp', 'PageDown', 'Home', 'End', 'ArrowUp', 'ArrowDown'])

/**
 * Enlarged photograph with year, title and description. Modal: focus stays inside,
 * Escape / close button / backdrop close it, arrows move between events. The page
 * behind never scrolls, so the timeline is exactly where the reader left it.
 */
export function HistoryViewer({ events, index, onNavigate, onClose }: {
  events: HistoryEvent[]
  index: number
  onNavigate: (index: number) => void
  onClose: () => void
}) {
  const dialog = useRef<HTMLDivElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const [failed, setFailed] = useState<string | null>(null)
  const event = events[index]
  const photo = historyPhoto(event.id)
  const hasPrevious = index > 0, hasNext = index < events.length - 1

  useEffect(() => { closeButton.current?.focus({ preventScroll: true }) }, [])

  // Block every page scroll while open (wheel, touch, keys); Lenis is told to pause too.
  useEffect(() => {
    const element = dialog.current!
    const block = (event: Event) => event.preventDefault()
    element.addEventListener('wheel', block, { passive: false })
    element.addEventListener('touchmove', block, { passive: false })
    window.dispatchEvent(new CustomEvent('brandbook:scroll-lock', { detail: true }))
    return () => {
      element.removeEventListener('wheel', block)
      element.removeEventListener('touchmove', block)
      window.dispatchEvent(new CustomEvent('brandbook:scroll-lock', { detail: false }))
    }
  }, [])

  // Warm up the neighbours so navigating feels instant.
  useEffect(() => {
    for (const neighbour of [events[index - 1], events[index + 1]]) {
      const source = neighbour && historyPhoto(neighbour.id)
      if (source) new Image().src = `${base}${source.large}`
    }
  }, [events, index])

  const onKeyDown = (keyEvent: ReactKeyboardEvent) => {
    if (keyEvent.key === 'Escape') { keyEvent.preventDefault(); onClose(); return }
    if (keyEvent.key === 'ArrowLeft' && hasPrevious) { keyEvent.preventDefault(); onNavigate(index - 1); return }
    if (keyEvent.key === 'ArrowRight' && hasNext) { keyEvent.preventDefault(); onNavigate(index + 1); return }
    if (scrollKeys.has(keyEvent.key) && !(keyEvent.target instanceof HTMLButtonElement && keyEvent.key === ' ')) keyEvent.preventDefault()
    if (keyEvent.key !== 'Tab') return
    const focusable = Array.from(dialog.current!.querySelectorAll<HTMLElement>('button:not([disabled])'))
    const firstItem = focusable[0], lastItem = focusable[focusable.length - 1]
    if (keyEvent.shiftKey && document.activeElement === firstItem) { keyEvent.preventDefault(); lastItem.focus() }
    else if (!keyEvent.shiftKey && document.activeElement === lastItem) { keyEvent.preventDefault(); firstItem.focus() }
  }

  return <div className="history-viewer" onKeyDown={onKeyDown} onClick={clickEvent => { if (clickEvent.target === clickEvent.currentTarget) onClose() }}
    ref={dialog} role="dialog" aria-modal="true" aria-labelledby="history-viewer-title" data-lenis-prevent>
    <div className="history-viewer-panel">
      <figure className="history-viewer-figure" key={event.id}>
        {photo && failed !== event.id
          ? <img src={`${base}${photo.large}`} width={photo.width} height={photo.height} alt={event.alt} decoding="async" onError={() => setFailed(event.id)} />
          : <span className="history-photo-missing"><ImageOff size={28} aria-hidden="true" /><span>Fotografia indisponível</span></span>}
      </figure>
      <div className="history-viewer-info">
        {/* Only the text is re-mounted (fade); the buttons keep keyboard focus while navigating. */}
        <div className="history-viewer-text" key={event.id}>
          <p className="history-viewer-count">{index + 1} / {events.length}</p>
          <span className="history-year">{event.year}</span>
          <h3 id="history-viewer-title">{event.title}</h3>
          <p>{event.description}</p>
        </div>
        <div className="history-viewer-nav">
          <button type="button" onClick={() => onNavigate(index - 1)} disabled={!hasPrevious} aria-label="Acontecimento anterior"><ArrowLeft size={18} aria-hidden="true" /><span>{hasPrevious ? events[index - 1].year : ''}</span></button>
          <button type="button" onClick={() => onNavigate(index + 1)} disabled={!hasNext} aria-label="Próximo acontecimento"><span>{hasNext ? events[index + 1].year : ''}</span><ArrowRight size={18} aria-hidden="true" /></button>
        </div>
      </div>
      <button ref={closeButton} type="button" className="history-viewer-close" onClick={onClose} aria-label="Fechar fotografia"><X size={20} aria-hidden="true" /></button>
    </div>
  </div>
}
