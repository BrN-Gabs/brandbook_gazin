import type { CSSProperties } from 'react'
import { placeholderCopy, type Chapter, type Subsection } from '../../data/brandChapters'
import { ContentPlaceholder } from './ContentPlaceholder'
import { MediaShowcase } from './MediaShowcase'
import { VisualIdentityBody } from '../identity/VisualIdentityChapter'
import { PositioningBody } from '../positioning/PositioningBody'
import { VerbalBody } from '../verbal/VerbalBody'
import { PhysicalBody } from '../physical/PhysicalBody'
import { PhotoVideoBody } from '../photo/PhotoVideoBody'
import { GovernanceBody } from '../governance/GovernanceBody'
import { CampaignsBody } from '../campaigns/CampaignsBody'
import { DigitalBody } from '../digital/DigitalBody'
import { InternalCommunicationBody } from '../internal/InternalCommunicationBody'
import { SponsorshipsBody } from '../sponsorships/SponsorshipsBody'
import { CharactersBody } from '../characters/CharactersBody'
import { OurBrandsBody } from '../brands/OurBrandsBody'

/** Chapters whose lead is an editorial statement revealed word by word. */
const editorialLead = (chapter: Chapter) => (chapter.layout === 'positioning' || chapter.layout === 'verbal' || chapter.layout === 'physical' || chapter.layout === 'photo' || chapter.layout === 'governance' || chapter.layout === 'campaigns' || chapter.layout === 'digital' || chapter.layout === 'internal' || chapter.layout === 'sponsorships' || chapter.layout === 'characters' || chapter.layout === 'our-brands') && !!chapter.description?.length

export function ChapterHeader({ chapter }: { chapter: Chapter }) {
  return <header className="chapter-header">
    <span className="chapter-ghost" aria-hidden="true">{chapter.number}</span>
    <div className="chapter-heading">
      <p className="chapter-eyebrow"><span className="chapter-dot" aria-hidden="true" />Capítulo {chapter.number}</p>
      <h2 id={`${chapter.id}-title`} className="chapter-title"><span className="chapter-title-mask"><span className="chapter-title-line">{chapter.title}</span></span></h2>
    </div>
    <div className="chapter-intro">
      {/* Every chapter: title, subtitle (one line) and description. */}
      {chapter.leadTitle
        ? <p className="vb-lead-title" style={{ "--chars": chapter.leadTitle.length } as CSSProperties}>{chapter.leadTitle}</p>
        : <ContentPlaceholder kind="text" label={placeholderCopy.chapterSubtitle} compact />}
      {editorialLead(chapter)
        // Editorial lead, revealed word by word (Positioning/VerbalAnimations).
        ? chapter.description!.map(paragraph => <p key={paragraph} className="pos-lead">{paragraph.split(' ').map((word, index) => <span key={index}><span className="pos-word">{word}</span>{' '}</span>)}</p>)
        : chapter.description?.length
        ? chapter.description.map(paragraph => <p key={paragraph}>{paragraph}</p>)
        : <ContentPlaceholder kind="text" label={placeholderCopy.chapterDescription} compact />}
    </div>
  </header>
}

/** In-chapter index: direct links to every subtopic. */
export function ChapterNavigation({ chapter }: { chapter: Chapter }) {
  return <nav className="chapter-nav" aria-label={`Assuntos de ${chapter.title}`}>
    <ol>
      {chapter.subsections.map(subsection => <li key={subsection.id}>
        <a href={`#${subsection.id}`}><span>{subsection.number}</span>{subsection.title}</a>
      </li>)}
    </ol>
  </nav>
}

export function BrandbookSubsection({ subsection }: { subsection: Subsection }) {
  const { content } = subsection
  return <article id={subsection.id} className="subsection" data-status={subsection.status} aria-labelledby={`${subsection.id}-title`}>
    <span className="subsection-node" aria-hidden="true" />
    <header className="subsection-head">
      <span className="subsection-number">{subsection.number}</span>
      <h3 id={`${subsection.id}-title`}>{subsection.title}</h3>
    </header>
    <div className="subsection-text">
      {content?.text?.length
        ? content.text.map(paragraph => <p key={paragraph}>{paragraph}</p>)
        : <ContentPlaceholder kind="text" label={placeholderCopy.description} compact />}
    </div>
    <MediaShowcase media={content?.media} kinds={subsection.kinds} />
  </article>
}

function ChapterBody({ chapter }: { chapter: Chapter }) {
  // Chapters with full, interactive content render their own body.
  if (chapter.layout === 'identity') return <VisualIdentityBody chapter={chapter} />
  if (chapter.layout === 'positioning') return <PositioningBody chapter={chapter} />
  if (chapter.layout === 'verbal') return <VerbalBody chapter={chapter} />
  if (chapter.layout === 'physical') return <PhysicalBody chapter={chapter} />
  if (chapter.layout === 'photo') return <PhotoVideoBody chapter={chapter} />
  if (chapter.layout === 'governance') return <GovernanceBody chapter={chapter} />
  if (chapter.layout === 'campaigns') return <CampaignsBody chapter={chapter} />
  if (chapter.layout === 'digital') return <DigitalBody chapter={chapter} />
  if (chapter.layout === 'internal') return <InternalCommunicationBody chapter={chapter} />
  if (chapter.layout === 'sponsorships') return <SponsorshipsBody chapter={chapter} />
  if (chapter.layout === 'characters') return <CharactersBody chapter={chapter} />
  if (chapter.layout === 'our-brands') return <OurBrandsBody chapter={chapter} />
  const items = chapter.subsections.map(subsection => <BrandbookSubsection key={subsection.id} subsection={subsection} />)
  if (chapter.layout === 'tree') {
    // Brand architecture: master brand on top, group brands below, relationships last.
    const [root, ...rest] = items
    const relation = rest.pop()
    return <div className="chapter-body layout-tree">
      <div className="tree-root">{root}</div>
      <div className="tree-branches">{rest}</div>
      <div className="tree-relation">{relation}</div>
    </div>
  }
  if (chapter.layout === 'rail') {
    return <div className="chapter-body layout-rail" role="region" aria-label={`${chapter.title}: assuntos`} tabIndex={0}>
      {items}
    </div>
  }
  return <div className={`chapter-body layout-${chapter.layout}`}>{items}</div>
}

/** One Brandbook chapter: header, in-chapter index, and subtopics. */
export function BrandbookChapter({ chapter }: { chapter: Chapter }) {
  return <section id={chapter.id} className={`chapter theme-${chapter.theme} chapter-${chapter.layout}`} data-chapter={chapter.number} aria-labelledby={`${chapter.id}-title`}>
    <div className="page-container chapter-inner">
      <div className="chapter-top">
        <ChapterHeader chapter={chapter} />
        <ChapterNavigation chapter={chapter} />
      </div>
      <ChapterBody chapter={chapter} />
    </div>
  </section>
}
