import { useRef, type PointerEvent } from 'react'
import { ImagePlus } from 'lucide-react'

export type PurposePhoto = { src: string; alt: string }

/**
 * Large photo frame beside the mission and vision statements. To place a photo, fill
 * `photo.src` (path in /public, e.g. 'assets/proposito/missao.jpg') and `photo.alt` in
 * src/data/brandContent.ts; while `src` is empty the frame shows a discreet placeholder.
 * With a mouse and motion enabled it tilts towards the cursor with a soft light.
 */
export function PurposePhotoFrame({ photo }: { photo?: PurposePhoto }) {
  const stage = useRef<HTMLDivElement>(null)
  const src = photo?.src ? `${import.meta.env.BASE_URL}${photo.src.replace(/^\//, '')}` : ''

  const move = (event: PointerEvent) => {
    const element = stage.current
    if (!element || event.pointerType !== 'mouse' || !document.documentElement.classList.contains('motion-enabled')) return
    const box = element.getBoundingClientRect()
    const x = (event.clientX - box.left) / box.width, y = (event.clientY - box.top) / box.height
    element.classList.add('is-tracking')
    element.style.setProperty('--ry', `${((x - .5) * 12).toFixed(2)}deg`)
    element.style.setProperty('--rx', `${((.5 - y) * 10).toFixed(2)}deg`)
    element.style.setProperty('--gx', `${(x * 100).toFixed(1)}%`)
    element.style.setProperty('--gy', `${(y * 100).toFixed(1)}%`)
    element.style.setProperty('--glare', '1')
  }
  const leave = () => {
    const element = stage.current
    if (!element) return
    element.classList.remove('is-tracking')
    for (const name of ['--rx', '--ry', '--gx', '--gy', '--glare']) element.style.removeProperty(name)
  }

  return <div ref={stage} className="purpose-photo-stage" onPointerMove={move} onPointerLeave={leave} aria-hidden={src ? undefined : true}>
    <div className="purpose-photo-frame">
      <div className="purpose-photo-window">
        {src
          ? <img src={src} alt={photo!.alt} loading="lazy" decoding="async" />
          : <div className="purpose-photo-empty">
            {['tl', 'tr', 'bl', 'br'].map(corner => <span key={corner} className={`purpose-photo-corner is-${corner}`} />)}
            <ImagePlus size={30} strokeWidth={1.3} />
            <span>Espaço reservado para fotografia</span>
          </div>}
      </div>
    </div>
  </div>
}
