import type { ReactNode } from 'react'
import type { Chapter, Subsection } from '../../data/brandChapters'
import { applications, keyMessages, language, signatures, voice } from '../../data/verbalIdentity'
import { VoiceAttributes } from './VoiceAttributes'
import { LanguageComparison } from './LanguageComparison'
import { BrandSignatures } from './BrandSignatures'
import { KeyMessages } from './KeyMessages'
import { ApplicationExamples } from './ApplicationExamples'
import '../../styles/verbal.css'

/**
 * Same anatomy as the other "rows" subtopics (big number, title, text, white background),
 * so ids, numbering and navigation stay. `wide` puts the visual under the title and text,
 * across both columns.
 */
function VerbalSubsection({ subsection, text, concept, wide, children }: { subsection: Subsection; text: string; concept?: string; wide?: boolean; children: ReactNode }) {
  return <article id={subsection.id} className={`subsection vb-subsection ${wide ? 'is-wide' : ''}`} data-status={subsection.status} aria-labelledby={`${subsection.id}-title`}>
    <header className="subsection-head">
      <span className="subsection-number">{subsection.number}</span>
      <h3 id={`${subsection.id}-title`}><span className="vb-title-mask"><span className="vb-title-line">{subsection.title}</span></span></h3>
    </header>
    <div className="subsection-text">
      {concept && <p className="vb-concept" data-vb-reveal>{concept}</p>}
      <p data-vb-reveal>{text}</p>
    </div>
    <div className="vb-visual">{children}</div>
  </article>
}

/** Chapter 03 · Identidade Verbal: content from src/data/verbalIdentity.ts. */
export function VerbalBody({ chapter }: { chapter: Chapter }) {
  const [voiceSection, languageSection, signaturesSection, messagesSection, applicationsSection] = chapter.subsections
  return <div className="chapter-body layout-rows layout-verbal">
    <VerbalSubsection subsection={voiceSection} concept={voice.concept} text={voice.text}><VoiceAttributes /></VerbalSubsection>
    <VerbalSubsection subsection={languageSection} text={language.text} wide><LanguageComparison /></VerbalSubsection>
    <VerbalSubsection subsection={signaturesSection} text={signatures.text} wide><BrandSignatures /></VerbalSubsection>
    <VerbalSubsection subsection={messagesSection} concept={keyMessages.concept} text={keyMessages.text} wide><KeyMessages /></VerbalSubsection>
    <VerbalSubsection subsection={applicationsSection} text={applications.text} wide><ApplicationExamples /></VerbalSubsection>
  </div>
}
