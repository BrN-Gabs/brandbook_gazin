import { useEffect, useRef, useState, type CSSProperties, type JSX } from 'react'
import { ArrowDown } from 'lucide-react'
import type { Chapter } from '../../data/brandChapters'
import { governanceIntro, maintenance, misuse, responsibilities, usage, workflow } from '../../data/governance'
import { ApprovalWorkflow, BrandDocumentsLibrary, BrandManualMaintenance, BrandUsageComparison, BrandUsageGuidelines, GovernanceResponsibilities } from './GovernanceDemos'
import '../../styles/governance.css'

const sections: { data: { summary: string; text: string }; Demo: () => JSX.Element }[] = [
  { data: responsibilities, Demo: GovernanceResponsibilities },
  { data: workflow, Demo: ApprovalWorkflow },
  { data: usage, Demo: BrandUsageGuidelines },
  { data: misuse, Demo: BrandUsageComparison },
  { data: maintenance, Demo: BrandManualMaintenance },
]

/**
 * Chapter 10 · Governança da Marca. The five cards stay on the connecting line (same ids,
 * so the menu still lands on them); the selected card's complete content opens in the
 * details area below, so the cards never become too narrow to read.
 */
export function GovernanceBody({ chapter }: { chapter: Chapter }) {
  const [active, setActive] = useState(0)
  const details = useRef<HTMLDivElement>(null)

  // Menu and in-page links to a subtopic also select it.
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
    requestAnimationFrame(() => details.current?.scrollIntoView({ block: 'start', behavior: document.documentElement.classList.contains('motion-enabled') ? 'smooth' : 'auto' }))
  }
  const subsection = chapter.subsections[active]
  const { data, Demo } = sections[active]

  return <div className="chapter-body layout-governance">
    <figure className="gv-highlight" data-gv-reveal>
      <blockquote><p>{governanceIntro.highlight}</p></blockquote>
      <figcaption>{governanceIntro.highlightLabel}</figcaption>
    </figure>

    <div className="gv-line" style={{ '--active': active } as CSSProperties}>
      <span className="gv-line-track" aria-hidden="true"><span /></span>
      {chapter.subsections.map((item, index) => <article key={item.id} id={item.id} className={`subsection gv-card ${active === index ? 'is-active' : ''}`} data-status={item.status} aria-labelledby={`${item.id}-title`}>
        <span className="subsection-node" aria-hidden="true" />
        <header className="subsection-head">
          <span className="subsection-number">{item.number}</span>
          <h3 id={`${item.id}-title`}>{item.title}</h3>
        </header>
        <p className="gv-card-summary">{sections[index].data.summary}</p>
        <button type="button" className="gv-card-open" aria-controls="gv-details" aria-expanded={active === index} onClick={() => show(index)}>
          {active === index ? 'Em exibição' : 'Explorar'}<ArrowDown size={14} aria-hidden="true" />
        </button>
      </article>)}
    </div>

    <div ref={details} id="gv-details" className="gv-details" role="region" aria-labelledby="gv-details-title" tabIndex={-1}>
      <header className="gv-details-head">
        <span className="gv-details-number">{subsection.number}</span>
        <div>
          <p id="gv-details-title" className="gv-details-title">{subsection.title}</p>
          <p className="gv-details-text">{data.text}</p>
        </div>
      </header>
      <div className="gv-details-body" key={subsection.id}><Demo /></div>
    </div>

    <BrandDocumentsLibrary />
  </div>
}
