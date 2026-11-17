import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { ImageOff, MoveRight, Maximize2 } from 'lucide-react'
import { frameLayout, historyEvents, historyIntro, historyPhoto, type HistoryEvent } from '../data/history'
import { HistoryViewer } from '../components/history/HistoryViewer'
import '../styles/history.css'

const base = import.meta.env.BASE_URL
const first = historyEvents[0], last = historyEvents[historyEvents.length - 1]

/** Photo inside its frame, with a graceful fallback when the file is missing or fails. */
function FramePhoto({ event, eager }: { event: HistoryEvent; eager: boolean }) {
  const photo = historyPhoto(event.id)
  const [failed, setFailed] = useState(false)
  if (!photo || failed) return <span className="history-photo-missing"><ImageOff size={22} aria-hidden="true" /><span>Fotografia indisponível</span></span>
  // Size fixed by the photo's proportion before it loads: no layout shift while the rail moves.
  return <img src={`${base}${photo.small}`} width={photo.width} height={photo.height} alt={event.alt} style={{ '--ratio': photo.width / photo.height } as CSSProperties}
    loading={eager ? 'eager' : 'lazy'} decoding="async" draggable={false} onError={() => setFailed(true)} onLoad={() => window.dispatchEvent(new Event('history:media'))} />
}

/** Smooth curve through the centre of every frame (redrawn when the layout changes). */
function useConnector(rail: React.RefObject<HTMLDivElement | null>) {
  const [connector, setConnector] = useState({ d: '', dots: [] as [number, number][], width: 0, height: 0 })
  useLayoutEffect(() => {
    const element = rail.current
    if (!element) return
    let frame = 0
    const measure = () => {
      frame = 0
      const box = element.getBoundingClientRect()
      const points = Array.from(element.querySelectorAll<HTMLElement>('.history-frame'), frameElement => {
        const rect = frameElement.getBoundingClientRect()
        return [rect.left - box.left + rect.width / 2, rect.top - box.top + rect.height / 2] as [number, number]
      })
      const d = points.reduce((path, [x, y], index) => {
        if (!index) return `M ${x} ${y}`
        const [px, py] = points[index - 1], dx = (x - px) / 2
        return `${path} C ${px + dx} ${py}, ${x - dx} ${y}, ${x} ${y}`
      }, '')
      setConnector({ d, dots: points, width: element.scrollWidth, height: element.offsetHeight })
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure) }
    measure()
    const observer = new ResizeObserver(schedule)
    observer.observe(element)
    addEventListener('history:media', schedule)
    return () => { cancelAnimationFrame(frame); observer.disconnect(); removeEventListener('history:media', schedule) }
  }, [rail])
  return connector
}

/**
 * Nossa História: horizontal timeline of photographs. On desktop (mouse), the section is
 * pinned and the mouse wheel moves the track year by year (src/motion/HistoryAnimations.ts);
 * on touch screens the track is a native swipe carousel with snap points.
 */
