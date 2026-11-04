import { brandContent as content } from '../data/brandContent'
import { IntroField } from '../components/IntroField'

export function Introduction() {
  return <section id="introducao" className="introduction blue-section" aria-labelledby="introduction-title">
    <IntroField />
    <div className="page-container">
      <h2 id="introduction-title" className="section-heading" aria-label={content.introduction.title}>
        <span className="intro-title-mask" aria-hidden="true">{Array.from(content.introduction.title).map((letter, index) => <span className="intro-letter" key={index}>{letter}</span>)}</span>
      </h2>
      <div className="introduction-grid grid grid-cols-1 md:grid-cols-3">
        {content.introduction.items.map(item => <div key={item.number} className="introduction-column">
          <span className="intro-divider" aria-hidden="true" />
          <div className="column-heading"><h3>{item.title}</h3></div>
          <p className="body-copy">{item.text}</p>
        </div>)}
      </div>
    </div>
  </section>
}
