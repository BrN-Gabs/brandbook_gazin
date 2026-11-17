import type { ReactNode } from 'react'
import type { Chapter, Subsection } from '../../data/brandChapters'
import { differentials, editorialLabel, marketPositioning, personality, valueProposition } from '../../data/positioning'
import { PersonalityKeywords } from './PersonalityKeywords'
import { DifferentialsDiagram } from './DifferentialsDiagram'
import { ValueConnections } from './ValueConnections'
import { PositioningConstellation } from './PositioningConstellation'
import '../../styles/positioning.css'

/**
 * One subtopic with the same anatomy as the other chapters (number, title, text, node on
 * the spine), so ids, navigation and the DNA spine stay as they were. `wide` places the
 * visual under the text, across both columns.
 */
function PositioningSubsection({ subsection, text, wide, children, after }: { subsection: Subsection; text: string; wide?: boolean; children: ReactNode; after?: ReactNode }) {
  return <article id={subsection.id} className={`subsection pos-subsection ${wide ? 'is-wide' : ''}`} data-status={subsection.status} aria-labelledby={`${subsection.id}-title`}>
    <span className="subsection-node" aria-hidden="true" />
    <header className="subsection-head">
      <span className="subsection-number">{subsection.number}</span>
      <h3 id={`${subsection.id}-title`}><span className="pos-title-mask"><span className="pos-title-line">{subsection.title}</span></span></h3>
    </header>
    <div className="subsection-text"><p data-pos-reveal>{text}</p></div>
    <div className="pos-visual">{children}</div>
    {after}
  </article>
}

/** Chapter 01 · Posicionamento da Marca: content from src/data/positioning.ts. */
export function PositioningBody({ chapter }: { chapter: Chapter }) {
  const [personalitySection, differentialsSection, valueSection, marketSection] = chapter.subsections
  return <div className="chapter-body layout-split layout-positioning">
    <PositioningSubsection subsection={personalitySection} text={personality.text}><PersonalityKeywords /></PositioningSubsection>
    <PositioningSubsection subsection={differentialsSection} text={differentials.text} wide><DifferentialsDiagram /></PositioningSubsection>
    <PositioningSubsection subsection={valueSection} text={valueProposition.text} wide><ValueConnections /></PositioningSubsection>
    <PositioningSubsection subsection={marketSection} text={marketPositioning.text}
      after={<figure className="pos-synthesis" data-pos-synthesis>
        <blockquote><p>{marketPositioning.synthesis}</p></blockquote>
        <figcaption>{editorialLabel}</figcaption>
      </figure>}>
      <PositioningConstellation />
    </PositioningSubsection>
  </div>
}
