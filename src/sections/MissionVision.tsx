import { brandContent as content, type PurposeStatement } from '../data/brandContent'
import { Fragment } from 'react'

function PurposeContent({ statement, revealWords = false }: { statement: PurposeStatement; revealWords?: boolean }) {
  return (
    <>
      <h2 className="section-pill">{statement.label}</h2>
      <blockquote className="purpose-text">
        {statement.lines.map((line, index) => (
          <div className="purpose-line" key={line}>
            <span className="purpose-line-content">{revealWords ? line.split(' ').map((word, wordIndex) => <Fragment key={wordIndex}><span className="mission-word">{word}</span>{wordIndex < line.split(' ').length - 1 ? ' ' : ''}</Fragment>) : line}{index < statement.lines.length - 1 ? ' ' : ''}</span>
          </div>
        ))}
      </blockquote>
    </>
  )
}

export function MissionVision() {
  return (
    <section id="missao-visao" aria-label={content.purpose.title}>
      <div className="mission section-space">
        <div className="page-container">
          <PurposeContent statement={content.purpose.mission} revealWords />
        </div>
      </div>
      <div className="vision blue-section section-space">
        <div className="vision-panel" aria-hidden="true" />
        <div className="vision-arc" aria-hidden="true" />
        <div className="page-container relative">
          <PurposeContent statement={content.purpose.vision} />
        </div>
      </div>
    </section>
  )
}
