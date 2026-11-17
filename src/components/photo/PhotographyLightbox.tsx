import { createContext, useCallback, useContext, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Maximize2, X } from 'lucide-react'
import type { PvPhoto } from '../../data/photoVideo'

const base = import.meta.env.BASE_URL
export const photoSrc = (photo: PvPhoto) => `${base}${photo.src}`

type Open = (photo: PvPhoto, caption?: string) => void
const LightboxContext = createContext<Open>(() => {})

/**
 * One enlarged-photo viewer for the whole chapter (native <dialog>: focus stays inside,
 * Escape and the backdrop close it, focus returns to the photo that opened it).
 */
export function PhotographyLightbox({ children }: { children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const opener = useRef<HTMLElement | null>(null)
  const [current, setCurrent] = useState<{ photo: PvPhoto; caption?: string } | null>(null)
  const open = useCallback<Open>((photo, caption) => {
    opener.current = document.activeElement as HTMLElement | null
    setCurrent({ photo, caption })
  }, [])
  useEffect(() => {
    const element = dialog.current
    if (!current || !element || element.open) return
    element.showModal()
    window.dispatchEvent(new CustomEvent('brandbook:scroll-lock', { detail: true }))
  }, [current])
  const onClose = () => {
    window.dispatchEvent(new CustomEvent('brandbook:scroll-lock', { detail: false }))
    setCurrent(null)
    opener.current?.focus({ preventScroll: true })
  }
  return <LightboxContext.Provider value={open}>
    {children}
    <dialog ref={dialog} className="pv-lightbox" aria-label="Fotografia ampliada" onClose={onClose}
      onClick={event => { if (event.target === event.currentTarget) dialog.current?.close() }}>
      {current && <figure>
        <img src={photoSrc(current.photo)} width={current.photo.width} height={current.photo.height} alt={current.photo.alt} />
        <figcaption>{current.caption && <b>{current.caption}</b>}<span>{current.photo.credit}</span></figcaption>
      </figure>}
      <button type="button" className="pv-lightbox-close" onClick={() => dialog.current?.close()} aria-label="Fechar fotografia ampliada"><X size={20} aria-hidden="true" /></button>
    </dialog>
  </LightboxContext.Provider>
}

/** Photo that opens in the lightbox (a real button: mouse, touch and keyboard). */
export function ZoomablePhoto({ photo, caption, className = '', imgClassName = '', style }: { photo: PvPhoto; caption?: string; className?: string; imgClassName?: string; style?: CSSProperties }) {
  const open = useContext(LightboxContext)
  return <button type="button" className={`pv-zoom ${className}`} onClick={() => open(photo, caption)} aria-label={`Ampliar fotografia: ${caption ?? photo.alt}`}>
    <img className={imgClassName} src={photoSrc(photo)} width={photo.width} height={photo.height} alt={photo.alt} loading="lazy" decoding="async" style={style} />
    <span className="pv-zoom-icon" aria-hidden="true"><Maximize2 size={15} /></span>
  </button>
}
