import { brandContent as content } from '../data/brandContent'
import { IntroField } from '../components/IntroField'

export function Hero() {
  return (
    <section id="inicio" className="hero blue-section" aria-labelledby="hero-title">
      <IntroField />
      <div className="page-container hero-content">
        <div className="hero-center">
        <h1 id="hero-title" className="hero-title">
          <span className="hero-title-motion">{content.hero.title[0]}</span>
        </h1>
        <div className="hero-logo-stage">
          <img className="brand-logo hero-logo" src={`${import.meta.env.BASE_URL}${content.meta.logoSrc}`} alt={content.meta.logoAlt} width="2974" height="835" fetchPriority="high" />
        </div>
        </div>
      </div>
    </section>
  )
}
