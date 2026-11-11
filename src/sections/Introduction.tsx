import { brandContent as content } from '../data/brandContent'
import { IntroField } from '../components/IntroField'

export function Introduction() {
  return <section id="introducao" className="introduction blue-section" aria-labelledby="hero-title">
    <IntroField />
    <div className="page-container">
      <h1 id="hero-title" className="hero-title" aria-label={content.hero.title[0]}>
        <span id="introduction-title" className="intro-title-mask" aria-hidden="true"><span className="intro-word intro-word-brand">brand</span><span className="intro-word intro-word-book">book</span></span>
      </h1>
      <div className="introduction-grid grid grid-cols-1 md:grid-cols-3">
        {content.introduction.items.map(item => <div key={item.number} className="introduction-column">
          <span className="intro-divider" aria-hidden="true" />
          <div className="column-heading"><h2>{item.title}</h2></div>
          <p className="body-copy">{item.text}</p>
        </div>)}
      </div>
    </div>
  </section>
}
