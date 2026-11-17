import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Building2, ChevronDown, FileText, Images, MessageSquareQuote, MonitorPlay } from 'lucide-react'
import type { Chapter } from '../../data/brandChapters'
import { campaigns, internalAssets, language, materials, notices, tv } from '../../data/internalCommunication'
import { CorporateNoticeComparison, EmployeeCampaignGallery, InternalLanguageGuide, InternalMaterialsLibrary, InternalTvShowcase } from './InternalDemos'
import '../../styles/internal.css'

const base = import.meta.env.BASE_URL
const motionOn = () => document.documentElement.classList.contains('motion-enabled')

/** Small visual of each card (the full demonstration is in the details panel). */
const previews: ReactNode[] = [
  <span className="in-preview is-tv" aria-hidden="true"><span className="in-preview-screen"><img src={`${base}${internalAssets.tvGazin.src}`} alt="" /><i /><i /></span><MonitorPlay size={18} /></span>,
  <span className="in-preview is-doc" aria-hidden="true"><span className="in-preview-paper"><img src={`${base}${internalAssets.gazinLight.src}`} alt="" /><b /><i /><i /><i /></span><FileText size={18} /></span>,
  <span className="in-preview is-gallery" aria-hidden="true"><span className="in-preview-tiles"><i /><i /><i /></span><Images size={18} /></span>,
  <span className="in-preview is-stack" aria-hidden="true"><span className="in-preview-sheets"><i /><i /><i /></span><Building2 size={18} /></span>,
  <span className="in-preview is-chat" aria-hidden="true"><span className="in-preview-bubbles"><i /><i /></span><MessageSquareQuote size={18} /></span>,
]
const summaries = [tv.summary, notices.summary, campaigns.summary, materials.summary, language.summary]
const details = [InternalTvShowcase, CorporateNoticeComparison, EmployeeCampaignGallery, InternalMaterialsLibrary, InternalLanguageGuide]
const texts = [tv.text, notices.text, campaigns.text, materials.text, language.text]

/**
 * Chapter 08 · Comunicação Interna. Keeps the horizontal strip of vertical cards (same ids,
 * so the index, the side menu and F5 work as before); each card opens the full content in one
 * shared details panel below the strip. The strip scrolls like chapter 04 (native, thin blue
 * scrollbar that shows the real position; swipe and Shift+wheel).
 */
export function InternalCommunicationBody({ chapter }: { chapter: Chapter }) {
  const [active, setActive] = useState(0)
  const rail = useRef<HTMLDivElement>(null)
  const detail = useRef<HTMLElement>(null)
  const detailTitle = useRef<HTMLHeadingElement>(null)
  const ids = chapter.subsections.map(subsection => subsection.id)

  const scrollToCard = (index: number) => {
    const element = rail.current, card = element?.children[index] as HTMLElement | undefined
    if (!element || !card) return
    element.scrollTo({ left: card.offsetLeft - element.offsetLeft - 4, behavior: motionOn() ? 'smooth' : 'auto' })
  }
  const open = (index: number) => {
    setActive(index)
    scrollToCard(index)
    requestAnimationFrame(() => {
      detail.current?.scrollIntoView({ block: 'start', behavior: motionOn() ? 'smooth' : 'auto' })
      detailTitle.current?.focus({ preventScroll: true })
    })
  }

  useEffect(() => {
    // Links to a card (chapter index, side menu) also select it and bring it into the strip.
    const onClick = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href^="#comunicacao-interna-"]') : null
      const index = link ? ids.indexOf(link.getAttribute('href')!.slice(1)) : -1
      if (index >= 0) { setActive(index); scrollToCard(index) }
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const Detail = details[active]
  const current = chapter.subsections[active]
  return <div className="chapter-body layout-internal">
    <div className="in-strip">
      <div ref={rail} className="layout-rail in-rail" role="region" aria-label={`${chapter.title}: assuntos`} tabIndex={0}>
        {chapter.subsections.map((subsection, index) => <article key={subsection.id} id={subsection.id} className={`subsection in-card ${active === index ? 'is-active' : ''}`} data-status={subsection.status} aria-labelledby={`${subsection.id}-title`}>
          {previews[index]}
          <header className="subsection-head">
            <span className="subsection-number">{subsection.number}</span>
            <h3 id={`${subsection.id}-title`}>{subsection.title}</h3>
          </header>
          <p className="in-card-summary">{summaries[index]}</p>
          <button type="button" className="in-card-open" aria-expanded={active === index} aria-controls="in-detail" onClick={() => open(index)}>
            {active === index ? 'Detalhes abertos' : 'Ver detalhes'}<ChevronDown size={16} aria-hidden="true" />
          </button>
        </article>)}
      </div>
    </div>

    <section id="in-detail" ref={detail} className="in-detail" aria-labelledby="in-detail-title">
      <header className="in-detail-head">
        <span className="in-detail-number">{current.number}</span>
        <h3 id="in-detail-title" ref={detailTitle} tabIndex={-1}>{current.title}</h3>
        <p>{texts[active]}</p>
      </header>
      <div className="in-detail-body" key={current.id}><Detail /></div>
    </section>
  </div>
}
