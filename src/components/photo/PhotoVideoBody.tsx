import { useEffect, useRef, useState } from 'react'
import { ArrowDown } from 'lucide-react'
import type { Chapter } from '../../data/brandChapters'
import { audiovisual, framing, lighting, motionEditing, style, type PvSection } from '../../data/photoVideo'
import { PhotographyLightbox, photoSrc } from './PhotographyLightbox'
import { AudiovisualDirection, FramingShowcase, LightingDemo, PhotographyStyle, VideoMotionExamples } from './PhotoVideoDemos'
import '../../styles/photo-video.css'

const sections: { data: PvSection; Demo: () => React.JSX.Element }[] = [
  { data: style, Demo: PhotographyStyle },
  { data: framing, Demo: FramingShowcase },
  { data: lighting, Demo: LightingDemo },
  { data: audiovisual, Demo: AudiovisualDirection },
  { data: motionEditing, Demo: VideoMotionExamples },
]

/**
 * Chapter 04 · Fotografia e Vídeo. The horizontal rail keeps one summary card per subtopic
 * (same ids, so menu links still land on them); selecting a card shows its complete
 * demonstration in the shared stage below, instead of five separate modals.
 */
export function PhotoVideoBody({ chapter }: { chapter: Chapter }) {
  const [active, setActive] = useState(0)
  const stage = useRef<HTMLDivElement>(null)

  // Menu and in-chapter links to a subtopic also select it.
  useEffect(() => {
    const select = (hash: string) => {
      const index = chapter.subsections.findIndex(subsection => `#${subsection.id}` === hash)
      if (index >= 0) setActive(index)
    }
    const onClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]')
      if (link) select(link.getAttribute('href')!)
    }
    const onHash = () => select(location.hash)
    document.addEventListener('click', onClick, true)
    addEventListener('hashchange', onHash)
    return () => { document.removeEventListener('click', onClick, true); removeEventListener('hashchange', onHash) }
  }, [chapter.subsections])

  const show = (index: number) => {
    setActive(index)
    requestAnimationFrame(() => stage.current?.scrollIntoView({ block: 'start', behavior: document.documentElement.classList.contains('motion-enabled') ? 'smooth' : 'auto' }))
  }

  const subsection = chapter.subsections[active]
  const { data, Demo } = sections[active]
  return <PhotographyLightbox>
    <div className="chapter-body layout-photo">
      <div className="pv-rail" role="region" aria-label={`${chapter.title}: assuntos`} tabIndex={0}>
        {chapter.subsections.map((item, index) => {
          const card = sections[index].data
          return <article key={item.id} id={item.id} className={`subsection pv-card ${active === index ? 'is-active' : ''}`} data-status={item.status} aria-labelledby={`${item.id}-title`}>
            <div className="pv-card-photo"><img src={photoSrc(card.photo)} width={card.photo.width} height={card.photo.height} alt="" loading="lazy" decoding="async" /></div>
            <header className="subsection-head">
              <span className="subsection-number">{item.number}</span>
              <h3 id={`${item.id}-title`}>{item.title}</h3>
            </header>
            <p className="pv-card-summary">{card.summary}</p>
            <button type="button" className="pv-card-open" aria-controls="pv-stage" aria-expanded={active === index} onClick={() => show(index)}>
              {active === index ? 'Em exibição' : 'Ver demonstração'}<ArrowDown size={15} aria-hidden="true" />
            </button>
          </article>
        })}
      </div>

      <div ref={stage} id="pv-stage" className="pv-stage" role="region" aria-labelledby="pv-stage-title" tabIndex={-1}>
        <header className="pv-stage-head">
          <span className="pv-stage-number">{subsection.number}</span>
          <div>
            <p id="pv-stage-title" className="pv-stage-title">{subsection.title}</p>
            <p className="pv-stage-text">{data.text}</p>
          </div>
          <p className="pv-proposal">Proposta editorial</p>
        </header>
        <div className="pv-stage-body" key={subsection.id}><Demo /></div>
      </div>
    </div>
  </PhotographyLightbox>
}