export function OurHistory() {
  const section = useRef<HTMLElement>(null)
  const viewport = useRef<HTMLDivElement>(null)
  const rail = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLOListElement>(null)
  const bar = useRef<HTMLSpanElement>(null)
  const [active, setActive] = useState(0)
  const [viewer, setViewer] = useState<number | null>(null)
  const opener = useRef<HTMLButtonElement | null>(null)
  const connector = useConnector(rail)

  // Active event = the frame closest to the centre of the screen; progress between first and last.
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const items = track.current?.querySelectorAll<HTMLElement>('.history-item')
      if (!items?.length) return
      const centre = innerWidth / 2
      const centres = Array.from(items, item => { const rect = item.getBoundingClientRect(); return rect.left + rect.width / 2 })
      let nearest = 0
      centres.forEach((value, index) => { if (Math.abs(value - centre) < Math.abs(centres[nearest] - centre)) nearest = index })
      // Real travel progress: rail offset when pinned, horizontal scroll otherwise.
      const scroller = viewport.current!, railElement = rail.current!
      const pinned = section.current?.classList.contains('is-pinned')
      const travel = pinned ? railElement.scrollWidth - scroller.clientWidth : scroller.scrollWidth - scroller.clientWidth
      const moved = pinned ? -new DOMMatrixReadOnly(getComputedStyle(railElement).transform).m41 : scroller.scrollLeft
      const progress = travel > 0 ? Math.min(1, Math.max(0, moved / travel)) : 0
      if (progress > .985) nearest = items.length - 1
      else if (progress < .015) nearest = 0
      if (bar.current) bar.current.style.transform = `scaleX(${progress})`
      setActive(previous => previous === nearest ? previous : nearest)
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    const scroller = viewport.current
    addEventListener('scroll', schedule, { passive: true })
    addEventListener('resize', schedule)
    addEventListener('history:progress', schedule)
    scroller?.addEventListener('scroll', schedule, { passive: true })
    return () => { cancelAnimationFrame(frame); removeEventListener('scroll', schedule); removeEventListener('resize', schedule); removeEventListener('history:progress', schedule); scroller?.removeEventListener('scroll', schedule) }
  }, [])

  const open = (index: number, button: HTMLButtonElement) => { opener.current = button; setViewer(index) }
  const close = useCallback(() => {
    setViewer(null)
    // Returning focus must not move the timeline (see HistoryAnimations focus handling).
    requestAnimationFrame(() => {
      const element = section.current
      if (element) element.dataset.restoringFocus = ''
      opener.current?.focus({ preventScroll: true })
      requestAnimationFrame(() => { if (element) delete element.dataset.restoringFocus })
    })
  }, [])

  const event = historyEvents[active]
  return <section ref={section} id="historia" className="history" aria-labelledby="history-title">
    <div className="history-pin">
      <header className="history-head">
        <p className="history-eyebrow"><span aria-hidden="true" />{historyIntro.eyebrow}</p>
        <h2 id="history-title" className="history-title">{historyIntro.title}</h2>
        <p className="history-subtitle">{historyIntro.subtitle}</p>
        <p className="history-text">{historyIntro.text}</p>
        <p className="history-hint" aria-hidden="true"><MoveRight size={18} /><span className="when-pinned">{historyIntro.hint}</span><span className="when-native">Deslize para percorrer a linha do tempo</span></p>
      </header>

      <div ref={viewport} className="history-viewport">
        <div ref={rail} className="history-rail">
        <svg className="history-connector" width={connector.width} height={connector.height} aria-hidden="true">
          <path className="history-connector-base" d={connector.d} />
          <path className="history-connector-progress" d={connector.d} pathLength={1} />
          {connector.dots.map(([x, y], index) => <circle key={index} cx={x} cy={y} r="4" />)}
        </svg>
        <ol ref={track} className="history-track" aria-label={`Linha do tempo de ${first.year} a ${last.year}`}>
          {historyEvents.map((item, index) => {
            const layout = frameLayout(index)
            const style = { '--rot': `${layout.rotation}deg`, '--y': `${layout.offsetY}vh`, '--i': index } as CSSProperties
            return <li key={item.id} className={`history-item size-${layout.size} ${layout.captionTop ? 'caption-top' : ''} ${index === active ? 'is-active' : ''}`} style={style} data-rotation={layout.rotation}>
              <div className="history-float"><div className="history-bob">
                <button type="button" className="history-frame" onClick={event => open(index, event.currentTarget)}
                  aria-label={`Ampliar fotografia de ${item.year}: ${item.title}`} aria-haspopup="dialog">
                  <FramePhoto event={item} eager={index < 4} />
                  <span className="history-zoom" aria-hidden="true"><Maximize2 size={14} /></span>
                </button>
              </div></div>
              <div className="history-caption">
                <span className="history-year">{item.year}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </li>
          })}
          <li className="history-closing"><span className="history-closing-line" aria-hidden="true" /><p>{historyIntro.closing}</p></li>
        </ol>
        </div>
      </div>

      <div className="history-progress">
        <div className="history-range">
          <span>{first.year}</span>
          <span className="history-bar" aria-hidden="true"><span ref={bar} /></span>
          <span>{last.year}</span>
        </div>
        <p className="history-current" aria-live="polite"><b>{event.year}</b><span>{event.title}</span></p>
      </div>
    </div>
    {viewer !== null && <HistoryViewer events={historyEvents} index={viewer} onNavigate={setViewer} onClose={close} />}
  </section>
}
